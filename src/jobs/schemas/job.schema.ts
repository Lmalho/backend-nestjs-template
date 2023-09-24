import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { JobStatus, JobType } from '../types/job.types';
import { IJob } from '../interfaces/job.interface';

export type JobDocument = HydratedDocument<Job>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Job implements IJob {
  @Prop({
    required: true,
    type: String,
  })
  itemId: string;

  @Prop({
    enum: Object.values(JobStatus),
    type: String,
    default: JobStatus.PENDING,
  })
  status: JobStatus;
  @Prop({
    enum: Object.values(JobType),
    type: String,
  })
  type: JobType;
}

export const JobSchema = SchemaFactory.createForClass(Job);
