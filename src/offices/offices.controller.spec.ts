import { Test, TestingModule } from '@nestjs/testing';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';

describe('OfficesController', () => {
  let controller: OfficesController;
  let service: jest.Mocked<OfficesService>;

  const mockOfficesService = { findAll: jest.fn(), findAvailability: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficesController],
      providers: [{ provide: OfficesService, useValue: mockOfficesService }],
    }).compile();

    controller = module.get<OfficesController>(OfficesController);
    service = module.get(OfficesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all offices from the service', async () => {
      const offices = [
        { id: 1, name: 'Citizens Office Mitte', opensAtHour: 8, closesAtHour: 16 },
        { id: 2, name: 'Citizens Office Nord', opensAtHour: 9, closesAtHour: 17 },
      ];

      service.findAll.mockResolvedValue(offices);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(offices);
    });
  });

  describe('findAvailability', () => {
    it('should return available slots from the service', async () => {
      const slots = [{ officeId: 1, date: '2026-06-30', startHour: 8, endHour: 9 }];

      service.findAvailability.mockResolvedValue(slots);

      const result = await controller.findAvailability(1, { date: '2026-06-30' });

      expect(service.findAvailability).toHaveBeenCalledWith(1, '2026-06-30');
      expect(result).toEqual(slots);
    });
  });
});
