import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentStatus } from './entity/appointment.entity';
import { Office } from '../offices/entity/office.entity';
import { AppointmentMapper } from './appointments.mapper';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createAppointment, createAppointmentResponseDto, createOffice } from '../../test/testdata.factory';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  let appointmentRepository: jest.Mocked<Repository<Appointment>>;
  let officeRepository: jest.Mocked<Repository<Office>>;

  const mockMappedDto = (dto = createAppointmentResponseDto()) =>
    jest.spyOn(AppointmentMapper, 'toResponseDto').mockReturnValue(dto as any);

  const mockMappedDtoList = (dtos = [createAppointmentResponseDto()]) =>
    jest.spyOn(AppointmentMapper, 'toResponseDtoList').mockReturnValue(dtos as any);

  const expectNotFound = async (
    promise: Promise<unknown>,
    message: string,
  ) => {
    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow(message);
  };

  const expectBadRequest = async (
    promise: Promise<unknown>,
    message: string,
  ) => {
    await expect(promise).rejects.toThrow(BadRequestException);
    await expect(promise).rejects.toThrow(message);
  };

  const mockAppointmentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOfficeRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AppointmentsService,
          {
            provide: getRepositoryToken(Office),
            useValue: mockOfficeRepository,
          },
          {
            provide: getRepositoryToken(Appointment),
            useValue: mockAppointmentRepository,
          },
        ],
      }).compile();
  
      service = module.get<AppointmentsService>(AppointmentsService);
      appointmentRepository = module.get(getRepositoryToken(Appointment));
      officeRepository = module.get(getRepositoryToken(Office))
    });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return mapped appointments with default limit 10', async () => {
      const query: FindAppointmentsDto = {};
      const appointments = [createAppointment()];
      const expected = [createAppointmentResponseDto()];

      appointmentRepository.find.mockResolvedValue(appointments);
      mockMappedDtoList(expected);

      const result = await service.findAll(query);

      expect(appointmentRepository.find).toHaveBeenCalledWith({
        where: {},
        take: 10,
        order: { id: 'ASC' },
      });
      expect(result).toEqual(expected);
    });

    it('should apply status filter and custom limit', async () => {
      const query: FindAppointmentsDto = {
        status: AppointmentStatus.CANCELED,
        limit: 5,
      };

      appointmentRepository.find.mockResolvedValue([createAppointment()]);
      mockMappedDtoList();

      await service.findAll(query);

      expect(appointmentRepository.find).toHaveBeenCalledWith({
        where: { status: AppointmentStatus.CANCELED },
        take: 5,
        order: { id: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return mapped appointment when found', async () => {
      const appointment = createAppointment();
      const expected = createAppointmentResponseDto();

      appointmentRepository.findOne.mockResolvedValue(appointment);
      mockMappedDto(expected);

      const result = await service.findOne(1);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { office: true },
      });
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when appointment does not exist', async () => {
      appointmentRepository.findOne.mockResolvedValue(null);

      await expectNotFound(service.findOne(999), 'Appointment 999 not found');
    });
  });

  describe('create', () => {
    it('should create and return a new appointment', async () => {
      const office = createOffice();
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        startsAt: '2026-06-21T09:00:00.000Z',
        endsAt: '2026-06-21T10:00:00.000Z',
        officeId: office.id,
      };

      const createdEntity = createAppointment({
        id: undefined,
        title: dto.title,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        office,
      });

      const savedEntity = createAppointment({
        id: 2,
        title: dto.title,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        office,
      });

      const expected = createAppointmentResponseDto({
        id: 2,
        title: dto.title,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        officeId: office.id,
      });

      officeRepository.findOne.mockResolvedValue(office);
      appointmentRepository.create.mockReturnValue(createdEntity);
      appointmentRepository.save.mockResolvedValue(savedEntity);
      mockMappedDto(expected);

      const result = await service.create(dto);

      expect(officeRepository.findOne).toHaveBeenCalledWith({
        where: { id: office.id },
      });
      expect(appointmentRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        office,
      });
      expect(appointmentRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when office does not exist', async () => {
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        startsAt: '2026-06-21T09:00:00.000Z',
        endsAt: '2026-06-21T10:00:00.000Z',
        officeId: 999,
      };

      officeRepository.findOne.mockResolvedValue(null);

      await expectNotFound(
        service.create(dto),
        'Office with id 999 was not found',
      );

      expect(appointmentRepository.create).not.toHaveBeenCalled();
      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when startsAt is after endsAt', async () => {
      const dto: CreateAppointmentDto = {
        title: 'Invalid appointment',
        startsAt: '2026-06-21T11:00:00.000Z',
        endsAt: '2026-06-21T10:00:00.000Z',
        officeId: 1,
      };

      officeRepository.findOne.mockResolvedValue(createOffice());

      await expectBadRequest(
        service.create(dto),
        'startsAt must be before endsAt',
      );

      expect(appointmentRepository.create).not.toHaveBeenCalled();
      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update appointment fields without changing office', async () => {
      const office = createOffice({ id: 1 });
      const existingAppointment = createAppointment({ office });

      const dto: UpdateAppointmentDto = {
        title: 'Updated title',
        startsAt: '2026-06-22T09:00:00.000Z',
        endsAt: '2026-06-22T10:00:00.000Z',
        officeId: 1,
      };

      const savedEntity = createAppointment({
        ...existingAppointment,
        title: dto.title,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        office,
      });

      const expected = createAppointmentResponseDto({
        id: 1,
        title: dto.title,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        officeId: 1,
      });

      appointmentRepository.findOne.mockResolvedValue(existingAppointment);
      appointmentRepository.save.mockResolvedValue(savedEntity);
      mockMappedDto(expected);

      const result = await service.update(1, dto);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { office: true },
      });
      expect(officeRepository.findOne).not.toHaveBeenCalled();
      expect(appointmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: dto.title,
          startsAt: dto.startsAt,
          endsAt: dto.endsAt,
          office,
        }),
      );
      expect(result).toEqual(expected);
    });

    it('should update appointment and change office if officeId differs', async () => {
      const oldOffice = createOffice({ id: 1, name: 'Nuremberg Office' });
      const newOffice = createOffice({ id: 2, name: 'Munich Office' });
      const existingAppointment = createAppointment({ office: oldOffice });

      const dto: UpdateAppointmentDto = {
        officeId: 2,
      };

      const savedEntity = createAppointment({
        ...existingAppointment,
        office: newOffice,
      });

      const expected = createAppointmentResponseDto({
        officeId: 2,
      });

      appointmentRepository.findOne.mockResolvedValue(existingAppointment);
      officeRepository.findOne.mockResolvedValue(newOffice);
      appointmentRepository.save.mockResolvedValue(savedEntity);
      mockMappedDto(expected);

      const result = await service.update(1, dto);

      expect(officeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(appointmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          office: newOffice,
        }),
      );
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when appointment to update does not exist', async () => {
      appointmentRepository.findOne.mockResolvedValue(null);

      await expectNotFound(
        service.update(999, { title: 'X' }),
        'Appointment 999 not found',
      );

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when new office does not exist', async () => {
      const existingAppointment = createAppointment({ office: createOffice({ id: 1 }) });

      appointmentRepository.findOne.mockResolvedValue(existingAppointment);
      officeRepository.findOne.mockResolvedValue(null);

      await expectNotFound(
        service.update(1, { officeId: 999 }),
        'Office with id 999 was not found',
      );

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when updated dates are invalid', async () => {
      const existingAppointment = createAppointment({ office: createOffice({ id: 1 }) });

      const dto: UpdateAppointmentDto = {
        startsAt: '2026-06-22T12:00:00.000Z',
        endsAt: '2026-06-22T10:00:00.000Z',
      };

      appointmentRepository.findOne.mockResolvedValue(existingAppointment);

      await expectBadRequest(
        service.update(1, dto),
        'startsAt must be before endsAt',
      );

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });
  });
});