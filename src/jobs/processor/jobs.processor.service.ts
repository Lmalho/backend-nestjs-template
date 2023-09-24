import { Process, Processor } from '@nestjs/bull';
import { JobPayload, Queues } from 'src/common/types/queues';
import { JobsService } from '../jobs.service';
import { Job } from 'bull';
import { JobStatus } from 'src/jobs/types/job.types';

@Processor(Queues.JOB)
export class JobsProcessorService {
  constructor(private readonly jobsService: JobsService) {}

  @Process()
  async process(job: Job<JobPayload>): Promise<any> {
    console.log(`Processing new job ${job.id}`);

    const jobUpdated = await this.jobsService.update(job.id.toString(), {
      status: JobStatus.FINISHED,
    });
    if (jobUpdated) console.log(`Updated export job ${job.id}`);
    return;
  }
}
