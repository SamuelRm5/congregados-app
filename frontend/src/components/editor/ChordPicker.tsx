import { useState } from "react";
import { CHORD_QUALITIES } from "../../lib/music/constants";

interface ChordPickerProps {
  onSelect: (chord: string) => void;
  onCancel: () => void;
}

const NOTES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const QUALITIES = CHORD_QUALITIES.slice(0, 12); // Show most common
// const BASS_NOTES = ["", ...NOTES];

export default function ChordPicker({ onSelect, onCancel }: ChordPickerProps) {
  const [root, setRoot] = useState("C");
  const [quality, setQuality] = useState("");
  const [bass, setBass] = useState("");

  const chord = root + quality + (bass ? `/${bass}` : "");

  return (
    <div className="w-72 bg-white rounded-2xl border border-navy/15 shadow-xl p-4">
      <h3 className="text-sm font-semibold text-navy mb-3">Insertar acorde</h3>

      {/* Root note */}
      <div className="mb-3">
        <p className="text-xs text-navy/50 mb-1.5">Nota raíz</p>
        <div className="grid grid-cols-6 gap-1">
          {NOTES.map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRoot(n)}
              className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                root === n
                  ? "bg-amber-500 text-navy"
                  : "bg-navy/5 hover:bg-navy/10 text-navy"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div className="mb-3">
        <p className="text-xs text-navy/50 mb-1.5">Calidad</p>
        <div className="grid grid-cols-4 gap-1">
          {QUALITIES.map((q) => (
            <button
              type="button"
              key={q || "maj"}
              onClick={() => setQuality(q)}
              className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                quality === q
                  ? "bg-amber-500 text-navy"
                  : "bg-navy/5 hover:bg-navy/10 text-navy"
              }`}
            >
              {q || "maj"}
            </button>
          ))}
        </div>
      </div>

      {/* Bass note */}
      <div className="mb-4">
        <p className="text-xs text-navy/50 mb-1.5">
          Bajo (slash chord, opcional)
        </p>
        <div className="grid grid-cols-7 gap-1">
          <button
            type="button"
            onClick={() => setBass("")}
            className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
              bass === ""
                ? "bg-navy text-white"
                : "bg-navy/5 hover:bg-navy/10 text-navy"
            }`}
          >
            —
          </button>
          {NOTES.map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setBass(n)}
              className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                bass === n
                  ? "bg-navy text-white"
                  : "bg-navy/5 hover:bg-navy/10 text-navy"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold font-mono text-amber-700">
          {chord}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-lg text-navy/60 hover:bg-navy/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSelect(chord)}
            className="px-4 py-1.5 text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-navy font-medium transition-colors"
          >
            Insertar
          </button>
        </div>
      </div>
    </div>
  );
}
