import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseJobDto, ResponseFindAllJobDto } from './dto/response-job.dto';

@ApiTags('Jobs')
@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({
    summary: 'Create a job',
    description: 'Creates a job',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ResponseJobDto,
  })
  @Post()
  createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @ApiOperation({
    summary: 'List of jobs',
    description: 'Lists all jobs by status',
  })
  @ApiCreatedResponse({
    description: 'Lists all jobs by status',
    type: ResponseFindAllJobDto,
  })
  @Get()
  findAllJobs() {
    return this.jobsService.findAll();
  }

  @ApiOperation({
    summary: 'Get a job',
    description: 'Gets a job by id',
  })
  @ApiCreatedResponse({
    description: 'Gets a job by id',
    type: ResponseJobDto,
  })
  @Get(':jobId')
  findOneJob(@Param('jobId') jobId: string) {
    return this.jobsService.findOne(jobId);
  }
}
