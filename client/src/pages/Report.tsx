import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useSession } from '@/lib/session-store';
import {
  sessionScore,
  compressPersona,
  deriveHooks,
  formatRecommendations,
  risks,
  leoComments,
} from '@/lib/leo-engine';
import { ScoreRing } from '@/components/ScoreRing';
import { LeoComment } from '@/components/LeoComment';
import { ExportPanel } from '@/components/ExportPanel';
import { MODULE_ORDER, MODULE_META, TRACKS } from '@/lib/types';
import { QUESTIONS } from '@/lib/questions';
import { PRINCIPLES_BY_ID } from '@/lib/playbook';
import { isModuleVisible } from '@/lib/track-profiles';

const TABS = [
  { id: 'persona', label: 'Persona' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'formate', label: 'Formate' },
  { id: 'risiken', label: 'Risiken' },
  { id: 'style', label: 'Style-DNA' },
  { id: 'roh', label: 'Roh-Daten' },
  { id: 'export', label: 'Export' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Report() {
  const { state } = useSession();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<TabId>('persona');

  useEffect(() => {
    if (state.startedAt === 0) navigate('/');
  }, [state.startedAt, navigate]);

  const score = sessionScore(state);
  const persona = compressPersona(state);
  const hooks = deriveHooks(state);
  const formats = formatRecommendations(state);
  const r = risks(state);
  const comments = leoComments(state);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="border-b border-border pb-10 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <div className="text-tag text-muted-foreground">STRATEGIE-REPORT</div>
          <h1
            className="font-serif text-5xl md:text-7xl leading-[0.9] mt-2 tracking-tight"
            data-testid="text-report-title"
          >
            {state.projectName || 'Unbenannt'}
          </h1>
          <p className="text-tag text-muted-foreground mt-3">
            KLIENT — {state.clientName || '—'}
          </p>
          {state.track && (
            <p className="text-tag mt-1">
              <span className="text-muted-foreground">TRACK — </span>
              <span className="text-primary">{TRACKS[state.track].code}</span>
              <span className="font-serif italic ml-2 text-foreground">{TRACKS[state.track].name}</span>
            </p>
          )}
        </div>
        <div className="lg:col-span-4 flex justify-end">
          <ScoreRing score={score} size={120} label="SOCIAL-FIRST-SCORE" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-10 -mx-4 sm:mx-0 overflow-x-auto">
        <div className="flex gap-px min-w-max sm:min-w-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              data-testid={`tab-${t.id}`}
              className={`font-mono text-tag px-4 py-3 hover-elevate ${
                tab === t.id
                  ? 'text-foreground border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === 'persona' && (
        <div className="space-y-10 max-w-3xl" data-testid="content-persona">
          <div>
            <div className="text-tag text-muted-foreground">ONE-LINER</div>
            <p className="font-serif text-3xl md:text-4xl leading-tight mt-3" data-testid="text-oneliner">
              {persona.oneLiner}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Block label="AUDIENCE" value={persona.audience} />
            <Block label="PROMISE" value={persona.promise} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Block label="VOICE" value={persona.voice.join(', ') || '—'} />
            <Block label="VERMEIDEN" value={persona.avoid.join(', ') || '—'} />
          </div>
          {comments.length > 0 && (
            <div className="border-t border-border pt-8 space-y-3">
              <div className="text-tag text-muted-foreground">LEO LIEST MIT</div>
              {comments.map((c, i) => (
                <LeoComment key={i} item={c} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'hooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="content-hooks">
          {hooks.map((h, i) => (
            <article
              key={i}
              className="border border-border bg-card p-6 space-y-4"
              data-testid={`hook-${i}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-tag text-primary">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-tag text-muted-foreground">{h.principleId}</span>
              </div>
              <h3 className="font-serif text-2xl leading-tight">{h.hook}</h3>
              <div className="text-sm text-muted-foreground leading-relaxed">{h.reason}</div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-tag text-muted-foreground">
                <span>{h.format}</span>
                <span>{h.platform.join(' · ')}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'formate' && (
        <div className="space-y-6 max-w-4xl" data-testid="content-formate">
          {formats.map((f, i) => (
            <article
              key={i}
              className="border border-border bg-card p-6 space-y-4"
              data-testid={`format-${i}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-tag text-primary">FORMAT {String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-tag text-muted-foreground">{f.principles.join(' · ')}</span>
              </div>
              <h3 className="font-serif text-3xl leading-tight">{f.name}</h3>
              <p className="text-sm text-foreground/85 leading-relaxed">{f.description}</p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-tag text-muted-foreground">PLATTFORMEN</dt>
                  <dd className="mt-1">{f.platforms.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-tag text-muted-foreground">FREQUENZ</dt>
                  <dd className="mt-1">{f.cadence}</dd>
                </div>
                <div>
                  <dt className="text-tag text-muted-foreground">REASON TO RETURN</dt>
                  <dd className="mt-1">{f.reasonToReturn}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      {tab === 'risiken' && (
        <div className="space-y-8 max-w-3xl" data-testid="content-risiken">
          <div>
            <h3 className="font-serif text-2xl mb-4">Verletzte Prinzipien</h3>
            {r.violatedPrinciples.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine harten Verstöße. Bleib wachsam.</p>
            ) : (
              <ul className="space-y-3">
                {r.violatedPrinciples.map(({ id, count }) => {
                  const p = PRINCIPLES_BY_ID[id];
                  return (
                    <li
                      key={id}
                      className="border-l-2 border-destructive pl-4 py-2"
                      data-testid={`violation-${id}`}
                    >
                      <div className="font-mono text-tag text-destructive">
                        {id} — {count}× verletzt
                      </div>
                      <div className="font-serif text-lg mt-1">{p?.name}</div>
                      <p className="text-sm text-muted-foreground mt-1">{p?.leosCheck}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-serif text-2xl mb-4">Schwache Antworten</h3>
            {r.weakAnswers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine kritisch dünnen Antworten gefunden.</p>
            ) : (
              <ul className="space-y-2">
                {r.weakAnswers.map((w, i) => (
                  <li
                    key={i}
                    className="font-mono text-tag text-muted-foreground border-l-2 border-border pl-3"
                  >
                    {w.moduleId} / {w.questionId} — Score {w.score}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === 'style' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl" data-testid="content-style">
          <article className="border border-border bg-card p-6">
            <div className="text-tag text-primary">ANZIEHEN</div>
            <ul className="font-serif text-2xl leading-tight mt-4 space-y-1">
              {persona.voice.length > 0 ? (
                persona.voice.map((v) => <li key={v}>{v}</li>)
              ) : (
                <li className="text-muted-foreground text-base">Noch nichts gewählt.</li>
              )}
            </ul>
          </article>
          <article className="border border-border bg-card p-6">
            <div className="text-tag text-muted-foreground">ABSTOSSEN</div>
            <ul className="font-serif text-2xl leading-tight mt-4 space-y-1">
              {persona.avoid.length > 0 ? (
                persona.avoid.map((v) => <li key={v}>{v}</li>)
              ) : (
                <li className="text-muted-foreground text-base">Noch nichts gewählt.</li>
              )}
            </ul>
          </article>
        </div>
      )}

      {tab === 'roh' && (
        <div className="space-y-12 max-w-3xl" data-testid="content-roh">
          {MODULE_ORDER.filter((mid) => isModuleVisible(state.track, mid)).map((mid) => {
            const meta = MODULE_META[mid];
            const mod = state.modules[mid];
            return (
              <section key={mid} className="space-y-4">
                <div className="border-b border-border pb-2 flex items-baseline gap-3">
                  <span className="font-mono text-tag text-primary">{meta.number}</span>
                  <h3 className="font-serif text-2xl">{meta.title}</h3>
                </div>
                {mid === 'casestudy' &&
                  (mod.caseStudies ?? []).map((cs, i) => (
                    <div key={i} className="space-y-2 border-l-2 border-border pl-4">
                      <div className="font-mono text-tag text-muted-foreground">CS {String(i + 1).padStart(2, '0')}</div>
                      {Object.entries(cs).map(
                        ([k, v]) =>
                          v && (
                            <div key={k}>
                              <div className="font-mono text-tag text-muted-foreground">{k}</div>
                              <p className="text-sm leading-relaxed">{v}</p>
                            </div>
                          ),
                      )}
                    </div>
                  ))}
                {mid === 'style' && (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-tag text-muted-foreground">ANZIEHEN: </span>
                      {((mod.answers.style_attract as string[]) ?? []).join(', ') || '—'}
                    </div>
                    <div>
                      <span className="text-tag text-muted-foreground">ABSTOSSEN: </span>
                      {((mod.answers.style_avoid as string[]) ?? []).join(', ') || '—'}
                    </div>
                  </div>
                )}
                {mid !== 'casestudy' && mid !== 'style' &&
                  QUESTIONS[mid].map((q) => {
                    const v = mod.answers[q.id];
                    if (!v || (typeof v === 'string' && !v.trim())) return null;
                    return (
                      <div key={q.id} className="space-y-1">
                        <div className="text-tag text-muted-foreground">{q.label}</div>
                        <p className="text-sm leading-relaxed">
                          {Array.isArray(v) ? v.join(', ') : v}
                        </p>
                      </div>
                    );
                  })}
              </section>
            );
          })}
        </div>
      )}

      {tab === 'export' && (
        <div className="max-w-2xl">
          <ExportPanel />
        </div>
      )}
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-tag text-muted-foreground">{label}</div>
      <p className="font-serif text-xl leading-snug mt-2">{value}</p>
    </div>
  );
}
