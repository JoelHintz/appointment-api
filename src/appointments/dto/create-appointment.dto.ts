import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsNotEmpty, Min } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the booked appointment', example: 'Applying for a passport' })
  title!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ description: 'ID of the office the appointment is booked for', example: 1 })
  officeId!: number;

  @IsISO8601()
  @ApiProperty({ description: 'Start time in ISO-8601 format', example: '2026-06-20T09:00:00.000Z' })
  startsAt!: string;
}
