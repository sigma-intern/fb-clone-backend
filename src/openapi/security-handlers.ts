import { ErrorRequestHandler, Request } from 'express';
import { SecurityHandlers } from 'openapi-security-handler';
import { assertRequiredScopes, getTokenFromRequest, JwtBearerScope, JwtPayload } from '../lib/auth';
import { AuthService } from '../services/auth.service';
import { LogicError } from '../errors/logic.error';
import { User } from '../models/user';
import { OpenApiRequest } from './types';
import { isOpenApiSecurityHandlerError } from './lib';
import { jwtBearerSchemeName } from './components/security-schemes/jwt-bearer';

export interface RequestWithUser extends OpenApiRequest {
  user: User;
}

export interface RequestWithToken extends RequestWithUser {
  tokenPayload?: JwtPayload;
}

export interface RequestWithAuthError extends RequestWithToken {
  authError: LogicError;
}

export function getSecurityHandlers(authService: AuthService): Readonly<SecurityHandlers> {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [jwtBearerSchemeName]: async (req, scopes, definition) => {
      // const scheme = definition as unknown as OpenAPIV3.OAuth2SecurityScheme;
      const request = req as RequestWithAuthError;
      const jwtScopes = scopes as JwtBearerScope[];

      // This is necessary due to peculiarities of error handling by openapi-security-handler: https://github.com/kogosoftwarellc/open-api/blob/db977d3ca6adbaa08c44e0db1231c74c8427eaba/packages/openapi-security-handler/index.ts
      try {
        if (!request.tokenPayload) {
          request.tokenPayload = authService.getAccessTokenPayload(
            getTokenFromRequest(request),
            jwtScopes
          );
        } else {
          assertRequiredScopes(jwtScopes, request.tokenPayload.scopes);
        }
        if (!request.user) {
          const user = await authService.getUserFromPayload(request.tokenPayload);
          request.user = user;
        }
      } catch (err) {
        request.authError = err as LogicError;
        return false;
      }
      return true;
    },
  };
}

export const openApiSecurityHandlerTransfomMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  next(transformOpenApiSecurityHandlerError(err, req));
};

export const transformOpenApiSecurityHandlerError = (err: any, req: Request) => {
  const request = req as RequestWithAuthError;
  delete request.tokenPayload;
  if (request.authError && isOpenApiSecurityHandlerError(err)) {
    return request.authError;
  }
  return err;
};
