import { Module } from '@nestjs/common';
import { OfficesService } from './/offices.service';
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './entity/office.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Office])],
    providers: [OfficesService],
    controllers: [OfficesController]
})
export class OfficesModule {}
