import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import api from '../../lib/api';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Announcement {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/announcements')
      .then((r) => setAnnouncements(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Anuncios</h1>
          <p className="text-navy/60 text-sm">Mantente al día con nuestra congregación</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 text-navy/50">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No hay anuncios por ahora</p>
          <p className="text-sm mt-1">Vuelve pronto para novedades</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} {...a} />
          ))}
        </div>
      )}
    </div>
  );
}
