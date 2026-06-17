import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentResponseDto } from './dto/appointment-reponse.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {

    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new appointment' })
    @ApiResponse({ status: 201, type: AppointmentResponseDto })
    create(@Body() dto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
        return this.appointmentsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Find appointments with optional filters' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiResponse({ status: 200, type: [AppointmentResponseDto] })
    findAll(@Query() query: FindAppointmentsDto): Promise<AppointmentResponseDto[]> {
        return this.appointmentsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find one appointment by id' })
    @ApiResponse({ status: 200, type: AppointmentResponseDto })
    findOne(@Param('id', ParseIntPipe) id: number): Promise<AppointmentResponseDto> {
        return this.appointmentsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing appointment' })
    @ApiResponse({ status: 200, type: AppointmentResponseDto })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
        return this.appointmentsService.update(id, dto);
    }
}
