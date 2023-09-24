import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Dto that defines a document entity
 */
export class EntityDto {
  @ApiProperty({
    description: `Id`,
    example: '6177fcf7d31beec75cca64a3',
    type: String,
  })
  @IsString()
  _id: string;

  @ApiProperty({
    description: `Created at UTC time in string format`,
    example: '2021-11-22T15:45:23.672Z',
    type: String,
  })
  @IsString()
  createdAt?: string;

  @ApiProperty({
    description: `Updated at UTC time in string format`,
    example: '2021-11-22T15:45:23.672Z',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  updatedAt?: string | undefined;
}
