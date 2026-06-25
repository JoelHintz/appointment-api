import { ApiProperty } from '@nestjs/swagger';

export class OfficeAvailabilitySlotDto {
  @ApiProperty({ description: 'ID of the office' })
  officeId!: number;

  @ApiProperty({ description: 'Slot start time in ISO-8601 format' })
  startsAt!: string;

  @ApiProperty({ description: 'Slot end time in ISO-8601 format' })
  endsAt!: string;
}
