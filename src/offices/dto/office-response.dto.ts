import { ApiProperty } from '@nestjs/swagger';

export class OfficeResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  opensAt!: string;

  @ApiProperty()
  closesAt!: string;
}
