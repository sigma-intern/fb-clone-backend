import { OpenAPIV3 } from 'openapi-types';
import { validGeneralErrorCodes } from '../../../errors/codes';

export const badRequestErrorResponseName = 'BadRequestErrorResponse';

export const BadRequestErrorResponse: OpenAPIV3.ResponseObject = {
  description: 'Bad Request Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['code'],
        properties: {
          code: {
            type: 'string',
            enum: validGeneralErrorCodes,
          },
        },
        additionalProperties: true,
      },
    },
  },
};
