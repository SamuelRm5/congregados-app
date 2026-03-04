export const NOTES_SHARP: string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

export const FLAT_TO_SHARP: Record<string, string> = {
  Cb: 'B',
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

export const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
};

// Keys that conventionally display with flats
export const FLAT_KEYS = new Set([
  'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb',
  'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm',
  'BbM7', 'EbM7', 'AbM7',
]);

export const ALL_KEYS: string[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F',
  'F#', 'G', 'Ab', 'A', 'Bb', 'B',
];

export const CHORD_QUALITIES: string[] = [
  '',
  'm',
  '7',
  'maj7',
  'm7',
  'sus4',
  'sus2',
  'dim',
  'aug',
  'add9',
  '6',
  'm6',
  '9',
  'mmaj7',
  '7sus4',
  'dim7',
  'm9',
  'maj9',
  '5',
  'aug7',
];
