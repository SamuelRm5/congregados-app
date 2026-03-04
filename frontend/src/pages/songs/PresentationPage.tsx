import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import PresentationView from '../../components/presentation/PresentationView';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Song {
  id: number;
  title: string;
  originalKey: string;
  content: string;
}

export default function PresentationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/songs/${id}`)
      .then((r) => setSong(r.data))
      .catch(() => navigate('/app/songs'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Enter fullscreen
  useEffect(() => {
    if (!song) return;
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, [song]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-navy">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!song) return null;

  return (
    <PresentationView
      song={song}
      onExit={() => navigate(`/app/songs/${song.id}`)}
    />
  );
}
