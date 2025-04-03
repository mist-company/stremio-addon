import { MongoClient } from 'mongodb';
import { DB_NAME, DB_URL } from '../utils/config';

export class DBHelper {
  private readonly client: MongoClient;
  private isConnected = false;

  constructor() {
    this.client = new MongoClient(DB_URL);
  }

  async getCollection(collectionName: string) {
    return this.client.db(DB_NAME).collection(collectionName);
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  async disconnect() {
    await this.client.close();
    this.isConnected = false;
  }
}
