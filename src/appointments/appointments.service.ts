import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-reponse.dto';
import { AppointmentMapper } from './appointments.mapper';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Office } from '../offices/entity/office.entity';

@Injectable()
export class AppointmentsService {
  private readonly appointmentDurationMinutes = 60;

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
    this.validateStartsAt(dto.startsAt);

    const office = await this.loadOffice(dto.officeId);

    await this.validateOfficeIsAvailable({
      officeId: office.id,
      startsAt: dto.startsAt,
    });

    const toSave = {
      title: dto.title,
      startsAt: dto.startsAt,
      endsAt: this.calculateEndTime(dto.startsAt),
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

    this.validateStartsAt(toSave.startsAt);
    await this.validateOfficeIsAvailable({
      officeId: toSave.office.id,
      startsAt: toSave.startsAt,
      ignoredAppointmentId: id,
    });

    const saved = await this.appointmentRepository.save(toSave);
    return AppointmentMapper.toResponseDto(saved);
  }

  private async mergeDtoIntoEntity(appointment: Appointment, dto: UpdateAppointmentDto) {
    if (dto.title !== undefined) {
      appointment.title = dto.title;
    }
    if (dto.startsAt !== undefined) {
      appointment.startsAt = dto.startsAt;
      appointment.endsAt = this.calculateEndTime(dto.startsAt);
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

  private calculateEndTime(startsAt: string): string {
    const start = new Date(startsAt);
    const end = new Date(start.getTime() + this.appointmentDurationMinutes * 60 * 1000);

    return end.toISOString();
  }

  private validateStartsAt(startsAt: string): void {
    const start = new Date(startsAt);

    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('startsAt must be a valid ISO date string');
    }

    if (start.getUTCMinutes() !== 0 || start.getUTCSeconds() !== 0 || start.getUTCMilliseconds() !== 0) {
      throw new BadRequestException('Appointment must start at a full hour');
    }
  }

  private async validateOfficeIsAvailable(params: {
    officeId: number;
    startsAt: string;
    ignoredAppointmentId?: number;
  }): Promise<void> {
    const { officeId, startsAt, ignoredAppointmentId } = params;

    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.officeId = :officeId', { officeId })
      .andWhere('appointment.startsAt = :startsAt', { startsAt });

    if (ignoredAppointmentId !== undefined) {
      query.andWhere('appointment.id != :ignoredAppointmentId', { ignoredAppointmentId });
    }

    const conflictingAppointment = await query.getOne();

    if (conflictingAppointment) {
      throw new BadRequestException('Office is already booked for the requested time');
    }
  }
}
