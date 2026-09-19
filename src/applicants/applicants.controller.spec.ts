import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { createApplicantResponseDto, createCreateApplicantDto } from '../../test/testdata.factory';

describe('ApplicantsController', () => {
  let controller: ApplicantsController;
  let applicantsService: jest.Mocked<ApplicantsService>;

  beforeEach(() => {
    applicantsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    } as any as jest.Mocked<ApplicantsService>;

    controller = new ApplicantsController(applicantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should delegate creation to the service and return the result', async () => {
      const dto = createCreateApplicantDto();
      const expected = createApplicantResponseDto();

      applicantsService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(applicantsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return the list the service provides', async () => {
      const expected = [createApplicantResponseDto()];

      applicantsService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(applicantsService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate the id to the service and return the applicant', async () => {
      const expected = createApplicantResponseDto({ id: 5 });

      applicantsService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(5);

      expect(applicantsService.findOne).toHaveBeenCalledWith(5);
      expect(result).toEqual(expected);
    });
  });
});
