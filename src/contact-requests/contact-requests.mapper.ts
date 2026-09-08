import { ContactRequest, ContactRequestStatus } from './entity/contact-request.entity';
import { ContactRequestResponseDto } from './dto/contact-request-response.dto';

export class ContactRequestMapper {
  static toResponseDto(entity: ContactRequest): ContactRequestResponseDto {
    return {
      id: entity.id ?? -1,
      name: entity.name,
      email: entity.email,
      subject: entity.subject,
      message: entity.message,
      status: entity.status ?? ContactRequestStatus.NEW,
      submittedAt: entity.submittedAt,
    };
  }

  static toResponseDtoList(entities: ContactRequest[]): ContactRequestResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
