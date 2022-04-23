import { IncomingMessage } from 'http';
import { TokenExpiredError, VerifyErrors } from 'jsonwebtoken';
import { LogicError } from '../errors/logic.error';
import { ErrorCode } from '../errors/codes';
import * as jwt from 'jsonwebtoken';
import { config } from './config';
import { UserTokenPayload } from '../services/auth.service';

export const jwtBearerDocstring =
  'Users can auth to the system. The JWT token has `userId` as subject and payload of `{ "id": 42, "scopes": ["string", "scopes" }` where `id` is `userId` and `scopes` is an array of authorised scopes described below. The token MUST be provided under `Bearer ` scheme in `Authorization` header.';

export interface JwtPayload {
  id: number;
  scopes: JwtBearerScope[];
}

export enum JwtBearerScope {
  UserRead = 'user:read',
  UserCreate = 'user:create',
  TokenRefresh = 'token:refresh',
}

export const JwtBearerScopeDescriptions: Readonly<Record<JwtBearerScope, string>> = {
  [JwtBearerScope.UserRead]: 'For Access Token. Scope to read users.',
  [JwtBearerScope.UserCreate]: 'For Access Token. Scope to create users.',
  [JwtBearerScope.TokenRefresh]: 'For Refresh Token. Scope to refresh token.',
};

export const jwtScopeStrings = Object.values(JwtBearerScope);

export const jwtAudience = 'users';
export const jwtAlgorithm = 'HS512';
export const jwtIssuer = 'Sigma AB (kind of :)';

export function generateAccessToken(user: UserTokenPayload) {
  return jwt.sign(
    {
      id: user.userId,
      scopes: user.scopes,
    },
    config.jwt.accessTokenKey,
    {
      algorithm: jwtAlgorithm,
      subject: user.userId.toString(),
      audience: jwtAudience,
      expiresIn: '1h',
      issuer: 'Sigma FB Clone',
    }
  );
}

export function generateRefreshToken(user: UserTokenPayload) {
  return jwt.sign(
    {
      id: user.userId,
      scopes: [JwtBearerScope.TokenRefresh],
    },
    config.jwt.refreshTokenKey,
    {
      algorithm: jwtAlgorithm,
      subject: user.userId.toString(),
      audience: jwtAudience,
      expiresIn: '180d',
      issuer: jwtIssuer,
    }
  );
}

export function isJwtPayload(payload: any): payload is JwtPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof payload.id === 'number' &&
    Array.isArray(payload.scopes) &&
    payload.scopes.every((p: string) => (jwtScopeStrings as string[]).includes(p))
  );
}

export function getTokenFromRequest(request: IncomingMessage) {
  if (typeof request.headers.authorization !== 'string') {
    throw new LogicError(ErrorCode.AuthNo);
  }
  return getTokenFromAccessTokenString(request.headers.authorization);
}

const bearerRegex = /^Bearer +/;
export function getTokenFromAccessTokenString(str: string) {
  if (!bearerRegex.test(str)) {
    throw new LogicError(ErrorCode.AuthBadScheme);
  }
  return str.replace(bearerRegex, '');
}

export function handleJwtError(err: VerifyErrors, codeToThrow = ErrorCode.AuthBad): never {
  if (err instanceof TokenExpiredError) {
    throw new LogicError(ErrorCode.AuthExpired);
  }
  throw new LogicError(codeToThrow);
}

export function assertRequiredScopes(
  requiredScopes: ReadonlyArray<JwtBearerScope>,
  actualScopes: ReadonlyArray<JwtBearerScope>
) {
  if (requiredScopes.some((s) => !actualScopes.includes(s))) {
    // Scope is synonymic to user's role
    throw new LogicError(ErrorCode.AuthScopes);
  }
}
