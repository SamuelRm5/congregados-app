import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../entities/song.entity';
import { Tag } from '../entities/tag.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { QuerySongsDto } from './dto/query-songs.dto';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findAll(query: QuerySongsDto) {
    const { search, tag, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const qb = this.songsRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.tags', 'tag')
      .orderBy('song.title', 'ASC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('song.title LIKE :search', { search: `%${search}%` });
    }

    if (tag) {
      qb.innerJoin('song.tags', 'filterTag', 'filterTag.name = :tagName', { tagName: tag });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!song) {
      throw new NotFoundException(`Song #${id} not found`);
    }

    return song;
  }

  async create(dto: CreateSongDto) {
    const { tags: tagNames, ...songData } = dto;
    const song = this.songsRepository.create(songData);

    if (tagNames?.length) {
      song.tags = await this.resolveOrCreateTags(tagNames);
    }

    return this.songsRepository.save(song);
  }

  async update(id: number, dto: UpdateSongDto) {
    const song = await this.findOne(id);
    const { tags: tagNames, ...songData } = dto;

    Object.assign(song, songData);

    if (tagNames !== undefined) {
      song.tags = await this.resolveOrCreateTags(tagNames);
    }

    return this.songsRepository.save(song);
  }

  async remove(id: number) {
    const song = await this.findOne(id);
    return this.songsRepository.remove(song);
  }

  private async resolveOrCreateTags(names: string[]): Promise<Tag[]> {
    return Promise.all(
      names.map(async (name) => {
        let tag = await this.tagsRepository.findOne({ where: { name } });
        if (!tag) {
          tag = this.tagsRepository.create({ name });
          await this.tagsRepository.save(tag);
        }
        return tag;
      }),
    );
  }
}
