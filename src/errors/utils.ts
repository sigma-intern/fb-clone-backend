import { AxiosError } from 'axios';
import { as, NonOptional } from '../lib/types';

export interface SerializedError {
  message?: Error['message'];
  stack?: Error['stack'];
  cause?: SerializedError;
  http?: {
    request?: {
      url: string;
      method?: string;
      headers?: Record<string, string>;
    };
    response?: {
      body?: ErrorResponse['data'];
      headers?: Record<string, string>;
    };
  };
}
type ErrorResponse = NonOptional<AxiosError['response']>;

export interface SerializeErrorOptions {
  /**
   * @default {false}
   */
  includeStack?: boolean;
  /**
   * @default {false}
   */
  includeHttp?: boolean;
}

/**
 * This function is safer than a library [`serialize-error`](https://www.npmjs.com/package/serialize-error/v/2.1.0).
 *
 * Their algorithm has issues in serialization.
 * @param error
 * @param options
 */
export function serializeError(error: any, options: SerializeErrorOptions) {
  const opts = Object.assign(
    { includeStack: false, includeHttp: false } as SerializeErrorOptions,
    options
  );
  const serialized: SerializedError = {};
  if ('message' in error) {
    serialized.message = error.message as Error['message'];
  }
  if (opts.includeStack && 'stack' in error) {
    serialized.stack = error.stack as Error['stack'];
  }
  if ('cause' in error) {
    serialized.cause = serializeError(error.cause, opts);
  }

  // Handling details of Axios errors.
  if (opts.includeHttp && (error.response || error.request)) {
    serialized.http = {};
    if (error.request) {
      const req = error.request as AxiosError['request'];
      serialized.http.request = {
        url: req.protocol + '//' + req.host + req.path,
      };
      if ('method' in req) {
        serialized.http.request.method = req.method;
      }
      if (typeof req.getHeaders === 'function') {
        serialized.http.request.headers = req.getHeaders();
      }
    }
    if (error.response && as<ErrorResponse>(error.response)) {
      const response = {} as NonOptional<NonOptional<SerializedError['http']>['response']>;
      let responseNonEmpty = false;
      if ('data' in error.response) {
        response.body = error.response.data;
        responseNonEmpty = true;
      }
      if ('headers' in error.response) {
        response.headers = error.response.headers;
        responseNonEmpty = true;
      }
      if (responseNonEmpty) {
        serialized.http.response = response;
      }
    }
  }
  return serialized;
}
