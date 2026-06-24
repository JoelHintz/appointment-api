import { Module } from '@nestjs/common';
import { OfficesService } from './/offices.service';
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './entity/office.entity';
import { OfficesSeedService } from './offices.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Office])],
  providers: [OfficesService, OfficesSeedService],
  controllers: [OfficesController],
})
export class OfficesModule {}
