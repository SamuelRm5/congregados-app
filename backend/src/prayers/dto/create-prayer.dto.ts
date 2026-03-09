import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { PrayerType } from '../../entities/prayer.entity';

export { PrayerType };

export class CreatePrayerDto {
  @IsEnum(PrayerType)
  type: PrayerType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
