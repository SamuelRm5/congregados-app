import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Maximize2, Gauge, Music2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import SongDisplay from '../../components/viewer/SongDisplay';
import TransposeControls from '../../components/viewer/TransposeControls';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useTranspose } from '../../hooks/useTranspose';

interface Song {
  id: number;
  title: string;
  originalKey: string;
  bpm: number | null;
  content: string;
  tags: { id: number; name: string }[];
}

export default function SongViewerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { semitones, transposedKey, transpose, reset } = useTranspose(song?.originalKey ?? 'C');

  useEffect(() => {
    if (!id) return;
    api
      .get(`/songs/${id}`)
      .then((r) => setSong(r.data))
      .catch(() => navigate('/app/songs'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!song || !confirm(`¿Eliminar "${song.title}"?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/songs/${song.id}`);
      toast.success('Canción eliminada');
      navigate('/app/songs');
    } catch {
      toast.error('Error al eliminar la canción');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!song) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back */}
      <Link
        to="/app/songs"
        className="inline-flex items-center gap-1.5 text-sm text-navy/60 hover:text-navy transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Canciones
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-tight">
            {song.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                Tonalidad original: {song.originalKey}
              </span>
            </div>
            {song.bpm && (
              <div className="flex items-center gap-1 text-sm text-navy/50">
                <Gauge className="w-3.5 h-3.5" />
                {song.bpm} BPM
              </div>
            )}
          </div>
          {song.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {song.tags.map((t) => (
                <Badge key={t.id} variant="amber">{t.name}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 sm:self-start">
          <Link to={`/app/songs/${song.id}/present`}>
            <Button variant="secondary" size="sm" title="Presentación">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </Link>
          <Link to={`/app/songs/${song.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="w-4 h-4" />
              Editar
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleDelete} loading={deleting} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Transpose Controls */}
      <div className="flex items-center justify-between mb-6 p-3 bg-white rounded-xl border border-navy/10 shadow-sm">
        <span className="text-sm text-navy/60 font-medium">Transposición</span>
        <TransposeControls
          originalKey={song.originalKey}
          transposedKey={transposedKey}
          semitones={semitones}
          onTranspose={transpose}
          onReset={reset}
        />
      </div>

      {/* Song content */}
      <div className="bg-white rounded-2xl border border-navy/10 shadow-sm p-6 overflow-x-auto">
        <SongDisplay
          content={song.content}
          semitones={semitones}
          originalKey={song.originalKey}
        />
      </div>
    </div>
  );
}
