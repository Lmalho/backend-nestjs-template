import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

import { BullModule } from '@nestjs/bullmq';
import { Queues } from 'src/common/types/queues';
import { JobsProcessorService } from './processor/jobs.processor.service';
import { JobModelFactory } from './schemas/job.model.factory';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([new JobModelFactory()]),
    BullModule.registerQueue({ name: Queues.JOB }),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobsProcessorService],
})
export class JobsModule {}
