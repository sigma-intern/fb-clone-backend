import { OpenAPIV3 } from 'openapi-types';
import { authorizationErrorCodes } from '../../../errors/codes';

export const authorizationErrorResponseName = 'AuthenticationErrorResponse';

export const AuthorizationErrorResponse: OpenAPIV3.ResponseObject = {
  description: 'Authorization Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['code'],
        properties: {
          code: {
            type: 'string',
            enum: authorizationErrorCodes,
          },
        },
        additionalProperties: true,
      },
    },
  },
};
