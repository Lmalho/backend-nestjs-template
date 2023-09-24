import { MongooseModuleOptions } from '@nestjs/mongoose';
import { registerAs } from '@nestjs/config';

export default registerAs<MongooseModuleOptions>('mongoose', () => {
  const { MONGO_URI } = process.env;

  return {
    uri: MONGO_URI,
    retryAttempts: 5,
  };
});
