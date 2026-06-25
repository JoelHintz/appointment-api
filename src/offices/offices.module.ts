import { Module } from '@nestjs/common';
import { OfficesService } from './/offices.service';
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './entity/office.entity';
import { OfficesSeedService } from './offices.seed';
import { Appointment } from '../appointments/entity/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Office, Appointment])],
  providers: [OfficesService, OfficesSeedService],
  controllers: [OfficesController],
})
export class OfficesModule {}
