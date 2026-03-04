import { BookOpen, Users, Star } from 'lucide-react';

const values = [
  {
    icon: BookOpen,
    title: 'Palabra',
    desc: 'Fundamentados en las Escrituras, creciendo en el conocimiento de Dios.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    desc: 'Una familia unida que se cuida, sirve y camina junta en fe.',
  },
  {
    icon: Star,
    title: 'Adoración',
    desc: 'Exaltando a Cristo en cada reunión con música y alabanza genuina.',
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-600 text-sm font-medium tracking-wider uppercase mb-3">
              Quiénes somos
            </p>
            <h2 className="text-4xl font-display font-bold text-navy mb-6">
              Una iglesia viva,<br />llena de esperanza
            </h2>
            <p className="text-navy/70 leading-relaxed mb-4">
              Somos una congregación que busca conocer a Dios y darlo a conocer.
              Creemos en el poder transformador del Evangelio y en una vida de
              discipulado auténtico.
            </p>
            <p className="text-navy/70 leading-relaxed">
              Desde nuestros jóvenes hasta nuestros adultos mayores, cada persona
              tiene un lugar y un propósito en nuestra familia. Te invitamos a
              descubrirlo con nosotros.
            </p>
          </div>

          <div className="space-y-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-5 bg-white rounded-xl border border-navy/8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">{title}</h3>
                  <p className="text-sm text-navy/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
