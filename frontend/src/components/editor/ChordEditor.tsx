import { useRef, useState } from 'react';
import { FishSymbol, ChevronDown } from 'lucide-react';
import ChordPicker from './ChordPicker';
import SongDisplay from '../viewer/SongDisplay';

interface ChordEditorProps {
  value: string;
  onChange: (value: string) => void;
  originalKey: string;
}

export default function ChordEditor({ value, onChange, originalKey }: ChordEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const openPicker = () => {
    const el = textareaRef.current;
    if (el) {
      setCursorPos(el.selectionStart);
    }
    setPickerOpen(true);
  };

  const insertChord = (chord: string) => {
    const pos = cursorPos ?? value.length;
    const before = value.slice(0, pos);
    const after = value.slice(pos);
    const insertion = `[${chord}]`;
    const newValue = before + insertion + after;
    onChange(newValue);
    setPickerOpen(false);

    // Restore focus to textarea after insertion
    setTimeout(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        const newPos = pos + insertion.length;
        el.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const addSection = (section: string) => {
    const el = textareaRef.current;
    const pos = el?.selectionStart ?? value.length;
    const before = value.slice(0, pos);
    const after = value.slice(pos);
    const nl = before && !before.endsWith('\n') ? '\n' : '';
    const insertion = `${nl}[${section}]\n`;
    onChange(before + insertion + after);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openPicker}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy text-xs font-medium transition-colors"
        >
          <FishSymbol className="w-3.5 h-3.5" />
          Insertar acorde
        </button>

        <div className="h-4 w-px bg-navy/10" />

        {['INTRO', 'VERSO', 'CORO', 'PUENTE', 'OUTRO'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => addSection(s)}
            className="px-2.5 py-1.5 rounded-lg bg-navy/5 hover:bg-navy/10 text-navy text-xs font-medium transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chord picker popover */}
      {pickerOpen && (
        <div className="relative z-10">
          <ChordPicker onSelect={insertChord} onCancel={() => setPickerOpen(false)} />
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => pickerOpen && setPickerOpen(false)}
        rows={16}
        placeholder={`Escribe la letra aquí. Haz clic en "Insertar acorde" para añadir acordes.

Ejemplo:
[INTRO]
[G]   [D]   [Em]   [C]

[G]Amazing [D]grace how [Em]sweet the [C]sound`}
        className="w-full font-mono text-sm rounded-xl border border-navy/20 bg-white px-4 py-3 text-navy resize-y
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
          placeholder:text-navy/30 leading-relaxed"
        spellCheck={false}
      />

      <p className="text-xs text-navy/40">
        Tip: Posiciona el cursor donde quieras el acorde, luego haz clic en "Insertar acorde".
      </p>

      {/* Preview toggle */}
      <button
        type="button"
        onClick={() => setShowPreview(!showPreview)}
        className="inline-flex items-center gap-1.5 text-xs text-navy/50 hover:text-navy transition-colors"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPreview ? 'rotate-180' : ''}`} />
        {showPreview ? 'Ocultar' : 'Mostrar'} previsualización
      </button>

      {showPreview && value && (
        <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-4 overflow-x-auto">
          <p className="text-xs text-navy/40 mb-3 uppercase tracking-wider font-medium">Vista previa</p>
          <SongDisplay content={value} semitones={0} originalKey={originalKey} />
        </div>
      )}
    </div>
  );
}
