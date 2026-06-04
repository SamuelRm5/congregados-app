import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    // Formateo en segundo plano: no bloquea la respuesta. Los errores ya
    // quedan registrados dentro de formatWithAi; aquí solo evitamos el
    // unhandled rejection. Si falla, queda formattedBody = null y el admin
    // puede reintentarlo manualmente con el botón "Formatear".
    void this.formatWithAi(
      saved.id,
      saved.body,
      dto.type,
      dto.name ?? null,
    ).catch(() => undefined);
    return saved;
  }

  // Formatea una oración existente bajo demanda (botón "Formatear" del admin).
  // Propaga el error al controlador para que el front pueda avisar al usuario.
  async formatById(id: number): Promise<Prayer> {
    const prayer = await this.prayersRepository.findOne({ where: { id } });
    if (!prayer) {
      throw new NotFoundException(`Oración ${id} no encontrada`);
    }
    await this.formatWithAi(
      prayer.id,
      prayer.body,
      prayer.type,
      prayer.name ?? null,
    );
    return this.prayersRepository.findOneByOrFail({ id });
  }

  private async formatWithAi(
    id: number,
    body: string,
    type: string,
    name: string | null,
  ): Promise<void> {
    const apiKey = this.configService.get<string>('AI_GATEWAY_API_KEY');
    if (!apiKey) {
      this.logger.error(`[Prayer ${id}] AI_GATEWAY_API_KEY no configurada`);
      throw new Error('AI_GATEWAY_API_KEY no configurada');
    }

    try {
      const tipoTexto =
        type === 'THANKSGIVING' ? 'da gracias porque' : 'pide orar para que';

      const prompt = name
        ? `Eres un asistente de una iglesia. Reformulas peticiones y agradecimientos para mostrarlos en pantalla: alguien los lee en voz alta y al leerlos ya está orando por esa persona.

El remitente se llama "${name}".

Reglas:
- Devuelve UNA sola frase que empiece con "${name} ${tipoTexto}" seguida de lo esencial (ej: "${name} ${tipoTexto} Dios bendiga a su familia y sane a su hijo").
- Lenguaje sencillo, directo y natural. NADA de adornos.
- NO agregues frases de cierre, exhortaciones ni invitaciones (prohibido: "unámonos en gratitud", "invitándonos a...", "oremos juntos", "que el Señor...", "pidamos por...").
- NO agregues nada que el remitente no haya dicho.
- Elimina las peticiones de oración explícitas o redundantes (ej: "por favor oren por ella", "les pido sus oraciones"): sobran.
- Si el nombre "${name}" aparece al inicio del texto, ignóralo para no repetirlo.
- Corrige ortografía, puntuación y redacción, conservando datos y nombres importantes.
- Si el texto es completamente incoherente e incomprensible, responde únicamente con: SIN COHERENCIA
- Responde ÚNICAMENTE con la frase, sin comillas ni explicaciones.

Oración: "${body}"`
        : `Eres un asistente de una iglesia. Reformulas peticiones y agradecimientos para mostrarlos en pantalla: alguien los lee en voz alta y al leerlos ya está orando por esa persona.

No se proporcionó nombre del remitente.

Reglas:
- Devuelve UNA sola frase. Si el texto empieza con un nombre propio y un verbo (ej: "Carlos pide...", "Viviana da gracias..."), consérvalo; si no, redacta en tercera persona ("Se pide orar para que...").
- Lenguaje sencillo, directo y natural. NADA de adornos.
- NO agregues frases de cierre, exhortaciones ni invitaciones (prohibido: "unámonos en gratitud", "invitándonos a...", "oremos juntos", "que el Señor...").
- NO agregues nada que el remitente no haya dicho.
- Elimina las peticiones de oración explícitas o redundantes (ej: "por favor oren por ella", "les pido sus oraciones"): sobran.
- Corrige ortografía, puntuación y redacción, conservando datos importantes.
- Si el texto es completamente incoherente e incomprensible, responde únicamente con: SIN COHERENCIA
- Responde ÚNICAMENTE con la frase, sin comillas ni explicaciones.

Oración: "${body}"`;

      const model = 'google/gemini-3.1-flash-lite';
      const { text } = await generateText({ model, prompt });
      await this.prayersRepository.update(id, { formattedBody: text.trim() });
      this.logger.log(`[Prayer ${id}] Formateada correctamente`);
    } catch (err) {
      this.logger.error(
        `[Prayer ${id}] Error al formatear con IA: ${
          err instanceof Error ? err.message : String(err)
        }`,
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
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
