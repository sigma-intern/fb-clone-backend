import { AxiosError } from 'axios';
import { as, NonOptional, SerializePropertyValue } from '../lib/types';

export interface SerializedError {
  name?: Error['message'];
  message?: Error['message'];
  stack?: Error['stack'];
  code?: any;
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
  [property: string]: any;
}
type ErrorResponse = NonOptional<AxiosError['response']>;

export const includeHttp: unique symbol = Symbol('serializeError.http');

/**
 * Configuration to serialize properties of Errors.
 *
 * Provide {true} to include the value directly or callback which returns the value to serialization.
 */
export type ErrorSerializationProperties = Record<string, SerializePropertyValue | boolean> & {
  /**
   * @default false
   */
  name?: SerializePropertyValue | boolean;
  /**
   * @default true
   */
  message?: SerializePropertyValue | boolean;
  /**
   * @default false
   */
  stack?: SerializePropertyValue | boolean;
  /**
   * @default true
   */
  code?: SerializePropertyValue | boolean;
  /**
   * If `true` is provided, the cause error will be serialized with these options.
   * @default false
   */
  cause?: SerializePropertyValue | boolean;
  /**
   * If `true` or string is provided Axios-like error details will be transformed as `SerializedError['http']`.
   *
   * If `true` is provided, the transformed data will be stored as `http` property.
   * If string is provided, it will be used as a property for error details.
   * @default false
   */
  [includeHttp]?: boolean | string;
};

/**
 * This function is safer than a library [`serialize-error`](https://www.npmjs.com/package/serialize-error/v/2.1.0).
 *
 * Their algorithm has issues in serialization.
 * @param error
 * @param properties
 */
export function serializeError(error: any, properties: ErrorSerializationProperties) {
  const serialized: SerializedError = {};

  const props: ErrorSerializationProperties = Object.assign(
    { message: true, code: true },
    properties
  );
  if (props[includeHttp] === true) {
    props[includeHttp] = 'http';
  }
  if (typeof props[includeHttp] === 'string') {
    const property = props[includeHttp] as string;
    if (properties[property]) {
      throw new TypeError(
        `HTTP error serialization conflict: output property "${props[includeHttp]}" mentioned in the config.`
      );
    }
    serialized[property] = extractHttpError(error);
  }

  if (props.cause === true) {
    props.cause = (value) => serializeError(value, properties);
  }
  for (const [key, value] of Object.entries(properties)) {
    if (value === false) {
      continue;
    }
    if (typeof value === 'function') {
      serialized[key] = value(error[key], error, key);
    } else {
      serialized[key] = error[key];
    }
  }
  return serialized;
}

function extractHttpError(error: any) {
  if (error.response || error.request) {
    const http: SerializedError['http'] = {};
    if (error.request) {
      const req = error.request as AxiosError['request'];
      http.request = {
        url: req.protocol + '//' + req.host + req.path,
      };
      if ('method' in req) {
        http.request.method = req.method;
      }
      if (typeof req.getHeaders === 'function') {
        http.request.headers = req.getHeaders();
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
        http.response = response;
      }
    }
    return http;
  }
}
