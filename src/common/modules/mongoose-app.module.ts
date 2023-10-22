import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig, MongooseConfigKey } from '../config/mongoose.config';

//Module with Mongoose configuration

@Module({
  imports: [
    ConfigModule.forRoot({ load: [MongooseConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get(MongooseConfigKey),
      inject: [ConfigService],
    }),
  ],
})
export class MongooseAppModule {}
