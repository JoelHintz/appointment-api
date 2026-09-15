import { ApiProperty } from '@nestjs/swagger';
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
}
