import { OpenAPIV3 } from 'openapi-types';
import { JwtBearerScheme, jwtBearerSchemeName } from './components/security-schemes/jwt-bearer';
import { SkipLimitParameter, skipLimitParameterName } from './components/parameters/skip-limits';
import {
  BadRequestErrorResponse,
  badRequestErrorResponseName,
} from './components/responses/bad-request-error';
import { ErrorResponse, errorResponseName } from './components/responses/error';
import {
  NotFoundErrorResponse,
  notFoundErrorResponseName,
} from './components/responses/not-found-error';
import { ServerErrorResponse, serverErrorResponseName } from './components/responses/server-error';
import { UserSchema, userSchemaName } from './components/schemas/user';
import {
  AuthenticationErrorResponse,
  authenticationErrorResponseName,
} from './components/responses/authentication-error';
import {
  AuthorizationErrorResponse,
  authorizationErrorResponseName,
} from './components/responses/authorization-error';

export enum OpenApiTags {
  Users = 'users',
}

export const apiPrefix = '/api/v1';

export function getOpenApiDoc(originUrl = '', paths: OpenAPIV3.PathsObject): OpenAPIV3.Document {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Sigma FB Clone',
      version: '1.0.0',
    },
    servers: [
      {
        url: apiPrefix,
        description: 'API prefix',
      },
      {
        url: '{originUrl}' + apiPrefix,
        description: 'Deployment URL',
        variables: {
          originUrl: {
            description: 'Origin URL',
            default: originUrl,
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        [jwtBearerSchemeName]: JwtBearerScheme,
      },
      parameters: {
        [skipLimitParameterName]: SkipLimitParameter,
      },
      responses: {
        [badRequestErrorResponseName]: BadRequestErrorResponse,
        [authenticationErrorResponseName]: AuthenticationErrorResponse,
        [authorizationErrorResponseName]: AuthorizationErrorResponse,
        [errorResponseName]: ErrorResponse,
        [notFoundErrorResponseName]: NotFoundErrorResponse,
        [serverErrorResponseName]: ServerErrorResponse,
      },
      schemas: {
        [userSchemaName]: UserSchema,
      },
    },
    tags: [
      {
        name: OpenApiTags.Users,
        description: 'API to manage users.',
      },
    ],
    paths,
  };
}

export function getCommonResponses(): OpenAPIV3.ResponsesObject {
  return {
    400: getOpenApiRef('responses', badRequestErrorResponseName),
    500: getOpenApiRef('responses', serverErrorResponseName),
  };
}

export function getAuthErrorResponses(): OpenAPIV3.ResponsesObject {
  return {
    401: getOpenApiRef('responses', authenticationErrorResponseName),
    403: getOpenApiRef('responses', authorizationErrorResponseName),
  };
}

export function getOpenApiRef(
  entityGroup: keyof OpenAPIV3.ComponentsObject,
  name: string
): OpenAPIV3.ReferenceObject {
  return {
    $ref: `#/components/${entityGroup}/${name}`,
  };
}
