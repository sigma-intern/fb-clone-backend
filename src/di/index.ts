import { MongodbConnectionService } from '../services/mongodb-connection.service';
import { config } from '../lib/config';
import { UsersRepository } from '../repositories/users.repository';
import { AuthService } from '../services/auth.service';

export interface Dependencies {
  users: UsersRepository;
  auth: AuthService;
  mongoDbConnection: MongodbConnectionService;
}

export async function createDependencies(): Promise<Dependencies> {
  const mongoDbConnection = new MongodbConnectionService(config.mongoDbUrl);
  const users = new UsersRepository(mongoDbConnection);
  const auth = new AuthService(users);

  await mongoDbConnection.init();

  return { users, auth, mongoDbConnection };
}

export async function disposeDependencies(dependencies: Dependencies) {
  await dependencies.mongoDbConnection.dispose();
}
