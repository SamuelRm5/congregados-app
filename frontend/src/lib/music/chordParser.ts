export interface ChordPosition {
  chord: string;
  position: number; // character index in the lyric text
}

export interface SongLine {
  type: 'lyrics' | 'section' | 'blank';
  text: string;
  chords: ChordPosition[];
}

/**
 * Section header regex: lines that contain ONLY a section label in brackets.
 * e.g. [INTRO], [VERSO 1], [CORO], [PUENTE], [OUTRO], [INSTRUMENTAL]
 */
const SECTION_REGEX =
  /^\[(INTRO|VERS[OO]?\s*\d*|CORO|CHORUS|BRIDGE|PUENTE|PRE[- ]?CORO|OUTRO|INSTRUMENTAL|ESTROFA\s*\d*|REFR[ÁA]N|INTERLUDIO)\]$/i;

/**
 * Parse raw song content (in [C]Letra format) into an array of SongLine objects.
 *
 * Input line: "[G]Amazing [D]grace how sweet the sound"
 * Output: { type: 'lyrics', text: 'Amazing grace how sweet the sound', chords: [{ chord: 'G', position: 0 }, { chord: 'D', position: 8 }] }
 */
export function parseContent(content: string): SongLine[] {
  const rawLines = content.split('\n');

  return rawLines.map((line): SongLine => {
    const trimmed = line.trim();

    if (!trimmed) {
      return { type: 'blank', text: '', chords: [] };
    }

    if (SECTION_REGEX.test(trimmed)) {
      return {
        type: 'section',
        text: trimmed.slice(1, -1), // strip [ ]
        chords: [],
      };
    }

    // Parse chords and extract lyric text
    const chords: ChordPosition[] = [];
    let text = '';
    let i = 0;

    while (i < line.length) {
      if (line[i] === '[') {
        const close = line.indexOf(']', i);
        if (close === -1) {
          text += line[i];
          i++;
          continue;
        }
        const inner = line.substring(i + 1, close).trim();
        // If it starts with A-G it's a chord, otherwise treat as text
        if (/^[A-G]/.test(inner)) {
          chords.push({ chord: inner, position: text.length });
        } else {
          // Non-chord bracketed content (shouldn't be section headers here)
          text += `[${inner}]`;
        }
        i = close + 1;
      } else {
        text += line[i];
        i++;
      }
    }

    return { type: 'lyrics', text, chords };
  });
}
