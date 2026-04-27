import React, { useMemo, useState } from 'react';
import { useStore } from '../store.js';
import { CATEGORIES, SIDES_OPTIONS } from '../seed.js';
import {
  ArrowLeft, Plus, Save, Trash2, ChevronDown, ChevronUp, GripVertical, Search, X,
  FileText, ChevronRight,
} from 'lucide-react';
import { classNames } from '../utils/file.js';
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, arrayMove, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ExerciseModal from './ExerciseModal.jsx';

export default function SequenceEditor({ sequenceId, setView }) {
  const seq = useStore((s) => s.sequences.find((q) => q.id === sequenceId));
  const exercises = useStore((s) => s.exercises);
  const update = useStore((s) => s.updateSequence);
  const addBlock = useStore((s) => s.addBlockToSequence);
  const reorderBlocks = useStore((s) => s.reorderBlocks);
  const reorderItems = useStore((s) => s.reorderItems);
  const moveItemToBlock = useStore((s) => s.moveItemToBlock);

  const [activeBlockId, setActiveBlockId] = useState(null);
  const [exModal, setExModal] = useState({ open: false, initialName: '' });
  const [draggingId, setDraggingId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  if (!seq) {
    return (
      <div className="text-center py-20 text-ink/50">
        Sequence not found.{' '}
        <button className="underline" onClick={() => setView({ name: 'sequences' })}>
          Back
        </button>
      </div>
    );
  }

  const handleAddBlock = (name) => {
    const newId = addBlock(seq.id, name);
    setActiveBlockId(newId);
  };

  const handleDragStart = ({ active }) => setDraggingId(active.id);
  const handleDragCancel = () => setDraggingId(null);

  // Single DndContext handles both block reorder and item move (including cross-block)
  const handleDragEnd = ({ active, over }) => {
    setDraggingId(null);
    if (!over || active.id === over.id) return;
    const activeId = active.id;
    const overId = over.id;

    const isActiveBlock = seq.blocks.some((b) => b.id === activeId);

    if (isActiveBlock) {
      // Resolve over target to a block id
      const overBlockId =
        seq.blocks.some((b) => b.id === overId)
          ? overId
          : seq.blocks.find((b) => b.items.some((i) => i.id === overId))?.id;
      if (!overBlockId) return;
      const ids = seq.blocks.map((b) => b.id);
      const oldIdx = ids.indexOf(activeId);
      const newIdx = ids.indexOf(overBlockId);
      if (oldIdx !== -1 && newIdx !== -1) reorderBlocks(seq.id, arrayMove(ids, oldIdx, newIdx));
      return;
    }

    // Dragging an item
    const sourceBlock = seq.blocks.find((b) => b.items.some((i) => i.id === activeId));
    if (!sourceBlock) return;

    const isOverBlock = seq.blocks.some((b) => b.id === overId);
    const targetBlockId = isOverBlock
      ? overId
      : seq.blocks.find((b) => b.items.some((i) => i.id === overId))?.id;
    if (!targetBlockId) return;

    if (sourceBlock.id === targetBlockId) {
      if (!isOverBlock) {
        const ids = sourceBlock.items.map((i) => i.id);
        const oldIdx = ids.indexOf(activeId);
        const newIdx = ids.indexOf(overId);
        if (oldIdx !== -1 && newIdx !== -1) reorderItems(seq.id, sourceBlock.id, arrayMove(ids, oldIdx, newIdx));
      }
    } else {
      moveItemToBlock(seq.id, sourceBlock.id, targetBlockId, activeId, isOverBlock ? null : overId);
    }
  };

  const totalExercises = seq.blocks.reduce((acc, b) => acc + b.items.filter((i) => !i.type || i.type === 'exercise').length, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <div>
        <button
          onClick={() => setView({ name: 'sequences' })}
          className="text-sm text-ink/55 hover:text-ink inline-flex items-center gap-2 mb-5"
        >
          <ArrowLeft size={14} /> All Sequences
        </button>

        <div className="card p-7">
          <input
            value={seq.title}
            onChange={(e) => update(seq.id, { title: e.target.value })}
            placeholder="Sequence title..."
            className="w-full bg-transparent font-serif text-3xl placeholder:text-muted/60 focus:outline-none"
          />
          <input
            value={seq.description}
            onChange={(e) => update(seq.id, { description: e.target.value })}
            placeholder="Intention or description..."
            className="w-full bg-transparent text-ink/60 mt-2 focus:outline-none placeholder:text-muted/60"
          />
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <label className="flex items-center gap-3">
              <span className="text-ink/55">Duration</span>
              <input
                type="number"
                min={0}
                value={seq.duration}
                onChange={(e) => update(seq.id, { duration: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="—"
                className="w-16 bg-card border border-line rounded-xl2 px-3 py-1 text-center focus:outline-none focus:border-ink/30"
              />
              <span className="text-ink/55">min</span>
            </label>
            <label className="flex items-center gap-3">
              <span className="text-ink/55">Level</span>
              <select
                value={seq.level}
                onChange={(e) => update(seq.id, { level: e.target.value })}
                className="bg-card border border-line rounded-xl2 px-3 py-1 focus:outline-none focus:border-ink/30"
              >
                <option value="">—</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Mixed</option>
              </select>
            </label>
            <label className="flex items-center gap-3 ml-auto">
              <Toggle
                checked={!!seq.isTemplate}
                onChange={(v) => update(seq.id, { isTemplate: v })}
              />
              <span className="text-ink/70">Save as template</span>
            </label>
          </div>
          {seq.blocks.length > 0 && (
            <>
              <div className="divider my-5" />
              <div className="text-xs text-ink/50 flex items-center gap-5">
                <span>{seq.blocks.length} block{seq.blocks.length === 1 ? '' : 's'}</span>
                <span>{totalExercises} exercise{totalExercises === 1 ? '' : 's'}</span>
                {seq.duration ? <span>{seq.duration} min</span> : null}
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          {seq.blocks.length === 0 ? (
            <div className="empty-dashed py-16 flex flex-col items-center justify-center">
              <div className="text-ink/55">No blocks yet. Add your first block below.</div>
              <button
                onClick={() => handleAddBlock('Main Block')}
                className="btn-outline mt-5"
              >
                <Plus size={14} /> Add Block
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={seq.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-5">
                  {seq.blocks.map((b) => (
                    <BlockRow
                      key={b.id}
                      block={b}
                      seqId={seq.id}
                      activeBlockId={activeBlockId}
                      setActiveBlockId={setActiveBlockId}
                      draggingId={draggingId}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay dropAnimation={null}>
                {draggingId
                  ? (() => {
                      const dragBlock = seq.blocks.find((b) => b.id === draggingId);
                      if (dragBlock) return <BlockDragPreview block={dragBlock} />;
                      const dragItem = seq.blocks.flatMap((b) => b.items).find((i) => i.id === draggingId);
                      if (dragItem) return <ItemDragPreview item={dragItem} exercises={exercises} />;
                      return null;
                    })()
                  : null}
              </DragOverlay>
            </DndContext>
          )}

          {seq.blocks.length > 0 && (
            <button
              onClick={() => handleAddBlock('New Block')}
              className="btn-outline mt-5 w-full justify-center"
            >
              <Plus size={14} /> Add Block
            </button>
          )}
        </div>

        <div className="card p-6 mt-6">
          <div className="label mb-2">Sequence Notes</div>
          <textarea
            value={seq.notes}
            onChange={(e) => update(seq.id, { notes: e.target.value })}
            placeholder="Post-class reflections, modifications to try..."
            rows={4}
            className="w-full bg-transparent focus:outline-none resize-none placeholder:text-ink/35"
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={() => {}} className="btn-primary">
            <Save size={16} /> Save Sequence
          </button>
          <span className="text-xs text-ink/40">
            Auto-saved · last update {new Date(seq.updatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-lg">Exercise Library</h3>
            <button
              onClick={() => setExModal({ open: true, initialName: '' })}
              className="text-xs text-ink/60 hover:text-ink inline-flex items-center gap-1"
            >
              <Plus size={12} /> New
            </button>
          </div>
          <div className="text-xs text-ink/50 mt-1">
            {activeBlockId
              ? <>Adding to: <span className="text-ink">{seq.blocks.find((b) => b.id === activeBlockId)?.name}</span></>
              : 'Select a block first'}
          </div>
          <LibraryPicker
            seqId={seq.id}
            activeBlockId={activeBlockId}
            onCreateInline={(name) => setExModal({ open: true, initialName: name })}
          />
        </div>
      </aside>

      {exModal.open && (
        <ExerciseModal
          close={() => setExModal({ open: false, initialName: '' })}
          editing={null}
          initialName={exModal.initialName}
          onCreated={(ex) => {
            if (activeBlockId) {
              useStore.getState().addItemToBlock(seq.id, activeBlockId, ex.id);
            }
          }}
        />
      )}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={classNames(
        'w-10 h-6 rounded-full p-0.5 transition',
        checked ? 'bg-ink' : 'bg-line'
      )}
    >
      <span
        className={classNames(
          'block w-5 h-5 rounded-full bg-card transition',
          checked ? 'translate-x-4' : ''
        )}
      />
    </button>
  );
}

function BlockRow({ block, seqId, activeBlockId, setActiveBlockId, draggingId }) {
  const updateBlock = useStore((s) => s.updateBlock);
  const deleteBlock = useStore((s) => s.deleteBlock);
  const addTextToBlock = useStore((s) => s.addTextToBlock);
  const [collapsed, setCollapsed] = useState(false);
  const isActive = activeBlockId === block.id;

  const sortable = useSortable({ id: block.id });
  const style = { transform: CSS.Translate.toString(sortable.transform), transition: sortable.transition };

  const exerciseCount = block.items.filter((i) => !i.type || i.type === 'exercise').length;
  const isBeingDragged = draggingId === block.id;

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      onClick={() => setActiveBlockId(block.id)}
      className={classNames(
        'card p-5 transition cursor-pointer',
        isActive ? 'ring-1 ring-ink/15' : '',
        isBeingDragged ? 'opacity-0' : ''
      )}
    >
      <div className="flex items-center gap-3">
        <button
          {...sortable.attributes}
          {...sortable.listeners}
          className="text-ink/35 hover:text-ink/70 cursor-grab active:cursor-grabbing touch-none"
          onClick={(e) => e.stopPropagation()}
          title="Drag block"
        >
          <GripVertical size={16} />
        </button>
        <input
          value={block.name}
          onChange={(e) => updateBlock(seqId, block.id, { name: e.target.value })}
          className="font-serif text-lg bg-transparent focus:outline-none flex-1"
          onClick={() => setActiveBlockId(block.id)}
        />
        <span className="text-xs text-ink/50">{exerciseCount} exercise{exerciseCount === 1 ? '' : 's'}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setCollapsed((c) => !c); }}
          className="p-1.5 rounded-full hover:bg-sandsoft text-ink/55"
        >
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); deleteBlock(seqId, block.id); }}
          className="p-1.5 rounded-full hover:bg-mauve/40 text-ink/55"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 ml-7" onClick={(e) => e.stopPropagation()}>
          {block.items.length === 0 ? (
            <div className="text-xs text-ink/40 italic py-3">
              Empty block — click an exercise in the library, or add a note below.
            </div>
          ) : (
            <SortableContext items={block.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-1.5">
                {block.items.map((it) =>
                  it.type === 'text' ? (
                    <TextItemRow key={it.id} item={it} seqId={seqId} blockId={block.id} />
                  ) : (
                    <ItemRow key={it.id} item={it} seqId={seqId} blockId={block.id} />
                  )
                )}
              </ul>
            </SortableContext>
          )}
          <button
            onClick={() => addTextToBlock(seqId, block.id)}
            className="mt-3 text-xs text-ink/45 hover:text-ink inline-flex items-center gap-1.5 transition"
          >
            <FileText size={12} /> Add note
          </button>
        </div>
      )}
    </div>
  );
}

function ItemRow({ item, seqId, blockId }) {
  const exercise = useStore((s) => s.exercises.find((e) => e.id === item.exerciseId));
  const updateItem = useStore((s) => s.updateItem);
  const removeItem = useStore((s) => s.removeItem);
  const sortable = useSortable({ id: item.id });
  const style = { transform: CSS.Translate.toString(sortable.transform), transition: sortable.transition };
  const [expanded, setExpanded] = useState(false);

  return (
    <li
      ref={sortable.setNodeRef}
      style={style}
      className={classNames(
        'group bg-bg/40 hover:bg-sandsoft/40 rounded-xl2 border border-transparent hover:border-line select-none',
        sortable.isDragging ? 'opacity-0' : ''
      )}
    >
      {/* Compact row */}
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          {...sortable.attributes}
          {...sortable.listeners}
          className="text-ink/30 hover:text-ink/70 cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical size={14} />
        </button>
        <div
          className="flex-1 text-sm truncate cursor-pointer"
          onClick={() => setExpanded((v) => !v)}
        >
          {exercise?.name || <span className="text-ink/40 italic">Removed exercise</span>}
        </div>
        <input
          type="number"
          min={1}
          value={item.sets}
          onChange={(e) => updateItem(seqId, blockId, item.id, { sets: Number(e.target.value || 1) })}
          className="w-10 text-right text-xs bg-transparent focus:outline-none text-ink/60"
          title="Sets"
        />
        <span className="text-xs text-ink/40">×</span>
        <input
          value={item.reps}
          onChange={(e) => updateItem(seqId, blockId, item.id, { reps: e.target.value })}
          className="w-20 text-xs bg-transparent focus:outline-none text-ink/60"
          placeholder="reps"
        />
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-ink/30 hover:text-ink/70 transition"
          title="More details"
        >
          <ChevronRight size={13} className={classNames('transition', expanded ? 'rotate-90' : '')} />
        </button>
        <button
          onClick={() => removeItem(seqId, blockId, item.id)}
          className="opacity-0 group-hover:opacity-100 text-ink/40 hover:text-mauve-ink"
        >
          <X size={14} />
        </button>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="px-9 pb-3 space-y-2.5 border-t border-line/50 pt-2.5">
          {/* Side */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-ink/45 w-16">Side</span>
            <div className="flex flex-wrap gap-1">
              {SIDES_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateItem(seqId, blockId, item.id, { side: item.side === s ? '' : s })}
                  className={classNames(
                    'px-2 py-0.5 rounded-full text-[11px] border transition',
                    item.side === s ? 'bg-ink text-bg border-ink' : 'border-line text-ink/55 hover:bg-sandsoft'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {/* Variation */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-ink/45 w-16">Variation</span>
            <input
              value={item.variation || ''}
              onChange={(e) => updateItem(seqId, blockId, item.id, { variation: e.target.value })}
              placeholder="e.g. with rotation"
              className="flex-1 text-xs bg-transparent focus:outline-none border-b border-line/60 focus:border-ink/30 pb-0.5"
            />
          </div>
          {/* Note */}
          <div className="flex items-start gap-3">
            <span className="text-[11px] text-ink/45 w-16 pt-0.5">Note</span>
            <textarea
              value={item.note || ''}
              onChange={(e) => updateItem(seqId, blockId, item.id, { note: e.target.value })}
              placeholder="Cue, modification..."
              rows={2}
              className="flex-1 text-xs bg-transparent focus:outline-none resize-none border-b border-line/60 focus:border-ink/30"
            />
          </div>
        </div>
      )}
    </li>
  );
}

function TextItemRow({ item, seqId, blockId }) {
  const updateItem = useStore((s) => s.updateItem);
  const removeItem = useStore((s) => s.removeItem);
  const sortable = useSortable({ id: item.id });
  const style = { transform: CSS.Translate.toString(sortable.transform), transition: sortable.transition };

  return (
    <li
      ref={sortable.setNodeRef}
      style={style}
      className={classNames(
        'group flex items-start gap-2 bg-wheat/20 rounded-xl2 px-3 py-2 border border-wheat/50 select-none',
        sortable.isDragging ? 'opacity-0' : ''
      )}
    >
      <button
        {...sortable.attributes}
        {...sortable.listeners}
        className="text-ink/30 hover:text-ink/70 cursor-grab active:cursor-grabbing shrink-0 mt-0.5 touch-none"
      >
        <GripVertical size={14} />
      </button>
      <FileText size={13} className="text-ink/35 shrink-0 mt-0.5" />
      <textarea
        value={item.content || ''}
        onChange={(e) => updateItem(seqId, blockId, item.id, { content: e.target.value })}
        placeholder="Transition, cue, or note..."
        rows={2}
        className="flex-1 text-sm bg-transparent focus:outline-none resize-none placeholder:text-ink/35"
      />
      <button
        onClick={() => removeItem(seqId, blockId, item.id)}
        className="opacity-0 group-hover:opacity-100 text-ink/40 hover:text-mauve-ink shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </li>
  );
}

function LibraryPicker({ seqId, activeBlockId, onCreateInline }) {
  const exercises = useStore((s) => s.exercises);
  const addItem = useStore((s) => s.addItemToBlock);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const cats = Array.isArray(e.category) ? e.category : [e.category];
      if (cat !== 'All' && !cats.includes(cat)) return false;
      if (q) {
        const term = q.toLowerCase();
        if (!`${e.name} ${(e.tags || []).join(' ')} ${e.position}`.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  }, [exercises, q, cat]);

  const onAdd = (id) => {
    if (!activeBlockId) return;
    addItem(seqId, activeBlockId, id);
  };

  const showCreateInline =
    q.trim().length > 0 &&
    !filtered.some((e) => e.name.toLowerCase() === q.trim().toLowerCase());

  return (
    <div className="mt-4">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find exercise..."
          className="w-full bg-card border border-line rounded-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-ink/30"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={classNames(
              'px-2.5 py-0.5 rounded-full text-[11px] border',
              cat === c ? 'bg-ink text-bg border-ink' : 'border-line text-ink/65 hover:bg-sandsoft'
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {showCreateInline && (
        <button
          onClick={() => onCreateInline(q.trim())}
          className="w-full text-left mt-3 px-3 py-2 rounded-xl2 bg-sage/40 border border-sage hover:bg-sage transition text-sm"
        >
          <span className="text-sage-ink font-medium">+ Create &amp; add</span>{' '}
          <span className="text-ink/60">"{q}"</span>
        </button>
      )}
      <div className="mt-3 max-h-[440px] overflow-y-auto pr-1 -mr-1 space-y-2">
        {filtered.length === 0 && !showCreateInline && (
          <div className="text-xs text-ink/40 italic">No matches.</div>
        )}
        {filtered.map((e) => {
          const cats = Array.isArray(e.category) ? e.category : [e.category];
          return (
            <button
              key={e.id}
              onClick={() => onAdd(e.id)}
              disabled={!activeBlockId}
              className={classNames(
                'w-full text-left px-3 py-2 rounded-xl2 border border-transparent hover:bg-sandsoft/50 hover:border-line transition',
                !activeBlockId && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="text-sm">{e.name}</div>
              <div className="text-[11px] text-ink/50 mt-0.5">
                {cats.join(', ')} · {e.position}
              </div>
              {e.springs && e.springs !== '—' && e.springs !== '' && (
                <div className="text-[11px] text-ink/45 mt-1 inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-300/60 inline-block" /> {e.springs} · footbar: {e.footbar}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BlockDragPreview({ block }) {
  const exerciseCount = block.items.filter((i) => !i.type || i.type === 'exercise').length;
  return (
    <div className="card p-5 shadow-xl opacity-95 cursor-grabbing">
      <div className="flex items-center gap-3">
        <GripVertical size={16} className="text-ink/35" />
        <span className="font-serif text-lg flex-1">{block.name}</span>
        <span className="text-xs text-ink/50">{exerciseCount} exercise{exerciseCount === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
}

function ItemDragPreview({ item, exercises }) {
  const exercise = exercises.find((e) => e.id === item.exerciseId);
  if (item.type === 'text') {
    return (
      <div className="flex items-start gap-2 bg-wheat/20 rounded-xl2 px-3 py-2 border border-wheat/50 shadow-xl opacity-95 cursor-grabbing">
        <GripVertical size={14} className="text-ink/30 shrink-0 mt-0.5" />
        <FileText size={13} className="text-ink/35 shrink-0 mt-0.5" />
        <span className="text-sm text-ink/60 truncate">{item.content || 'Note'}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-bg/40 rounded-xl2 border border-line shadow-xl opacity-95 cursor-grabbing">
      <GripVertical size={14} className="text-ink/30 shrink-0" />
      <span className="flex-1 text-sm truncate">{exercise?.name || 'Exercise'}</span>
      <span className="text-xs text-ink/40">{item.sets} × {item.reps}</span>
    </div>
  );
}
