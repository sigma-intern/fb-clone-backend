import { combineOperations } from './lib';
import { usersController } from './users.controller';

export function buildOperations() {
  return combineOperations([usersController]);
}
