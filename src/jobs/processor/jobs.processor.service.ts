import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { JobPayload, Queues } from 'src/common/types/queues';
import { JobsService } from '../jobs.service';
import { Job as BullMQJob } from 'bullmq';
import { JobStatus } from 'src/jobs/types/job.types';
import { Logger } from '@nestjs/common';

@Processor(Queues.JOB)
export class JobsProcessorService extends WorkerHost {
  private readonly logger = new Logger(JobsProcessorService.name);
  constructor(private readonly jobsService: JobsService) {
    super();
  }

  async process(job: BullMQJob<JobPayload>): Promise<any> {
    this.logger.log(`Processing new job ${job.id}`);

    const jobUpdated = await this.jobsService.update(job.data.jobId, {
      status: JobStatus.FINISHED,
    });
    if (jobUpdated) this.logger.log(`Job ${job.id} finished`);
    else this.logger.log(`Job ${job.id} failed`);
    return;
  }

  @OnWorkerEvent('error')
  onError(err: Error): void {
    this.logger.error(err);
  }
}
