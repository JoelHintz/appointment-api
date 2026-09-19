import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateApplicantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ description: 'First name of the applicant', example: 'Erika' })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ description: 'Last name of the applicant', example: 'Mustermann' })
  lastName!: string;

  @IsEmail()
  @ApiProperty({ description: 'Email address used for the appointment confirmation', example: 'erika.mustermann@example.com' })
  email!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birthDate must be a calendar date in the format YYYY-MM-DD' })
  @ApiProperty({ description: 'Date of birth as a calendar date', example: '1984-03-12' })
  birthDate!: string;
}
