import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store.js';
import { Search, BookOpen, Layers, Clock } from 'lucide-react';

export default function SearchPalette({ close, setView }) {
  const exercises = useStore((s) => s.exercises);
  const sequences = useStore((s) => s.sequences);
  const history = useStore((s) => s.history);
  const [q, setQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => document.getElementById('palette-input')?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) {
      return {
        ex: exercises.slice(0, 5),
        sq: sequences.slice(0, 5),
        hi: history.slice(0, 3),
      };
    }
    const t = q.toLowerCase();
    return {
      ex: exercises
        .filter((e) =>
          `${e.name} ${(e.tags || []).join(' ')} ${e.category} ${e.position}`
            .toLowerCase()
            .includes(t)
        )
        .slice(0, 8),
      sq: sequences.filter((s) => `${s.title} ${s.description}`.toLowerCase().includes(t)).slice(0, 6),
      hi: history.filter((h) => `${h.sequenceTitle} ${h.client} ${h.notes}`.toLowerCase().includes(t)).slice(0, 4),
    };
  }, [q, exercises, sequences, history]);

  const onPick = (kind, id) => {
    if (kind === 'ex') setView({ name: 'library' });
    if (kind === 'sq') setView({ name: 'editor', id });
    if (kind === 'hi') setView({ name: 'history' });
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 backdrop-blur-sm pt-24 px-6">
      <div className="card w-full max-w-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
          <Search size={16} className="text-ink/40" />
          <input
            id="palette-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises, sequences, classes..."
            className="flex-1 bg-transparent focus:outline-none placeholder:text-ink/40"
          />
          <kbd className="text-[10px] text-ink/40 border border-line rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-2">
          <Section icon={<BookOpen size={12} />} title="Exercises">
            {results.ex.length === 0 && <Empty />}
            {results.ex.map((e) => (
              <Row key={e.id} onClick={() => onPick('ex', e.id)} title={e.name} sub={`${e.category} · ${e.position}`} />
            ))}
          </Section>
          <Section icon={<Layers size={12} />} title="Sequences">
            {results.sq.length === 0 && <Empty />}
            {results.sq.map((s) => (
              <Row key={s.id} onClick={() => onPick('sq', s.id)} title={s.title || 'Untitled'} sub={`${s.blocks.length} blocks · ${s.duration || '—'} min`} />
            ))}
          </Section>
          <Section icon={<Clock size={12} />} title="History">
            {results.hi.length === 0 && <Empty />}
            {results.hi.map((h) => (
              <Row key={h.id} onClick={() => onPick('hi', h.id)} title={h.sequenceTitle} sub={`${h.date}${h.client ? ' · ' + h.client : ''}`} />
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="px-2 py-2">
      <div className="px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-ink/40 inline-flex items-center gap-1.5">
        {icon} {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({ title, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-xl2 hover:bg-sandsoft/60 transition flex items-center justify-between gap-3"
    >
      <span className="text-sm truncate">{title}</span>
      <span className="text-xs text-ink/40 truncate">{sub}</span>
    </button>
  );
}

function Empty() {
  return <div className="px-3 py-2 text-xs text-ink/35 italic">No matches.</div>;
}
