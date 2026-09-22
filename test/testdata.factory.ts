import { AppointmentResponseDto } from '../src/appointments/dto/appointment-response.dto';
import { CreateAppointmentDto } from '../src/appointments/dto/create-appointment.dto';
import { FindAppointmentsDto } from '../src/appointments/dto/find-appointments.dto';
import { UpdateAppointmentDto } from '../src/appointments/dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from '../src/appointments/entity/appointment.entity';
import { Office } from '../src/offices/entity/office.entity';

const DEFAULT_DATE = '2027-06-20';
const DEFAULT_START_HOUR = 9;
const DEFAULT_END_HOUR = 10;

export const createOffice = (overrides: Partial<Office> = {}): Office => ({
  id: 1,
  name: 'Nuremberg Office',
  opensAtHour: 8,
  closesAtHour: 18,
  ...overrides,
});

export const createAppointment = (overrides: Partial<Appointment> = {}): Appointment => ({
  id: 1,
  title: 'Citizen appointment',
  date: DEFAULT_DATE,
  startHour: DEFAULT_START_HOUR,
  endHour: DEFAULT_END_HOUR,
  status: AppointmentStatus.SCHEDULED,
  office: createOffice(),
  ...overrides,
});

export const createAppointmentResponseDto = (
  overrides: Partial<AppointmentResponseDto> = {},
): AppointmentResponseDto => ({
  id: 1,
  title: 'Citizen appointment',
  date: DEFAULT_DATE,
  startHour: DEFAULT_START_HOUR,
  endHour: DEFAULT_END_HOUR,
  status: AppointmentStatus.SCHEDULED,
  officeId: 1,
  officeName: 'Nuremberg Office',
  ...overrides,
});

export const createCreateAppointmentDto = (overrides: Partial<CreateAppointmentDto> = {}): CreateAppointmentDto => ({
  title: 'New appointment',
  date: DEFAULT_DATE,
  startHour: DEFAULT_START_HOUR,
  officeId: 1,
  ...overrides,
});

export const createFindAppointmentsDto = (overrides: Partial<FindAppointmentsDto> = {}): FindAppointmentsDto => ({
  limit: 10,
  status: AppointmentStatus.SCHEDULED,
  ...overrides,
});

export const createUpdateAppointmentDto = (overrides: Partial<UpdateAppointmentDto> = {}): UpdateAppointmentDto => ({
  title: 'Updated appointment',
  ...overrides,
});
