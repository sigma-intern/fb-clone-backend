import { MongoClient } from 'mongodb';
import { URL } from 'url';
import { logger } from '../lib/logger';
import { AsyncInitializable, Disposable } from '../lib/types';

export interface SkipLimit {
  /**
   * @default 0
   */
  skip?: number;
  limit: number;
}

export class MongodbConnectionService implements Disposable, AsyncInitializable {
  readonly client: MongoClient;
  readonly connectionUrl: URL;
  readonly defaultDbName: string;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
    this.connectionUrl = new URL(connectionString);
    this.defaultDbName =
      (this.connectionUrl.pathname[0] === '/'
        ? this.connectionUrl.pathname.slice(1)
        : this.connectionUrl.pathname) || 'main';
  }

  init(): Promise<void> {
    return this.client
      .connect()
      .then(() => {
        return this.client.db().command({
          ping: 1,
        });
      })
      .then(() => {
        logger.info(`MongoDB connected to the database "${this.defaultDbName}"`);
      });
  }

  dispose(): Promise<void> {
    return this.client.close().then(() => {
      logger.info('MongoDB disconnected');
    });
  }
}
