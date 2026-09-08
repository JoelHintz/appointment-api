import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequest, ContactRequestStatus } from './entity/contact-request.entity';
import { ContactRequestMapper } from './contact-requests.mapper';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { FindContactRequestsDto } from './dto/find-contact-requests.dto';
import {
  createContactRequest,
  createContactRequestResponseDto,
  createCreateContactRequestDto,
} from '../../test/testdata.factory';

describe('ContactRequestsService', () => {
  let service: ContactRequestsService;
  let contactRequestRepository: jest.Mocked<Repository<ContactRequest>>;

  const mockMappedDto = (dto = createContactRequestResponseDto()) =>
    jest.spyOn(ContactRequestMapper, 'toResponseDto').mockReturnValue(dto as any);

  const mockMappedDtoList = (dtos = [createContactRequestResponseDto()]) =>
    jest.spyOn(ContactRequestMapper, 'toResponseDtoList').mockReturnValue(dtos as any);

  const expectNotFound = async (promise: Promise<unknown>, message: string) => {
    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow(message);
  };

  const expectBadRequest = async (promise: Promise<unknown>, message: string) => {
    await expect(promise).rejects.toThrow(BadRequestException);
    await expect(promise).rejects.toThrow(message);
  };

  const mockContactRequestRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactRequestsService,
        {
          provide: getRepositoryToken(ContactRequest),
          useValue: mockContactRequestRepository,
        },
      ],
    }).compile();

    service = module.get<ContactRequestsService>(ContactRequestsService);
    contactRequestRepository = module.get(getRepositoryToken(ContactRequest));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return mapped contact requests newest first', async () => {
      const query: FindContactRequestsDto = {};
      const expected = [createContactRequestResponseDto()];

      contactRequestRepository.find.mockResolvedValue([createContactRequest()]);
      mockMappedDtoList(expected);

      const result = await service.findAll(query);

      expect(contactRequestRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { submittedAt: 'DESC' },
      });
      expect(result).toEqual(expected);
    });

    it('should apply the status filter', async () => {
      const query: FindContactRequestsDto = { status: ContactRequestStatus.ANSWERED };

      contactRequestRepository.find.mockResolvedValue([createContactRequest()]);
      mockMappedDtoList();

      await service.findAll(query);

      expect(contactRequestRepository.find).toHaveBeenCalledWith({
        where: { status: ContactRequestStatus.ANSWERED },
        order: { submittedAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return the mapped contact request when found', async () => {
      const expected = createContactRequestResponseDto();

      contactRequestRepository.findOne.mockResolvedValue(createContactRequest());
      mockMappedDto(expected);

      const result = await service.findOne(1);

      expect(contactRequestRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when the contact request does not exist', async () => {
      contactRequestRepository.findOne.mockResolvedValue(null);

      await expectNotFound(service.findOne(999), 'Contact request 999 not found');
    });
  });

  describe('create', () => {
    it('should set submittedAt and leave the status to the entity default', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-19T08:30:00.000Z'));

      const dto = createCreateContactRequestDto();
      const saved = createContactRequest({ id: 2 });
      const expected = createContactRequestResponseDto({ id: 2 });

      contactRequestRepository.create.mockReturnValue(saved);
      contactRequestRepository.save.mockResolvedValue(saved);
      mockMappedDto(expected);

      const result = await service.create(dto);

      expect(contactRequestRepository.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
        submittedAt: '2026-06-19T08:30:00.000Z',
      });
      expect(contactRequestRepository.save).toHaveBeenCalledWith(saved);
      expect(result).toEqual(expected);
    });

    it('should ignore a status or submittedAt smuggled into the dto', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-19T08:30:00.000Z'));

      const dto = {
        ...createCreateContactRequestDto(),
        status: ContactRequestStatus.ANSWERED,
        submittedAt: '1999-01-01T00:00:00.000Z',
      } as CreateContactRequestDto;

      contactRequestRepository.create.mockImplementation((entity: any) => entity);
      contactRequestRepository.save.mockImplementation(async (entity: any) => entity);
      mockMappedDto();

      await service.create(dto);

      expect(contactRequestRepository.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
        submittedAt: '2026-06-19T08:30:00.000Z',
      });
    });
  });

  describe('update', () => {
    it('should allow the transition from new to in_progress', async () => {
      const existing = createContactRequest({ status: ContactRequestStatus.NEW });
      const expected = createContactRequestResponseDto({ status: ContactRequestStatus.IN_PROGRESS });

      contactRequestRepository.findOne.mockResolvedValue(existing);
      contactRequestRepository.save.mockImplementation(async (entity: any) => entity);
      mockMappedDto(expected);

      const result = await service.update(1, { status: ContactRequestStatus.IN_PROGRESS });

      expect(contactRequestRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, status: ContactRequestStatus.IN_PROGRESS }),
      );
      expect(result).toEqual(expected);
    });

    it('should allow the transition from in_progress to answered', async () => {
      const existing = createContactRequest({ status: ContactRequestStatus.IN_PROGRESS });

      contactRequestRepository.findOne.mockResolvedValue(existing);
      contactRequestRepository.save.mockImplementation(async (entity: any) => entity);
      mockMappedDto();

      await service.update(1, { status: ContactRequestStatus.ANSWERED });

      expect(contactRequestRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: ContactRequestStatus.ANSWERED }),
      );
    });

    it('should reject a transition out of answered', async () => {
      contactRequestRepository.findOne.mockResolvedValue(
        createContactRequest({ status: ContactRequestStatus.ANSWERED }),
      );

      await expectBadRequest(
        service.update(1, { status: ContactRequestStatus.IN_PROGRESS }),
        "Cannot change status from 'answered' to 'in_progress'",
      );

      expect(contactRequestRepository.save).not.toHaveBeenCalled();
    });

    it('should reject a no-op transition to the same status', async () => {
      contactRequestRepository.findOne.mockResolvedValue(createContactRequest({ status: ContactRequestStatus.NEW }));

      await expectBadRequest(
        service.update(1, { status: ContactRequestStatus.NEW }),
        "Cannot change status from 'new' to 'new'",
      );

      expect(contactRequestRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the contact request does not exist', async () => {
      contactRequestRepository.findOne.mockResolvedValue(null);

      await expectNotFound(
        service.update(999, { status: ContactRequestStatus.IN_PROGRESS }),
        'Contact request 999 not found',
      );

      expect(contactRequestRepository.save).not.toHaveBeenCalled();
    });
  });
});
