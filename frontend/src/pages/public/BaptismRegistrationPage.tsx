import { useRef, useState } from "react";
import { CalendarDays, MapPin, Plus, Send, X } from "lucide-react";
import api from "../../lib/api";
import { toast } from "sonner";

const EVENT = {
  date: "Sábado 7 de noviembre",
  place: "Montenegro, Quindío",
  address: "Barrio Comuneros, Mz 8 Casa 27 · El Crucero vía al Parque del Café",
  mapsUrl: "https://maps.app.goo.gl/oBVD3Qn7MQeqQSoo8",
};

interface Participant {
  id: number;
  name: string;
}

const fieldClass = `
  w-full rounded-xl border border-navy/15 bg-navy/[3%]
  px-5 py-4 text-base text-navy placeholder:text-navy/30
  focus:outline-none focus:border-amber/60 focus:bg-amber/[3%]
  transition-all duration-200 font-body
`;

export default function BaptismRegistrationPage() {
  // Ids estables para que React no mezcle los inputs al eliminar uno del medio
  const nextId = useRef(1);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 0, name: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [submittedCount, setSubmittedCount] = useState<number | null>(null);
  const inputRefs = useRef(new Map<number, HTMLInputElement>());

  const filled = participants.filter((p) => p.name.trim()).length;

  const addParticipant = () => {
    const id = nextId.current++;
    setParticipants((prev) => [...prev, { id, name: "" }]);
    // Esperar a que el input exista en el DOM antes de enfocarlo
    requestAnimationFrame(() => inputRefs.current.get(id)?.focus());
  };

  const updateParticipant = (id: number, name: string) =>
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p)),
    );

  const removeParticipant = (id: number) =>
    setParticipants((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const names = participants.map((p) => p.name.trim()).filter(Boolean);
    if (!names.length) return;
    setLoading(true);
    try {
      await api.post("/baptisms/registrations", { participants: names });
      setSubmittedCount(names.length);
    } catch {
      toast.error("Error al enviar la inscripción. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedCount(null);
    setParticipants([{ id: nextId.current++, name: "" }]);
  };

  return (
    <div className="min-h-screen bg-cream">
      {submittedCount !== null ? (
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
          <div className="text-center px-4 py-16 prayer-success-enter">
            <div className="text-amber text-5xl mb-8 prayer-icon-float select-none">
              ✦
            </div>
            <h1 className="text-4xl font-display italic text-navy leading-tight mb-4">
              Inscripción
              <br />
              recibida
            </h1>
            <div className="w-12 h-px bg-amber/40 mx-auto my-6" />
            <p className="text-navy/50 font-body text-base leading-relaxed mb-10 max-w-xs mx-auto">
              {submittedCount === 1
                ? "Quedó inscrita 1 persona."
                : `Quedaron inscritas ${submittedCount} personas.`}{" "}
              ¡Los esperamos!
            </p>
            <button
              onClick={handleReset}
              className="text-amber/70 hover:text-amber text-sm tracking-widest uppercase transition-colors duration-200 cursor-pointer"
            >
              Hacer otra inscripción →
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
          <div className="pt-12 pb-10">
            {/* Encabezado */}
            <div className="text-center mb-10 prayer-fade-up">
              <div className="text-amber tracking-widest text-sm mb-4 select-none">
                ✦
              </div>
              <h1 className="text-4xl sm:text-5xl font-display italic text-navy leading-none mb-3">
                Bautizos
              </h1>
              <p className="text-navy/40 font-body text-sm leading-relaxed">
                Escribe el nombre de cada persona que va a asistir
              </p>
              <div className="w-16 h-px bg-amber/30 mx-auto mt-6" />
            </div>

            <div
              className="mb-10 rounded-2xl border border-navy/10 bg-white/60 divide-y divide-navy/10 prayer-fade-up"
              style={{ animationDelay: "40ms" }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <CalendarDays className="w-5 h-5 text-amber shrink-0" />
                <div>
                  <p className="text-navy/40 text-xs tracking-widest uppercase">
                    Fecha
                  </p>
                  <p className="text-navy font-body">{EVENT.date}</p>
                </div>
              </div>
              <a
                href={EVENT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-5 py-4 group"
              >
                <MapPin className="w-5 h-5 text-amber shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-navy/40 text-xs tracking-widest uppercase">
                    Ubicación
                  </p>
                  <p className="text-navy font-body">{EVENT.place}</p>
                  <p className="text-navy/50 text-sm font-body">
                    {EVENT.address}
                  </p>
                </div>
                <span className="text-amber/80 group-hover:text-amber text-xs tracking-widest uppercase shrink-0 transition-colors">
                  Mapa →
                </span>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div
                className="prayer-fade-up"
                style={{ animationDelay: "80ms" }}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-navy/40 text-xs tracking-widest uppercase">
                    Participantes
                  </p>
                  <p className="text-navy/40 text-xs tabular-nums">
                    {filled} {filled === 1 ? "persona" : "personas"}
                  </p>
                </div>

                <div className="space-y-3">
                  {participants.map((p, index) => (
                    <div key={p.id} className="relative prayer-fade-up">
                      <input
                        ref={(el) => {
                          if (el) inputRefs.current.set(p.id, el);
                          else inputRefs.current.delete(p.id);
                        }}
                        type="text"
                        value={p.name}
                        onChange={(e) =>
                          updateParticipant(p.id, e.target.value)
                        }
                        placeholder={`Nombre del participante ${index + 1}`}
                        aria-label={`Nombre del participante ${index + 1}`}
                        maxLength={100}
                        autoComplete="off"
                        className={`${fieldClass} ${participants.length > 1 ? "pr-12" : ""}`}
                      />
                      {participants.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeParticipant(p.id)}
                          aria-label={`Quitar participante ${index + 1}`}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-navy/30 hover:text-navy/70 hover:bg-navy/5 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  ))}

                  {/* Mismo estilo que los inputs, con borde punteado para distinguirlo como acción */}
                  <button
                    type="button"
                    onClick={addParticipant}
                    disabled={participants.length >= 50}
                    className={`${fieldClass} border-dashed text-navy/50 hover:text-navy hover:border-amber/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar otro participante
                  </button>
                </div>
              </div>

              <div
                className="prayer-fade-up pt-1"
                style={{ animationDelay: "160ms" }}
              >
                <button
                  type="submit"
                  disabled={!filled || loading}
                  className="
                    w-full py-4 rounded-2xl font-medium text-navy text-base
                    bg-amber hover:bg-amber-light
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200 flex items-center justify-center gap-2.5
                    shadow-lg shadow-amber/25 hover:shadow-amber/35
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
                      Enviar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
