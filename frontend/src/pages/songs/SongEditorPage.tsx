import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import ChordEditor from '../../components/editor/ChordEditor';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ALL_KEYS } from '../../lib/music/constants';

interface Tag { id: number; name: string }

const DEFAULT_FORM = {
  title: '',
  originalKey: 'C',
  bpm: '',
  content: '',
  tagInput: '',
  tags: [] as string[],
};

export default function SongEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/tags').then((r) => setAllTags(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/songs/${id}`)
      .then((r) => {
        const s = r.data;
        setForm({
          title: s.title,
          originalKey: s.originalKey,
          bpm: s.bpm?.toString() ?? '',
          content: s.content,
          tagInput: '',
          tags: s.tags.map((t: Tag) => t.name),
        });
      })
      .catch(() => navigate('/app/songs'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const set = (field: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addTag = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || form.tags.includes(trimmed)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, trimmed], tagInput: '' }));
  };

  const removeTag = (name: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== name) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('El título y la letra son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        originalKey: form.originalKey,
        bpm: form.bpm ? parseInt(form.bpm) : undefined,
        content: form.content,
        tags: form.tags,
      };

      if (isEdit) {
        await api.patch(`/songs/${id}`, payload);
        toast.success('Canción actualizada');
        navigate(`/app/songs/${id}`);
      } else {
        const { data } = await api.post('/songs', payload);
        toast.success('Canción creada');
        navigate(`/app/songs/${data.id}`);
      }
    } catch {
      toast.error('Error al guardar la canción');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        to={isEdit ? `/app/songs/${id}` : '/app/songs'}
        className="inline-flex items-center gap-1.5 text-sm text-navy/60 hover:text-navy transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {isEdit ? 'Ver canción' : 'Canciones'}
      </Link>

      <h1 className="text-3xl font-display font-bold text-navy mb-8">
        {isEdit ? 'Editar canción' : 'Nueva canción'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata */}
        <div className="bg-white rounded-2xl border border-navy/10 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-4">
            Información
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Título *"
              value={form.title}
              onChange={(e) => set('title')(e.target.value)}
              placeholder="Nombre de la canción"
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-navy/80">Tonalidad original *</label>
              <select
                value={form.originalKey}
                onChange={(e) => set('originalKey')(e.target.value)}
                className="w-full rounded-lg border border-navy/20 px-3 py-2 text-sm bg-white text-navy focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {ALL_KEYS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
                {/* Also allow minor keys */}
                {ALL_KEYS.map((k) => (
                  <option key={k + 'm'} value={k + 'm'}>{k}m</option>
                ))}
              </select>
            </div>

            <Input
              label="BPM"
              type="number"
              value={form.bpm}
              onChange={(e) => set('bpm')(e.target.value)}
              placeholder="120"
              min="1"
              max="300"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-navy/80">Etiquetas</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.tagInput}
                  onChange={(e) => set('tagInput')(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addTag(form.tagInput); }
                  }}
                  placeholder="Ej: Adoración"
                  list="tag-suggestions"
                  className="flex-1 rounded-lg border border-navy/20 px-3 py-2 text-sm bg-white text-navy focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <datalist id="tag-suggestions">
                  {allTags.map((t) => <option key={t.id} value={t.name} />)}
                </datalist>
                <button
                  type="button"
                  onClick={() => addTag(form.tagInput)}
                  className="px-3 py-2 rounded-lg bg-navy/5 hover:bg-navy/10 text-navy text-sm transition-colors"
                >
                  +
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-amber-100 text-amber-800"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="hover:text-red-600 transition-colors leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chord editor */}
        <div className="bg-white rounded-2xl border border-navy/10 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-4">
            Letra y acordes
          </h2>
          <ChordEditor
            value={form.content}
            onChange={set('content')}
            originalKey={form.originalKey}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link to={isEdit ? `/app/songs/${id}` : '/app/songs'}>
            <Button type="button" variant="secondary">Cancelar</Button>
          </Link>
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            {isEdit ? 'Guardar cambios' : 'Crear canción'}
          </Button>
        </div>
      </form>
    </div>
  );
}
