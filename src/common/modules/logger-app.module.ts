import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerConfig, LoggerConfigKey } from '../config/logger.config';
import { LoggerModule } from 'nestjs-pino';

// Module with Logger configuration

@Module({
  imports: [
    ConfigModule.forRoot({ load: [LoggerConfig] }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get(LoggerConfigKey),
      inject: [ConfigService],
    }),
  ],
})
export class LoggerAppModule {}
