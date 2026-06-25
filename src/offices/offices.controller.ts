import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OfficesService } from './offices.service';
import { OfficeResponseDto } from './dto/office-response.dto';
import { OfficeAvailabilityQueryDto } from './dto/office-availability-query.dto';
import { OfficeAvailabilitySlotDto } from './dto/office-availability-slot.dto';

@ApiTags('offices')
@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  @ApiOperation({ summary: 'Load all offices' })
  @ApiOkResponse({ type: OfficeResponseDto, isArray: true })
  async findAll(): Promise<OfficeResponseDto[]> {
    return this.officesService.findAll();
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get available appointment slots for an office on a date' })
  @ApiOkResponse({ type: OfficeAvailabilitySlotDto, isArray: true })
  async findAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: OfficeAvailabilityQueryDto,
  ): Promise<OfficeAvailabilitySlotDto[]> {
    return this.officesService.findAvailability(id, query.date);
  }
}
