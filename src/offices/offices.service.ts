import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './entity/office.entity';
import { OfficeResponseDto } from './dto/office-response.dto';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
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
}