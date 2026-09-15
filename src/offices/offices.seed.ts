import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './entity/office.entity';

export const INITIAL_OFFICE_DATA: Array<Partial<Office>> = [
  {
    name: 'Nuremberg Central Citizens Office',
    opensAtHour: 8,
    closesAtHour: 16,
  },
  {
    name: 'Nuremberg Citizens Office South',
    opensAtHour: 9,
    closesAtHour: 15,
  },
  {
    name: 'Nuremberg Citizens Office East',
    opensAtHour: 8,
    closesAtHour: 14,
  },
];

@Injectable()
export class OfficesSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedOffices();
  }

  async seedOffices(): Promise<void> {
    const existingOfficesCount = await this.officeRepository.count();

    if (existingOfficesCount > 0) {
      return;
    }

    await this.officeRepository.save(INITIAL_OFFICE_DATA);
  }
}
