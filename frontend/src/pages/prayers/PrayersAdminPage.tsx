import { useCallback, useEffect, useState } from 'react';
import { Heart, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Prayer {
  id: number;
  type: 'THANKSGIVING' | 'REQUEST';
  body: string;
  name: string | null;
  createdAt: string;
}

interface PrayersResponse {
  data: Prayer[];
  total: number;
  page: number;
  limit: number;
}

const TYPE_LABELS: Record<string, string> = {
  THANKSGIVING: 'Agradecimiento',
  REQUEST: 'Petición',
};

const LIMIT = 20;

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));

export default function PrayersAdminPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchPrayers = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: LIMIT };
    if (from) params.from = from;
    if (to) params.to = to;
    if (typeFilter) params.type = typeFilter;

    api
      .get<PrayersResponse>('/prayers', { params })
      .then((r) => {
        setPrayers(r.data.data);
        setTotal(r.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, from, to, typeFilter]);

  useEffect(() => {
    fetchPrayers();
  }, [fetchPrayers]);

  const totalPages = Math.ceil(total / LIMIT);
  const hasFilters = from || to || typeFilter;

  const clearFilters = () => {
    setFrom('');
    setTo('');
    setTypeFilter('');
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy">Oraciones</h1>
        <p className="text-navy/50 text-sm mt-1">
          {total} oración{total !== 1 ? 'es' : ''} recibida{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-navy/50" />
          <span className="text-sm font-medium text-navy/60">Filtros</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-navy/50 block mb-1">Desde</label>
            <input
              type="date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-navy/20 px-3 py-2 text-sm bg-white text-navy focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-navy/50 block mb-1">Hasta</label>
            <input
              type="date"
              value={to}
              onChange={(e) => { setTo(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-navy/20 px-3 py-2 text-sm bg-white text-navy focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-navy/50 block mb-1">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-navy/20 px-3 py-2 text-sm bg-white text-navy focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="REQUEST">Petición</option>
              <option value="THANKSGIVING">Agradecimiento</option>
            </select>
          </div>
          {hasFilters && (
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : prayers.length === 0 ? (
        <div className="text-center py-20 text-navy/40">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">No hay oraciones</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-amber hover:underline mt-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {prayers.map((prayer) => (
              <Card key={prayer.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={prayer.type === 'THANKSGIVING' ? 'amber' : 'default'}>
                    {TYPE_LABELS[prayer.type]}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-navy/45">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(prayer.createdAt)}
                  </div>
                </div>
                <p className="text-navy/80 leading-relaxed whitespace-pre-wrap">
                  {prayer.body}
                </p>
                {prayer.name && (
                  <p className="mt-3 text-sm text-navy/45 italic">— {prayer.name}</p>
                )}
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <span className="text-sm text-navy/60">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
