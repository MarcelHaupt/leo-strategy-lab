import type { TrendSignal } from '@/lib/trends';
import { TREND_DOMAINS, formatSourceDate } from '@/lib/trends';

export function StrengthDots({ strength }: { strength?: number }) {
  if (!strength) return null;
  const label = strength >= 4 ? 'von 4 oder mehr Reports belegt' : strength === 1 ? 'von 1 Report belegt' : `von ${strength} Reports belegt`;
  return (
    <span className="inline-flex items-center gap-1.5" title={label} aria-label={`Signalstärke: ${label}`} data-testid="trend-strength">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Signalstärke</span>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= strength ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </span>
    </span>
  );
}

export function TrendCard({ signal, reasons, compact = false }: { signal: TrendSignal; reasons?: string[]; compact?: boolean }) {
  return (
    <article className="bg-card p-5 space-y-3 h-full flex flex-col" data-testid={`trend-${signal.id}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-tag text-primary">{TREND_DOMAINS[signal.domain]}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          gültig bis {formatSourceDate(signal.expires)}
        </span>
      </div>
      <h3 className="font-serif text-2xl leading-tight">{signal.title}</h3>
      <StrengthDots strength={signal.strength} />
      <p className="text-sm leading-relaxed text-foreground/85">{signal.insight}</p>
      <div className="border-l-2 border-primary pl-3">
        <div className="text-tag text-muted-foreground">So nutzt du es</div>
        <p className="text-sm leading-relaxed mt-1">{signal.move}</p>
      </div>
      {!compact && (
        <div className="border-l-2 border-border pl-3">
          <div className="text-tag text-muted-foreground">Finger weg</div>
          <p className="text-sm leading-relaxed mt-1 text-muted-foreground">{signal.skip}</p>
        </div>
      )}
      {reasons && reasons.length > 0 && (
        <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Passt, weil: {reasons.join(' · ')}</p>
      )}
      <div className="mt-auto pt-3 border-t border-border space-y-1">
        <p className="font-mono text-[11px] text-primary">{signal.principles.join(' · ')}</p>
        {signal.sources.map((src) => (
          <a
            key={src.url}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline"
          >
            {src.label} · {formatSourceDate(src.date)}
          </a>
        ))}
      </div>
    </article>
  );
}
