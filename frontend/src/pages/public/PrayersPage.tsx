import { useState } from 'react';
import { Send } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

type PrayerType = 'THANKSGIVING' | 'REQUEST';

const TYPES = [
  {
    value: 'REQUEST' as const,
    symbol: '🙏',
    label: 'Petición',
    description: 'Pide oración por una necesidad',
  },
  {
    value: 'THANKSGIVING' as const,
    symbol: '❤️',
    label: 'Agradecimiento',
    description: 'Comparte una bendición recibida',
  },
];

const fieldClass = `
  w-full rounded-xl border border-white/10 bg-white/5
  px-5 py-4 text-base text-cream placeholder:text-cream/20
  focus:outline-none focus:border-amber/50 focus:bg-white/[7%]
  transition-all duration-200 font-body
`;

export default function PrayersPage() {
  const [type, setType] = useState<PrayerType>('REQUEST');
  const [body, setBody] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/prayers', {
        type,
        body: body.trim(),
        name: name.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      toast.error('Error al enviar la oración. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setType('REQUEST');
    setBody('');
    setName('');
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="relative bg-navy rounded-3xl overflow-hidden shadow-2xl shadow-navy/40 text-center px-8 py-16 prayer-success-enter">
          <div className="prayer-ambient" />
          <div className="relative z-10">
            <div className="text-amber text-5xl mb-8 prayer-icon-float select-none">✦</div>
            <h1 className="text-4xl font-display italic text-cream leading-tight mb-4">
              Oración<br />recibida
            </h1>
            <div className="w-12 h-px bg-amber/30 mx-auto my-6" />
            <p className="text-cream/50 font-body text-base leading-relaxed mb-10 max-w-xs mx-auto">
              Gracias por compartir tu oración con nosotros. Estaremos orando contigo.
            </p>
            <button
              onClick={handleReset}
              className="text-amber/70 hover:text-amber text-sm tracking-widest uppercase transition-colors duration-200 cursor-pointer"
            >
              Enviar otra oración →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Prayer book card */}
      <div className="relative bg-navy rounded-3xl overflow-hidden shadow-2xl shadow-navy/30">
        <div className="prayer-ambient" />

        <div className="relative z-10 px-8 pt-12 pb-10">

          {/* Header */}
          <div className="text-center mb-10 prayer-fade-up" style={{ animationDelay: '0ms' }}>
            <div className="text-amber tracking-widest text-sm mb-4 select-none">✦</div>
            <h1 className="text-5xl font-display italic text-cream leading-none mb-3">
              Oraciones
            </h1>
            <p className="text-cream/40 font-body text-sm leading-relaxed">
              Comparte tu oración con la congregación
            </p>
            <div className="w-16 h-px bg-amber/25 mx-auto mt-6" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Type selector */}
            <div className="prayer-fade-up" style={{ animationDelay: '80ms' }}>
              <p className="text-cream/40 text-xs tracking-widest uppercase text-center mb-4">
                Tipo de oración
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`
                      p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer
                      ${type === t.value
                        ? 'border-amber/60 bg-amber/10 shadow-lg shadow-amber/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[8%]'
                      }
                    `}
                  >
                    <span className="text-2xl block mb-3 leading-none">{t.symbol}</span>
                    <span
                      className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                        type === t.value ? 'text-amber-light' : 'text-cream/75'
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="text-cream/30 text-xs leading-snug">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prayer text */}
            <div className="prayer-fade-up" style={{ animationDelay: '160ms' }}>
              <label
                htmlFor="prayer-body"
                className="text-cream/40 text-xs tracking-widest uppercase block mb-3"
              >
                Tu oración <span className="text-amber normal-case tracking-normal">*</span>
              </label>
              <textarea
                id="prayer-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escribe tu oración aquí..."
                required
                maxLength={2000}
                rows={5}
                className={`${fieldClass} resize-y leading-relaxed`}
              />
              <p className="text-cream/20 text-xs mt-2 text-right tabular-nums">
                {body.length} / 2000
              </p>
            </div>

            {/* Name */}
            <div className="prayer-fade-up" style={{ animationDelay: '240ms' }}>
              <label
                htmlFor="prayer-name"
                className="text-cream/40 text-xs tracking-widest uppercase block mb-3"
              >
                Tu nombre{' '}
                <span className="text-cream/25 normal-case tracking-normal text-xs">(opcional)</span>
              </label>
              <input
                id="prayer-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anónimo si se deja vacío"
                maxLength={100}
                className={fieldClass}
              />
            </div>

            {/* Submit */}
            <div className="prayer-fade-up pt-1" style={{ animationDelay: '320ms' }}>
              <button
                type="submit"
                disabled={!body.trim() || loading}
                className="
                  w-full py-4 rounded-2xl font-medium text-navy text-base
                  bg-amber hover:bg-amber-light
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200 flex items-center justify-center gap-2.5
                  shadow-lg shadow-amber/20 hover:shadow-amber/30
                  cursor-pointer
                "
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar oración
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p
            className="text-center text-cream/20 text-xs mt-8 prayer-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            Tu privacidad es importante. El nombre es opcional.
          </p>
        </div>
      </div>
    </div>
  );
}
