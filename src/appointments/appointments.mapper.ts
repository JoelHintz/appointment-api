import { Appointment, AppointmentStatus } from "./entity/appointment.entity";
import { AppointmentResponseDto } from "./dto/appointment-reponse.dto";

export class AppointmentMapper {
  static toResponseDto(entity: Appointment): AppointmentResponseDto {
    return {
      id: entity.id ?? -1,
      title: entity.title,
      startsAt: entity.startsAt,
      endsAt: entity.endsAt,
      status: entity.status ?? AppointmentStatus.SCHEDULED,
      officeName: entity.office.name,
      officeId: entity.office.id
    };
  }

  static toResponseDtoList(entities: Appointment[]): AppointmentResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
