import bodyParser from 'body-parser';
import { OpenAPIRequestValidatorArgs } from 'openapi-request-validator';
import { Express } from 'express';
import { ExpressOpenAPIArgs } from 'express-openapi';
import { OpenAPIV3 } from 'openapi-types';
import { isNotProduction } from '../lib/config';
import { logger } from '../lib/logger';
import { OpenApiError } from '../errors/openapi-error';
import { Dependencies } from '../di';
import { OpenApiOperation } from '../controllers/lib';
import { OpenApiSecurityHandlerError } from './types';
import { getSecurityHandlers } from './security-handlers';

export const openApiDocsPath = '/api-docs';

export function getOpenApiOptions(
  app: Express,
  apiDoc: OpenAPIV3.Document,
  operations: Record<string, OpenApiOperation>,
  dependencies: Dependencies
): ExpressOpenAPIArgs {
  return {
    app,
    apiDoc,
    logger,
    consumesMiddleware: {
      'application/json': bodyParser.json({
        strict: false,
      }),
    },
    dependencies,
    errorTransformer: errorTransformer as any,
    enableObjectCoercion: true,
    exposeApiDocs: true,
    docsPath: openApiDocsPath,
    operations,
    promiseMode: true,
    securityHandlers: getSecurityHandlers(dependencies.auth),
    validateApiDoc: isNotProduction(),
  };
}

export const errorTransformer: OpenAPIRequestValidatorArgs['errorTransformer'] = (
  openApiError,
  ajvError
) => {
  return new OpenApiError(openApiError, ajvError);
};

export function isOpenApiSecurityHandlerError(err: any): err is OpenApiSecurityHandlerError {
  return (
    typeof err === 'object' &&
    err !== null &&
    err.status === 401 &&
    typeof err.message === 'string' &&
    err.errorCode === 'authentication.openapi.security'
  );
}
