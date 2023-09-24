import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueueOptions } from 'bull';
import { JobsModule } from './jobs/jobs.module';

const routes = [
  {
    path: '/jobs',
    module: JobsModule,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule.register(routes),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'), // Loaded from .ENV
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
