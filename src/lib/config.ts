import { config as loadConfig } from 'dotenv';
import appRootPath from 'app-root-path';

export interface Config {
  host: string;
  port: number;
  mongoDbUrl: string;
  logLevel: string;
  jwt: {
    accessTokenKey: string;
    refreshTokenKey: string;
  };
}

export function isNotProduction(): boolean {
  return !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
}

/**
 * The prefix is needed to avoid any collisions with environmental variables of other applications.
 *
 * For now, it is the abbreviation of "Sigma FB Clone".
 */
export const projectEnvPrefix = 'SFBC_';

const envConfig = loadConfig({
  path: process.env[projectEnvPrefix + 'CONFIG'] || appRootPath.resolve('./config/.env'),
  debug: isNotProduction(),
});
const loadError = envConfig.error as NodeJS.ErrnoException;
if (loadError) {
  if (loadError.code === 'ENOENT' || loadError.code === 'EACCES') {
    console.info(`Failed to load config from file "${loadError.path}": ${loadError.code}`);
  } else {
    console.warn('Unknown config file loading errors', loadError);
  }
}

function getConfig(): Config {
  let key = projectEnvPrefix + 'MONGO_DB';
  const mongoDbUrl = process.env[key];
  if (!mongoDbUrl) {
    throw new Error(`Env "${key}": MongoDB url is missing`);
  }
  key = projectEnvPrefix + 'PORT';
  const port = Number.parseInt(process.env[projectEnvPrefix + 'PORT'] ?? '5000');
  if (Number.isNaN(port)) {
    throw new Error(`Env "${key}": port "${process.env[key] ?? ''}" is not a number`);
  }
  key = projectEnvPrefix + 'JWT_ACCESS_TOKEN_KEY';
  const accessTokenKey = process.env[key];
  if (!accessTokenKey) {
    throw new Error(`Env "${key}: JWT access token is missing`);
  }
  key = projectEnvPrefix + 'JWT_REFRESH_TOKEN_KEY';
  const refreshTokenKey = process.env[key];
  if (!refreshTokenKey) {
    throw new Error(`Env "${key}: JWT refresh token is missing`);
  }

  return {
    host: process.env[projectEnvPrefix + 'HOST'] || 'localhost',
    port,
    mongoDbUrl,
    logLevel: process.env[projectEnvPrefix + 'LOG_LEVEL'] || (isNotProduction() ? 'DEBUG' : 'WARN'),
    jwt: {
      accessTokenKey,
      refreshTokenKey,
    },
  };
}

export const config: Config = getConfig();
