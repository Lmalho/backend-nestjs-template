import { Module } from '@nestjs/common';
import { BullConfig, BullConfigKey } from '../config/bull.config';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';

// Module with BullMQ configuration

@Module({
  imports: [
    ConfigModule.forRoot({ load: [BullConfig] }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) =>
        config.get<QueueOptions>(BullConfigKey),
      inject: [ConfigService],
    }),
  ],
})
export class BullAppModule {}
