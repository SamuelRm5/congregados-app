import pptxgen from 'pptxgenjs';
import coverImageUrl from '../assets/portada-oracion.png';

export interface PrayerForPptx {
  id: number;
  type: 'THANKSGIVING' | 'REQUEST';
  body: string;
  formattedBody?: string | null;
  name?: string | null;
  createdAt: string;
}

// ==========================================
// ⚙️ CONFIGURACIÓN GLOBAL DE LA PRESENTACIÓN
// Puedes modificar estos valores fácilmente.
// ==========================================
const SLIDE_LAYOUT = 'LAYOUT_4x3' as const; // Opciones: 'LAYOUT_4x3', 'LAYOUT_16x9', etc.
const SLIDE_W = 10; // Pulgadas (4:3)
const SLIDE_H = 7.5; // Pulgadas (4:3)
const COVER_ASPECT_BOX = 1; // Proporción 1:1 de la imagen de portada (cuadrada)

const FONT_SIZE_BODY = 25; // Tamaño de fuente máximo para el texto de las oraciones
const FONT_SIZE_BODY_MIN = 14; // Mínimo absoluto (sólo para grupos de 1 ó 2)
const FONT_SIZE_COMFORT = 18; // Con 3 oraciones no se baja de aquí: si no, van 2
const FONT_SIZE_BADGE = 10; // Tamaño de fuente para la insignia (Petición / Agradecimiento)

// Geometría de las tarjetas
const MARGIN_X = 0.7;
const CARD_W = SLIDE_W - MARGIN_X * 2;
const CARD_PAD_X = 0.45; // Aire lateral dentro de la tarjeta
const CARD_PAD_TOP = 0.3; // Espacio reservado para la insignia sobre el borde
const CARD_PAD_BOTTOM = 0.26;
const CARD_MIN_H = 0.9; // Ninguna tarjeta baja de esta altura
const CARD_GAP = 0.26; // Separación vertical entre tarjetas
const TEXT_W = CARD_W - CARD_PAD_X * 2;

// Área útil vertical (toda la diapositiva, sin encabezado)
const CONTENT_TOP = 0.55;
const CONTENT_BOTTOM = SLIDE_H - 0.4;
const CONTENT_H = CONTENT_BOTTOM - CONTENT_TOP;

const TARGET_PER_SLIDE = 3; // Objetivo: 3 oraciones por diapositiva
const STRETCH_RATIO = 0.3; // Cuánto puede crecer una tarjeta para repartir el espacio sobrante

// Métricas aproximadas de texto (ancho medio de carácter e interlineado).
// CHAR_WIDTH_RATIO se calibró midiendo el render real en PowerPoint (~0.44) y se
// dejó algo por encima para absorber el corte por palabras completas.
const CHAR_WIDTH_RATIO = 0.47;
const LINE_HEIGHT_RATIO = 1.25;
const PARAGRAPH_GAP = 0.08;

const TYPE_LABELS: Record<string, string> = {
  THANKSGIVING: 'AGRADECIMIENTO',
  REQUEST: 'PETICIÓN',
};

function getPrayerText(prayer: PrayerForPptx): string {
  if (prayer.formattedBody && prayer.formattedBody !== 'SIN COHERENCIA') {
    return prayer.formattedBody;
  }
  return prayer.body;
}

/** Alto estimado (en pulgadas) que ocupa un texto dentro de la tarjeta. */
function measureTextHeight(text: string, fontSize: number): number {
  const charsPerLine = Math.max(
    12,
    Math.floor((TEXT_W * 72) / (fontSize * CHAR_WIDTH_RATIO)),
  );
  const lineHeight = (fontSize * LINE_HEIGHT_RATIO) / 72;
  const paragraphs = text.split(/\r?\n/);

  let lines = 0;
  for (const paragraph of paragraphs) {
    lines += Math.max(1, Math.ceil(paragraph.trim().length / charsPerLine));
  }

  return lines * lineHeight + (paragraphs.length - 1) * PARAGRAPH_GAP;
}

/**
 * Alto natural de la tarjeta: sólo el texto más su relleno. No se limita al alto
 * de la diapositiva a propósito: así `fitFontSizeForGroup` detecta que el texto
 * se desborda y reduce la fuente en vez de dar por buena una tarjeta imposible.
 */
function measureCardHeight(text: string, fontSize: number): number {
  const raw = measureTextHeight(text, fontSize) + CARD_PAD_TOP + CARD_PAD_BOTTOM;
  return Math.max(CARD_MIN_H, raw);
}

/** Alto total que ocupa un grupo de textos (tarjetas + separaciones) a una fuente dada. */
function measureGroupHeight(texts: string[], fontSize: number): number {
  const cards = texts.reduce((sum, text) => sum + measureCardHeight(text, fontSize), 0);
  return cards + CARD_GAP * (texts.length - 1);
}

/**
 * Mayor tamaño de fuente (entre FONT_SIZE_BODY y FONT_SIZE_BODY_MIN) con el que
 * el grupo completo cabe en la diapositiva. Devuelve null si ni al mínimo cabe.
 */
function fitFontSizeForGroup(texts: string[]): number | null {
  for (let fontSize = FONT_SIZE_BODY; fontSize >= FONT_SIZE_BODY_MIN; fontSize -= 1) {
    if (measureGroupHeight(texts, fontSize) <= CONTENT_H) return fontSize;
  }
  return null;
}

/** Fuente definitiva de una diapositiva: la que quepa, o el mínimo como último recurso. */
export function resolveSlideFontSize(texts: string[]): number {
  return fitFontSizeForGroup(texts) ?? FONT_SIZE_BODY_MIN;
}

/**
 * Agrupa las oraciones por diapositiva con esta prioridad:
 * 1. 3 oraciones por lámina (objetivo), siempre que la letra no baje de
 *    FONT_SIZE_COMFORT.
 * 2. 2 si las 3 sólo caben con una letra demasiado pequeña.
 * 3. 1 sólo cuando no queda ninguna otra oración para acompañarla (o cuando dos
 *    juntas no caben de ninguna forma).
 * Además nunca deja una oración huérfana al final: si el corte dejaría una sola
 * en la última lámina, reparte (p. ej. 4 restantes → 2 + 2 en vez de 3 + 1).
 */
export function groupPrayersForSlides(prayers: PrayerForPptx[]): PrayerForPptx[][] {
  const slides: PrayerForPptx[][] = [];
  let index = 0;

  while (index < prayers.length) {
    const remaining = prayers.length - index;
    // Sólo se reparte para evitar huérfanas si el grupo sigue teniendo 2+ (nunca
    // se baja a 1 por esta regla: una lámina sola es siempre el último recurso).
    const avoidOrphan = (n: number) => (n >= 3 && remaining - n === 1 ? n - 1 : n);

    let size = avoidOrphan(Math.min(TARGET_PER_SLIDE, remaining));

    // Reduce el grupo hasta que quepa con un tamaño de letra legible.
    while (size > 1) {
      const texts = prayers.slice(index, index + size).map(getPrayerText);
      const fontSize = fitFontSizeForGroup(texts);
      const minAllowed = size >= 3 ? FONT_SIZE_COMFORT : FONT_SIZE_BODY_MIN;
      if (fontSize !== null && fontSize >= minAllowed) break;
      size = avoidOrphan(size - 1);
    }

    slides.push(prayers.slice(index, index + size));
    index += size;
  }

  return slides;
}

/**
 * Calcula alturas finales: parte del alto natural y reparte el espacio sobrante
 * de forma proporcional (hasta STRETCH_RATIO), dejando el resto como aire para
 * centrar el bloque verticalmente.
 */
function layoutSlideCards(
  texts: string[],
  fontSize: number,
): { heights: number[]; startY: number } {
  const natural = texts.map((text) => measureCardHeight(text, fontSize));
  const gaps = CARD_GAP * (texts.length - 1);
  const available = CONTENT_H - gaps;
  const totalNatural = natural.reduce((sum, h) => sum + h, 0);
  const leftover = available - totalNatural;

  if (totalNatural <= 0) {
    return { heights: natural, startY: CONTENT_TOP };
  }

  // No cabe ni al mínimo de fuente: se ajusta proporcionalmente y PowerPoint
  // encoge el texto sobrante (`fit: 'shrink'`).
  if (leftover < 0) {
    const scale = available / totalNatural;
    return { heights: natural.map((h) => h * scale), startY: CONTENT_TOP };
  }

  const stretch = Math.min(leftover, totalNatural * STRETCH_RATIO);
  const heights = natural.map((h) => h + (h / totalNatural) * stretch);
  const startY = CONTENT_TOP + (leftover - stretch) / 2;

  return { heights, startY };
}

/** Carga la portada como data URI (pptxgenjs la incrusta en el archivo .pptx). */
async function loadCoverImage(): Promise<string | null> {
  try {
    const response = await fetch(coverImageUrl);
    if (!response.ok) return null;
    const blob = await response.blob();

    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const formatDateSpan = (prayers: PrayerForPptx[]): string => {
  if (prayers.length === 0) return new Date().toLocaleDateString('es-CO');
  const dateStr = prayers[0].createdAt;
  try {
    return new Intl.DateTimeFormat('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Bogota',
    }).format(new Date(dateStr));
  } catch {
    return new Date().toLocaleDateString('es-CO');
  }
};

export async function generatePrayersPptx(
  prayers: PrayerForPptx[],
  subtitleFilter?: string,
): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = SLIDE_LAYOUT;

  // Palette definition
  const COLOR_BG = '0F172A'; // Dark Slate / Navy
  const COLOR_CARD_BG = '1E293B'; // Card surface
  const COLOR_CARD_BORDER = '334155';
  const COLOR_AMBER = 'D4A853'; // Gold/Amber accent
  const COLOR_EMERALD = '10B981'; // Thanksgiving badge
  const COLOR_TEXT_PRIMARY = 'FAF7F2'; // Cream text
  const COLOR_TEXT_MUTED = '94A3B8'; // Muted text

  // 1. Portada (imagen a sangre completa)
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: COLOR_BG };

  const dateLabel = formatDateSpan(prayers);
  const fullSub = subtitleFilter
    ? `${dateLabel} — ${subtitleFilter}`
    : `Congregados • ${dateLabel}`;

  const coverImage = await loadCoverImage();

  if (coverImage) {
    // La portada es cuadrada (1254x1254): `w`/`h` deben conservar esa proporción
    // porque pptxgenjs calcula el recorte con ellas; `sizing.cover` la escala y
    // recorta hasta llenar la diapositiva 4:3 sin deformarla (12.5% arriba/abajo,
    // zona navy sólido, el título queda centrado).
    coverSlide.addImage({
      data: coverImage,
      x: 0,
      y: 0,
      w: COVER_ASPECT_BOX,
      h: COVER_ASPECT_BOX,
      sizing: { type: 'cover', w: SLIDE_W, h: SLIDE_H },
    });
  } else {
    // Fallback tipográfico si la imagen no se pudo cargar
    coverSlide.addText('✦', {
      x: 1.0,
      y: 1.8,
      w: 8.0,
      h: 0.6,
      align: 'center',
      fontSize: 32,
      color: COLOR_AMBER,
    });

    coverSlide.addText('Reunión de Oración', {
      x: 0.8,
      y: 2.5,
      w: 8.4,
      h: 1.2,
      align: 'center',
      fontSize: 36,
      bold: true,
      color: COLOR_TEXT_PRIMARY,
    });

    coverSlide.addShape(pptx.ShapeType.line, {
      x: 4.2,
      y: 3.9,
      w: 1.6,
      h: 0,
      line: { color: COLOR_AMBER, width: 2 },
    });
  }

  // Fecha / subtítulo sobre la zona inferior (navy sólido en la portada)
  coverSlide.addText(fullSub, {
    x: 0.8,
    y: SLIDE_H - 1.15,
    w: SLIDE_W - 1.6,
    h: 0.5,
    align: 'center',
    valign: 'middle',
    fontSize: 15,
    color: COLOR_TEXT_MUTED,
  });

  // 2. Group prayers into slides
  const groupedSlides = groupPrayersForSlides(prayers);

  groupedSlides.forEach((slidePrayers) => {
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_BG };

    const texts = slidePrayers.map(getPrayerText);
    // Fuente uniforme en la diapositiva: la mayor con la que quepa todo el grupo.
    const fontSize = resolveSlideFontSize(texts);
    const { heights, startY } = layoutSlideCards(texts, fontSize);

    let cardY = startY;

    slidePrayers.forEach((prayer, idx) => {
      const cardH = heights[idx];
      const isThanks = prayer.type === 'THANKSGIVING';
      const badgeColor = isThanks ? COLOR_EMERALD : COLOR_AMBER;
      const badgeText = TYPE_LABELS[prayer.type] || 'ORACIÓN';

      // Card Background
      slide.addShape(pptx.ShapeType.roundRect, {
        x: MARGIN_X,
        y: cardY,
        w: CARD_W,
        h: cardH,
        fill: { color: COLOR_CARD_BG },
        line: { color: COLOR_CARD_BORDER, width: 1 },
        rectRadius: 0.08,
      });

      // Badge sobre el borde superior de la tarjeta
      const badgeW = 1.7;
      const badgeH = 0.26;
      const badgeX = MARGIN_X + CARD_PAD_X - 0.1;
      const badgeY = cardY - badgeH / 2;

      slide.addShape(pptx.ShapeType.roundRect, {
        x: badgeX,
        y: badgeY,
        w: badgeW,
        h: badgeH,
        fill: { color: COLOR_CARD_BG },
        line: { color: badgeColor, width: 1.5 },
        rectRadius: 0.5,
      });

      slide.addText(badgeText, {
        x: badgeX,
        y: badgeY,
        w: badgeW,
        h: badgeH,
        fontSize: FONT_SIZE_BADGE,
        bold: true,
        color: badgeColor,
        align: 'center',
        valign: 'middle',
      });

      // Texto de la oración: ocupa la tarjeta completa menos el relleno
      slide.addText(texts[idx], {
        x: MARGIN_X + CARD_PAD_X,
        y: cardY + CARD_PAD_TOP,
        w: TEXT_W,
        h: cardH - CARD_PAD_TOP - CARD_PAD_BOTTOM,
        fontSize,
        color: COLOR_TEXT_PRIMARY,
        align: 'left',
        valign: 'middle',
        wrap: true,
        fit: 'shrink',
      });

      cardY += cardH + CARD_GAP;
    });
  });

  // File Download
  const fileName = `oraciones-${new Date().toISOString().split('T')[0]}.pptx`;
  await pptx.writeFile({ fileName });
}
