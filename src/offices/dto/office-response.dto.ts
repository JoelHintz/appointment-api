import { ApiProperty } from '@nestjs/swagger';

export class OfficeResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ description: 'First hour the office is open, local time', example: 8 })
  opensAtHour!: number;

  @ApiProperty({ description: 'Hour the office closes, local time', example: 16 })
  closesAtHour!: number;
}
