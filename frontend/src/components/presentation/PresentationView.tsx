import { useCallback, useEffect, useState } from "react";
import { X, Minus, Plus, RotateCcw } from "lucide-react";
import SongDisplay from "../viewer/SongDisplay";
import { useTranspose } from "../../hooks/useTranspose";

interface PresentationViewProps {
  song: {
    title: string;
    originalKey: string;
    content: string;
  };
  onExit: () => void;
}

export default function PresentationView({
  song,
  onExit,
}: PresentationViewProps) {
  const { semitones, transposedKey, transpose, reset } = useTranspose(
    song.originalKey,
  );
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer) clearTimeout(hideTimer);
    const t = setTimeout(() => setControlsVisible(false), 3000);
    setHideTimer(t);
  }, [hideTimer]);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      showControls();
      if (e.key === "+" || e.key === "=") transpose(1);
      else if (e.key === "-") transpose(-1);
      else if (e.key === "0") reset();
      else if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [transpose, reset, onExit, showControls]);

  return (
    <div
      className="fixed inset-0 bg-navy z-50 overflow-y-auto overflow-x-hidden"
      onMouseMove={showControls}
    >
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-12 pb-28">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-4">
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
            {song.title}
          </h1>
          <p className="text-amber-400 text-base sm:text-2xl font-mono shrink-0">
            Tono: {transposedKey}
            {semitones !== 0 && ` (original: ${song.originalKey})`}
          </p>
        </div>

        <SongDisplay
          content={song.content}
          semitones={semitones}
          originalKey={song.originalKey}
          presentationMode
        />
      </div>

      {/* Floating controls */}
      <div
        className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ${
          controlsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center pb-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
            <button
              onClick={() => transpose(-1)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Bajar semitono (tecla -)"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center min-w-[56px]">
              <span className="text-white font-bold font-mono text-lg">
                {transposedKey}
              </span>
              {semitones !== 0 && (
                <span className="text-white/40 text-xs">
                  {semitones > 0 ? `+${semitones}` : semitones}
                </span>
              )}
            </div>

            <button
              onClick={() => transpose(1)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Subir semitono (tecla +)"
            >
              <Plus className="w-4 h-4" />
            </button>

            {semitones !== 0 && (
              <button
                onClick={reset}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors ml-1"
                title="Reset (tecla 0)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
              onClick={onExit}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              title="Salir (Escape)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
