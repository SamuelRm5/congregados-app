import { useCallback, useMemo, useState } from 'react';
import { getTransposedKey } from '../lib/music/transpose';

export function useTranspose(originalKey: string) {
  const [semitones, setSemitones] = useState(0);

  const transposedKey = useMemo(
    () => getTransposedKey(originalKey, semitones),
    [originalKey, semitones],
  );

  const transpose = useCallback((delta: number) => {
    setSemitones((prev) => prev + delta);
  }, []);

  const reset = useCallback(() => setSemitones(0), []);

  return { semitones, transposedKey, transpose, reset };
}
