import { ApiProperty } from '@nestjs/swagger';
import { ContactRequestStatus } from '../entity/contact-request.entity';

export class ContactRequestResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  subject!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty({ enum: ContactRequestStatus })
  status!: ContactRequestStatus;

  @ApiProperty({ description: 'Submission time in ISO-8601 format', example: '2026-06-20T09:00:00.000Z' })
  submittedAt!: string;
}
