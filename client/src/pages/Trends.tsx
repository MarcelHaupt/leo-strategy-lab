import { useState } from 'react';
import { Link } from 'wouter';
import { useSession } from '@/lib/session-store';
import { TrendCard } from '@/components/TrendCard';
import { activeSignals, RADAR_SOURCES, TREND_DOMAINS, type TrendDomain } from '@/lib/trends';
import { sessionTrends, tinyTrends } from '@/lib/trend-context';
import { tr } from '@/lib/i18n';

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

  // Breite der Grundlage: wie viele verschiedene Herausgeber und Reports stecken hinter den aktiven Signalen
  const sourceCount = new Set(signals.flatMap((s) => s.sources.map((src) => src.label.replace(/\s*\(.*\)\s*$/, '').trim()))).size;

  const sources = domain === 'alle' ? RADAR_SOURCES : RADAR_SOURCES.filter((r) => r.domains.includes(domain));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">
      <div className="border-b border-border pb-10">
        <div className="text-tag text-muted-foreground">{tr('TREND-RADAR', 'TREND RADAR')}</div>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mt-2 tracking-tight">
          {signals.length} {tr('Signale.', 'signals.')}
          <br />
          <span className="italic text-primary">{tr('Keine Hypes.', 'No hype.')}</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          {tr(
            `Aus ${sourceCount} Reports, Studien und Nischenquellen, von Plattformdaten bis Marktforschung, von Handel bis Gesundheit. Jedes Signal hat eine Quelle, ein Datum und ein Ablaufdatum. Was abgelaufen ist, fliegt automatisch raus. Die Punkte zeigen, wie viele Reports dasselbe Muster belegen. Trends sind Kontext, keine Strategie.`,
            `From ${sourceCount} reports, studies and niche sources, from platform data to market research, from retail to health. Every signal has a source, a date and an expiry date. Whatever has expired drops out automatically. The dots show how many reports back the same pattern. Trends are context, not strategy.`,
          )}
        </p>
      </div>

      {matches.length > 0 && (
        <section className="space-y-4" data-testid="section-trend-matches">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="font-serif text-3xl tracking-tight">
              {tr('Passt zu', 'Fits')} <span className="italic text-primary">{state.projectName || state.tiny.topic || tr('deinem Projekt', 'your project')}</span>
            </h2>
            <span className="font-mono text-tag text-muted-foreground">
              {hasSession ? tr('aus deiner Session', 'from your session') : tr('aus deinem Tiny-Briefing', 'from your Tiny briefing')}
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
                {d === 'alle' ? `${tr('Alle', 'All')} · ${signals.length}` : `${TREND_DOMAINS[d]} · ${counts[d] ?? 0}`}
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
          <div className="text-tag text-muted-foreground">{tr('RADAR-QUELLEN', 'RADAR SOURCES')}</div>
          <h2 className="font-serif text-3xl tracking-tight mt-1">
            {tr('Wo neue Signale', 'Where new signals')} <span className="italic text-primary">{tr('herkommen', 'come from')}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            {tr(
              'Tools für den Alltag, Newsletter für die Nische, Jahresreports für den Rahmen. Einmal pro Quartal durchgehen.',
              'Tools for everyday use, newsletters for the niche, annual reports for the big picture. Go through them once a quarter.',
            )}
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
        <span className="text-tag text-muted-foreground">{tr('Recherche-Stand: November 2026', 'Research as of: November 2026')}</span>
        <Link href={hasSession ? '/report' : '/tiny'} data-testid="link-trends-back">
          <a className="font-mono uppercase text-sm text-primary hover:underline">
            {hasSession ? tr('Zum Report →', 'To the report →') : tr('Zum Tiny Mode →', 'To Tiny Mode →')}
          </a>
        </Link>
      </div>
    </div>
  );
}
