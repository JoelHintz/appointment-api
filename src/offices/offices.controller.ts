import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OfficesService } from './offices.service';
import { OfficeResponseDto } from './dto/office-response.dto';

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
}