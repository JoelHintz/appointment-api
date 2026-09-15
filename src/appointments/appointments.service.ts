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

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
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
      relations: { office: true },
    });

    return AppointmentMapper.toResponseDtoList(appointments);
  }

  async findOne(id: number): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { office: true },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    return AppointmentMapper.toResponseDto(appointment);
  }

  async create(dto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    const office = await this.loadOffice(dto.officeId);

    await this.validateOfficeIsAvailable({
      officeId: office.id,
      date: dto.date,
      startHour: dto.startHour,
    });

    const toSave = {
      title: dto.title,
      date: dto.date,
      startHour: dto.startHour,
      endHour: this.calculateEndHour(dto.startHour),
      office,
    };

    const entity = this.appointmentRepository.create(toSave);
    const saved = await this.appointmentRepository.save(entity);

    return AppointmentMapper.toResponseDto(saved);
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { office: true },
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
}
