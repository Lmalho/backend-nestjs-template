import { Module } from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { QueueOptions } from 'bullmq';
import { JobsModule } from './jobs/jobs.module';
import { LoggerModule } from 'nestjs-pino';
import { MongooseConfig } from './common/config/mongoose.config';
import { LoggerConfig } from './common/config/logger.config';
import { BullConfig, BullConfigKey } from './common/config/bull.config';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { MongooseExceptionFilter } from './common/filters/mongoose-exception.filter';

const routes = [
  {
    path: '/jobs',
    module: JobsModule,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({ load: [MongooseConfig, BullConfig, LoggerConfig] }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('logger'),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) =>
        config.get<QueueOptions>(BullConfigKey),
      inject: [ConfigService],
    }),
    RouterModule.register(routes),
    JobsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongooseExceptionFilter,
    },
  ],
})
export class AppModule {}
