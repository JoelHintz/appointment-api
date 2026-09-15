import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OfficesService } from './offices.service';
import { Office } from './entity/office.entity';
import { Appointment, AppointmentStatus } from '../appointments/entity/appointment.entity';

describe('OfficesService', () => {
  let service: OfficesService;
  let officeRepository: jest.Mocked<Repository<Office>>;
  let appointmentRepository: jest.Mocked<Repository<Appointment>>;

  const date = '2026-06-30';

  const mockOffice = {
    id: 1,
    name: 'Nuremberg Central Citizens Office',
    opensAtHour: 8,
    closesAtHour: 12,
  };

  const bookedAppointment = (id: number, startHour: number): Appointment => ({
    id,
    title: 'taken',
    date,
    startHour,
    endHour: startHour + 1,
    status: AppointmentStatus.SCHEDULED,
    office: mockOffice,
  });

  const mockOfficeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAppointmentRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficesService,
        { provide: getRepositoryToken(Office), useValue: mockOfficeRepository },
        { provide: getRepositoryToken(Appointment), useValue: mockAppointmentRepository },
      ],
    }).compile();

    service = module.get<OfficesService>(OfficesService);
    officeRepository = module.get(getRepositoryToken(Office));
    appointmentRepository = module.get(getRepositoryToken(Appointment));
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
        { id: 1, name: 'Citizens Office Mitte', opensAtHour: 8, closesAtHour: 16 },
        { id: 2, name: 'Citizens Office Nord', opensAtHour: 9, closesAtHour: 17 },
      ];

      officeRepository.find.mockResolvedValue(offices);

      const result = await service.findAll();

      expect(officeRepository.find).toHaveBeenCalledTimes(1);
      expect(officeRepository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });

      expect(result).toEqual([
        { id: 1, name: 'Citizens Office Mitte', opensAtHour: 8, closesAtHour: 16 },
        { id: 2, name: 'Citizens Office Nord', opensAtHour: 9, closesAtHour: 17 },
      ]);
    });

    it('should return an empty array when no offices exist', async () => {
      officeRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(officeRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findAvailability', () => {
    it('should return slots when no appointments exist', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([]);

      const result = await service.findAvailability(1, date);

      expect(appointmentRepository.find).toHaveBeenCalledWith({
        where: { office: { id: 1 }, date },
      });
      expect(result).toEqual([
        { officeId: 1, date, startHour: 8, endHour: 9 },
        { officeId: 1, date, startHour: 9, endHour: 10 },
        { officeId: 1, date, startHour: 10, endHour: 11 },
        { officeId: 1, date, startHour: 11, endHour: 12 },
      ]);
    });

    it('should exclude occupied one-hour slots', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([bookedAppointment(1, 9)]);

      const result = await service.findAvailability(1, date);

      expect(result).toEqual([
        { officeId: 1, date, startHour: 8, endHour: 9 },
        { officeId: 1, date, startHour: 10, endHour: 11 },
        { officeId: 1, date, startHour: 11, endHour: 12 },
      ]);
    });

    it('should allow adjacent slots', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([bookedAppointment(1, 8), bookedAppointment(2, 9)]);

      const result = await service.findAvailability(1, date);

      expect(result).toEqual([
        { officeId: 1, date, startHour: 10, endHour: 11 },
        { officeId: 1, date, startHour: 11, endHour: 12 },
      ]);
    });

    it('should return an empty array if no slot is available', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([
        bookedAppointment(1, 8),
        bookedAppointment(2, 9),
        bookedAppointment(3, 10),
        bookedAppointment(4, 11),
      ]);

      const result = await service.findAvailability(1, date);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when office does not exist', async () => {
      officeRepository.findOne.mockResolvedValue(null);

      await expect(service.findAvailability(999, date)).rejects.toThrow(
        new NotFoundException('Office with id 999 was not found'),
      );
      expect(appointmentRepository.find).not.toHaveBeenCalled();
    });
  });
});
