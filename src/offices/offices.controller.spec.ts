import { Test, TestingModule } from '@nestjs/testing';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';

describe('OfficesController', () => {
  let controller: OfficesController;
  let service: jest.Mocked<OfficesService>;

  const mockOfficesService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficesController],
      providers: [
        {
          provide: OfficesService,
          useValue: mockOfficesService,
        },
      ],
    }).compile();

    controller = module.get<OfficesController>(OfficesController);
    service = module.get(OfficesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all offices from the service', async () => {
      const offices = [
        {
          id: 1,
          name: 'Citizens Office Mitte',
          opensAt: '08:00',
          closesAt: '16:00',
        },
        {
          id: 2,
          name: 'Citizens Office Nord',
          opensAt: '09:00',
          closesAt: '17:00',
        },
      ];

      service.findAll.mockResolvedValue(offices);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(offices);
    });
  });
});