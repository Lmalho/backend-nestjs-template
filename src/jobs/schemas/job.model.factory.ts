import { AsyncModelFactory } from '@nestjs/mongoose';
import { Job, JobSchema } from './job.schema';

export class JobModelFactory implements AsyncModelFactory {
  name = Job.name;
  inject = [];
  useFactory = async () => {
    return JobSchema;
  };
}
