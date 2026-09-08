import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ContactRequestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  ANSWERED = 'answered',
}

@Entity()
export class ContactRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  subject!: string;

  @Column()
  message!: string;

  @Column({
    type: 'simple-enum',
    enum: ContactRequestStatus,
    default: ContactRequestStatus.NEW,
  })
  status!: ContactRequestStatus;

  @Column()
  submittedAt!: string;
}
