import { Injectable } from '@nestjs/common';

import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';

import { InjectQueue } from '@nestjs/bull';
import { JobTimes, JobPayload, Queues } from 'src/common/types/queues';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { Job } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseFindAllJobDto } from './dto/response-job.dto';

@Injectable()
export class JobsService {
  findOne(jobId: string) {
    return this.jobsModel.findOne({ _id: jobId });
  }
  constructor(
    @InjectModel(Job.name)
    private jobsModel: Model<Job>,
    @InjectQueue(Queues.JOB)
    private exportJobQueue: Queue<JobPayload>,
  ) {}

  async create(jobDto: CreateJobDto) {
    const job = await new this.jobsModel(jobDto).save();

    const payload: JobPayload = { jobId: job._id.toString() };
    await this.exportJobQueue.add(payload.jobId, payload, {
      delay: JobTimes[job.type],
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
