import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Music } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-navy text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <Music className="w-4 h-4 text-navy" />
            </div>
            <span className="font-display font-semibold text-lg tracking-wide">
              Congregados
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/announcements"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Anuncios
            </NavLink>
            <NavLink
              to="/prayers"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Oraciones
            </NavLink>
            <Link
              to="/login"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-400 text-navy transition-colors"
            >
              Área de Miembros
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/announcements"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            Anuncios
          </NavLink>
          <NavLink
            to="/prayers"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            Oraciones
          </NavLink>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 text-navy text-center mt-2"
          >
            Área de Miembros
          </Link>
        </div>
      )}
    </header>
  );
}
