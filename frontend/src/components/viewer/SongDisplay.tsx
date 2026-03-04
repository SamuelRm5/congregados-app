import { useMemo } from 'react';
import { transposeContent } from '../../lib/music/transpose';
import { parseContent } from '../../lib/music/chordParser';
import ChordLine from './ChordLine';

interface SongDisplayProps {
  content: string;
  semitones: number;
  originalKey: string;
  presentationMode?: boolean;
}

export default function SongDisplay({
  content,
  semitones,
  originalKey,
  presentationMode = false,
}: SongDisplayProps) {
  const lines = useMemo(() => {
    const transposed = semitones !== 0
      ? transposeContent(content, semitones, originalKey)
      : content;
    return parseContent(transposed);
  }, [content, semitones, originalKey]);

  return (
    <div className={`space-y-0.5 ${presentationMode ? 'p-8' : ''}`}>
      {lines.map((line, i) => (
        <ChordLine key={i} line={line} presentationMode={presentationMode} />
      ))}
    </div>
  );
}
