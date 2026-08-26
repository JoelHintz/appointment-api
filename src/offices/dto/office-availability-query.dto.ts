import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class OfficeAvailabilityQueryDto {
  @IsDateString()
  @ApiProperty({ description: 'Date to check availability for', example: '2026-06-30' })
  date!: string;
}
