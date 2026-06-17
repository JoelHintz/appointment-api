import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { createAppointmentResponseDto, createCreateAppointmentDto, createFindAppointmentsDto, createUpdateAppointmentDto } from '../../test/testdata.factory';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let appointmentsService: jest.Mocked<AppointmentsService>;

  beforeEach(() => {
    appointmentsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    } as any as jest.Mocked<AppointmentsService>;

    controller = new AppointmentsController(appointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should delegate creation to the service and return the result', async () => {
      const dto = createCreateAppointmentDto();
      const expected = createAppointmentResponseDto();

      appointmentsService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(appointmentsService.create).toHaveBeenCalledTimes(1);
      expect(appointmentsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should delegate query to the service and return the result list', async () => {
      const query = createFindAppointmentsDto({ limit: 5 });
      const expected = [
        createAppointmentResponseDto({ id: 1 }),
        createAppointmentResponseDto({ id: 2, title: 'Second appointment' }),
      ];

      appointmentsService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(appointmentsService.findAll).toHaveBeenCalledTimes(1);
      expect(appointmentsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });

    it('should also pass an empty query object to the service', async () => {
      const query = {};
      const expected = [createAppointmentResponseDto()];

      appointmentsService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(appointmentsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate the id to the service and return the appointment', async () => {
      const id = 1;
      const expected = createAppointmentResponseDto({ id });

      appointmentsService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(id);

      expect(appointmentsService.findOne).toHaveBeenCalledTimes(1);
      expect(appointmentsService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should delegate id and dto to the service and return the updated appointment', async () => {
      const id = 1;
      const dto = createUpdateAppointmentDto({
        title: 'Updated title',
        officeId: 2,
      });

      const expected = createAppointmentResponseDto({
        id,
        title: 'Updated title',
        officeId: 2,
      });

      appointmentsService.update.mockResolvedValue(expected);

      const result = await controller.update(id, dto);

      expect(appointmentsService.update).toHaveBeenCalledTimes(1);
      expect(appointmentsService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expected);
    });

    it('should support partial update dto', async () => {
      const id = 1;
      const dto = createUpdateAppointmentDto({
        title: undefined,
        officeId: 3,
      });

      const expected = createAppointmentResponseDto({
        id,
        officeId: 3,
      });

      appointmentsService.update.mockResolvedValue(expected);

      const result = await controller.update(id, dto);

      expect(appointmentsService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expected);
    });
  });
});