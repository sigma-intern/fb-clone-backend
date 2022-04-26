import { Collection } from 'mongodb';
import { MongodbConnectionService } from '../services/mongodb-connection.service';
import { User } from '../models/user';

export const usersCollectionName = 'users';

export class UsersRepository {
  private readonly collection: Collection<User>;
  constructor(private dbConnection: MongodbConnectionService) {
    this.collection = dbConnection.client
      .db(dbConnection.defaultDbName)
      .collection(usersCollectionName);
  }
}
