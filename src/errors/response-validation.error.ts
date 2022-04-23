import { OpenAPIResponseValidatorValidationError } from 'openapi-response-validator';
import { ErrorCode } from './codes';
import { ServerError } from './server.error';

export class ResponseValidationError extends ServerError {
  readonly validationError: Partial<OpenAPIResponseValidatorValidationError>;

  constructor(validationError: Partial<OpenAPIResponseValidatorValidationError>, message?: string) {
    super(ErrorCode.ServerOpenapiResponseValidation, undefined, message || validationError.message);
    this.validationError = validationError;
  }
}
