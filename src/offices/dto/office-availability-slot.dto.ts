import { ApiProperty } from '@nestjs/swagger';

export class OfficeAvailabilitySlotDto {
  @ApiProperty({ description: 'ID of the office' })
  officeId!: number;

  @ApiProperty({ description: 'Calendar date of the slot', example: '2026-06-20' })
  date!: string;

  @ApiProperty({ description: 'Hour the slot starts at, local time of the office', example: 9 })
  startHour!: number;

  @ApiProperty({ description: 'Hour the slot ends at, local time of the office', example: 10 })
  endHour!: number;
}
