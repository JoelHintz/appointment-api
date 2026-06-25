import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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
      opensAt: office.opensAt,
      closesAt: office.closesAt,
    }));
  }

  async findAvailability(officeId: number, date: string): Promise<OfficeAvailabilitySlotDto[]> {
    const office = await this.officeRepository.findOne({
      where: { id: officeId },
    });

    if (!office) {
      throw new NotFoundException(`Office with id ${officeId} was not found`);
    }

    const openHour = this.parseHour(office.opensAt);
    const closeHour = this.parseHour(office.closesAt);

    const [year, month, day] = date.split('-').map(Number);
    const dayStart = new Date(Date.UTC(year, month - 1, day));
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const appointments = await this.appointmentRepository.find({
      where: {
        office: { id: officeId },
        startsAt: Between(dayStart.toISOString(), dayEnd.toISOString()),
      },
    });

    const bookedStarts = new Set(appointments.map((a) => a.startsAt));

    const slots: OfficeAvailabilitySlotDto[] = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      const slotStart = new Date(Date.UTC(year, month - 1, day, hour));
      const startsAt = slotStart.toISOString();

      if (!bookedStarts.has(startsAt)) {
        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
        slots.push({
          officeId: office.id,
          startsAt,
          endsAt: slotEnd.toISOString(),
        });
      }
    }

    return slots;
  }

  private parseHour(time: string): number {
    const [hours] = time.split(':');
    return Number.parseInt(hours, 10);
  }
}
