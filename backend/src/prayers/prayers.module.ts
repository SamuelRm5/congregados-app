import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayersService } from './prayers.service';
import { PrayersController } from './prayers.controller';
import { Prayer } from '../entities/prayer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prayer])],
  providers: [PrayersService],
  controllers: [PrayersController],
})
export class PrayersModule {}
