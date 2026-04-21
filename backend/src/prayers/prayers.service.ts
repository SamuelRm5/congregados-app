import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { generateText } from 'ai';
import { Prayer } from '../entities/prayer.entity';
import { CreatePrayerDto } from './dto/create-prayer.dto';

// Bogotá es UTC-5: el inicio del día en Bogotá equivale a 05:00 UTC
function bogotaStartOfDay(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 5, 0, 0, 0));
}

// El fin del día en Bogotá (23:59:59.999) equivale a 04:59:59.999 UTC del día siguiente
function bogotaEndOfDay(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1, 4, 59, 59, 999));
}

@Injectable()
export class PrayersService {
  private readonly logger = new Logger(PrayersService.name);

  constructor(
    @InjectRepository(Prayer)
    private prayersRepository: Repository<Prayer>,
    private configService: ConfigService,
  ) {}

  async create(dto: CreatePrayerDto) {
    const prayer = this.prayersRepository.create({
      type: dto.type,
      body: dto.body,
      name: dto.name ?? undefined,
    });
    const saved = await this.prayersRepository.save(prayer);
    this.formatWithAi(saved.id, saved.body, dto.type, dto.name ?? null);
    return saved;
  }

  private async formatWithAi(
    id: number,
    body: string,
    type: string,
    name: string | null,
  ): Promise<void> {
    try {
      const apiKey = this.configService.get<string>('AI_GATEWAY_API_KEY');
      if (!apiKey) {
        this.logger.warn(`[Prayer ${id}] AI_GATEWAY_API_KEY no configurada`);
        return;
      }

      const tipoTexto = type === 'THANKSGIVING' ? 'da gracias' : 'pide por';

      const prompt = name
        ? `Eres un asistente de una iglesia que formatea peticiones y agradecimientos de oración.

El remitente se llama "${name}" y su tipo de oración es "${tipoTexto}".

Reglas:
- Comienza siempre con "${name} ${tipoTexto}" seguido de lo que dice la oración.
- Si el nombre "${name}" aparece al inicio del texto de la oración, ignóralo para evitar redundancia.
- Corrige ortografía, puntuación y redacción. Mantén todos los datos, nombres y peticiones importantes.
- Sé conciso pero sin omitir nada relevante.
- Si el texto es completamente incoherente e incomprensible, responde únicamente con: SIN COHERENCIA
- Responde ÚNICAMENTE con el texto formateado, sin comillas ni explicaciones.

Oración: "${body}"`
        : `Eres un asistente de una iglesia que formatea peticiones y agradecimientos de oración.

No se proporcionó nombre del remitente.

Reglas:
- Si el texto comienza con un nombre propio seguido de un verbo (ej: "Carlos pide", "Viviana agradece"), conserva esa estructura y solo corrige ortografía y redacción.
- Si no hay nombre, corrige ortografía, puntuación y redacción manteniendo todos los datos importantes.
- Sé conciso pero sin omitir nada relevante.
- Si el texto es completamente incoherente e incomprensible, responde únicamente con: SIN COHERENCIA
- Responde ÚNICAMENTE con el texto formateado, sin comillas ni explicaciones.

Oración: "${body}"`;

      const { text } = await generateText({
        model: 'google/gemma-4-31b-it',
        prompt,
      });
      await this.prayersRepository.update(id, { formattedBody: text.trim() });
      this.logger.log(`[Prayer ${id}] Formateada correctamente`);
    } catch (err) {
      this.logger.error(
        `[Prayer ${id}] Error al formatear con IA`,
        err instanceof Error ? err.stack : String(err),
      );
    }
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
      qb.andWhere('prayer.createdAt BETWEEN :from AND :to', {
        from: bogotaStartOfDay(from),
        to: bogotaEndOfDay(to),
      });
    } else if (from) {
      qb.andWhere('prayer.createdAt >= :from', {
        from: bogotaStartOfDay(from),
      });
    } else if (to) {
      qb.andWhere('prayer.createdAt <= :to', { to: bogotaEndOfDay(to) });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }
}
