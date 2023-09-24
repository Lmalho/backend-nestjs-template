import { MongoMemoryReplSet } from 'mongodb-memory-server';

export = async function globalTeardown() {
  const instance: MongoMemoryReplSet = (global as any).__MONGOINSTANCE;
  await instance.stop();
};
