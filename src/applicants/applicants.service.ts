import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Applicant } from './entity/applicant.entity';
import { ApplicantResponseDto } from './dto/applicant-response.dto';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { ApplicantMapper } from './applicants.mapper';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
  ) {}

  async findAll(): Promise<ApplicantResponseDto[]> {
    const applicants = await this.applicantRepository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });

    return ApplicantMapper.toResponseDtoList(applicants);
  }

  async findOne(id: number): Promise<ApplicantResponseDto> {
    const applicant = await this.applicantRepository.findOne({ where: { id } });

    if (!applicant) {
      throw new NotFoundException(`Applicant with id ${id} was not found`);
    }

    return ApplicantMapper.toResponseDto(applicant);
  }

  async create(dto: CreateApplicantDto): Promise<ApplicantResponseDto> {
    const entity = this.applicantRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      birthDate: dto.birthDate,
    });

    const saved = await this.applicantRepository.save(entity);

    return ApplicantMapper.toResponseDto(saved);
  }
}
