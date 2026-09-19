import { Appointment, AppointmentStatus } from './entity/appointment.entity';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { ApplicantMapper } from '../applicants/applicants.mapper';

export class AppointmentMapper {
  static toResponseDto(entity: Appointment): AppointmentResponseDto {
    return {
      id: entity.id ?? -1,
      title: entity.title,
      date: entity.date,
      startHour: entity.startHour,
      endHour: entity.endHour,
      status: entity.status ?? AppointmentStatus.SCHEDULED,
      officeName: entity.office?.name,
      officeId: entity.office?.id,
      applicantId: entity.applicant?.id ?? null,
      applicantName: entity.applicant ? ApplicantMapper.toDisplayName(entity.applicant) : null,
    };
  }

  static toResponseDtoList(entities: Appointment[]): AppointmentResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
