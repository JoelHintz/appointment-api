import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { AppointmentMapper } from './appointments.mapper';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Office } from '../offices/entity/office.entity';
import { Applicant } from '../applicants/entity/applicant.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
  ) {}

  async findAll(query: FindAppointmentsDto): Promise<AppointmentResponseDto[]> {
    const where: FindOptionsWhere<Appointment> = {};

    if (query.status) {
      where.status = query.status;
    }

    const appointments = await this.appointmentRepository.find({
      where,
      take: query.limit ?? 10,
      order: { id: 'ASC' },
      relations: { office: true, applicant: true },
    });

    return AppointmentMapper.toResponseDtoList(appointments);
  }

  async findOne(id: number): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { office: true, applicant: true },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    return AppointmentMapper.toResponseDto(appointment);
  }

  async create(dto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    const office = await this.loadOffice(dto.officeId);
    const applicant = dto.applicantId === undefined ? null : await this.loadApplicant(dto.applicantId);

    await this.validateOfficeIsAvailable({
      officeId: office.id,
      date: dto.date,
      startHour: dto.startHour,
    });

    if (applicant) {
      await this.validateApplicantHasNoAppointment({
        applicantId: applicant.id,
        officeId: office.id,
        date: dto.date,
      });
    }

    const toSave = {
      title: dto.title,
      date: dto.date,
      startHour: dto.startHour,
      endHour: this.calculateEndHour(dto.startHour),
      office,
      applicant,
    };

    const entity = this.appointmentRepository.create(toSave);
    const saved = await this.appointmentRepository.save(entity);

    return AppointmentMapper.toResponseDto(saved);
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { office: true, applicant: true },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    const toSave = await this.mergeDtoIntoEntity(appointment, dto);

    toSave.endHour = this.calculateEndHour(toSave.startHour);

    await this.validateOfficeIsAvailable({
      officeId: toSave.office.id,
      date: toSave.date,
      startHour: toSave.startHour,
      ignoredAppointmentId: id,
    });

    if (toSave.applicant) {
      await this.validateApplicantHasNoAppointment({
        applicantId: toSave.applicant.id,
        officeId: toSave.office.id,
        date: toSave.date,
        ignoredAppointmentId: id,
      });
    }

    const saved = await this.appointmentRepository.save(toSave);
    return AppointmentMapper.toResponseDto(saved);
  }

  private async mergeDtoIntoEntity(appointment: Appointment, dto: UpdateAppointmentDto) {
    if (dto.title !== undefined) {
      appointment.title = dto.title;
    }
    if (dto.date !== undefined) {
      appointment.date = dto.date;
    }
    if (dto.startHour !== undefined) {
      appointment.startHour = dto.startHour;
    }
    if (dto.officeId !== undefined && appointment.office.id !== dto.officeId) {
      appointment.office = await this.loadOffice(dto.officeId);
    }
    if (dto.applicantId !== undefined && appointment.applicant?.id !== dto.applicantId) {
      appointment.applicant = await this.loadApplicant(dto.applicantId);
    }
    return appointment;
  }

  private async loadOffice(officeId: number): Promise<Office> {
    const office = await this.officeRepository.findOne({
      where: { id: officeId },
    });

    if (!office) {
      throw new NotFoundException(`Office with id ${officeId} was not found`);
    }

    return office;
  }

  private async loadApplicant(applicantId: number): Promise<Applicant> {
    const applicant = await this.applicantRepository.findOne({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new NotFoundException(`Applicant with id ${applicantId} was not found`);
    }

    return applicant;
  }

  /** Every appointment fills exactly one hourly slot. */
  private calculateEndHour(startHour: number): number {
    return startHour + 1;
  }

  private async validateOfficeIsAvailable(params: {
    officeId: number;
    date: string;
    startHour: number;
    ignoredAppointmentId?: number;
  }): Promise<void> {
    const { officeId, date, startHour, ignoredAppointmentId } = params;

    const where: FindOptionsWhere<Appointment> = {
      office: { id: officeId },
      date,
      startHour,
    };

    if (ignoredAppointmentId !== undefined) {
      where.id = Not(ignoredAppointmentId);
    }

    const conflictingAppointment = await this.appointmentRepository.findOne({ where });

    if (conflictingAppointment) {
      throw new BadRequestException('Office is already booked for the requested time');
    }
  }

  /** One person books at most one appointment per office and day. */
  private async validateApplicantHasNoAppointment(params: {
    applicantId: number;
    officeId: number;
    date: string;
    ignoredAppointmentId?: number;
  }): Promise<void> {
    const { applicantId, officeId, date, ignoredAppointmentId } = params;

    const where: FindOptionsWhere<Appointment> = {
      applicant: { id: applicantId },
      office: { id: officeId },
      date,
    };

    if (ignoredAppointmentId !== undefined) {
      where.id = Not(ignoredAppointmentId);
    }

    const existingAppointment = await this.appointmentRepository.findOne({ where });

    if (existingAppointment) {
      throw new BadRequestException('Applicant already has an appointment at this office on the requested date');
    }
  }
}
