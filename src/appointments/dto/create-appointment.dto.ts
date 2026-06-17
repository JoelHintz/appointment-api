import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsNotEmpty } from "class-validator";

export class CreateAppointmentDto {
    @IsNotEmpty()
    @ApiProperty({description: 'Title of the booked appointment'})
    title!: string;

    @IsNotEmpty()
    @ApiProperty({description: 'ID of the Office the appointment is booked for'})
    officeId!: number;

    @IsISO8601()
    @ApiProperty({description: 'Start time in ISO-8601 format', example: '2026-06-20T09:00:00.000Z'})
    startsAt!: string;

    @IsISO8601()
    @ApiProperty({description: 'End time in ISO-8601 format', example: '2026-06-20T09:30:00.000Z'})
    endsAt!: string;
}
