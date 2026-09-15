import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

describe('CreateAppointmentDto', () => {
  const validPayload = {
    title: 'Applying for a passport',
    officeId: 1,
    date: '2026-06-20',
    startHour: 9,
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

  it('rejects a date that is not a plain calendar date', () => {
    expect(errorsFor({ ...validPayload, date: '2026-06-20T12:00:00Z' })).toHaveLength(1);
    expect(errorsFor({ ...validPayload, date: '20.06.2026' })).toHaveLength(1);
  });

  it('rejects a start hour that is not an integer', () => {
    const errors = errorsFor({ ...validPayload, startHour: 9.5 });

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('startHour');
  });
});
