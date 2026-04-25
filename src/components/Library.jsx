import React, { useMemo, useState } from 'react';
import { useStore } from '../store.js';
import { CATEGORIES, EQUIPMENT, CATEGORY_COLOR, POSITION_COLOR } from '../seed.js';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { classNames } from '../utils/file.js';
import ExerciseModal from './ExerciseModal.jsx';
import BlocksTab from './BlocksTab.jsx';

export default function Library({ initialTab }) {
  const exercises = useStore((s) => s.exercises);
  const deleteExercise = useStore((s) => s.deleteExercise);

  const [tab, setTab] = useState(initialTab || 'exercises');
  const [equip, setEquip] = useState('All Equipment');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      if (equip !== 'All Equipment' && e.equipment !== equip) return false;
      if (cat !== 'All' && e.category !== cat) return false;
      if (q) {
        const term = q.toLowerCase();
        const hay =
          `${e.name} ${e.purpose} ${(e.tags || []).join(' ')} ${e.position} ${e.category}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [exercises, equip, cat, q]);

  const groupedByCategory = useMemo(() => {
    const groups = {};
    for (const cat of CATEGORIES) groups[cat] = [];
    for (const e of filtered) {
      if (!groups[e.category]) groups[e.category] = [];
      groups[e.category].push(e);
    }
    return groups;
  }, [filtered]);

  const onAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const onEdit = (ex) => {
    setEditing(ex);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="serif-display">Library</h1>
          <p className="text-ink/50 mt-1">{exercises.length} exercises</p>
        </div>
        {tab === 'exercises' ? (
          <button onClick={onAdd} className="btn-primary">
            <Plus size={16} /> Add Exercise
          </button>
        ) : null}
      </div>

      <div className="mt-8 inline-flex p-1 bg-sandsoft/60 rounded-full">
        <button
          onClick={() => setTab('exercises')}
          className={classNames(
            'px-5 py-1.5 rounded-full text-sm transition',
            tab === 'exercises' ? 'bg-card shadow-soft' : 'text-ink/55 hover:text-ink'
          )}
        >
          Exercises
        </button>
        <button
          onClick={() => setTab('blocks')}
          className={classNames(
            'px-5 py-1.5 rounded-full text-sm transition',
            tab === 'blocks' ? 'bg-card shadow-soft' : 'text-ink/55 hover:text-ink'
          )}
        >
          Blocks
        </button>
      </div>

      {tab === 'exercises' ? (
        <>
          <div className="mt-8 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search exercises or tags..."
              className="input pl-11"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['All Equipment', ...EQUIPMENT].map((eq) => (
              <button
                key={eq}
                onClick={() => setEquip(eq)}
                className={classNames('chip', equip === eq ? 'bg-sage text-sage-ink border-sage' : '')}
              >
                {eq === 'All Equipment' ? 'All Equipment' : eq}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={classNames('chip', cat === c ? 'chip-active' : '')}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {CATEGORIES.map((c) => {
              const items = groupedByCategory[c];
              if (!items || items.length === 0) return null;
              return (
                <section key={c}>
                  <h3 className="font-serif italic text-ink/55 text-base mb-4">{c}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((e) => (
                      <ExerciseCard key={e.id} ex={e} onEdit={() => onEdit(e)} onDelete={() => deleteExercise(e.id)} />
                    ))}
                  </div>
                </section>
              );
            })}
            {filtered.length === 0 && (
              <div className="empty-dashed py-16 text-center text-ink/50">
                Nothing matches those filters.
              </div>
            )}
          </div>
        </>
      ) : (
        <BlocksTab />
      )}

      {modalOpen && <ExerciseModal close={() => setModalOpen(false)} editing={editing} />}
    </div>
  );
}

function ExerciseCard({ ex, onEdit, onDelete }) {
  const cat = CATEGORY_COLOR[ex.category] || { bg: 'bg-sandsoft', text: 'text-ink/70' };
  const pos = POSITION_COLOR[ex.position] || { bg: 'bg-sandsoft', text: 'text-ink/70' };

  return (
    <div className="card p-5 group relative">
      <div className="flex items-start justify-between gap-3">
        <div className="font-serif text-lg leading-snug truncate">{ex.name}</div>
        <span className={classNames('tag', cat.bg, cat.text, 'shrink-0')}>{ex.category}</span>
      </div>
      {ex.purpose && <p className="text-sm text-ink/65 mt-2 line-clamp-2">{ex.purpose}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ex.position && (
          <span className={classNames('tag', pos.bg, pos.text)}>{ex.position}</span>
        )}
        {ex.difficulty && <span className="tag bg-sandsoft text-ink/65">{ex.difficulty}</span>}
        {ex.equipment && <span className="tag bg-peach text-peach-ink">{ex.equipment}</span>}
      </div>
      {ex.tags?.length > 0 && (
        <div className="mt-3 text-xs text-ink/40 flex flex-wrap gap-x-3 gap-y-1">
          {ex.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
      )}
      {(ex.springs && ex.springs !== '—') || (ex.footbar && ex.footbar !== '—') ? (
        <>
          <div className="divider my-3" />
          <div className="text-xs text-ink/55 flex gap-5">
            <span>
              <span className="text-ink/40">Springs:</span> {ex.springs}
            </span>
            <span>
              <span className="text-ink/40">Footbar:</span> {ex.footbar}
            </span>
          </div>
        </>
      ) : null}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-full bg-card border border-line hover:bg-sandsoft"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-full bg-card border border-line hover:bg-mauve/40"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
