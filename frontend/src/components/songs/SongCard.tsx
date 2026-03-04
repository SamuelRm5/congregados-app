import { useNavigate } from 'react-router-dom';
import { Music2, Gauge } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { parseContent } from '../../lib/music/chordParser';

interface SongCardProps {
  id: number;
  title: string;
  originalKey: string;
  bpm: number | null;
  tags: { id: number; name: string }[];
  content?: string;
}

function getPreview(content: string): string {
  const lines = parseContent(content);
  for (const line of lines) {
    if (line.type === 'lyrics' && line.text.trim()) {
      return line.text.slice(0, 80) + (line.text.length > 80 ? '…' : '');
    }
  }
  return '';
}

export default function SongCard({ id, title, originalKey, bpm, tags, content = '' }: SongCardProps) {
  const navigate = useNavigate();
  const preview = getPreview(content);

  return (
    <Card hoverable onClick={() => navigate(`/app/songs/${id}`)}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Music2 className="w-4 h-4 text-amber-600" />
          </div>
          <Badge variant="amber" className="shrink-0">
            {originalKey}
          </Badge>
        </div>

        <h3 className="font-display font-semibold text-navy text-base leading-snug mb-1 mt-2">
          {title}
        </h3>

        {preview && (
          <p className="text-xs text-navy/50 leading-relaxed mb-3 line-clamp-2">
            {preview}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <Badge key={t.id} variant="outline">
                {t.name}
              </Badge>
            ))}
          </div>
          {bpm && (
            <div className="flex items-center gap-1 text-xs text-navy/40">
              <Gauge className="w-3 h-3" />
              {bpm}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
