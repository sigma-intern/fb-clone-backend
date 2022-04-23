import { ErrorCode } from './codes';
import { SerializedError, serializeError } from './utils';

export interface ILogicError {
  code: ErrorCode;
}

export interface SerializedLogicError extends SerializedError {
  name: string;
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

  asJsonObject(debug = false): SerializedLogicError {
    const data = serializeError(this, {
      includeStack: debug,
      includeHttp: debug,
    }) as SerializedLogicError;
    data.name = this.constructor.name;
    return data;
  }
}
