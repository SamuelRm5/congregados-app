import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Music2 } from 'lucide-react';
import api from '../../lib/api';
import SongCard from '../../components/songs/SongCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';

interface Tag { id: number; name: string }
interface Song {
  id: number;
  title: string;
  originalKey: string;
  bpm: number | null;
  tags: Tag[];
  content: string;
}

export default function SongsListPage() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  const fetchSongs = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeTag) params.tag = activeTag;

    api
      .get('/songs', { params })
      .then((r) => setSongs(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedSearch, activeTag]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    api.get('/tags').then((r) => setTags(r.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Canciones</h1>
          <p className="text-navy/60 text-sm mt-0.5">
            {songs.length} canciones en el repertorio
          </p>
        </div>
        <Button onClick={() => navigate('/app/songs/new')} size="md">
          <Plus className="w-4 h-4" />
          Nueva canción
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar canción…"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-navy/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tag filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag('')}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              !activeTag
                ? 'bg-navy text-white border-navy'
                : 'border-navy/20 text-navy/60 hover:border-navy/40'
            }`}
          >
            Todas
          </button>
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTag(activeTag === t.name ? '' : t.name)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeTag === t.name
                  ? 'bg-amber-500 text-navy border-amber-500'
                  : 'border-navy/20 text-navy/60 hover:border-navy/40'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-16 text-navy/50">
          <Music2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No se encontraron canciones</p>
          {search || activeTag ? (
            <button
              onClick={() => { setSearch(''); setActiveTag(''); }}
              className="text-sm text-amber-600 hover:underline mt-2"
            >
              Limpiar filtros
            </button>
          ) : (
            <button
              onClick={() => navigate('/app/songs/new')}
              className="text-sm text-amber-600 hover:underline mt-2"
            >
              Crear la primera canción
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} {...song} />
          ))}
        </div>
      )}
    </div>
  );
}
