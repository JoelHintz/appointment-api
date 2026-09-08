import { ContactRequestsController } from './contact-requests.controller';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequestStatus } from './entity/contact-request.entity';
import {
  createContactRequestResponseDto,
  createCreateContactRequestDto,
  createUpdateContactRequestDto,
} from '../../test/testdata.factory';

describe('ContactRequestsController', () => {
  let controller: ContactRequestsController;
  let contactRequestsService: jest.Mocked<ContactRequestsService>;

  beforeEach(() => {
    contactRequestsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    } as any as jest.Mocked<ContactRequestsService>;

    controller = new ContactRequestsController(contactRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should delegate creation to the service and return the result', async () => {
      const dto = createCreateContactRequestDto();
      const expected = createContactRequestResponseDto();

      contactRequestsService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(contactRequestsService.create).toHaveBeenCalledTimes(1);
      expect(contactRequestsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should delegate the query to the service and return the result list', async () => {
      const query = { status: ContactRequestStatus.NEW };
      const expected = [createContactRequestResponseDto()];

      contactRequestsService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(contactRequestsService.findAll).toHaveBeenCalledTimes(1);
      expect(contactRequestsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate the id to the service and return the contact request', async () => {
      const id = 1;
      const expected = createContactRequestResponseDto({ id });

      contactRequestsService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(id);

      expect(contactRequestsService.findOne).toHaveBeenCalledTimes(1);
      expect(contactRequestsService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should delegate id and dto to the service and return the updated contact request', async () => {
      const id = 1;
      const dto = createUpdateContactRequestDto({ status: ContactRequestStatus.IN_PROGRESS });
      const expected = createContactRequestResponseDto({ id, status: ContactRequestStatus.IN_PROGRESS });

      contactRequestsService.update.mockResolvedValue(expected);

      const result = await controller.update(id, dto);

      expect(contactRequestsService.update).toHaveBeenCalledTimes(1);
      expect(contactRequestsService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expected);
    });
  });
});
