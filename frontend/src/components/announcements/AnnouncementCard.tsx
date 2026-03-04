import { Calendar } from 'lucide-react';

interface AnnouncementCardProps {
  title: string;
  body: string;
  createdAt: string;
}

export default function AnnouncementCard({ title, body, createdAt }: AnnouncementCardProps) {
  const date = new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(createdAt));

  return (
    <article className="bg-white rounded-xl border border-navy/10 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-amber-600 text-xs font-medium mb-3">
        <Calendar className="w-3.5 h-3.5" />
        {date}
      </div>
      <h2 className="font-display font-semibold text-xl text-navy mb-3">{title}</h2>
      <p className="text-navy/70 leading-relaxed whitespace-pre-wrap">{body}</p>
    </article>
  );
}
