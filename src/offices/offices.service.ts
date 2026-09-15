import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './entity/office.entity';
import { Appointment } from '../appointments/entity/appointment.entity';
import { OfficeResponseDto } from './dto/office-response.dto';
import { OfficeAvailabilitySlotDto } from './dto/office-availability-slot.dto';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(): Promise<OfficeResponseDto[]> {
    const offices = await this.officeRepository.find({
      order: { name: 'ASC' },
    });

    return offices.map((office) => ({
      id: office.id,
      name: office.name,
      opensAtHour: office.opensAtHour,
      closesAtHour: office.closesAtHour,
    }));
  }

  async findAvailability(officeId: number, date: string): Promise<OfficeAvailabilitySlotDto[]> {
    const office = await this.officeRepository.findOne({
      where: { id: officeId },
    });

    if (!office) {
      throw new NotFoundException(`Office with id ${officeId} was not found`);
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        office: { id: officeId },
        date,
      },
    });

    const bookedHours = new Set(appointments.map((appointment) => appointment.startHour));

    const slots: OfficeAvailabilitySlotDto[] = [];
    for (let hour = office.opensAtHour; hour < office.closesAtHour; hour++) {
      if (!bookedHours.has(hour)) {
        slots.push({
          officeId: office.id,
          date,
          startHour: hour,
          endHour: hour + 1,
        });
      }
    }

    return slots;
  }
}
