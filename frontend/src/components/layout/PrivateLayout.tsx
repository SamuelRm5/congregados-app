import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, FishSymbol } from 'lucide-react';
import Sidebar from './Sidebar';

export default function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-10 flex items-center gap-3 px-4 h-14 bg-navy text-white shadow-md shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <FishSymbol className="w-3.5 h-3.5 text-navy" />
            </div>
            <span className="font-display font-semibold text-sm">Congregados</span>
          </div>
        </header>

        <main className="flex-1 bg-cream overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
