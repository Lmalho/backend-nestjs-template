import { MongoMemoryReplSet } from 'mongodb-memory-server';

export = async function globalSetup() {
  const instance = await MongoMemoryReplSet.create({});
  const uri = instance.getUri();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
};
