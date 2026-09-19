import { ApiProperty } from '@nestjs/swagger';

export class ApplicantResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ example: '1984-03-12' })
  birthDate!: string;
}
