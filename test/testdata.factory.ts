import { AppointmentResponseDto } from '../src/appointments/dto/appointment-response.dto';
import { CreateAppointmentDto } from '../src/appointments/dto/create-appointment.dto';
import { FindAppointmentsDto } from '../src/appointments/dto/find-appointments.dto';
import { UpdateAppointmentDto } from '../src/appointments/dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from '../src/appointments/entity/appointment.entity';
import { Office } from '../src/offices/entity/office.entity';
import { Applicant } from '../src/applicants/entity/applicant.entity';
import { ApplicantResponseDto } from '../src/applicants/dto/applicant-response.dto';
import { CreateApplicantDto } from '../src/applicants/dto/create-applicant.dto';
import { ContactRequestResponseDto } from '../src/contact-requests/dto/contact-request-response.dto';
import { CreateContactRequestDto } from '../src/contact-requests/dto/create-contact-request.dto';
import { UpdateContactRequestDto } from '../src/contact-requests/dto/update-contact-request.dto';
import { ContactRequest, ContactRequestStatus } from '../src/contact-requests/entity/contact-request.entity';

const DEFAULT_DATE = '2026-06-20';
const DEFAULT_START_HOUR = 9;
const DEFAULT_END_HOUR = 10;

export const createOffice = (overrides: Partial<Office> = {}): Office => ({
  id: 1,
  name: 'Nuremberg Office',
  opensAtHour: 8,
  closesAtHour: 18,
  ...overrides,
});

export const createApplicant = (overrides: Partial<Applicant> = {}): Applicant => ({
  id: 1,
  firstName: 'Erika',
  lastName: 'Mustermann',
  email: 'erika.mustermann@example.com',
  birthDate: '1984-03-12',
  ...overrides,
});

export const createApplicantResponseDto = (overrides: Partial<ApplicantResponseDto> = {}): ApplicantResponseDto => ({
  id: 1,
  firstName: 'Erika',
  lastName: 'Mustermann',
  email: 'erika.mustermann@example.com',
  birthDate: '1984-03-12',
  ...overrides,
});

export const createCreateApplicantDto = (overrides: Partial<CreateApplicantDto> = {}): CreateApplicantDto => ({
  firstName: 'Erika',
  lastName: 'Mustermann',
  email: 'erika.mustermann@example.com',
  birthDate: '1984-03-12',
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
  applicant: null,
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
  applicantId: null,
  applicantName: null,
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

const DEFAULT_SUBMITTED_AT = '2026-06-19T08:30:00.000Z';

export const createContactRequest = (overrides: Partial<ContactRequest> = {}): ContactRequest => ({
  id: 1,
  name: 'Erika Mustermann',
  email: 'erika.mustermann@example.com',
  subject: 'Question about passport fees',
  message: 'How much does a new passport cost?',
  status: ContactRequestStatus.NEW,
  submittedAt: DEFAULT_SUBMITTED_AT,
  ...overrides,
});

export const createContactRequestResponseDto = (
  overrides: Partial<ContactRequestResponseDto> = {},
): ContactRequestResponseDto => ({
  id: 1,
  name: 'Erika Mustermann',
  email: 'erika.mustermann@example.com',
  subject: 'Question about passport fees',
  message: 'How much does a new passport cost?',
  status: ContactRequestStatus.NEW,
  submittedAt: DEFAULT_SUBMITTED_AT,
  ...overrides,
});

export const createCreateContactRequestDto = (
  overrides: Partial<CreateContactRequestDto> = {},
): CreateContactRequestDto => ({
  name: 'Erika Mustermann',
  email: 'erika.mustermann@example.com',
  subject: 'Question about passport fees',
  message: 'How much does a new passport cost?',
  ...overrides,
});

export const createUpdateContactRequestDto = (
  overrides: Partial<UpdateContactRequestDto> = {},
): UpdateContactRequestDto => ({
  status: ContactRequestStatus.IN_PROGRESS,
  ...overrides,
});
