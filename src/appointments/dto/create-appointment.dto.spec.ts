import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

describe('CreateAppointmentDto', () => {
  const validPayload = {
    title: 'Applying for a passport',
    officeId: 1,
    startsAt: '2026-06-20T09:00:00.000Z',
  };

  const errorsFor = (payload: Record<string, unknown>) => validateSync(plainToInstance(CreateAppointmentDto, payload));

  it('accepts a valid payload', () => {
    expect(errorsFor(validPayload)).toHaveLength(0);
  });

  it('coerces a numeric string officeId to a number', () => {
    const dto = plainToInstance(CreateAppointmentDto, { ...validPayload, officeId: '1' });

    expect(validateSync(dto)).toHaveLength(0);
    expect(dto.officeId).toBe(1);
  });

  it('rejects a non-numeric officeId', () => {
    const errors = errorsFor({ ...validPayload, officeId: 'abc' });

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('officeId');
  });

  it('rejects a zero or negative officeId', () => {
    expect(errorsFor({ ...validPayload, officeId: 0 })).toHaveLength(1);
    expect(errorsFor({ ...validPayload, officeId: -3 })).toHaveLength(1);
  });
});
