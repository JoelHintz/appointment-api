import { AppointmentResponseDto } from '../src/appointments/dto/appointment-reponse.dto';
import { CreateAppointmentDto } from '../src/appointments/dto/create-appointment.dto';
import { FindAppointmentsDto } from '../src/appointments/dto/find-appointments.dto';
import { UpdateAppointmentDto } from '../src/appointments/dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from '../src/appointments/entity/appointment.entity';
import { Office } from '../src/offices/entity/office.entity';

const DEFAULT_START = '2026-06-20T09:00:00.000Z';
const DEFAULT_END = '2026-06-20T10:00:00.000Z';

export const createOffice = (
  overrides: Partial<Office> = {}
): Office =>
  ({
      id: 1,
      name: 'Nuremberg Office',
      openingTime: '08:00',
      closingTime: '18:00',
      ...overrides,
    }) as Office;

export const createAppointment = (
    overrides: Partial<Appointment> = {},
  ): Appointment => ({
    id: 1,
    title: 'Citizen appointment',
    startsAt: DEFAULT_START,
    endsAt: DEFAULT_END,
    status: AppointmentStatus.SCHEDULED,
    office: createOffice(),
    ...overrides,
  });

export const createAppointmentResponseDto = (
  overrides: Partial<AppointmentResponseDto> = {},
): AppointmentResponseDto =>
  ({
    id: 1,
    title: 'Citizen appointment',
    startsAt: DEFAULT_START,
    endsAt: DEFAULT_END,
    status: AppointmentStatus.SCHEDULED,
    officeId: 1,
    ...overrides,
  }) as AppointmentResponseDto;

export const createCreateAppointmentDto = (
  overrides: Partial<CreateAppointmentDto> = {},
): CreateAppointmentDto =>
  ({
    title: 'New appointment',
    startsAt: DEFAULT_START,
    endsAt: DEFAULT_END,
    officeId: 1,
    ...overrides,
  });

export const createFindAppointmentsDto = (
  overrides: Partial<FindAppointmentsDto> = {},
): FindAppointmentsDto =>
  ({
    limit: 10,
    status: AppointmentStatus.SCHEDULED,
    ...overrides,
  });

export const createUpdateAppointmentDto = (
  overrides: Partial<UpdateAppointmentDto> = {},
): UpdateAppointmentDto =>
  ({
    title: 'Updated appointment',
    ...overrides,
  });
