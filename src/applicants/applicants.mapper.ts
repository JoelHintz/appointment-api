import { Applicant } from './entity/applicant.entity';
import { ApplicantResponseDto } from './dto/applicant-response.dto';

export class ApplicantMapper {
  static toResponseDto(entity: Applicant): ApplicantResponseDto {
    return {
      id: entity.id ?? -1,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      birthDate: entity.birthDate,
    };
  }

  static toResponseDtoList(entities: Applicant[]): ApplicantResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /** Display name used wherever an applicant appears inside another response. */
  static toDisplayName(entity: Applicant): string {
    return `${entity.firstName} ${entity.lastName}`;
  }
}
