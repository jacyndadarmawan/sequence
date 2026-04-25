import React, { useRef, useState } from 'react';
import { useStore } from '../store.js';
import { readJSONFile } from '../utils/file.js';
import { Sparkles, FolderOpen, FileUp, AlertCircle } from 'lucide-react';

export default function SessionStartModal() {
  const startNewSession = useStore((s) => s.startNewSession);
  const loadSession = useStore((s) => s.loadSession);
  const fileRef = useRef(null);
  const [err, setErr] = useState('');

  const onFile = async (e) => {
    setErr('');
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      if (data?.app !== 'Sequence') {
        setErr('That file does not look like a Sequence session.');
        return;
      }
      loadSession(data);
    } catch (err) {
      setErr('Could not read that file. Make sure it is a valid Sequence JSON file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm p-6">
      <div className="card w-full max-w-2xl p-10 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-ink text-bg flex items-center justify-center font-serif italic">
            s
          </div>
          <span className="font-serif text-xl">Sequence</span>
        </div>
        <h1 className="font-serif text-4xl leading-tight mt-6">
          Welcome.
          <br />
          <em className="text-muted not-italic font-serif italic">How would you like to begin?</em>
        </h1>
        <p className="text-ink/60 mt-3 max-w-md">
          Sequence is a calm planning space for your Pilates classes. Start fresh, or pick up where you left
          off.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <button
            onClick={startNewSession}
            className="card text-left p-6 hover:bg-sandsoft/40 transition group"
          >
            <div className="w-10 h-10 rounded-xl2 bg-sandsoft flex items-center justify-center mb-4">
              <Sparkles size={18} className="text-ink/70" />
            </div>
            <div className="font-serif text-xl">Start a new session</div>
            <div className="text-sm text-ink/60 mt-1">
              Begin with a seed library and your first blank canvas.
            </div>
            <div className="text-sm mt-4 text-ink group-hover:underline">Begin →</div>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="card text-left p-6 hover:bg-sandsoft/40 transition group"
          >
            <div className="w-10 h-10 rounded-xl2 bg-sage flex items-center justify-center mb-4">
              <FolderOpen size={18} className="text-sage-ink" />
            </div>
            <div className="font-serif text-xl">Load a saved session</div>
            <div className="text-sm text-ink/60 mt-1">
              Open a <code className="text-xs">.json</code> file you previously exported.
            </div>
            <div className="text-sm mt-4 text-ink group-hover:underline flex items-center gap-1">
              <FileUp size={14} /> Choose file →
            </div>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
          </button>
        </div>

        {err && (
          <div className="mt-6 flex items-center gap-2 text-sm text-mauve-ink bg-mauve/40 border border-mauve px-4 py-3 rounded-xl2">
            <AlertCircle size={16} /> {err}
          </div>
        )}

        <div className="mt-10 text-xs text-ink/40 italic">
          “Build sequences with intention. Every block in its right place.”
        </div>
      </div>
    </div>
  );
}
