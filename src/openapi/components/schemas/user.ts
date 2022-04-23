import { OpenAPIV3 } from 'openapi-types';

export const userSchemaName = 'User';

export const UserSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['email', 'name'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      minLength: 1,
    },
  },
};
