import { Process, Processor } from '@nestjs/bull';
import { JobPayload, Queues } from 'src/common/types/queues';
import { JobsService } from '../jobs.service';
import { Job } from 'bull';
import { JobStatus } from 'src/jobs/types/job.types';
import { Logger } from '@nestjs/common';

@Processor(Queues.JOB)
export class JobsProcessorService {
  private readonly logger = new Logger(JobsProcessorService.name);
  constructor(private readonly jobsService: JobsService) {}

  @Process()
  async process(job: Job<JobPayload>): Promise<any> {
    console.log(`Processing new job ${job.id}`);

    const jobUpdated = await this.jobsService.update(job.id.toString(), {
      status: JobStatus.FINISHED,
    });
    if (jobUpdated) this.logger.log(`Job ${job.id} finished`);
    return;
  }
}
