import { Injectable } from '@nestjs/common';

import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';

import { InjectQueue } from '@nestjs/bullmq';
import { JobTimes, JobPayload, Queues } from 'src/common/types/queues';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { Job } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseFindAllJobDto } from './dto/response-job.dto';
import { ThrowNotFoundIfNull } from 'src/common/decorators/throw-not-found-if-null.decorator';
import { ErrorCodes } from 'src/common/errors/codes.error';

@Injectable()
export class JobsService {
  @ThrowNotFoundIfNull(ErrorCodes.JOB_NOT_FOUND)
  async findOne(jobId: string) {
    return this.jobsModel.findOne({ _id: jobId });
  }
  constructor(
    @InjectQueue(Queues.JOB)
    private jobQueue: Queue<JobPayload>,
    @InjectModel(Job.name)
    private jobsModel: Model<Job>,
  ) {}

  async create(jobDto: CreateJobDto) {
    const job = await new this.jobsModel(jobDto).save();

    const payload: JobPayload = { jobId: job._id.toString() };
    await this.jobQueue.add(payload.jobId, payload, {
      delay: JobTimes[job.type],
      removeOnFail: true,
    });

    return job;
  }

  async findAll() {
    const listOfJobs = await this.jobsModel.aggregate().group({
      _id: '$status',
      jobs: { $push: '$$ROOT' },
    });

    return { data: listOfJobs } as ResponseFindAllJobDto;
  }

  async update(jobId: string, job: UpdateJobDto) {
    const updatedJob = await this.jobsModel.findOneAndUpdate(
      { _id: jobId },
      {
        $set: job,
      },
      {
        new: true,
      },
    );

    return updatedJob;
  }
}
