import cors from 'cors';
import express from 'express';
import { initialize } from 'express-openapi';
import { OpenAPIV3 } from 'openapi-types';
import { isNotProduction } from './lib/config';
import { logger } from './lib/logger';
import { errorHandlingPipeline } from './middlewares/error-handler-pipeline';
import { notFoundHandler } from './middlewares/not-found.middleware';
import { validateResponses } from './middlewares/validate-responses.middleware';
import { getOpenApiOptions } from './openapi/lib';
import { createPaths } from './openapi/paths';
import { buildOperations } from './controllers';
import { createDependencies, disposeDependencies } from './di';
import { bindOnExitHandler } from './lib/exit-handler';
import { apiPrefix, getOpenApiDoc } from './openapi/specification';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';

export async function createApp(urlOrigin = '') {
  const app = express();
  app.use(
    cors({
      origin: true,
    })
  );

  const apiDoc = getOpenApiDoc(urlOrigin, createPaths()) as OpenAPIV3.Document &
    Record<string, any>;
  apiDoc['x-express-openapi-disable-defaults-middleware'] = true;
  if (isNotProduction()) {
    apiDoc['x-express-openapi-disable-response-validation-middleware'] = false;
    apiDoc['x-express-openapi-response-validation-strict'] = true;
    apiDoc['x-express-openapi-additional-middleware'] = [validateResponses];
    logger.info('Response OpenApi validation is enabled');
  } else {
    apiDoc['x-express-openapi-disable-response-validation-middleware'] = true;
  }

  const dependencies = await createDependencies();
  bindOnExitHandler(() => {
    return disposeDependencies(dependencies);
  });

  const openapiFramework = initialize(
    getOpenApiOptions(app, apiDoc, buildOperations(), dependencies)
  );
  app.use(
    path.posix.join(apiPrefix, 'docs'),
    swaggerUi.serve,
    swaggerUi.setup(openapiFramework.apiDoc)
  );

  app.use(errorHandlingPipeline);
  app.use(notFoundHandler);

  return { app, openapi: openapiFramework };
}
