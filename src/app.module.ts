import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficesModule } from './offices/offices.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/appointements.db',
      synchronize: true,
      autoLoadEntities: true
    }),
    AppointmentsModule,
    OfficesModule
  ]
})
export class AppModule {}
