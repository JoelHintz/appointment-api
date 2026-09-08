import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContactRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the citizen sending the request', example: 'Erika Mustermann' })
  name!: string;

  @IsEmail()
  @ApiProperty({ description: 'Email address for the answer', example: 'erika.mustermann@example.com' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ description: 'Short subject of the request', example: 'Question about passport fees' })
  subject!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  @ApiProperty({
    description: 'Message text of the request',
    example: 'How much does a new passport cost and which documents do I need?',
  })
  message!: string;
}
