import React from 'react';
import { useStore } from '../store.js';
import { BookOpen, Layers, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/file.js';

export default function Landing({ setView }) {
  const exercises = useStore((s) => s.exercises);
  const sequences = useStore((s) => s.sequences);
  const history = useStore((s) => s.history);
  const createSequence = useStore((s) => s.createSequence);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const lastClass = history[0];
  const recentSequences = [...sequences]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 3);

  const start = (kind) => {
    if (kind === 'library') setView({ name: 'library' });
    if (kind === 'history') setView({ name: 'history' });
    if (kind === 'new') {
      const seq = createSequence({ title: '' });
      setView({ name: 'editor', id: seq.id });
    }
  };

  return (
    <div>
      <p className="text-sm text-ink/50">{dateLabel}</p>
      <h1 className="serif-display mt-2">
        Ready to plan
        <br />
        <em className="text-muted">your next class?</em>
      </h1>
      <p className="text-ink/55 mt-4 max-w-md leading-relaxed">
        Build sequences with intention. Every block in its right place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        <ActionCard
          icon={<BookOpen size={18} className="text-ink/70" />}
          tint="bg-sandsoft"
          title="Library"
          subtitle={`${exercises.length} exercises`}
          cta="Browse"
          onClick={() => start('library')}
        />
        <ActionCard
          icon={<Layers size={18} className="text-ink/70" />}
          tint="bg-sandsoft"
          title="New Sequence"
          subtitle="Drag and stack exercises"
          cta="Start building"
          onClick={() => start('new')}
        />
        <ActionCard
          icon={<Clock size={18} className="text-mint-ink" />}
          tint="bg-mint"
          title="Class History"
          subtitle={lastClass ? `Last: ${formatDate(lastClass.date)}` : 'No classes logged yet'}
          cta="View history"
          onClick={() => start('history')}
        />
      </div>

      <div className="mt-16">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-serif text-2xl">Recent Sequences</h2>
          <button
            onClick={() => setView({ name: 'sequences' })}
            className="text-sm text-ink/60 hover:text-ink inline-flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        {recentSequences.length === 0 ? (
          <div className="empty-dashed py-16 text-center text-ink/50">
            No sequences yet. <button onClick={() => start('new')} className="underline">Start your first one</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentSequences.map((s) => (
              <SequenceMini key={s.id} seq={s} onOpen={() => setView({ name: 'editor', id: s.id })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({ icon, tint, title, subtitle, cta, onClick }) {
  return (
    <button onClick={onClick} className="card text-left p-6 hover:bg-sandsoft/30 transition group">
      <div className={`w-11 h-11 rounded-xl2 ${tint} flex items-center justify-center mb-8`}>{icon}</div>
      <div className="font-serif text-2xl">{title}</div>
      <div className="text-sm text-ink/55 mt-1">{subtitle}</div>
      <div className="text-sm text-ink/70 mt-6 inline-flex items-center gap-1 group-hover:text-ink">
        {cta} <ArrowRight size={14} />
      </div>
    </button>
  );
}

function SequenceMini({ seq, onOpen }) {
  return (
    <button onClick={onOpen} className="card text-left p-5 hover:bg-sandsoft/30 transition">
      <div className="font-serif text-lg">{seq.title || 'Untitled sequence'}</div>
      <div className="text-xs text-ink/50 mt-3 flex items-center gap-3">
        <span>{seq.duration ? `${seq.duration} min` : '—'}</span>
        <span>·</span>
        <span>{seq.level || 'Mixed'}</span>
        <span>·</span>
        <span>
          {seq.blocks.length} block{seq.blocks.length === 1 ? '' : 's'}
        </span>
      </div>
    </button>
  );
}
