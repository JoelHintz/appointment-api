import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '../entity/appointment.entity';

export class AppointmentResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ example: '2026-06-20' })
  date!: string;

  @ApiProperty({ example: 9 })
  startHour!: number;

  @ApiProperty({ example: 10 })
  endHour!: number;

  @ApiProperty({ enum: AppointmentStatus })
  status!: AppointmentStatus;

  @ApiProperty()
  officeId!: number;

  @ApiProperty()
  officeName!: string;

  @ApiPropertyOptional({ description: 'ID of the person the appointment is booked for', example: 1, nullable: true })
  applicantId?: number | null;

  @ApiPropertyOptional({ description: 'Name of the person the appointment is booked for', example: 'Erika Mustermann', nullable: true })
  applicantName?: string | null;
}
