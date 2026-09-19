import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficesModule } from './offices/offices.module';
import { ContactRequestsModule } from './contact-requests/contact-requests.module';
import { ApplicantsModule } from './applicants/applicants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/appointments.db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AppointmentsModule,
    OfficesModule,
    ApplicantsModule,
    ContactRequestsModule,
  ],
})
export class AppModule {}
