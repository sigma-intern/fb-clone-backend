import { jwtBearerDocstring, JwtBearerScopeDescriptions } from '../../../lib/auth';
import { OpenAPIV3 } from 'openapi-types';
import * as path from 'path';
import { apiPrefix } from '../../specification';

export const jwtBearerSchemeName = 'jwt-bearer';

// Weird type is required due to issue with library typing.
export const JwtBearerScheme: OpenAPIV3.OAuth2SecurityScheme & { description: string } = {
  type: 'oauth2',
  description: jwtBearerDocstring,
  flows: {
    password: {
      scopes: JwtBearerScopeDescriptions,
      tokenUrl: path.posix.join(apiPrefix, '/auth/login'),
      refreshUrl: path.posix.join(apiPrefix, '/auth/refresh'),
    },
  },
};
