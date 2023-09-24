import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../jobs.controller';
import { JobsService } from '../jobs.service';
import { ResponseFindAllJobDto } from '../dto/response-job.dto';
import { generateJob } from './jobs.stub';
import { JobStatus } from 'src/jobs/types/job.types';
import { JobDocument } from '../schemas/job.schema';

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

      expect(controller.createExport(mock)).resolves.toEqual(job);
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

      const response = await controller.findAllExports();
      expect(response.data).toHaveLength(1);
      expect(response.data[0].jobs).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
