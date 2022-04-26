import { OpenAPIV3 } from 'openapi-types';
import { usersPathItem } from '../controllers/users.controller';

export function createPaths(): OpenAPIV3.PathsObject {
  return {
    '/users': usersPathItem,
  };
}
