import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequestResponseDto } from './dto/contact-request-response.dto';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { FindContactRequestsDto } from './dto/find-contact-requests.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
import { ContactRequestStatus } from './entity/contact-request.entity';

@ApiTags('contact-requests')
@Controller('contact-requests')
export class ContactRequestsController {
  constructor(private readonly contactRequestsService: ContactRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new contact request' })
  @ApiResponse({ status: 201, type: ContactRequestResponseDto })
  create(@Body() dto: CreateContactRequestDto): Promise<ContactRequestResponseDto> {
    return this.contactRequestsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find contact requests with an optional status filter' })
  @ApiQuery({ name: 'status', required: false, enum: ContactRequestStatus })
  @ApiResponse({ status: 200, type: [ContactRequestResponseDto] })
  findAll(@Query() query: FindContactRequestsDto): Promise<ContactRequestResponseDto[]> {
    return this.contactRequestsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one contact request by id' })
  @ApiResponse({ status: 200, type: ContactRequestResponseDto })
  @ApiResponse({ status: 404, description: 'Contact request not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ContactRequestResponseDto> {
    return this.contactRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Advance the status of a contact request' })
  @ApiResponse({ status: 200, type: ContactRequestResponseDto })
  @ApiResponse({ status: 400, description: 'Status transition is not allowed' })
  @ApiResponse({ status: 404, description: 'Contact request not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactRequestDto,
  ): Promise<ContactRequestResponseDto> {
    return this.contactRequestsService.update(id, dto);
  }
}
