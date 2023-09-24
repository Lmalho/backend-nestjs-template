import { MongooseModuleOptions } from '@nestjs/mongoose';
import { registerAs } from '@nestjs/config';

export const MongooseConfigKey = 'mongoose';
export const MongooseConfig = registerAs<MongooseModuleOptions>(
  MongooseConfigKey,
  (): MongooseModuleOptions => {
    const { MONGO_URI } = process.env;

    const options: MongooseModuleOptions = {
      uri: MONGO_URI,
      ignoreUndefined: true,
      retryAttempts: 5,
    };
    return options;
  },
);
