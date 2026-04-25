import { create } from 'zustand';
import { seedExercises, seedSequences, seedHistory } from './seed.js';

const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const emptyState = {
  sessionLoaded: false,
  sessionName: '',
  exercises: [],
  blocksLibrary: [],
  sequences: [],
  history: [],
  isDirty: false,
  lastSavedAt: null,
};

const seededState = () => ({
  sessionLoaded: true,
  sessionName: 'New Session',
  exercises: seedExercises,
  blocksLibrary: [],
  sequences: seedSequences,
  history: seedHistory,
  isDirty: false,
  lastSavedAt: null,
});

export const useStore = create((set, get) => ({
  ...emptyState,

  startNewSession: () => set({ ...seededState() }),

  loadSession: (data) => {
    set({
      sessionLoaded: true,
      sessionName: data.sessionName || 'Loaded Session',
      exercises: data.exercises || [],
      blocksLibrary: data.blocksLibrary || [],
      sequences: data.sequences || [],
      history: data.history || [],
      isDirty: false,
      lastSavedAt: null,
    });
  },

  exportSession: () => {
    const s = get();
    const payload = {
      app: 'Sequence',
      version: '0.1.0',
      exportedAt: new Date().toISOString(),
      sessionName: s.sessionName,
      exercises: s.exercises,
      blocksLibrary: s.blocksLibrary,
      sequences: s.sequences,
      history: s.history,
    };
    set({ isDirty: false, lastSavedAt: payload.exportedAt });
    return payload;
  },

  markClean: () => set({ isDirty: false }),

  setSessionName: (name) => set({ sessionName: name }),

  // Exercises
  addExercise: (ex) => {
    const newEx = { id: uid('e'), tags: [], notes: '', springs: '—', footbar: '—', ...ex };
    set((s) => ({ exercises: [...s.exercises, newEx] }));
    return newEx;
  },
  updateExercise: (id, patch) =>
    set((s) => ({ exercises: s.exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
  deleteExercise: (id) =>
    set((s) => ({ exercises: s.exercises.filter((e) => e.id !== id) })),

  // Blocks library (saved reusable blocks)
  addSavedBlock: (block) => {
    const nb = { id: uid('lb'), name: 'Untitled Block', items: [], createdAt: new Date().toISOString(), ...block };
    set((s) => ({ blocksLibrary: [...s.blocksLibrary, nb] }));
    return nb;
  },
  deleteSavedBlock: (id) =>
    set((s) => ({ blocksLibrary: s.blocksLibrary.filter((b) => b.id !== id) })),

  // Sequences
  createSequence: (data = {}) => {
    const seq = {
      id: uid('s'),
      title: '',
      description: '',
      duration: '',
      level: '',
      isTemplate: false,
      blocks: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    set((s) => ({ sequences: [...s.sequences, seq] }));
    return seq;
  },
  updateSequence: (id, patch) =>
    set((s) => ({
      sequences: s.sequences.map((q) =>
        q.id === id ? { ...q, ...patch, updatedAt: new Date().toISOString() } : q
      ),
    })),
  deleteSequence: (id) =>
    set((s) => ({ sequences: s.sequences.filter((q) => q.id !== id) })),
  duplicateSequence: (id) => {
    const orig = get().sequences.find((q) => q.id === id);
    if (!orig) return;
    const copy = {
      ...orig,
      id: uid('s'),
      title: `${orig.title} (copy)`,
      isTemplate: false,
      blocks: orig.blocks.map((b) => ({
        ...b,
        id: uid('b'),
        items: b.items.map((it) => ({ ...it, id: uid('i') })),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ sequences: [copy, ...s.sequences] }));
    return copy;
  },

  // Block ops within a sequence
  addBlockToSequence: (seqId, name = 'New Block') =>
    set((s) => ({
      sequences: s.sequences.map((q) =>
        q.id === seqId
          ? {
              ...q,
              blocks: [...q.blocks, { id: uid('b'), name, items: [] }],
              updatedAt: new Date().toISOString(),
            }
          : q
      ),
    })),
  updateBlock: (seqId, blockId, patch) =>
    set((s) => ({
      sequences: s.sequences.map((q) =>
        q.id === seqId
          ? {
              ...q,
              blocks: q.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
              updatedAt: new Date().toISOString(),
            }
          : q
      ),
    })),
  deleteBlock: (seqId, blockId) =>
    set((s) => ({
      sequences: s.sequences.map((q) =>
        q.id === seqId
          ? { ...q, blocks: q.blocks.filter((b) => b.id !== blockId), updatedAt: new Date().toISOString() }
          : q
      ),
    })),
  reorderBlocks: (seqId, ids) =>
    set((s) => ({
      sequences: s.sequences.map((q) => {
        if (q.id !== seqId) return q;
        const map = new Map(q.blocks.map((b) => [b.id, b]));
        return { ...q, blocks: ids.map((id) => map.get(id)).filter(Boolean), updatedAt: new Date().toISOString() };
      }),
    })),

  // Exercise items in a block
  addItemToBlock: (seqId, blockId, exerciseId) =>
    set((s) => ({
      sequences: s.sequences.map((q) =>
        q.id === seqId
          ? {
              ...q,
              blocks: q.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, items: [...b.items, { id: uid('i'), exerciseId, sets: 1, reps: '8' }] }
                  : b
              ),
              updatedAt: new Date().toISOString(),
            }
          : q
      ),
    })),
  removeItem: (seqId, blockId, itemId) =>
    set((s) => ({
      sequences: s.sequences.map((q) =>
        q.id === seqId
          ? {
              ...q,
              blocks: q.blocks.map((b) =>
                b.id === blockId ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b
              ),
              updatedAt: new Date().toISOString(),
            }
          : q
      ),
    })),
  updateItem: (seqId, blockId, itemId, patch) =>
    set((s) => ({
      sequences: s.sequences.map((q) =>
        q.id === seqId
          ? {
              ...q,
              blocks: q.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, items: b.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
                  : b
              ),
              updatedAt: new Date().toISOString(),
            }
          : q
      ),
    })),
  reorderItems: (seqId, blockId, ids) =>
    set((s) => ({
      sequences: s.sequences.map((q) => {
        if (q.id !== seqId) return q;
        return {
          ...q,
          blocks: q.blocks.map((b) => {
            if (b.id !== blockId) return b;
            const map = new Map(b.items.map((i) => [i.id, i]));
            return { ...b, items: ids.map((id) => map.get(id)).filter(Boolean) };
          }),
          updatedAt: new Date().toISOString(),
        };
      }),
    })),

  // History
  logClass: (entry) => {
    const e = {
      id: uid('h'),
      date: new Date().toISOString().slice(0, 10),
      sequenceId: '',
      sequenceTitle: '',
      client: '',
      duration: '',
      exerciseCount: 0,
      rating: 0,
      notes: '',
      ...entry,
    };
    set((s) => ({ history: [e, ...s.history] }));
    return e;
  },
  deleteHistory: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
}));
