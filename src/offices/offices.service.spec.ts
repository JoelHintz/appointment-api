import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfficesService } from './offices.service';
import { Office } from './entity/office.entity';

describe('OfficesService', () => {
  let service: OfficesService;
  let repository: jest.Mocked<Repository<Office>>;

  const mockOfficeRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficesService,
        {
          provide: getRepositoryToken(Office),
          useValue: mockOfficeRepository,
        },
      ],
    }).compile();

    service = module.get<OfficesService>(OfficesService);
    repository = module.get(getRepositoryToken(Office));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should load offices ordered by name and map them to response objects', async () => {
      const offices: Office[] = [
        {
          id: 1,
          name: 'Citizens Office Mitte',
          opensAt: '08:00',
          closesAt: '16:00'
        },
        {
          id: 2,
          name: 'Citizens Office Nord',
          opensAt: '09:00',
          closesAt: '17:00'
        },
      ];

      repository.find.mockResolvedValue(offices);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });

      expect(result).toEqual([
        {
          id: 1,
          name: 'Citizens Office Mitte',
          opensAt: '08:00',
          closesAt: '16:00'
        },
        {
          id: 2,
          name: 'Citizens Office Nord',
          opensAt: '09:00',
          closesAt: '17:00'
        },
      ]);
    });

    it('should return an empty array when no offices exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});