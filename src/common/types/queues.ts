import { JobType } from 'src/jobs/types/job.types';

export enum Queues {
  JOB = 'JOB',
}

export type JobPayload = {
  jobId: string;
};

//in milliseconds
export const JobTimes = {
  [JobType.PROCESS]: 10000,
  [JobType.DELETE]: 2500,
};
