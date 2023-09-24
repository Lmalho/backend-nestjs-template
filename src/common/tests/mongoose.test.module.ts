import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { DynamicModule } from '@nestjs/common';
import { MongooseConfig, MongooseConfigKey } from '../config/mongoose.config';

export const rootMongooseTestModule = (
  testOptions: MongooseModuleOptions = {},
): DynamicModule =>
  MongooseModule.forRootAsync({
    imports: [ConfigModule.forRoot({ load: [MongooseConfig] })],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const baseConfig = await configService.get<MongooseModuleOptions>(
        MongooseConfigKey,
      );
      const overrideOptions = { ...baseConfig, ...testOptions };

      return {
        ...overrideOptions,
        uri: process.env.MONGO_URI,
        dbName: new Types.ObjectId().toHexString(),
      };
    },
  });
