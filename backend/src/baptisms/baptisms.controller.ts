import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { BaptismsService } from './baptisms.service';
import { CreateBaptismRegistrationDto } from './dto/create-baptism-registration.dto';

@Controller('baptisms')
export class BaptismsController {
  constructor(private baptismsService: BaptismsService) {}

  @Post('registrations')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() dto: CreateBaptismRegistrationDto) {
    return this.baptismsService.create(dto);
  }
}
