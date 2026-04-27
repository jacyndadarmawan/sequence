import React, { useEffect, useState } from 'react';
import { useStore } from './store.js';
import TopNav from './components/TopNav.jsx';
import BottomBar from './components/BottomBar.jsx';
import Landing from './components/Landing.jsx';
import Library from './components/Library.jsx';
import Sequences from './components/Sequences.jsx';
import SequenceEditor from './components/SequenceEditor.jsx';
import History from './components/History.jsx';
import SessionStartModal from './components/SessionStartModal.jsx';
import SearchPalette from './components/SearchPalette.jsx';

export default function App() {
  const sessionLoaded = useStore((s) => s.sessionLoaded);
  const [view, setView] = useState({ name: 'landing' });
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-flag the session as dirty whenever any data slice changes after load.
  // When isDirty is explicitly cleared (save / load / new session), re-baseline.
  useEffect(() => {
    let prevSlice = null;
    let prevDirty = false;
    const sliceOf = (s) => ({
      exercises: s.exercises,
      blocksLibrary: s.blocksLibrary,
      sequences: s.sequences,
      history: s.history,
      sessionName: s.sessionName,
    });
    const unsub = useStore.subscribe((s) => {
      if (!s.sessionLoaded) return;
      const slice = sliceOf(s);
      if (!prevSlice) {
        prevSlice = slice;
        prevDirty = s.isDirty;
        return;
      }
      // Transition to clean (post-save / post-load) — adopt new baseline silently.
      if (prevDirty && !s.isDirty) {
        prevSlice = slice;
        prevDirty = false;
        return;
      }
      const changed =
        prevSlice.exercises !== slice.exercises ||
        prevSlice.blocksLibrary !== slice.blocksLibrary ||
        prevSlice.sequences !== slice.sequences ||
        prevSlice.history !== slice.history ||
        prevSlice.sessionName !== slice.sessionName;
      prevSlice = slice;
      prevDirty = s.isDirty;
      if (changed && !s.isDirty) {
        useStore.setState({ isDirty: true });
        prevDirty = true;
      }
    });
    return unsub;
  }, []);

  // Warn before closing the tab/window if there are unsaved changes.
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (useStore.getState().isDirty) {
        e.preventDefault();
        // Most browsers ignore custom text and show their own dialog —
        // returnValue must be set for the prompt to appear.
        e.returnValue = 'You have unsaved changes. Save your session before leaving?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  if (!sessionLoaded) return <SessionStartModal />;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav view={view} setView={setView} openSearch={() => setSearchOpen(true)} />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-10">
        {view.name === 'landing' && <Landing setView={setView} />}
        {view.name === 'library' && <Library setView={setView} initialTab={view.tab} editExerciseId={view.editExerciseId} />}
        {view.name === 'sequences' && <Sequences setView={setView} />}
        {view.name === 'editor' && <SequenceEditor sequenceId={view.id} setView={setView} />}
        {view.name === 'history' && <History setView={setView} expandHistoryId={view.expandHistoryId} />}
      </main>
      <BottomBar />
      {searchOpen && <SearchPalette close={() => setSearchOpen(false)} setView={setView} />}
    </div>
  );
}
