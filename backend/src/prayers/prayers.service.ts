import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrayersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePrayerDto) {
    return this.prisma.prayer.create({
      data: {
        type: dto.type,
        body: dto.body,
        name: dto.name || null,
      },
    });
  }

  async findAll(params: {
    from?: string;
    to?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const { from, to, type, page = 1, limit = 20 } = params;
    const where: Prisma.PrayerWhereInput = {};

    if (type) {
      where.type = type as Prisma.EnumPrayerTypeFilter['equals'];
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.prayer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.prayer.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
