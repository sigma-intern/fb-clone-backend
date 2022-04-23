import * as jwt from 'jsonwebtoken';
import {
  assertRequiredScopes,
  getTokenFromRequest,
  handleJwtError,
  JwtPayload,
  isJwtPayload,
  jwtAudience,
  jwtAlgorithm,
  jwtIssuer,
} from '../lib/auth';
import { IncomingMessage } from 'http';
import { JwtBearerScope } from '../lib/auth';
import { Nullable } from '../lib/types';
import { UsersRepository } from '../repositories/users.repository';
import { config } from '../lib/config';
import { ErrorCode } from '../errors/codes';
import { LogicError } from '../errors/logic.error';
import { VerifyErrors } from 'jsonwebtoken';
import { User } from '../models/user';

export interface UserTokenPayload {
  userId: number;
  scopes: JwtBearerScope;
}

export class AuthService {
  private users: UsersRepository;

  constructor(users: UsersRepository) {
    this.users = users;
  }

  getAccessTokenPayload(
    token: string,
    scopes: Nullable<ReadonlyArray<JwtBearerScope>> = null,
    ignoreExpiration = false
  ) {
    let payload: object | string;
    try {
      payload = jwt.verify(token, config.jwt.accessTokenKey, {
        ignoreExpiration,
        audience: jwtAudience,
        algorithms: [jwtAlgorithm],
        issuer: jwtIssuer,
      });
    } catch (err) {
      handleJwtError(err as VerifyErrors);
    }
    if (!isJwtPayload(payload)) {
      throw new LogicError(ErrorCode.AuthBad);
    }
    if (scopes) {
      assertRequiredScopes(scopes, payload.scopes);
    }
    return payload;
  }

  getRefreshTokenPayload(token: string, checkScope = true, ignoreExpiration = false) {
    let payload: object | string;
    try {
      payload = jwt.verify(token, config.jwt.refreshTokenKey, {
        ignoreExpiration,
        audience: jwtAudience,
        algorithms: [jwtAlgorithm],
        issuer: jwtIssuer,
      });
    } catch (err) {
      handleJwtError(err as VerifyErrors, ErrorCode.AuthBadRefresh);
    }
    if (!isJwtPayload(payload)) {
      throw new LogicError(ErrorCode.AuthBadRefresh);
    }
    if (
      checkScope &&
      (payload.scopes.length !== 1 || payload.scopes[0] !== JwtBearerScope.TokenRefresh)
    ) {
      throw new LogicError(ErrorCode.AuthBadRefresh);
    }
    return payload;
  }

  getUserFromRequestByAccessToken(
    request: IncomingMessage,
    scopes: Nullable<ReadonlyArray<JwtBearerScope>> = null,
    ignoreExpiration = false
  ) {
    return this.getUserFromAccessToken(getTokenFromRequest(request), scopes, ignoreExpiration);
  }

  async getUserFromAccessToken(
    token: string,
    scopes: Nullable<ReadonlyArray<JwtBearerScope>> = null,
    ignoreExpiration = false
  ) {
    const payload = this.getAccessTokenPayload(token, scopes, ignoreExpiration);
    return this.getUserFromPayload(payload);
  }

  async getUserFromPayload(payload: JwtPayload): Promise<User> {
    // const user = await this.users.getOne({ userId: payload.id });
    // if (!user) {
    //   throw new LogicError(ErrorCode.AuthBad);
    // }
    // return user;
    throw new Error('Not Implemented: ' + this.getUserFromPayload.name);
  }
}
