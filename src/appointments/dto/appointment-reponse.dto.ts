import { ApiProperty } from "@nestjs/swagger";
import { AppointmentStatus } from "../entity/appointment.entity";

export class AppointmentResponseDto {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    title!: string;

    @ApiProperty()
    startsAt!: string;

    @ApiProperty()
    endsAt!: string;

    @ApiProperty({ enum: AppointmentStatus })
    status!: AppointmentStatus;

    @ApiProperty()
    officeId!: number;

    @ApiProperty()
    officeName!: string;
}
