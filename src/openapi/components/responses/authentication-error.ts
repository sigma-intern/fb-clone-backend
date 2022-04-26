import { OpenAPIV3 } from 'openapi-types';
import { authenticationErrorCodes } from '../../../errors/codes';

export const authenticationErrorResponseName = 'AuthenticationErrorResponse';

export const AuthenticationErrorResponse: OpenAPIV3.ResponseObject = {
  description: 'Authentication Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['code'],
        properties: {
          code: {
            type: 'string',
            enum: authenticationErrorCodes,
          },
        },
        additionalProperties: true,
      },
    },
  },
};
