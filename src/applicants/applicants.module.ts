import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './entity/applicant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant])],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
})
export class ApplicantsModule {}
