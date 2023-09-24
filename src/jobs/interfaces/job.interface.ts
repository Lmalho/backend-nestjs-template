import { JobStatus, JobType } from '../types/job.types';

export interface IJob {
  itemId: string;
  status: JobStatus;
  type: JobType;
}
