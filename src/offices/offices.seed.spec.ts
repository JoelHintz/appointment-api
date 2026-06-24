import { INITIAL_OFFICE_DATA, OfficesSeedService } from './offices.seed';
import { Office } from './entity/office.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OfficesService } from './offices.service';

type MockOfficeRepository = {
  count: jest.Mock<Promise<number>, []>;
  save: jest.Mock<Promise<Office[]>, [Partial<Office>[]]>;
};

describe('OfficesSeedService', () => {
  let service: OfficesSeedService;
  let officeRepository: MockOfficeRepository;

  const mockOfficeRepository = {
    count: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficesSeedService,
        {
          provide: getRepositoryToken(Office),
          useValue: mockOfficeRepository,
        },
      ],
    }).compile();

    service = module.get<OfficesSeedService>(OfficesSeedService);
    officeRepository = module.get(getRepositoryToken(Office));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should seed workshop offices when no offices exist', async () => {
    officeRepository.count.mockResolvedValue(0);
    officeRepository.save.mockResolvedValue(INITIAL_OFFICE_DATA as Array<Office>);

    await service.seedOffices();

    expect(officeRepository.count).toHaveBeenCalledTimes(1);
    expect(officeRepository.save).toHaveBeenCalledTimes(1);
    expect(officeRepository.save).toHaveBeenCalledWith(INITIAL_OFFICE_DATA);
  });

  it('should not seed offices when offices already exist', async () => {
    officeRepository.count.mockResolvedValue(3);

    await service.seedOffices();

    expect(officeRepository.count).toHaveBeenCalledTimes(1);
    expect(officeRepository.save).not.toHaveBeenCalled();
  });

  it('should seed offices on application bootstrap', async () => {
    const seedSpy = jest.spyOn(service, 'seedOffices').mockResolvedValue(undefined);

    await service.onApplicationBootstrap();

    expect(seedSpy).toHaveBeenCalledTimes(1);
  });
});
