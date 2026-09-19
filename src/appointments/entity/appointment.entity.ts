import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Office } from '../../offices/entity/office.entity';
import { Applicant } from '../../applicants/entity/applicant.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CANCELED = 'canceled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  date!: string;

  @Column()
  startHour!: number;

  @Column()
  endHour!: number;

  @Column({
    type: 'simple-enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status!: AppointmentStatus;

  @JoinColumn({ name: 'officeId' })
  @ManyToOne(() => Office, { nullable: false })
  office!: Office;

  /**
   * The person the appointment is booked for. Nullable because appointments
   * created before applicants existed have none.
   */
  @JoinColumn({ name: 'applicantId' })
  @ManyToOne(() => Applicant, { nullable: true })
  applicant!: Applicant | null;
}
