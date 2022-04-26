import { ErrorRequestHandler } from 'express';
import { ErrorCode } from '../errors/codes';
import { LogicError } from '../errors/logic.error';
import { coerceLogicError, isOpenApiFinalError } from '../errors/openapi-error';
import { ServerError } from '../errors/server.error';
import { isNotProduction } from '../lib/config';
import { logger } from '../lib/logger';
import { openApiSecurityHandlerTransfomMiddleware } from '../openapi/security-handlers';

export const errorHandlingPipeline: ErrorRequestHandler[] = [
  openApiSecurityHandlerTransfomMiddleware,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err, req, res, next) => {
    if (err instanceof LogicError) {
      switch (err.code) {
        case ErrorCode.AuthNo:
        case ErrorCode.AuthBad:
        case ErrorCode.AuthBadScheme:
          res.status(401);
          break;

        case ErrorCode.AuthScopes:
        case ErrorCode.AuthExpired:
        case ErrorCode.AuthBadRefresh:
          res.status(403);
          break;

        case ErrorCode.NotFound:
        case ErrorCode.UserNotFound:
          res.status(404);
          break;

        case ErrorCode.Server:
        case ErrorCode.ServerOpenapiResponseValidation:
          res.status(500);
          break;

        default:
          res.status(400);
          break;
      }
      res.json(err.toJsonObject(isNotProduction()));
    } else {
      if (err instanceof SyntaxError && err.message.includes('JSON')) {
        res
          .status(400)
          .json(
            new LogicError(ErrorCode.JsonBad, err.message, err).toJsonObject(isNotProduction())
          );
      } else if (isOpenApiFinalError(err)) {
        const error = coerceLogicError(err);
        res.status(err.status).json(error);
      } else {
        res
          .status(500)
          .json(new ServerError(ErrorCode.Server, err).toJsonObject(isNotProduction()));
      }
    }

    if (Math.floor(res.statusCode / 100) === 5) {
      const errorMessage = `error at "${req.url}":`;
      logger.error(
        (err.code !== ErrorCode.ServerOpenapiResponseValidation
          ? 'Request server '
          : 'Request response validation') + errorMessage,
        err
      );
    } else {
      logger.debug(`Request error at "${req.url}":`, err);
    }
  },
];
