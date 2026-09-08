import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ContactRequest, ContactRequestStatus } from './entity/contact-request.entity';
import { ContactRequestResponseDto } from './dto/contact-request-response.dto';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { FindContactRequestsDto } from './dto/find-contact-requests.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
import { ContactRequestMapper } from './contact-requests.mapper';

/** Allowed status transitions. A status that is not listed here is final. */
const ALLOWED_STATUS_TRANSITIONS: Record<ContactRequestStatus, ContactRequestStatus[]> = {
  [ContactRequestStatus.NEW]: [ContactRequestStatus.IN_PROGRESS],
  [ContactRequestStatus.IN_PROGRESS]: [ContactRequestStatus.ANSWERED],
  [ContactRequestStatus.ANSWERED]: [],
};

@Injectable()
export class ContactRequestsService {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
  ) {}

  async findAll(query: FindContactRequestsDto): Promise<ContactRequestResponseDto[]> {
    const where: FindOptionsWhere<ContactRequest> = {};

    if (query.status) {
      where.status = query.status;
    }

    const contactRequests = await this.contactRequestRepository.find({
      where,
      order: { submittedAt: 'DESC' },
    });

    return ContactRequestMapper.toResponseDtoList(contactRequests);
  }

  async findOne(id: number): Promise<ContactRequestResponseDto> {
    const contactRequest = await this.loadContactRequest(id);

    return ContactRequestMapper.toResponseDto(contactRequest);
  }

  async create(dto: CreateContactRequestDto): Promise<ContactRequestResponseDto> {
    // Built field by field so that no client value can leak into the server-owned
    // fields `status` and `submittedAt`.
    const toSave = {
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
      submittedAt: new Date().toISOString(),
    };

    const entity = this.contactRequestRepository.create(toSave);
    const saved = await this.contactRequestRepository.save(entity);

    return ContactRequestMapper.toResponseDto(saved);
  }

  async update(id: number, dto: UpdateContactRequestDto): Promise<ContactRequestResponseDto> {
    const contactRequest = await this.loadContactRequest(id);

    this.validateStatusTransition(contactRequest.status, dto.status);
    contactRequest.status = dto.status;

    const saved = await this.contactRequestRepository.save(contactRequest);

    return ContactRequestMapper.toResponseDto(saved);
  }

  private async loadContactRequest(id: number): Promise<ContactRequest> {
    const contactRequest = await this.contactRequestRepository.findOne({
      where: { id },
    });

    if (!contactRequest) {
      throw new NotFoundException(`Contact request ${id} not found`);
    }

    return contactRequest;
  }

  private validateStatusTransition(current: ContactRequestStatus, next: ContactRequestStatus): void {
    const allowed = ALLOWED_STATUS_TRANSITIONS[current] ?? [];

    if (!allowed.includes(next)) {
      throw new BadRequestException(`Cannot change status from '${current}' to '${next}'`);
    }
  }
}
