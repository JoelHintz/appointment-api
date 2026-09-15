import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Matches, Max, Min } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the booked appointment', example: 'Applying for a passport' })
  title!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ description: 'ID of the office the appointment is booked for', example: 1 })
  officeId!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be a calendar date in the format YYYY-MM-DD' })
  @ApiProperty({ description: 'Calendar date of the appointment, local time of the office', example: '2026-06-20' })
  date!: string;

  @IsInt()
  @Min(0)
  @Max(23)
  @Type(() => Number)
  @ApiProperty({
    description: 'Hour the appointment starts at, local time of the office',
    example: 9,
    minimum: 0,
    maximum: 23,
  })
  startHour!: number;
}
