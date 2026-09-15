import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class OfficeAvailabilityQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be a calendar date in the format YYYY-MM-DD' })
  @ApiProperty({ description: 'Date to check availability for', example: '2026-06-30' })
  date!: string;
}
