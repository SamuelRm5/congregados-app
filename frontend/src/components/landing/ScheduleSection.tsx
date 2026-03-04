import { Clock, MapPin } from 'lucide-react';

const services = [
  {
    day: 'Domingo',
    time: '10:00 AM',
    name: 'Servicio Principal',
    desc: 'Adoración, Palabra y comunión familiar.',
  },
  {
    day: 'Miércoles',
    time: '7:00 PM',
    name: 'Estudio Bíblico',
    desc: 'Profundizando en las Escrituras en grupo.',
  },
  {
    day: 'Viernes',
    time: '7:30 PM',
    name: 'Reunión de Jóvenes',
    desc: 'Espacio para los jóvenes de la congregación.',
  },
];

export default function ScheduleSection() {
  return (
    <section id="schedule" className="py-24 px-4 sm:px-6 bg-navy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-amber-400 text-sm font-medium tracking-wider uppercase mb-3">
            Únete a nosotros
          </p>
          <h2 className="text-4xl font-display font-bold text-white">
            Horarios de reunión
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {services.map(({ day, time, name, desc }) => (
            <div
              key={day}
              className="p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-colors bg-white/5"
            >
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-3">
                <Clock className="w-4 h-4" />
                {day} — {time}
              </div>
              <h3 className="text-white font-display font-semibold text-lg mb-2">{name}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-white/50 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Calle Ejemplo 123, Ciudad — En persona y en línea</span>
        </div>
      </div>
    </section>
  );
}
