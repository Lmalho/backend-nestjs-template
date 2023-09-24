import { Controller, Get, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseJobDto, ResponseFindAllJobDto } from './dto/response-job.dto';

@ApiTags('Exports')
@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({
    summary: 'Create an export job',
    description: 'Creates an import job',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ResponseJobDto,
  })
  @Post()
  createExport(@Body() createJobDto: CreateJobDto) {
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
  findAllExports() {
    return this.jobsService.findAll();
  }
}
