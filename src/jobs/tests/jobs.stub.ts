import { JobType, JobStatus } from 'src/jobs/types/job.types';
import { CreateJobDto } from '../dto/create-job.dto';
import { ResponseJobDto } from '../dto/response-job.dto';

export function generateJob(): CreateJobDto {
  return {
    itemId: '1234',
    type: JobType.DELETE,
  };
}

export function generateJobResponse(): Partial<ResponseJobDto> {
  return {
    ...generateJob(),
    status: JobStatus.PENDING,
  };
}
