import { Module } from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';
import { MongooseConfig } from './common/config/mongoose.config';
import { LoggerConfig } from './common/config/logger.config';
import { BullConfig } from './common/config/bull.config';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { MongooseExceptionFilter } from './common/filters/mongoose-exception.filter';
import { LoggerAppModule } from './common/modules/logger-app.module';
import { MongooseAppModule } from './common/modules/mongoose-app.module';
import { BullAppModule } from './common/modules/bull-app.module';

const routes = [
  {
    path: '/jobs',
    module: JobsModule,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({ load: [MongooseConfig, BullConfig, LoggerConfig] }),
    LoggerAppModule,
    MongooseAppModule,
    BullAppModule,
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
