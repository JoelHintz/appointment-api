import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { Office } from '../offices/entity/office.entity';
import { Applicant } from '../applicants/entity/applicant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Office, Applicant])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
