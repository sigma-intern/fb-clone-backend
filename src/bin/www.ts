#!/usr/bin/env node
import { createServer } from 'http';
import { createApp } from '../app';
import { config, isNotProduction } from '../lib/config';
import { bindOnExitHandler, exitGracefully } from '../lib/exit-handler';
import { logger } from '../lib/logger';

async function main() {
  logger.info((isNotProduction() ? 'Not production' : 'Production') + ' environment');

  const { app } = await createApp(`http://${config.host}:${config.port}`);

  const server = createServer(app);
  server.listen(config.port, config.host, () => {
    logger.info(`Listening at ${config.host}:${config.port}`);
  });
  bindOnExitHandler(() => {
    server.close();
  }, true);
}

main().catch((err) => {
  logger.fatal('Process crashed with exception!', err);
  exitGracefully(1);
});
