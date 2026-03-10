import { FishSymbol } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
            <FishSymbol className="w-3 h-3 text-navy" />
          </div>
          <span className="font-display text-sm text-white">Congregados</span>
        </div>
        <p className="text-xs text-center">
          &copy; {new Date().getFullYear()} Iglesia Congregados. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
