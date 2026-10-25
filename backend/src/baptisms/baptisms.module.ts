import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaptismsService } from './baptisms.service';
import { BaptismsController } from './baptisms.controller';
import { BaptismRegistration } from '../entities/baptism-registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaptismRegistration])],
  providers: [BaptismsService],
  controllers: [BaptismsController],
})
export class BaptismsModule {}
