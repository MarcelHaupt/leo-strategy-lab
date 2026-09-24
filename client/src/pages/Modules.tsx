import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useSession, moduleProgress } from '@/lib/session-store';
import { MODULE_ORDER, TRACKS } from '@/lib/types';
import { ModuleCard } from '@/components/ModuleCard';
import { sessionScore, leoComments } from '@/lib/leo-engine';
import { LeoComment } from '@/components/LeoComment';
import { ScoreRing } from '@/components/ScoreRing';
import { isModuleVisible, visibleModulesForTrack } from '@/lib/track-profiles';

export default function Modules() {
  const { state } = useSession();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (state.startedAt === 0) navigate('/');
  }, [state.startedAt, navigate]);

  const score = sessionScore(state);
  const comments = leoComments(state);

  const visibleModules = state.track
    ? visibleModulesForTrack(state.track)
    : MODULE_ORDER;
  const completed = visibleModules.filter(
    (id) => moduleProgress(state.modules[id]).status === 'done',
  ).length;
  const trackMeta = state.track ? TRACKS[state.track] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-border pb-10">
        <div className="lg:col-span-8">
          <div className="text-tag text-muted-foreground">ÜBERSICHT</div>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mt-2 tracking-tight">
            {String(visibleModules.length).padStart(2, '0')} Module.
            <br />
            <span className="italic text-primary">Ein Report.</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-xl leading-relaxed">
            Du kannst in beliebiger Reihenfolge arbeiten. Jedes Modul wird live ausgewertet und
            fließt in den finalen Strategie-Report ein.
          </p>
        </div>
        <div className="lg:col-span-4 flex items-end justify-end gap-6">
          <div className="text-right space-y-1">
            <div className="text-tag text-muted-foreground">FORTSCHRITT</div>
            <div className="font-mono text-3xl text-foreground" data-testid="text-progress">
              {String(completed).padStart(2, '0')} / {String(visibleModules.length).padStart(2, '0')}
            </div>
          </div>
          <ScoreRing score={score} label="SCORE" />
        </div>
      </div>

      {trackMeta && (
        <div className="flex items-center gap-3 -mt-6">
          <span className="font-mono text-tag text-muted-foreground">TRACK</span>
          <span className="font-mono text-tag text-primary">{trackMeta.code}</span>
          <span className="font-serif italic text-base text-foreground">{trackMeta.name}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {MODULE_ORDER.filter((id) => isModuleVisible(state.track, id)).map((id) => (
          <ModuleCard key={id} id={id} />
        ))}
      </div>

      {comments.length > 0 && (
        <div className="border-t border-border pt-10">
          <div className="text-tag text-muted-foreground mb-4">LEO LIEST MIT</div>
          <div className="space-y-3 max-w-3xl">
            {comments.map((c, i) => (
              <LeoComment key={i} item={c} />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-6 flex items-center justify-between">
        <span className="text-tag text-muted-foreground">
          Wenn du fertig bist, geht es zum Report.
        </span>
        <Link href="/report" data-testid="link-to-report">
          <a className="font-mono uppercase text-sm text-primary hover:underline">
            Zum Report →
          </a>
        </Link>
      </div>
    </div>
  );
}
