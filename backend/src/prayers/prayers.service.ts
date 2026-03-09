import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prayer } from '../entities/prayer.entity';
import { CreatePrayerDto } from './dto/create-prayer.dto';

@Injectable()
export class PrayersService {
  constructor(
    @InjectRepository(Prayer)
    private prayersRepository: Repository<Prayer>,
  ) {}

  async create(dto: CreatePrayerDto) {
    const prayer = this.prayersRepository.create({
      type: dto.type,
      body: dto.body,
      name: dto.name ?? undefined,
    });
    return this.prayersRepository.save(prayer);
  }

  async findAll(params: {
    from?: string;
    to?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const { from, to, type, page = 1, limit = 20 } = params;

    const qb = this.prayersRepository
      .createQueryBuilder('prayer')
      .orderBy('prayer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (type) {
      qb.andWhere('prayer.type = :type', { type });
    }

    if (from && to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      qb.andWhere('prayer.createdAt BETWEEN :from AND :to', {
        from: new Date(from),
        to: toDate,
      });
    } else if (from) {
      qb.andWhere('prayer.createdAt >= :from', { from: new Date(from) });
    } else if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      qb.andWhere('prayer.createdAt <= :to', { to: toDate });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }
}
