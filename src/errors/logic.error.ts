import { ErrorCode } from './codes';
import {
  includeHttp,
  SerializedError,
  serializeError,
  ErrorSerializationProperties,
} from './utils';

export interface ILogicError {
  code: ErrorCode;
}

export class LogicError extends TypeError implements ILogicError {
  readonly code: ErrorCode;
  readonly cause?: Error;

  constructor(code: ErrorCode, message?: string, cause?: Error) {
    if (!message) {
      super(code, { cause });
    } else {
      super(message, { cause });
    }
    this.code = code;
  }

  toJsonObject(debug = false): SerializedError {
    return serializeError(this, getDefaultErrorSerializationProperties(debug));
  }
}

export function getDefaultErrorSerializationProperties(
  debug: boolean
): ErrorSerializationProperties {
  return {
    name: debug,
    stack: debug,
    cause: true,
    [includeHttp]: debug,
  };
}
