import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ContactRequestStatus } from '../entity/contact-request.entity';

/**
 * Status-only patch body. Deliberately not `PartialType(CreateContactRequestDto)`:
 * the citizen's name, email, subject and message must not be editable afterwards.
 */
export class UpdateContactRequestDto {
  @IsEnum(ContactRequestStatus)
  @ApiProperty({ enum: ContactRequestStatus, description: 'New status of the contact request' })
  status!: ContactRequestStatus;
}
