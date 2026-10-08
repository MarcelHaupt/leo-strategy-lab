import { useState } from 'react';
import { Link } from 'wouter';
import { useSession } from '@/lib/session-store';
import { TrendCard } from '@/components/TrendCard';
import { activeSignals, RADAR_SOURCES, TREND_DOMAINS, type TrendDomain } from '@/lib/trends';
import { sessionTrends, tinyTrends } from '@/lib/trend-context';

export default function Trends() {
  const { state } = useSession();
  const [domain, setDomain] = useState<TrendDomain | 'alle'>('alle');

  const signals = activeSignals();
  const visible = domain === 'alle' ? signals : signals.filter((s) => s.domain === domain);
  const counts = signals.reduce<Record<string, number>>((acc, s) => {
    acc[s.domain] = (acc[s.domain] ?? 0) + 1;
    return acc;
  }, {});

  // Treffer für das aktuelle Projekt: lange Session hat Vorrang, sonst Tiny
  const hasSession = state.startedAt > 0;
  const hasTiny = !!(state.tiny.topic || state.tiny.audience || state.tiny.problemIssue);
  const matches = hasSession ? sessionTrends(state, 3) : hasTiny ? tinyTrends(state.tiny, 3) : [];

  const sources = domain === 'alle' ? RADAR_SOURCES : RADAR_SOURCES.filter((r) => r.domains.includes(domain));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">
      <div className="border-b border-border pb-10">
        <div className="text-tag text-muted-foreground">TREND-RADAR</div>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mt-2 tracking-tight">
          {signals.length} Signale.
          <br />
          <span className="italic text-primary">Keine Hypes.</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Kuratiert aus Plattform-Reports, Studien und Nischenquellen. Jedes Signal hat eine Quelle, ein Datum und
          ein Ablaufdatum. Was abgelaufen ist, fliegt automatisch raus. Trends sind Kontext, keine Strategie.
        </p>
      </div>

      {matches.length > 0 && (
        <section className="space-y-4" data-testid="section-trend-matches">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="font-serif text-3xl tracking-tight">
              Passt zu <span className="italic text-primary">{state.projectName || state.tiny.topic || 'deinem Projekt'}</span>
            </h2>
            <span className="font-mono text-tag text-muted-foreground">
              aus {hasSession ? 'deiner Session' : 'deinem Tiny-Briefing'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {matches.map((m) => (
              <TrendCard key={m.signal.id} signal={m.signal} reasons={m.reasons} compact />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex flex-wrap gap-2" role="tablist">
          {(['alle', ...Object.keys(TREND_DOMAINS)] as (TrendDomain | 'alle')[]).map((d) => {
            const on = domain === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDomain(d)}
                className={`font-mono text-xs uppercase tracking-wider border px-3 py-2 ${
                  on ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover-elevate'
                }`}
                data-testid={`button-trend-domain-${d}`}
                aria-pressed={on}
              >
                {d === 'alle' ? `Alle · ${signals.length}` : `${TREND_DOMAINS[d]} · ${counts[d] ?? 0}`}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {visible.map((s) => (
            <TrendCard key={s.id} signal={s} />
          ))}
        </div>
      </section>

      <section className="border-t border-border pt-10 space-y-4" data-testid="section-radar-sources">
        <div>
          <div className="text-tag text-muted-foreground">RADAR-QUELLEN</div>
          <h2 className="font-serif text-3xl tracking-tight mt-1">
            Wo neue Signale <span className="italic text-primary">herkommen</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Tools für den Alltag, Newsletter für die Nische, Jahresreports für den Rahmen. Einmal pro Quartal durchgehen.
          </p>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {sources.map((r) => (
            <li key={r.name} className="py-3 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="md:col-span-4 font-serif text-lg hover:text-primary"
              >
                {r.name}
              </a>
              <span className="md:col-span-5 text-sm text-foreground/85">{r.use}</span>
              <span className="md:col-span-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground md:text-right">
                {r.cadence}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="border-t border-border pt-6 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-tag text-muted-foreground">Recherche-Stand: Oktober 2026</span>
        <Link href={hasSession ? '/report' : '/tiny'} data-testid="link-trends-back">
          <a className="font-mono uppercase text-sm text-primary hover:underline">
            {hasSession ? 'Zum Report →' : 'Zum Tiny Mode →'}
          </a>
        </Link>
      </div>
    </div>
  );
}
