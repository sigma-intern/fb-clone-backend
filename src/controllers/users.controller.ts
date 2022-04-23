import { controllerNameProp, createOperationFullName, OpenApiOperations } from './lib';
import { logger } from '../lib/logger';
import { OpenAPIV3 } from 'openapi-types';
import { skipLimitParameterName } from '../openapi/components/parameters/skip-limits';
import { UserSchema } from '../openapi/components/schemas/user';
import { getCommonResponses, getOpenApiRef, OpenApiTags } from '../openapi/specification';

export const usersController: OpenApiOperations = {
  [controllerNameProp]: 'users',
  getAll() {
    logger.debug('userService', this.dependencies.users);
    return { users: [], count: 0 };
  },
};

export const usersPathItem: OpenAPIV3.PathItemObject = {
  summary: 'APIs to get users',
  get: {
    operationId: createOperationFullName(
      usersController[controllerNameProp],
      usersController.getAll.name
    ),
    description: 'Get users',
    tags: [OpenApiTags.Users],
    parameters: [getOpenApiRef('parameters', skipLimitParameterName)],
    responses: {
      ...getCommonResponses(),
      200: {
        description: 'List of users.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['users', 'count'],
              properties: {
                users: {
                  type: 'array',
                  items: UserSchema,
                },
                count: {
                  type: 'integer',
                  minimum: 0,
                },
              },
            },
          },
        },
      },
    },
  } as OpenAPIV3.OperationObject,
};
