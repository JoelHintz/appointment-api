import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  birthDate!: string;
}
