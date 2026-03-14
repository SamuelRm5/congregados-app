import type { SongLine } from "../../lib/music/chordParser";

interface ChordLineProps {
  line: SongLine;
  presentationMode?: boolean;
}

/**
 * Build a chord-position string using spaces to align chords
 * above their corresponding syllable positions.
 */
function buildChordDisplayLine(chords: SongLine["chords"]): string {
  let result = "";
  let currentPos = 0;

  for (const { chord, position } of chords) {
    if (position > currentPos) {
      result += " ".repeat(position - currentPos);
    }
    result += chord;
    currentPos = position + chord.length;
  }

  return result;
}

export default function ChordLine({
  line,
  presentationMode = false,
}: ChordLineProps) {
  if (line.type === "blank") {
    return <div className={presentationMode ? "h-6" : "h-3"} />;
  }

  if (line.type === "section") {
    return (
      <div
        className={`font-semibold uppercase tracking-widest mt-6 mb-1 ${
          presentationMode ? "text-amber-400 text-lg" : "text-amber-700 text-xs"
        }`}
      >
        — {line.text} —
      </div>
    );
  }

  // Lyrics line
  const hasChords = line.chords.length > 0;

  return (
    <div
      className={`font-mono leading-snug whitespace-pre ${presentationMode ? "text-sm sm:text-lg md:text-2xl" : "text-sm"}`}
    >
      {/* Chord row */}
      <div
        className={`font-bold select-none min-h-[1.2em] ${
          presentationMode ? "text-amber-400" : "text-amber-700"
        }`}
      >
        {hasChords ? buildChordDisplayLine(line.chords) : ""}
      </div>
      {/* Lyric row */}
      <div className={presentationMode ? "text-white" : "text-navy"}>
        {line.text || "\u00A0"}
      </div>
    </div>
  );
}
