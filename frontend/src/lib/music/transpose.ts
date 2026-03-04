import { NOTES_SHARP, FLAT_TO_SHARP, SHARP_TO_FLAT, FLAT_KEYS } from './constants';

/**
 * Regex to parse a single chord token:
 *
 * ^([A-G])          - Group 1: Root letter
 * ([#b]?)           - Group 2: Root accidental (# or b, optional)
 * (.*?)             - Group 3: Quality/suffix (lazy — everything until optional slash)
 * (?:\/             - Non-capturing group: optional slash bass
 *   ([A-G])         - Group 4: Bass letter
 *   ([#b]?)         - Group 5: Bass accidental
 * )?$               - End
 */
const CHORD_REGEX = /^([A-G])([#b]?)(.*?)(?:\/([A-G])([#b]?))?$/;

function noteToIndex(letter: string, accidental: string): number {
  const note = letter + accidental;
  const flat = FLAT_TO_SHARP[note];
  const lookup = flat ?? note;
  const idx = NOTES_SHARP.indexOf(lookup);
  if (idx === -1) return 0;
  return idx;
}

function indexToNote(index: number, preferFlats: boolean): string {
  const i = ((index % 12) + 12) % 12;
  const sharp = NOTES_SHARP[i];
  if (preferFlats && SHARP_TO_FLAT[sharp]) {
    return SHARP_TO_FLAT[sharp];
  }
  return sharp;
}

function shouldPreferFlats(originalKey: string, semitones: number): boolean {
  const m = originalKey.match(/^([A-G])([#b]?)(m?)$/);
  if (!m) return false;
  const rootIdx = noteToIndex(m[1], m[2]);
  const newIdx = ((rootIdx + semitones) % 12 + 12) % 12;
  const newSharp = NOTES_SHARP[newIdx];
  const newFlat = SHARP_TO_FLAT[newSharp];
  const minor = m[3];
  return (
    FLAT_KEYS.has((newFlat ?? newSharp) + minor) ||
    FLAT_KEYS.has(newSharp + minor)
  );
}

/**
 * Transpose a single chord string by N semitones.
 *
 * Examples:
 *   transposeChord('Bbmaj7', 2, false) => 'Cmaj7'
 *   transposeChord('F#m7/B', 1, false) => 'Gm7/C'
 *   transposeChord('Dsus4', -1, false)  => 'Dbsus4' (if preferFlats) or 'C#sus4'
 */
export function transposeChord(chord: string, semitones: number, preferFlats: boolean): string {
  const m = chord.match(CHORD_REGEX);
  if (!m) return chord;

  const [, rootLetter, rootAcc, quality, bassLetter, bassAcc] = m;

  const newRoot = indexToNote(noteToIndex(rootLetter, rootAcc) + semitones, preferFlats);

  let newBass = '';
  if (bassLetter) {
    newBass = '/' + indexToNote(noteToIndex(bassLetter, bassAcc ?? '') + semitones, preferFlats);
  }

  return newRoot + quality + newBass;
}

/**
 * Transpose all chords embedded in a `[C]Letra` format content string.
 * Chords are anything inside square brackets that matches the chord regex.
 * Section headers like [INTRO], [CORO], etc. are left untouched.
 */
export function transposeContent(content: string, semitones: number, originalKey: string): string {
  if (semitones === 0) return content;
  const preferFlats = shouldPreferFlats(originalKey, semitones);

  return content.replace(/\[([^\]]+)\]/g, (_full, inner: string) => {
    const trimmed = inner.trim();
    // Only transpose if it looks like a chord (starts with A-G)
    if (/^[A-G]/.test(trimmed)) {
      return `[${transposeChord(trimmed, semitones, preferFlats)}]`;
    }
    return `[${inner}]`;
  });
}

/**
 * Compute the display key name after transposition.
 */
export function getTransposedKey(originalKey: string, semitones: number): string {
  const m = originalKey.match(/^([A-G])([#b]?)(m?)$/);
  if (!m) return originalKey;
  const preferFlats = shouldPreferFlats(originalKey, semitones);
  const newNote = indexToNote(noteToIndex(m[1], m[2]) + semitones, preferFlats);
  return newNote + m[3];
}
