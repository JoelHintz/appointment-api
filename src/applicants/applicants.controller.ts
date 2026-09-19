import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicantsService } from './applicants.service';
import { ApplicantResponseDto } from './dto/applicant-response.dto';
import { CreateApplicantDto } from './dto/create-applicant.dto';

@ApiTags('applicants')
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new applicant' })
  @ApiResponse({ status: 201, type: ApplicantResponseDto })
  create(@Body() dto: CreateApplicantDto): Promise<ApplicantResponseDto> {
    return this.applicantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Load all applicants' })
  @ApiResponse({ status: 200, type: [ApplicantResponseDto] })
  findAll(): Promise<ApplicantResponseDto[]> {
    return this.applicantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one applicant by id' })
  @ApiResponse({ status: 200, type: ApplicantResponseDto })
  @ApiResponse({ status: 404, description: 'Applicant not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ApplicantResponseDto> {
    return this.applicantsService.findOne(id);
  }
}
