import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useSession } from '@/lib/session-store';
import { sessionScore } from '@/lib/leo-engine';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { TRACKS, type TrackId } from '@/lib/types';

export function SessionHeader() {
  const { state, dispatch } = useSession();
  const [location] = useLocation();
  const score = sessionScore(state);
  const hasSession = state.startedAt > 0;
  const [trackOpen, setTrackOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!trackOpen) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setTrackOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTrackOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [trackOpen]);

  const trackMeta = state.track ? TRACKS[state.track] : null;

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" data-testid="link-home">
          <a className="block">
            <Logo className="h-9 w-auto text-foreground" />
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-tag">
          <Link href="/modules" data-testid="link-modules">
            <a
              className={`px-3 py-2 hover-elevate ${
                location.startsWith('/modules') || location.startsWith('/module/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Module
            </a>
          </Link>
          <Link href="/report" data-testid="link-report">
            <a
              className={`px-3 py-2 hover-elevate ${
                location.startsWith('/report') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Report
            </a>
          </Link>
          <Link href="/tiny" data-testid="link-tiny">
            <a
              className={`px-3 py-2 hover-elevate ${
                location.startsWith('/tiny') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Tiny
            </a>
          </Link>
          <Link href="/trends" data-testid="link-trends">
            <a
              className={`px-3 py-2 hover-elevate ${
                location.startsWith('/trends') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Trends
            </a>
          </Link>
          <Link href="/about" data-testid="link-about">
            <a
              className={`px-3 py-2 hover-elevate ${
                location.startsWith('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              About
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {hasSession && trackMeta && (
            <div className="relative" ref={popoverRef}>
              <button
                type="button"
                onClick={() => setTrackOpen((v) => !v)}
                className="font-mono text-xs uppercase tracking-wider border border-border px-2 py-1 text-foreground hover-elevate"
                data-testid="button-track-switcher"
                aria-haspopup="true"
                aria-expanded={trackOpen}
                title="Track wechseln"
              >
                <span className="text-muted-foreground">TRACK · </span>
                <span className="text-primary">{trackMeta.name}</span>
              </button>
              {trackOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 border border-border bg-background shadow-lg z-50"
                  data-testid="popover-track"
                >
                  <div className="p-3 border-b border-border">
                    <div className="font-mono text-tag text-muted-foreground">TRACK WECHSELN</div>
                    <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                      Beim Wechsel bleiben deine Antworten erhalten. Manche Fragen werden ausgeblendet, andere kommen dazu.
                    </p>
                  </div>
                  <ul className="divide-y divide-border">
                    {(Object.values(TRACKS) as Array<typeof TRACKS[TrackId]>).map((t) => {
                      const isActive = t.id === state.track;
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch({ type: 'setTrack', track: t.id });
                              setTrackOpen(false);
                            }}
                            className={`w-full text-left p-3 hover-elevate ${
                              isActive ? 'bg-card' : ''
                            }`}
                            data-testid={`button-track-switch-${t.id}`}
                          >
                            <div className="flex items-baseline justify-between gap-3">
                              <span
                                className={`font-mono text-tag ${
                                  isActive ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              >
                                {t.code}
                              </span>
                              {isActive && (
                                <span className="font-mono text-tag text-primary">AKTIV</span>
                              )}
                            </div>
                            <div className="font-serif text-lg mt-1">{t.name}</div>
                            <div className="font-serif italic text-xs text-muted-foreground">
                              {t.subtitle}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
          {hasSession && (
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <div className="text-tag text-muted-foreground" data-testid="text-client-name">
                {state.clientName || 'unbekannt'}
              </div>
              <div className="font-mono text-xs text-foreground" data-testid="text-project-name">
                {state.projectName || '—'}
              </div>
            </div>
          )}
          {hasSession && (
            <div
              className="font-mono text-xs border border-border px-2 py-1 text-foreground"
              data-testid="badge-score"
              title="Social-First-Score"
            >
              {score} / 100
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
