import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Office } from '../../offices/entity/office.entity';

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
}
