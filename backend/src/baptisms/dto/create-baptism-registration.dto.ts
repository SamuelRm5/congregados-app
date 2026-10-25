import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBaptismRegistrationDto {
  // Se recortan espacios y se descartan los campos que quedaron vacíos
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? (value as unknown[])
          .map((v) => (typeof v === 'string' ? v.trim() : v))
          .filter((v) => v !== '')
      : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(100, { each: true })
  participants: string[];
}
