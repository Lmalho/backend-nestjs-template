import { JobStatus, JobType } from 'src/jobs/types/job.types';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    type: String,
    description: `Item id`,
    example: '4382739',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value?.trim() : value,
  )
  itemId: string;

  @ApiProperty({
    enumName: 'JobType',
    enum: Object.values(JobType),
    description: 'File type of the job',
    example: JobType[0],
    required: true,
    nullable: false,
  })
  type: JobType;
}

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ApiProperty({
    enumName: 'StatusType',
    enum: Object.values(JobStatus),
    description: 'Job status',
    example: JobStatus[0],
    required: false,
    nullable: false,
  })
  status?: JobStatus;
}
