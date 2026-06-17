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

    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,
        @InjectRepository(Office)
        private readonly officeRepository: Repository<Office>
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

        const toSave = {
            title: dto.title,
            startsAt: dto.startsAt,
            endsAt: dto.endsAt,
            office,
        };

        this.validateStartAndEnd(toSave.startsAt, toSave.endsAt);

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

        this.validateStartAndEnd(toSave.startsAt, toSave.endsAt);

        const saved = await this.appointmentRepository.save(toSave);
        return AppointmentMapper.toResponseDto(saved);
    }

    private async mergeDtoIntoEntity(appointment: Appointment, dto: UpdateAppointmentDto) {
        if (dto.title !== undefined) {
            appointment.title = dto.title;
        }
        if (dto.startsAt !== undefined) {
            appointment.startsAt = dto.startsAt;
        }
        if (dto.endsAt !== undefined) {
            appointment.endsAt = dto.endsAt;
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

    private validateStartAndEnd(startsAt: string, endsAt: string): void {
        if (new Date(startsAt) >= new Date(endsAt)) {
            throw new BadRequestException('startsAt must be before endsAt');
        }
    }
}
