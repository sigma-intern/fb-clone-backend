import { ServerErrorCode } from './codes';
import { LogicError } from './logic.error';

export class ServerError extends LogicError {
  constructor(code: ServerErrorCode, cause?: Error, message?: string) {
    super(code, message, cause);
  }
}
