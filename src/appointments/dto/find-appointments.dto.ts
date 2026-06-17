import { ApiPropertyOptional } from "@nestjs/swagger";
import { AppointmentStatus } from "../entity/appointment.entity";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class FindAppointmentsDto {
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Maximum number of records to return',
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    limit?: number = 10;

    @IsOptional()
    @ApiPropertyOptional({
        enum: AppointmentStatus,
        description: 'Optional status filter',
    })
    status?: AppointmentStatus;
}
