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
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

describe('JobsService', () => {
  let module: TestingModule;
  let service: JobsService;
  let jobModel: Model<Job>;
  let jobQueue: Queue<JobPayload>;

  // class QueueMock extends EventEmitter2 {
  //   public add = jest.fn();
  //   public process = jest.fn();
  // }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), JobsModule],
    }).compile();

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
