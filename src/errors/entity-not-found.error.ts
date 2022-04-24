import { ErrorCode, NotFoundErrorCode } from './codes';
import { LogicError } from './logic.error';

export class EntityNotFoundError<I = string> extends LogicError {
  constructor(
    public readonly entityId: I,
    code: NotFoundErrorCode = ErrorCode.NotFound,
    message?: string,
    cause?: Error
  ) {
    super(code, message, cause);
  }

  toJsonObject(debug = false) {
    const serialized = super.toJsonObject(debug);
    serialized.entityId = this.entityId;
    return serialized;
  }
}
