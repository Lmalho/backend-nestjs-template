import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueueOptions } from 'bull';
import { JobsModule } from './jobs/jobs.module';
import { LoggerModule } from 'nestjs-pino';
import { MongooseConfig } from './common/config/mongoose.config';
import { LoggerConfig } from './common/config/logger.config';
import { BullConfig } from './common/config/bull.config';

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
    RouterModule.register(routes),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) =>
        config.get<QueueOptions>('bull'),
    }),
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
