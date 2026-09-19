import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './entity/applicant.entity';
import { createApplicant, createCreateApplicantDto } from '../../test/testdata.factory';

describe('ApplicantsService', () => {
  let service: ApplicantsService;
  let applicantRepository: jest.Mocked<Repository<Applicant>>;

  const mockApplicantRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        {
          provide: getRepositoryToken(Applicant),
          useValue: mockApplicantRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
    applicantRepository = module.get(getRepositoryToken(Applicant));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should store the applicant and return the mapped response', async () => {
      const dto = createCreateApplicantDto();
      const saved = createApplicant({ id: 4 });

      applicantRepository.create.mockReturnValue(saved);
      applicantRepository.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(applicantRepository.create).toHaveBeenCalledWith({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        birthDate: dto.birthDate,
      });
      expect(result).toEqual({
        id: 4,
        firstName: 'Erika',
        lastName: 'Mustermann',
        email: 'erika.mustermann@example.com',
        birthDate: '1984-03-12',
      });
    });
  });

  describe('findAll', () => {
    it('should return all applicants ordered by name', async () => {
      applicantRepository.find.mockResolvedValue([createApplicant()]);

      const result = await service.findAll();

      expect(applicantRepository.find).toHaveBeenCalledWith({
        order: { lastName: 'ASC', firstName: 'ASC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('erika.mustermann@example.com');
    });
  });

  describe('findOne', () => {
    it('should return the applicant when it exists', async () => {
      applicantRepository.findOne.mockResolvedValue(createApplicant({ id: 2 }));

      const result = await service.findOne(2);

      expect(applicantRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result.id).toBe(2);
    });

    it('should throw NotFoundException for an unknown id', async () => {
      applicantRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Applicant with id 999 was not found');
    });
  });
});
