import React, { useEffect, useState } from 'react';
import { GitBranch, Circle } from 'lucide-react';
import { useStore } from '../store.js';

const BRANCH = typeof __GIT_BRANCH__ !== 'undefined' ? __GIT_BRANCH__ : '(no git)';
const VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';

export default function BottomBar() {
  const [serverOnline, setServerOnline] = useState(true);
  const [hmrConnected, setHmrConnected] = useState(true);
  const isDirty = useStore((s) => s.isDirty);
  const lastSavedAt = useStore((s) => s.lastSavedAt);

  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      try {
        const res = await fetch(`${window.location.origin}/?_ping=${Date.now()}`, {
          method: 'HEAD',
          cache: 'no-store',
        });
        if (!cancelled) setServerOnline(res.ok || res.status < 500);
      } catch {
        if (!cancelled) setServerOnline(false);
      }
    };
    ping();
    const t = setInterval(ping, 8000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (import.meta.hot) {
      const onConn = () => setHmrConnected(true);
      const onDisc = () => setHmrConnected(false);
      import.meta.hot.on('vite:ws:connect', onConn);
      import.meta.hot.on('vite:ws:disconnect', onDisc);
      return () => {
        try {
          import.meta.hot.off('vite:ws:connect', onConn);
          import.meta.hot.off('vite:ws:disconnect', onDisc);
        } catch {}
      };
    }
  }, []);

  const dotColor = serverOnline ? 'fill-sage-ink text-sage-ink' : 'fill-mauve-ink text-mauve-ink';
  const status = serverOnline
    ? hmrConnected
      ? 'online · HMR ready'
      : 'online · HMR disconnected'
    : 'offline';

  return (
    <footer className="border-t border-line bg-bg/90 backdrop-blur text-[11px] tracking-wide">
      <div className="max-w-[1400px] mx-auto px-8 h-9 flex items-center justify-between text-ink/55">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <GitBranch size={12} /> <span className="font-medium">{BRANCH}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Circle size={8} className={dotColor} />
            <span>vite dev server · {status}</span>
          </span>
          <span className="hidden md:inline text-ink/30">v{VERSION}</span>
        </div>
        <div className="flex items-center gap-5">
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 text-mauve-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-mauve-ink animate-pulse" />
              Unsaved changes
            </span>
          ) : lastSavedAt ? (
            <span className="text-ink/40">
              Saved {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : null}
          <div className="text-ink/50">© {new Date().getFullYear()} Jacynda Darmawan</div>
        </div>
      </div>
    </footer>
  );
}
