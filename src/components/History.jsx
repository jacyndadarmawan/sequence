import React, { useMemo, useState } from 'react';
import { useStore } from '../store.js';
import { Plus, Search, Star, ChevronDown, Layers, Clock, Trash2 } from 'lucide-react';
import { classNames } from '../utils/file.js';
import LogClassModal from './LogClassModal.jsx';

export default function History({ setView }) {
  const history = useStore((s) => s.history);
  const sequences = useStore((s) => s.sequences);
  const exercises = useStore((s) => s.exercises);
  const deleteHistory = useStore((s) => s.deleteHistory);

  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return history
      .filter((h) =>
        q ? `${h.sequenceTitle} ${h.client} ${h.notes}`.toLowerCase().includes(q.toLowerCase()) : true
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [history, q]);

  const grouped = useMemo(() => {
    const out = {};
    for (const h of filtered) {
      const d = new Date(h.date);
      const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      out[key] = out[key] || [];
      out[key].push(h);
    }
    return out;
  }, [filtered]);

  const sequenceById = (id) => sequences.find((s) => s.id === id);
  const exerciseById = (id) => exercises.find((e) => e.id === id);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="serif-display">Class History</h1>
          <p className="text-ink/50 mt-1">
            {history.length} class{history.length === 1 ? '' : 'es'} logged
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">
          <Plus size={16} /> Log Class
        </button>
      </div>

      <div className="mt-8 relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search history..."
          className="input pl-11"
        />
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className="empty-dashed py-20 text-center text-ink/55 mt-10">
          <div>No classes logged yet.</div>
          <button onClick={() => setOpen(true)} className="underline mt-2 inline-block">
            Log your first class →
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([month, rows]) => (
          <section key={month} className="mt-10">
            <h3 className="font-serif italic text-ink/55 text-sm tracking-wider uppercase mb-4">
              {month}
            </h3>
            <div className="space-y-3">
              {rows.map((h) => {
                const seq = sequenceById(h.sequenceId);
                const isOpen = expanded === h.id;
                return (
                  <div key={h.id} className="card group">
                    <div className="flex items-center px-5 py-4 gap-5">
                      <div className="text-center w-12 shrink-0 border-r border-line pr-5">
                        <div className="font-serif text-2xl leading-none">{new Date(h.date).getDate()}</div>
                        <div className="text-[11px] text-ink/50 mt-1 uppercase tracking-wider">
                          {new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-lg truncate">{h.sequenceTitle || 'Untitled class'}</div>
                        <div className="text-xs text-ink/55 mt-1 flex items-center gap-3">
                          {h.client && <span>{h.client}</span>}
                          {h.duration && (
                            <span className="inline-flex items-center gap-1">
                              <Clock size={11} /> {h.duration} min
                            </span>
                          )}
                          {h.exerciseCount > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Layers size={11} /> {h.exerciseCount} exercises
                            </span>
                          )}
                        </div>
                      </div>
                      <Stars rating={h.rating} />
                      <button
                        onClick={() => setExpanded(isOpen ? null : h.id)}
                        className="p-1.5 rounded-full hover:bg-sandsoft text-ink/55"
                      >
                        <ChevronDown
                          size={16}
                          className={classNames('transition', isOpen && 'rotate-180')}
                        />
                      </button>
                      <button
                        onClick={() => deleteHistory(h.id)}
                        className="p-1.5 rounded-full hover:bg-mauve/40 opacity-0 group-hover:opacity-100 transition text-ink/55"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-line">
                        {h.notes && (
                          <div className="mt-4">
                            <div className="label mb-2">Notes</div>
                            <p className="text-sm text-ink/75 leading-relaxed whitespace-pre-wrap">{h.notes}</p>
                          </div>
                        )}
                        {seq && (
                          <div className="mt-5">
                            <div className="label mb-2">Sequence used</div>
                            <button
                              onClick={() => setView({ name: 'editor', id: seq.id })}
                              className="text-sm underline text-ink hover:text-ink/70"
                            >
                              {seq.title} →
                            </button>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {seq.blocks.map((b) => (
                                <div key={b.id} className="bg-bg/40 rounded-xl2 p-3 border border-line">
                                  <div className="text-sm font-medium">{b.name}</div>
                                  <ol className="text-xs text-ink/65 mt-1 space-y-0.5">
                                    {b.items.map((it, i) => (
                                      <li key={it.id}>
                                        {i + 1}. {exerciseById(it.exerciseId)?.name}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}

      {open && <LogClassModal close={() => setOpen(false)} />}
    </div>
  );
}

function Stars({ rating = 0 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-ink/15'}
        />
      ))}
    </div>
  );
}
