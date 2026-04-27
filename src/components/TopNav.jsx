import React, { useRef } from 'react';
import { useStore } from '../store.js';
import { downloadJSON, readJSONFile } from '../utils/file.js';
import { BookOpen, Layers, Clock, Search, Plus, Save, FolderOpen } from 'lucide-react';
import { classNames } from '../utils/file.js';

export default function TopNav({ view, setView, openSearch }) {
  const exportSession = useStore((s) => s.exportSession);
  const loadSession = useStore((s) => s.loadSession);
  const sessionName = useStore((s) => s.sessionName);
  const createSequence = useStore((s) => s.createSequence);
  const isDirty = useStore((s) => s.isDirty);
  const fileRef = useRef(null);

  const goLanding = () => setView({ name: 'landing' });

  const onSave = () => {
    const data = exportSession();
    const safe = (sessionName || 'session').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
    const stamp = new Date().toISOString().slice(0, 10);
    downloadJSON(data, `sequence-${safe}-${stamp}.json`);
  };

  const onLoad = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      if (data?.app === 'Sequence') loadSession(data);
    } catch {}
    e.target.value = '';
  };

  const onNewSequence = () => {
    const seq = createSequence({ title: '', description: '' });
    setView({ name: 'editor', id: seq.id });
  };

  const navItem = (name, label, Icon) => (
    <button
      key={name}
      onClick={() => setView({ name })}
      className={classNames(
        'nav-pill',
        view.name === name || (name === 'sequences' && view.name === 'editor')
          ? 'nav-pill-active'
          : ''
      )}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur border-b border-line">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-6">
        {/* Logo */}
        <button onClick={goLanding} className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-ink text-bg flex items-center justify-center font-serif italic">
            s
          </div>
          <span className="font-serif text-xl group-hover:opacity-80 hidden md:inline">Sequence</span>
        </button>

        {/* Nav — centered */}
        <nav className="flex items-center justify-center gap-1 overflow-x-auto">
          {navItem('library', 'Library', BookOpen)}
          {navItem('sequences', 'Sequences', Layers)}
          {navItem('history', 'History', Clock)}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={openSearch}
            className="p-2 rounded-full hover:bg-sandsoft text-ink/60 hover:text-ink transition"
            title="Search (Ctrl/Cmd+K)"
          >
            <Search size={18} />
          </button>
          <button
            onClick={onSave}
            className="btn-ghost relative px-2 md:px-3"
            title={isDirty ? 'You have unsaved changes — save now' : 'Save session to file'}
          >
            <Save size={16} />
            <span className="hidden lg:inline">Save</span>
            {isDirty && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-mauve-ink" />
            )}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-ghost px-2 md:px-3"
            title="Load session from file"
          >
            <FolderOpen size={16} />
            <span className="hidden lg:inline">Load</span>
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onLoad} />
          <button onClick={onNewSequence} className="btn-primary px-2 md:px-3">
            <Plus size={16} />
            <span className="hidden sm:inline">New Sequence</span>
          </button>
        </div>
      </div>
    </header>
  );
}
