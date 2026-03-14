import { Minus, Plus, RotateCcw } from 'lucide-react';

interface TransposeControlsProps {
  originalKey: string;
  transposedKey: string;
  semitones: number;
  onTranspose: (delta: number) => void;
  onReset: () => void;
  compact?: boolean;
}

export default function TransposeControls({
  originalKey,
  transposedKey,
  semitones,
  onTranspose,
  onReset,
  compact = false,
}: TransposeControlsProps) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'bg-white rounded-xl border border-navy/10 shadow-sm px-4 py-2'}`}>
      <button
        onClick={onReset}
        disabled={semitones === 0}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none bg-navy/5 hover:bg-navy/10"
        aria-label="Resetear tonalidad"
        title={`Volver a ${originalKey}`}
      >
        <RotateCcw className="w-3.5 h-3.5 text-navy/60" />
      </button>

      <button
        onClick={() => onTranspose(-1)}
        className="w-8 h-8 rounded-lg bg-navy/5 hover:bg-navy/10 flex items-center justify-center transition-colors"
        aria-label="Bajar semitono"
      >
        <Minus className="w-4 h-4 text-navy" />
      </button>

      <div className="flex flex-col items-center min-w-[70px]">
        <span className="text-sm font-bold text-navy font-mono">{transposedKey}</span>
        {semitones !== 0 && (
          <span className="text-xs text-navy/40">
            {semitones > 0 ? `+${semitones}` : semitones} / {originalKey}
          </span>
        )}
      </div>

      <button
        onClick={() => onTranspose(1)}
        className="w-8 h-8 rounded-lg bg-navy/5 hover:bg-navy/10 flex items-center justify-center transition-colors"
        aria-label="Subir semitono"
      >
        <Plus className="w-4 h-4 text-navy" />
      </button>
    </div>
  );
}
