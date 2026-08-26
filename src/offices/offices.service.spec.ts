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

  const mockOffice = {
    id: 1,
    name: 'Nuremberg Central Citizens Office',
    opensAt: '08:00',
    closesAt: '12:00',
  };

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
        { id: 1, name: 'Citizens Office Mitte', opensAt: '08:00', closesAt: '16:00' },
        { id: 2, name: 'Citizens Office Nord', opensAt: '09:00', closesAt: '17:00' },
      ];

      officeRepository.find.mockResolvedValue(offices);

      const result = await service.findAll();

      expect(officeRepository.find).toHaveBeenCalledTimes(1);
      expect(officeRepository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });

      expect(result).toEqual([
        { id: 1, name: 'Citizens Office Mitte', opensAt: '08:00', closesAt: '16:00' },
        { id: 2, name: 'Citizens Office Nord', opensAt: '09:00', closesAt: '17:00' },
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
    const date = '2026-06-30';

    it('should return slots when no appointments exist', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([]);

      const result = await service.findAvailability(1, date);

      expect(result).toEqual([
        { officeId: 1, startsAt: '2026-06-30T08:00:00.000Z', endsAt: '2026-06-30T09:00:00.000Z' },
        { officeId: 1, startsAt: '2026-06-30T09:00:00.000Z', endsAt: '2026-06-30T10:00:00.000Z' },
        { officeId: 1, startsAt: '2026-06-30T10:00:00.000Z', endsAt: '2026-06-30T11:00:00.000Z' },
        { officeId: 1, startsAt: '2026-06-30T11:00:00.000Z', endsAt: '2026-06-30T12:00:00.000Z' },
      ]);
    });

    it('should exclude occupied one-hour slots', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([
        {
          id: 1,
          title: 'taken',
          startsAt: '2026-06-30T09:00:00.000Z',
          endsAt: '2026-06-30T10:00:00.000Z',
          status: AppointmentStatus.SCHEDULED,
          office: mockOffice,
        },
      ]);

      const result = await service.findAvailability(1, date);

      expect(result).toEqual([
        { officeId: 1, startsAt: '2026-06-30T08:00:00.000Z', endsAt: '2026-06-30T09:00:00.000Z' },
        { officeId: 1, startsAt: '2026-06-30T10:00:00.000Z', endsAt: '2026-06-30T11:00:00.000Z' },
        { officeId: 1, startsAt: '2026-06-30T11:00:00.000Z', endsAt: '2026-06-30T12:00:00.000Z' },
      ]);
    });

    it('should allows adjacent slots', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([
        {
          id: 1,
          title: 'taken',
          startsAt: '2026-06-30T08:00:00.000Z',
          endsAt: '2026-06-30T09:00:00.000Z',
          status: AppointmentStatus.SCHEDULED,
          office: mockOffice,
        },
        {
          id: 2,
          title: 'taken',
          startsAt: '2026-06-30T09:00:00.000Z',
          endsAt: '2026-06-30T10:00:00.000Z',
          status: AppointmentStatus.SCHEDULED,
          office: mockOffice,
        },
      ]);

      const result = await service.findAvailability(1, date);

      expect(result).toEqual([
        { officeId: 1, startsAt: '2026-06-30T10:00:00.000Z', endsAt: '2026-06-30T11:00:00.000Z' },
        { officeId: 1, startsAt: '2026-06-30T11:00:00.000Z', endsAt: '2026-06-30T12:00:00.000Z' },
      ]);
    });

    it('should return an empty array if no slot is available', async () => {
      officeRepository.findOne.mockResolvedValue(mockOffice);
      appointmentRepository.find.mockResolvedValue([
        {
          id: 1,
          title: 'a',
          startsAt: '2026-06-30T08:00:00.000Z',
          endsAt: '2026-06-30T09:00:00.000Z',
          status: AppointmentStatus.SCHEDULED,
          office: mockOffice,
        },
        {
          id: 2,
          title: 'b',
          startsAt: '2026-06-30T09:00:00.000Z',
          endsAt: '2026-06-30T10:00:00.000Z',
          status: AppointmentStatus.SCHEDULED,
          office: mockOffice,
        },
        {
          id: 3,
          title: 'c',
          startsAt: '2026-06-30T10:00:00.000Z',
          endsAt: '2026-06-30T11:00:00.000Z',
          status: AppointmentStatus.SCHEDULED,
          office: mockOffice,
        },
        {
          id: 4,
          title: 'd',
          startsAt: '2026-06-30T11:00:00.000Z',
          endsAt: '2026-06-30T12:00:00.000Z',
          status: AppointmentStatus.SCHEDULED,
          office: mockOffice,
        },
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
