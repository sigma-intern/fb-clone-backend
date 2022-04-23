export enum ErrorCode {
  JsonBad = 'json.bad',

  OpenApiValidation = 'openApi.validation',

  AuthNo = 'auth.no',
  AuthBad = 'auth.bad',
  AuthBadScheme = 'auth.bad.scheme',

  AuthScopes = 'auth.scopes',
  AuthExpired = 'auth.expired',
  AuthBadRefresh = 'auth.bad.refresh',

  Server = 'server',
  ServerOpenapiResponseValidation = 'server.openApi.response.validation',
  NotFound = 'notFound',

  UserNotFound = 'user.notFound',
}

export const validErrorCodes = Object.values(ErrorCode);

export type ServerErrorCode = ErrorCode.Server | ErrorCode.ServerOpenapiResponseValidation;
export const serverErrorCodes = [ErrorCode.Server, ErrorCode.ServerOpenapiResponseValidation];

export type NotFoundErrorCode = ErrorCode.NotFound | ErrorCode.UserNotFound;
export const notFoundErrorCodes = [ErrorCode.NotFound, ErrorCode.UserNotFound];

export type AuthenticationErrorCode =
  | ErrorCode.AuthNo
  | ErrorCode.AuthBad
  | ErrorCode.AuthBadScheme;
export const authenticationErrorCodes = [
  ErrorCode.AuthNo,
  ErrorCode.AuthBad,
  ErrorCode.AuthBadScheme,
];

export type AuthorizationErrorCode =
  | ErrorCode.AuthScopes
  | ErrorCode.AuthExpired
  | ErrorCode.AuthBadRefresh;
export const authorizationErrorCodes = [
  ErrorCode.AuthScopes,
  ErrorCode.AuthExpired,
  ErrorCode.AuthBadRefresh,
];

export const validGeneralErrorCodes = validErrorCodes.filter(
  (v) =>
    !notFoundErrorCodes.includes(v) &&
    !serverErrorCodes.includes(v) &&
    !authenticationErrorCodes.includes(v) &&
    !authorizationErrorCodes.includes(v)
);
