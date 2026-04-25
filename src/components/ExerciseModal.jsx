import React, { useEffect, useState } from 'react';
import { useStore } from '../store.js';
import { CATEGORIES, POSITIONS, DIFFICULTIES, EQUIPMENT, SPRING_OPTIONS, FOOTBAR_OPTIONS } from '../seed.js';
import { X } from 'lucide-react';
import { classNames } from '../utils/file.js';

const blank = {
  name: '',
  category: '',
  position: '',
  difficulty: '',
  equipment: '',
  purpose: '',
  tags: [],
  notes: '',
  springs: '—',
  footbar: '—',
};

export default function ExerciseModal({ close, editing, onCreated }) {
  const addExercise = useStore((s) => s.addExercise);
  const updateExercise = useStore((s) => s.updateExercise);
  const [form, setForm] = useState(editing ? { ...blank, ...editing } : blank);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '');
    if (!t) return;
    if (!form.tags.includes(t)) set({ tags: [...form.tags, t] });
    setTagInput('');
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateExercise(editing.id, form);
      close();
    } else {
      const created = addExercise(form);
      if (onCreated) onCreated(created);
      close();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center p-6 bg-ink/30 backdrop-blur-sm overflow-y-auto">
      <div className="card w-full max-w-2xl my-10 p-8 relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-sandsoft text-ink/60"
        >
          <X size={18} />
        </button>
        <h2 className="font-serif text-3xl">{editing ? 'Edit Exercise' : 'New Exercise'}</h2>

        <div className="mt-8 space-y-7">
          <Field label="Exercise Name *">
            <input
              autoFocus
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="e.g. Hundred"
              className="input"
            />
          </Field>

          <PillField label="Category" options={CATEGORIES} value={form.category} onChange={(v) => set({ category: v })} />
          <PillField label="Position" options={POSITIONS} value={form.position} onChange={(v) => set({ position: v })} />
          <PillField label="Difficulty" options={DIFFICULTIES} value={form.difficulty} onChange={(v) => set({ difficulty: v })} />
          <PillField label="Equipment" options={EQUIPMENT} value={form.equipment} onChange={(v) => set({ equipment: v })} />

          <Field label="Purpose">
            <input
              value={form.purpose}
              onChange={(e) => set({ purpose: e.target.value })}
              placeholder="e.g. Warm the spine, activate deep core"
              className="input"
            />
          </Field>

          <Field label="Tags">
            <div className="flex flex-wrap gap-2 items-center">
              {form.tags.map((t) => (
                <span key={t} className="chip chip-soft inline-flex items-center gap-1">
                  #{t}
                  <button
                    onClick={() => set({ tags: form.tags.filter((x) => x !== t) })}
                    className="text-ink/40 hover:text-ink"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
                placeholder="Add tag, press Enter"
                className="input-bare text-sm py-1"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Springs">
              <select
                value={form.springs}
                onChange={(e) => set({ springs: e.target.value })}
                className="input"
              >
                {SPRING_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Footbar">
              <select
                value={form.footbar}
                onChange={(e) => set({ footbar: e.target.value })}
                className="input"
              >
                {FOOTBAR_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => set({ notes: e.target.value })}
              rows={3}
              placeholder="Cues, contraindications, modifications..."
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button onClick={close} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!form.name.trim()}
            className={classNames('btn-primary', !form.name.trim() && 'opacity-50 cursor-not-allowed')}
          >
            {editing ? 'Save changes' : 'Create exercise'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="label mb-3">{label}</div>
      {children}
    </div>
  );
}

function PillField({ label, options, value, onChange }) {
  return (
    <div>
      <div className="label mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? '' : opt)}
            className={classNames('chip', value === opt ? 'chip-active' : '')}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
