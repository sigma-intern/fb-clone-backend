import { OpenAPIRequestValidatorError } from 'openapi-request-validator';
import * as Ajv from 'ajv';
import { ErrorCode } from './codes';
import { ILogicError } from './logic.error';

export interface OpenApiFinalError {
  status: number;
  errors?: any[];
}

export function isOpenApiFinalError(err: any): err is OpenApiFinalError {
  return (
    typeof err === 'object' &&
    err !== null &&
    typeof err.status === 'number' &&
    Array.isArray(err.errors)
  );
}

export interface OpenApiFinalLogicError extends ILogicError, OpenApiFinalError {}

export function coerceLogicError(err: OpenApiFinalError): OpenApiFinalLogicError {
  const error = { ...err } as OpenApiFinalLogicError;
  error.code = ErrorCode.OpenApiValidation;
  return error;
}

export class OpenApiError extends Error {
  readonly openApiError: OpenAPIRequestValidatorError;
  readonly jsonSchemaError: Ajv.ErrorObject;

  constructor(
    openApiError: OpenAPIRequestValidatorError,
    jsonSchemaError: Ajv.ErrorObject,
    message?: string
  ) {
    super(message);
    this.openApiError = openApiError;
    this.jsonSchemaError = jsonSchemaError;
  }
}
