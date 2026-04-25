import React, { useMemo, useState } from 'react';
import { useStore } from '../store.js';
import { Search, Plus, Bookmark, Layers, Copy, Trash2, Pencil } from 'lucide-react';
import { formatDate, classNames } from '../utils/file.js';

export default function Sequences({ setView }) {
  const sequences = useStore((s) => s.sequences);
  const createSequence = useStore((s) => s.createSequence);
  const duplicateSequence = useStore((s) => s.duplicateSequence);
  const deleteSequence = useStore((s) => s.deleteSequence);

  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');

  const list = useMemo(() => {
    return sequences
      .filter((s) => {
        if (filter === 'Regular' && s.isTemplate) return false;
        if (filter === 'Template' && !s.isTemplate) return false;
        if (q && !`${s.title} ${s.description}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }, [sequences, filter, q]);

  const templates = list.filter((s) => s.isTemplate);
  const regular = list.filter((s) => !s.isTemplate);

  const onNew = () => {
    const seq = createSequence({ title: '' });
    setView({ name: 'editor', id: seq.id });
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="serif-display">Sequences</h1>
          <p className="text-ink/50 mt-1">
            {sequences.length} sequence{sequences.length === 1 ? '' : 's'} saved
          </p>
        </div>
        <button onClick={onNew} className="btn-primary">
          <Plus size={16} /> New Sequence
        </button>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sequences..."
            className="input pl-11"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Regular', 'Template'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={classNames('chip', filter === f ? 'chip-active' : '')}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {(filter === 'All' || filter === 'Template') && templates.length > 0 && (
        <section className="mt-10">
          <h3 className="font-serif italic text-ink/55 text-sm tracking-wider uppercase mb-4 inline-flex items-center gap-2">
            <Bookmark size={14} /> Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((s) => (
              <SequenceCard
                key={s.id}
                seq={s}
                onOpen={() => setView({ name: 'editor', id: s.id })}
                onDuplicate={() => duplicateSequence(s.id)}
                onDelete={() => deleteSequence(s.id)}
              />
            ))}
          </div>
        </section>
      )}

      {(filter === 'All' || filter === 'Regular') && regular.length > 0 && (
        <section className="mt-12">
          <h3 className="font-serif italic text-ink/55 text-sm tracking-wider uppercase mb-4 inline-flex items-center gap-2">
            <Layers size={14} /> All Sequences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regular.map((s) => (
              <SequenceCard
                key={s.id}
                seq={s}
                onOpen={() => setView({ name: 'editor', id: s.id })}
                onDuplicate={() => duplicateSequence(s.id)}
                onDelete={() => deleteSequence(s.id)}
              />
            ))}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <div className="empty-dashed py-20 text-center text-ink/55 mt-10">
          No sequences match. <button onClick={onNew} className="underline ml-1">Start one</button>.
        </div>
      )}
    </div>
  );
}

function SequenceCard({ seq, onOpen, onDuplicate, onDelete }) {
  return (
    <div className="card p-5 group relative">
      <button onClick={onOpen} className="text-left w-full">
        <div className="flex items-start justify-between gap-3">
          <div className="font-serif text-lg leading-snug">{seq.title || 'Untitled sequence'}</div>
          {seq.isTemplate && (
            <span className="tag bg-sand text-ink/70 inline-flex items-center gap-1 shrink-0">
              <Bookmark size={11} /> Template
            </span>
          )}
        </div>
        {seq.description && (
          <p className="text-sm text-ink/60 mt-2 line-clamp-2">{seq.description}</p>
        )}
        <div className="text-xs text-ink/50 mt-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Layers size={11} /> {seq.duration ? `${seq.duration} min` : '—'}
          </span>
          <span>{seq.level || 'Mixed'}</span>
          <span>
            {seq.blocks.length} block{seq.blocks.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="text-xs text-ink/40 mt-3">{formatDate(seq.updatedAt || seq.createdAt)}</div>
      </button>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-1">
        <button onClick={onOpen} className="p-1.5 rounded-full bg-card border border-line hover:bg-sandsoft" title="Open">
          <Pencil size={12} />
        </button>
        <button onClick={onDuplicate} className="p-1.5 rounded-full bg-card border border-line hover:bg-sandsoft" title="Duplicate">
          <Copy size={12} />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-full bg-card border border-line hover:bg-mauve/40" title="Delete">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
