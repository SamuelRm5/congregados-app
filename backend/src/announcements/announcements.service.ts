import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  findAllPublic() {
    return this.announcementsRepository.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return this.announcementsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  create(dto: CreateAnnouncementDto) {
    const announcement = this.announcementsRepository.create(dto);
    return this.announcementsRepository.save(announcement);
  }

  async update(id: number, dto: Partial<CreateAnnouncementDto>) {
    const announcement = await this.announcementsRepository.findOne({ where: { id } });
    if (!announcement) throw new NotFoundException(`Announcement #${id} not found`);
    Object.assign(announcement, dto);
    return this.announcementsRepository.save(announcement);
  }

  async remove(id: number) {
    const announcement = await this.announcementsRepository.findOne({ where: { id } });
    if (!announcement) throw new NotFoundException(`Announcement #${id} not found`);
    return this.announcementsRepository.remove(announcement);
  }
}
