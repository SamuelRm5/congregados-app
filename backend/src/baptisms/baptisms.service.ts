import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaptismRegistration } from '../entities/baptism-registration.entity';
import { CreateBaptismRegistrationDto } from './dto/create-baptism-registration.dto';

@Injectable()
export class BaptismsService {
  constructor(
    @InjectRepository(BaptismRegistration)
    private registrationsRepository: Repository<BaptismRegistration>,
  ) {}

  async create(dto: CreateBaptismRegistrationDto) {
    const registration = this.registrationsRepository.create({
      participants: dto.participants.map((name) => ({ name })),
    });
    const saved = await this.registrationsRepository.save(registration);
    return { id: saved.id, count: saved.participants.length };
  }
}
