import { Dependencies } from '../di';
import { OpenApiRequest, OpenApiResponse } from '../openapi/types';

export const controllerNameProp: unique symbol = Symbol('controllerName');

export interface OpenApiOperations {
  readonly [controllerNameProp]: string;
  [methodName: string]: OpenApiOperation;
}

export type OpenApiOperation = (
  this: { dependencies: Dependencies },
  req: OpenApiRequest,
  res: OpenApiResponse
) => any | PromiseLike<any>;

export function combineOperations(controllers: Iterable<OpenApiOperations>) {
  const operations: Record<string, OpenApiOperation> = {};
  for (const controller of controllers) {
    for (const [methodName, operation] of Object.entries(controller)) {
      operations[createOperationFullName(controller[controllerNameProp], methodName)] = operation;
    }
  }
  return operations;
}

export function createOperationFullName(controllerName: string, methodName: string) {
  return `${controllerName}.${methodName}`;
}
