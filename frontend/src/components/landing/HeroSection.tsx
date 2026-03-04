import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-navy"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 30% 50%, rgba(212,168,83,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 20%, rgba(212,168,83,0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-amber-500/20 hidden lg:block" />
      <div className="absolute top-32 right-32 w-40 h-40 rounded-full border border-amber-500/10 hidden lg:block" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
              Bienvenido a nuestra iglesia
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
            Congregados
            <br />
            <span className="text-amber-400">en Su nombre</span>
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
            Una comunidad de fe unida en adoración, crecimiento y servicio.
            Todos son bienvenidos a ser parte de nuestra familia.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/announcements"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-navy font-semibold rounded-xl transition-colors"
            >
              Ver anuncios
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#schedule"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-colors"
            >
              Horarios de servicio
            </a>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 30C360 60 1080 0 1440 30V60H0V30Z" fill="#faf7f2" />
        </svg>
      </div>
    </section>
  );
}
