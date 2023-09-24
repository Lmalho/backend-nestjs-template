import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';

import { EntityDto } from 'src/common/dto/entity.dto';
import { JobStatus } from '../types/job.types';

export class ResponseJobDto extends IntersectionType(EntityDto, CreateJobDto) {
  @ApiProperty({
    enumName: 'StatusType',
    enum: Object.values(JobStatus),
    description: 'Job status',
    example: JobStatus[0],
    required: true,
    nullable: false,
  })
  status: JobStatus;
}

export class GroupJobDto {
  @ApiProperty({
    enumName: 'StatusType',
    enum: Object.values(JobStatus),
    description: 'Job status',
    example: JobStatus[0],
    required: true,
    nullable: false,
  })
  _id: JobStatus;
  @ApiProperty({
    description: 'List of jobs',
    type: [ResponseJobDto],
  })
  jobs: ResponseJobDto[];
}

export class ResponseFindAllJobDto {
  @ApiProperty({
    description: 'List of jobs grouped by status',
    type: [GroupJobDto],
  })
  data: GroupJobDto[];
}
