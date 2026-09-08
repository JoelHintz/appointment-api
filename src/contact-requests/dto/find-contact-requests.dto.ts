import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ContactRequestStatus } from '../entity/contact-request.entity';

export class FindContactRequestsDto {
  @IsOptional()
  @IsEnum(ContactRequestStatus)
  @ApiPropertyOptional({
    enum: ContactRequestStatus,
    description: 'Optional status filter',
  })
  status?: ContactRequestStatus;
}
