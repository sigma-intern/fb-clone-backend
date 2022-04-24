import { OpenAPIResponseValidatorValidationError } from 'openapi-response-validator';
import { ErrorCode } from './codes';
import { ServerError } from './server.error';

export class ResponseValidationError extends ServerError {
  constructor(
    public readonly validationError: Partial<OpenAPIResponseValidatorValidationError>,
    message?: string
  ) {
    super(ErrorCode.ServerOpenapiResponseValidation, undefined, message || validationError.message);
  }
}
