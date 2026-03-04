import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { QuerySongsDto } from './dto/query-songs.dto';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QuerySongsDto) {
    const { search, tag, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.title = { contains: search };
    }

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    const [data, total] = await Promise.all([
      this.prisma.song.findMany({
        where,
        include: { tags: true },
        orderBy: { title: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.song.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!song) {
      throw new NotFoundException(`Song #${id} not found`);
    }

    return song;
  }

  async create(dto: CreateSongDto) {
    const { tags, ...songData } = dto;

    return this.prisma.song.create({
      data: {
        ...songData,
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });
  }

  async update(id: number, dto: UpdateSongDto) {
    await this.findOne(id);

    const { tags, ...songData } = dto;

    return this.prisma.song.update({
      where: { id },
      data: {
        ...songData,
        tags: tags !== undefined
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.song.delete({ where: { id } });
  }
}
