import { TestingModule, Test } from '@nestjs/testing';
import { JobsService } from '../jobs.service';
import { generateJob, generateJobResponse } from './jobs.stub';
import { JobStatus } from 'src/jobs/types/job.types';
import { JobPayload, JobTimes, Queues } from 'src/common/types/queues';
import { Model } from 'mongoose';
import { Job } from '../schemas/job.schema';
import { getModelToken } from '@nestjs/mongoose';
import { rootMongooseTestModule } from 'src/common/tests/mongoose.test.module';
import { JobsModule } from '../jobs.module';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { JobsProcessorService } from '../processor/jobs.processor.service';

describe('JobsService', () => {
  let module: TestingModule;
  let service: JobsService;
  let jobModel: Model<Job>;
  let jobQueue: Queue<JobPayload>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), JobsModule],
    })
      .overrideProvider(JobsProcessorService)
      .useValue({ process: jest.fn() })
      .compile();

    await module.init();

    service = module.get(JobsService);
    jobQueue = module.get(getQueueToken(Queues.JOB));
    jobModel = module.get(getModelToken(Job.name));
  }, 10000);

  afterAll(async () => {
    await module.close();
  });

  describe('findAll', () => {
    it('should return all jobs by status', async () => {
      await Promise.all(
        [...Array(3)].map(() => new jobModel(generateJob()).save()),
      );

      const savedJobs = await service.findAll();

      expect(savedJobs['data'][0].jobs).toHaveLength(3);
    });
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      const job = await new jobModel(generateJob()).save();

      const jobDocument = await service.findOne(job._id.toString());

      expect(jobDocument).toMatchObject(generateJobResponse());
    });

    it('should throw an error if job not found', async () => {
      await expect(service.findOne('1234')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a job', async () => {
      jest.spyOn(jobQueue, 'add').mockResolvedValueOnce(null);

      const jobDocument = await service.create(generateJob());

      expect(jobDocument).toBeDefined();
      expect(jobDocument).toMatchObject(generateJobResponse());

      expect(jobQueue.add).toBeCalledWith(
        jobDocument._id.toString(),
        { jobId: jobDocument._id.toString() },
        {
          delay: JobTimes[jobDocument.type],
          removeOnFail: true,
        },
      );
    });
  });
  describe('update', () => {
    it('should update a job by id', async () => {
      const jobDocument = await new jobModel(generateJob()).save();

      const job = await service.update(jobDocument._id.toString(), {
        status: JobStatus.FINISHED,
      });

      expect(job).toMatchObject({ status: JobStatus.FINISHED });
    });
  });
});
