import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function PrivateLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-cream overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
