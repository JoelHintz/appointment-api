import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentStatus } from './entity/appointment.entity';
import { Office } from '../offices/entity/office.entity';
import { Applicant } from '../applicants/entity/applicant.entity';
import { AppointmentMapper } from './appointments.mapper';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createApplicant,
  createAppointment,
  createAppointmentResponseDto,
  createOffice,
} from '../../test/testdata.factory';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  let appointmentRepository: jest.Mocked<Repository<Appointment>>;
  let officeRepository: jest.Mocked<Repository<Office>>;
  let applicantRepository: jest.Mocked<Repository<Applicant>>;

  const mockMappedDto = (dto = createAppointmentResponseDto()) =>
    jest.spyOn(AppointmentMapper, 'toResponseDto').mockReturnValue(dto as any);

  const mockMappedDtoList = (dtos = [createAppointmentResponseDto()]) =>
    jest.spyOn(AppointmentMapper, 'toResponseDtoList').mockReturnValue(dtos as any);

  const expectNotFound = async (promise: Promise<unknown>, message: string) => {
    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow(message);
  };

  const expectBadRequest = async (promise: Promise<unknown>, message: string) => {
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

  const mockApplicantRepository = {
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
        {
          provide: getRepositoryToken(Applicant),
          useValue: mockApplicantRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get(getRepositoryToken(Appointment));
    officeRepository = module.get(getRepositoryToken(Office));
    applicantRepository = module.get(getRepositoryToken(Applicant));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  /**
   * `appointmentRepository.findOne` serves three purposes: loading an appointment
   * by id, looking for an appointment that already occupies the slot, and looking
   * for another appointment of the same applicant on that day. The mock tells
   * them apart by the shape of the where clause.
   */
  const mockRepositoryReads = (params: {
    loaded?: Appointment | null;
    conflicting?: Appointment | null;
    sameDay?: Appointment | null;
  }) => {
    appointmentRepository.findOne.mockImplementation(async (options: any) => {
      if (options?.where?.startHour !== undefined) {
        return params.conflicting ?? null;
      }
      if (options?.where?.applicant !== undefined) {
        return params.sameDay ?? null;
      }
      return params.loaded ?? null;
    });
  };

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
        relations: { office: true, applicant: true },
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
        relations: { office: true, applicant: true },
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
        relations: { office: true, applicant: true },
      });
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when appointment does not exist', async () => {
      appointmentRepository.findOne.mockResolvedValue(null);

      await expectNotFound(service.findOne(999), 'Appointment 999 not found');
    });
  });

  describe('create', () => {
    beforeEach(() => {
      mockRepositoryReads({ conflicting: null });
    });

    it('should create and return a new appointment', async () => {
      const office = createOffice();
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        date: '2026-06-21',
        startHour: 9,
        officeId: office.id,
      };

      const createdEntity = createAppointment({
        id: undefined,
        title: dto.title,
        date: dto.date,
        startHour: dto.startHour,
        endHour: 10,
        office,
      });

      const savedEntity = createAppointment({
        id: 2,
        title: dto.title,
        date: dto.date,
        startHour: dto.startHour,
        endHour: 10,
        office,
      });

      const expected = createAppointmentResponseDto({
        id: 2,
        title: dto.title,
        date: dto.date,
        startHour: dto.startHour,
        endHour: 10,
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
        date: dto.date,
        startHour: dto.startHour,
        endHour: 10,
        office,
        applicant: null,
      });
      expect(appointmentRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(expected);
    });

    it('should derive the end hour as the hour after the start hour', async () => {
      const office = createOffice();
      const dto: CreateAppointmentDto = {
        title: 'Late appointment',
        date: '2026-06-21',
        startHour: 15,
        officeId: office.id,
      };

      officeRepository.findOne.mockResolvedValue(office);
      appointmentRepository.create.mockImplementation((entity: any) => entity);
      appointmentRepository.save.mockImplementation(async (entity: any) => entity);
      mockMappedDto();

      await service.create(dto);

      expect(appointmentRepository.create).toHaveBeenCalledWith(expect.objectContaining({ startHour: 15, endHour: 16 }));
    });

    it('should throw NotFoundException when office does not exist', async () => {
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        date: '2026-06-21',
        startHour: 9,
        officeId: 999,
      };

      officeRepository.findOne.mockResolvedValue(null);

      await expectNotFound(service.create(dto), 'Office with id 999 was not found');

      expect(appointmentRepository.create).not.toHaveBeenCalled();
      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when office is already booked', async () => {
      const office = createOffice();
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        date: '2026-06-21',
        startHour: 9,
        officeId: office.id,
      };

      officeRepository.findOne.mockResolvedValue(office);
      mockRepositoryReads({ conflicting: createAppointment() });

      await expectBadRequest(service.create(dto), 'Office is already booked for the requested time');

      expect(appointmentRepository.create).not.toHaveBeenCalled();
      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should look for a conflict in the same office, date and hour', async () => {
      const office = createOffice({ id: 3 });
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        date: '2026-06-21',
        startHour: 9,
        officeId: office.id,
      };

      officeRepository.findOne.mockResolvedValue(office);
      appointmentRepository.create.mockImplementation((entity: any) => entity);
      appointmentRepository.save.mockImplementation(async (entity: any) => entity);
      mockMappedDto();

      await service.create(dto);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { office: { id: 3 }, date: '2026-06-21', startHour: 9 },
      });
    });

    it('should attach the applicant and check the same day at the same office', async () => {
      const office = createOffice({ id: 3 });
      const applicant = createApplicant({ id: 7 });
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        date: '2026-06-21',
        startHour: 9,
        officeId: office.id,
        applicantId: applicant.id,
      };

      officeRepository.findOne.mockResolvedValue(office);
      applicantRepository.findOne.mockResolvedValue(applicant);
      appointmentRepository.create.mockImplementation((entity: any) => entity);
      appointmentRepository.save.mockImplementation(async (entity: any) => entity);
      mockMappedDto();

      await service.create(dto);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { applicant: { id: 7 }, office: { id: 3 }, date: '2026-06-21' },
      });
      expect(appointmentRepository.create).toHaveBeenCalledWith(expect.objectContaining({ applicant }));
    });

    it('should throw NotFoundException when the applicant does not exist', async () => {
      const office = createOffice();
      const dto: CreateAppointmentDto = {
        title: 'New appointment',
        date: '2026-06-21',
        startHour: 9,
        officeId: office.id,
        applicantId: 999,
      };

      officeRepository.findOne.mockResolvedValue(office);
      applicantRepository.findOne.mockResolvedValue(null);

      await expectNotFound(service.create(dto), 'Applicant with id 999 was not found');

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when the applicant already books that office that day', async () => {
      const office = createOffice();
      const applicant = createApplicant();
      const dto: CreateAppointmentDto = {
        title: 'Second appointment of the day',
        date: '2026-06-21',
        startHour: 11,
        officeId: office.id,
        applicantId: applicant.id,
      };

      officeRepository.findOne.mockResolvedValue(office);
      applicantRepository.findOne.mockResolvedValue(applicant);
      mockRepositoryReads({ conflicting: null, sameDay: createAppointment({ id: 2, applicant }) });

      await expectBadRequest(
        service.create(dto),
        'Applicant already has an appointment at this office on the requested date',
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
        date: '2026-06-22',
        startHour: 9,
        officeId: 1,
      };

      const savedEntity = createAppointment({
        ...existingAppointment,
        title: dto.title,
        date: dto.date,
        startHour: dto.startHour,
        endHour: 10,
        office,
      });

      const expected = createAppointmentResponseDto({
        id: 1,
        title: dto.title,
        date: dto.date,
        startHour: dto.startHour,
        endHour: 10,
        officeId: 1,
      });

      mockRepositoryReads({ loaded: existingAppointment, conflicting: null });
      appointmentRepository.save.mockResolvedValue(savedEntity);
      mockMappedDto(expected);

      const result = await service.update(1, dto);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { office: true, applicant: true },
      });
      expect(officeRepository.findOne).not.toHaveBeenCalled();
      expect(appointmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: dto.title,
          date: dto.date,
          startHour: dto.startHour,
          endHour: 10,
          office,
        }),
      );
      expect(result).toEqual(expected);
    });

    it('should update appointment and change office if officeId differs', async () => {
      const oldOffice = createOffice({ id: 1, name: 'Nuremberg Office' });
      const newOffice = createOffice({ id: 2, name: 'Munich Office' });
      const existingAppointment = createAppointment({
        office: oldOffice,
      });

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

      mockRepositoryReads({ loaded: existingAppointment, conflicting: null });
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

      await expectNotFound(service.update(999, { title: 'X' }), 'Appointment 999 not found');

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when new office does not exist', async () => {
      const existingAppointment = createAppointment({
        office: createOffice({ id: 1 }),
      });

      mockRepositoryReads({ loaded: existingAppointment, conflicting: null });
      officeRepository.findOne.mockResolvedValue(null);

      await expectNotFound(service.update(1, { officeId: 999 }), 'Office with id 999 was not found');

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when office is already booked for the new time', async () => {
      const office = createOffice({ id: 1 });
      const existingAppointment = createAppointment({ id: 1, office });
      const conflictingAppointment = createAppointment({ id: 2 });

      const dto: UpdateAppointmentDto = {
        date: '2026-06-22',
        startHour: 9,
      };

      mockRepositoryReads({ loaded: existingAppointment, conflicting: conflictingAppointment });

      await expectBadRequest(service.update(1, dto), 'Office is already booked for the requested time');

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it('should not report a conflict with the appointment being edited', async () => {
      const office = createOffice({ id: 1 });
      const existingAppointment = createAppointment({ id: 1, office });

      const dto: UpdateAppointmentDto = {
        startHour: 10,
      };

      mockRepositoryReads({ loaded: existingAppointment, conflicting: null });
      appointmentRepository.save.mockImplementation(async (entity: any) => entity);
      mockMappedDto();

      const result = await service.update(1, dto);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { office: { id: 1 }, date: existingAppointment.date, startHour: 10, id: Not(1) },
      });
      expect(result).toBeDefined();
    });

    it('should reject a move onto a day the applicant already books at that office', async () => {
      const office = createOffice({ id: 1 });
      const applicant = createApplicant({ id: 7 });
      const existingAppointment = createAppointment({ id: 1, office, applicant });

      mockRepositoryReads({
        loaded: existingAppointment,
        conflicting: null,
        sameDay: createAppointment({ id: 2, office, applicant }),
      });

      await expectBadRequest(
        service.update(1, { date: '2026-06-22' }),
        'Applicant already has an appointment at this office on the requested date',
      );

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });
  });
});
