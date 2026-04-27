import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store.js';
import { Search, BookOpen, Layers, Clock, X, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, POSITIONS, EQUIPMENT } from '../seed.js';
import { classNames } from '../utils/file.js';

export default function SearchPalette({ close, setView }) {
  const exercises = useStore((s) => s.exercises);
  const sequences = useStore((s) => s.sequences);
  const history = useStore((s) => s.history);
  const [q, setQ] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [filterPos, setFilterPos] = useState('');
  const [filterEquip, setFilterEquip] = useState('');

  useEffect(() => {
    const t = setTimeout(() => document.getElementById('palette-input')?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  const hasFilter = filterCat || filterPos || filterEquip;

  const results = useMemo(() => {
    const t = q.toLowerCase().trim();
    const exFiltered = exercises.filter((e) => {
      const cats = Array.isArray(e.category) ? e.category : [e.category];
      if (filterCat && !cats.includes(filterCat)) return false;
      if (filterPos && e.position !== filterPos) return false;
      if (filterEquip && e.equipment !== filterEquip) return false;
      if (t) {
        const hay = `${e.name} ${(e.tags || []).join(' ')} ${cats.join(' ')} ${e.position} ${e.equipment}`.toLowerCase();
        if (!hay.includes(t)) return false;
      }
      return true;
    });

    if (!t && !hasFilter) {
      return {
        ex: exercises.slice(0, 5),
        sq: sequences.slice(0, 5),
        hi: history.slice(0, 3),
      };
    }
    return {
      ex: exFiltered.slice(0, 8),
      sq: t ? sequences.filter((s) => `${s.title} ${s.description}`.toLowerCase().includes(t)).slice(0, 6) : sequences.slice(0, 5),
      hi: t ? history.filter((h) => `${h.sequenceTitle} ${h.client} ${h.notes}`.toLowerCase().includes(t)).slice(0, 4) : history.slice(0, 3),
    };
  }, [q, exercises, sequences, history, filterCat, filterPos, filterEquip, hasFilter]);

  const onPick = (kind, id) => {
    if (kind === 'ex') setView({ name: 'library', editExerciseId: id });
    if (kind === 'sq') setView({ name: 'editor', id });
    if (kind === 'hi') setView({ name: 'history', expandHistoryId: id });
    close();
  };

  const toggleFilter = (setter, current, value) =>
    setter(current === value ? '' : value);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 backdrop-blur-sm pt-24 px-6"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="card w-full max-w-xl overflow-hidden">
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
          <Search size={16} className="text-ink/40 shrink-0" />
          <input
            id="palette-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises, sequences, tags..."
            className="flex-1 bg-transparent focus:outline-none placeholder:text-ink/40"
          />
          <button
            onClick={() => setShowFilters((v) => !v)}
            title="Filters"
            className={classNames(
              'p-1 rounded-lg transition',
              showFilters || hasFilter ? 'text-ink bg-sandsoft' : 'text-ink/40 hover:text-ink'
            )}
          >
            <SlidersHorizontal size={14} />
          </button>
          <button
            onClick={close}
            className="p-1 rounded-lg text-ink/40 hover:text-ink transition"
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="px-5 py-3 border-b border-line space-y-2 bg-bg/40">
            <FilterRow label="Category" options={CATEGORIES} value={filterCat} onChange={(v) => toggleFilter(setFilterCat, filterCat, v)} />
            <FilterRow label="Position" options={POSITIONS} value={filterPos} onChange={(v) => toggleFilter(setFilterPos, filterPos, v)} />
            <FilterRow label="Equipment" options={EQUIPMENT} value={filterEquip} onChange={(v) => toggleFilter(setFilterEquip, filterEquip, v)} />
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto py-2">
          <Section icon={<BookOpen size={12} />} title="Exercises">
            {results.ex.length === 0 && <Empty />}
            {results.ex.map((e) => {
              const cats = Array.isArray(e.category) ? e.category : [e.category];
              return (
                <Row
                  key={e.id}
                  onClick={() => onPick('ex', e.id)}
                  title={e.name}
                  sub={`${cats.join(', ')} · ${e.position}`}
                />
              );
            })}
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

function FilterRow({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] text-ink/40 uppercase tracking-widest w-16 shrink-0">{label}</span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={classNames(
            'px-2 py-0.5 rounded-full text-[11px] border transition',
            value === opt ? 'bg-ink text-bg border-ink' : 'border-line text-ink/55 hover:bg-sandsoft'
          )}
        >
          {opt}
        </button>
      ))}
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
      <span className="text-xs text-ink/40 truncate shrink-0">{sub}</span>
    </button>
  );
}

function Empty() {
  return <div className="px-3 py-2 text-xs text-ink/35 italic">No matches.</div>;
}
