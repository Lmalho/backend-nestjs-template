import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../jobs.controller';
import { JobsService } from '../jobs.service';
import { ResponseFindAllJobDto, ResponseJobDto } from '../dto/response-job.dto';
import { generateJob } from './jobs.stub';
import { JobStatus } from 'src/jobs/types/job.types';
import { JobDocument } from '../schemas/job.schema';
import { Types } from 'mongoose';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(JobsController);
    service = module.get(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new contact', async () => {
      const mock = generateJob();
      const job = {
        ...mock,
      } as any as JobDocument;

      jest.spyOn(service, 'create').mockReturnValueOnce(Promise.resolve(job));

      expect(controller.createJob(mock)).resolves.toEqual(job);
      expect(service.create).toHaveBeenCalledWith(mock);
    });
  });
  describe('findAll', () => {
    it('should return all jobs', async () => {
      const jobList = {
        data: [
          {
            _id: JobStatus.PENDING,
            jobs: [generateJob(), generateJob()],
          },
        ],
      } as ResponseFindAllJobDto;

      jest
        .spyOn(service, 'findAll')
        .mockReturnValueOnce(Promise.resolve(jobList));

      const response = await controller.findAllJobs();
      expect(response.data).toHaveLength(1);
      expect(response.data[0].jobs).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a job by id', async () => {
      const job = {
        id: new Types.ObjectId().toString(),
        status: JobStatus.PENDING,
        ...generateJob(),
      } as JobDocument;

      jest.spyOn(service, 'findOne').mockReturnValueOnce(Promise.resolve(job));

      expect(controller.findOneJob(job.id)).resolves.toEqual(job);
      expect(service.findOne).toHaveBeenCalled();
    });
  });
});
