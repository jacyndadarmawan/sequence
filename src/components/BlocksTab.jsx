import React, { useState } from 'react';
import { useStore } from '../store.js';
import { Plus, Trash2, X } from 'lucide-react';

export default function BlocksTab() {
  const blocks = useStore((s) => s.blocksLibrary);
  const exercises = useStore((s) => s.exercises);
  const addSavedBlock = useStore((s) => s.addSavedBlock);
  const deleteSavedBlock = useStore((s) => s.deleteSavedBlock);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [pickedIds, setPickedIds] = useState([]);

  const exerciseById = (id) => exercises.find((e) => e.id === id);

  const submitNewBlock = () => {
    if (!name.trim()) return;
    addSavedBlock({
      name: name.trim(),
      items: pickedIds.map((id) => ({ id: `i_${Math.random().toString(36).slice(2, 8)}`, exerciseId: id, sets: 1, reps: '8' })),
    });
    setName('');
    setPickedIds([]);
    setAdding(false);
  };

  return (
    <div>
      <div className="mt-8 flex items-end justify-between">
        <p className="text-sm text-ink/55">
          {blocks.length} saved {blocks.length === 1 ? 'block' : 'blocks'}
        </p>
        <button onClick={() => setAdding(true)} className="btn-primary">
          <Plus size={16} /> Add Block
        </button>
      </div>

      {blocks.length === 0 && !adding && (
        <div className="empty-dashed py-20 text-center text-ink/55 mt-6">
          <div className="text-base">No saved blocks yet.</div>
          <button onClick={() => setAdding(true)} className="mt-3 underline text-ink hover:text-ink">
            Save your first block →
          </button>
        </div>
      )}

      {adding && (
        <div className="card p-6 mt-6 space-y-5">
          <input
            autoFocus
            placeholder="Block name (e.g. Core Block)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input font-serif text-xl py-2 border-0 border-b border-line rounded-none focus:border-ink/30 px-0"
          />
          <div>
            <div className="label mb-3">Pick exercises</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
              {exercises.map((e) => {
                const checked = pickedIds.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() =>
                      setPickedIds((p) => (checked ? p.filter((x) => x !== e.id) : [...p, e.id]))
                    }
                    className={`text-left px-3 py-2 rounded-xl2 border transition ${
                      checked ? 'bg-sage border-sage' : 'border-line hover:bg-sandsoft/50'
                    }`}
                  >
                    <div className="text-sm">{e.name}</div>
                    <div className="text-[11px] text-ink/50">{e.category} · {e.position}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setAdding(false); setName(''); setPickedIds([]); }} className="btn-ghost">
              Cancel
            </button>
            <button onClick={submitNewBlock} disabled={!name.trim()} className="btn-primary">
              Save block
            </button>
          </div>
        </div>
      )}

      {blocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {blocks.map((b) => (
            <div key={b.id} className="card p-5 group relative">
              <div className="flex items-start justify-between">
                <div className="font-serif text-lg">{b.name}</div>
                <button
                  onClick={() => deleteSavedBlock(b.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-mauve/40 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="text-xs text-ink/50 mt-1">
                {b.items.length} exercise{b.items.length === 1 ? '' : 's'}
              </div>
              <div className="divider my-3" />
              <ol className="text-sm text-ink/75 space-y-1">
                {b.items.slice(0, 6).map((it, idx) => {
                  const ex = exerciseById(it.exerciseId);
                  return (
                    <li key={it.id} className="flex justify-between gap-3">
                      <span className="truncate">
                        <span className="text-ink/40 mr-2">{idx + 1}.</span>
                        {ex?.name || 'Removed exercise'}
                      </span>
                    </li>
                  );
                })}
                {b.items.length > 6 && (
                  <li className="text-xs text-ink/40">+ {b.items.length - 6} more</li>
                )}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
