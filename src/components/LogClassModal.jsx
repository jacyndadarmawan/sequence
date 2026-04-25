import React, { useEffect, useState } from 'react';
import { useStore } from '../store.js';
import { X, Star } from 'lucide-react';
import { classNames } from '../utils/file.js';

export default function LogClassModal({ close }) {
  const sequences = useStore((s) => s.sequences);
  const logClass = useStore((s) => s.logClass);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    sequenceId: '',
    client: '',
    duration: '',
    rating: 0,
    notes: '',
  });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    const seq = sequences.find((s) => s.id === form.sequenceId);
    logClass({
      date: form.date,
      sequenceId: seq?.id || '',
      sequenceTitle: seq?.title || form.client || 'Untitled class',
      client: form.client,
      duration: form.duration ? Number(form.duration) : (seq?.duration || ''),
      exerciseCount: seq ? seq.blocks.reduce((acc, b) => acc + b.items.length, 0) : 0,
      rating: form.rating,
      notes: form.notes,
    });
    close();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center p-6 bg-ink/30 backdrop-blur-sm overflow-y-auto">
      <div className="card w-full max-w-xl my-10 p-8 relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-sandsoft text-ink/60"
        >
          <X size={18} />
        </button>
        <h2 className="font-serif text-3xl">Log a class</h2>
        <p className="text-ink/55 text-sm mt-1">Capture today’s class for your history.</p>

        <div className="mt-7 space-y-5">
          <div>
            <div className="label mb-2">Date</div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set({ date: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <div className="label mb-2">Sequence</div>
            <select
              value={form.sequenceId}
              onChange={(e) => set({ sequenceId: e.target.value })}
              className="input"
            >
              <option value="">— Select a sequence —</option>
              {sequences.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || 'Untitled'}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="label mb-2">Client / Group</div>
              <input
                value={form.client}
                onChange={(e) => set({ client: e.target.value })}
                placeholder="e.g. Sarah M."
                className="input"
              />
            </div>
            <div>
              <div className="label mb-2">Duration (min)</div>
              <input
                type="number"
                min={0}
                value={form.duration}
                onChange={(e) => set({ duration: e.target.value })}
                placeholder="—"
                className="input"
              />
            </div>
          </div>
          <div>
            <div className="label mb-2">Rating</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => set({ rating: n })}
                  className="p-1"
                >
                  <Star
                    size={22}
                    className={classNames(
                      'transition',
                      n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-ink/20'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label mb-2">Notes</div>
            <textarea
              value={form.notes}
              onChange={(e) => set({ notes: e.target.value })}
              rows={4}
              placeholder="What went well? What to adjust next time?"
              className="input resize-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button onClick={close} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} className="btn-primary">
            Save class
          </button>
        </div>
      </div>
    </div>
  );
}
