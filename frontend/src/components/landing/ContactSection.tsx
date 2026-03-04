import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-cream-dark">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-amber-600 text-sm font-medium tracking-wider uppercase mb-3">
          Contáctanos
        </p>
        <h2 className="text-4xl font-display font-bold text-navy mb-4">
          Estamos aquí para ti
        </h2>
        <p className="text-navy/60 mb-12 max-w-lg mx-auto">
          No dudes en escribirnos o visitarnos. Somos una comunidad abierta y
          siempre hay alguien dispuesto a acompañarte.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="mailto:contacto@congregados.com"
            className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-navy/10 shadow-sm hover:shadow-md transition-shadow group"
          >
            <Mail className="w-5 h-5 text-amber-600" />
            <span className="text-navy font-medium group-hover:text-amber-700 transition-colors">
              contacto@congregados.com
            </span>
          </a>
          <a
            href="tel:+1234567890"
            className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-navy/10 shadow-sm hover:shadow-md transition-shadow group"
          >
            <Phone className="w-5 h-5 text-amber-600" />
            <span className="text-navy font-medium group-hover:text-amber-700 transition-colors">
              +123 456 7890
            </span>
          </a>
          <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-navy/10 shadow-sm">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-navy font-medium">Calle Ejemplo 123</span>
            <ExternalLink className="w-4 h-4 text-navy/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
