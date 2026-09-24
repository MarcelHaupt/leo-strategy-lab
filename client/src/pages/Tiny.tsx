import { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { Download, FileJson } from 'lucide-react';
import { useSession } from '@/lib/session-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LeoComment } from '@/components/LeoComment';
import { PRINCIPLES, PRINCIPLES_BY_ID } from '@/lib/playbook';
import type { TinyGoal, ProblemType, CrispKey, TinyState } from '@/lib/types';
import {
  TINY_GOALS,
  TINY_PLATFORMS,
  PROBLEM_TYPES,
  CRISP_META,
  MAX_PRINCIPLES,
  problemSentence,
  suggestPrinciples,
  activePrinciples,
  tinyHooks,
  tinyFormats,
  crispDrafts,
  next72Draft,
  tinyChecks,
  tinySteps,
} from '@/lib/tiny-engine';
import { resolvedCrisp, paperHooks, exportTinyMarkdown, exportTinyJSON } from '@/lib/tiny-export';

const fieldCls = 'font-sans border-border bg-card focus-visible:ring-1';
const chip = (active: boolean) =>
  `font-mono text-xs uppercase tracking-wider border px-3 py-2 transition-colors ${
    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover-elevate'
  }`;

function Step({ n, title, sub, children }: { n: string; title: ReactNode; sub: string; children: ReactNode }) {
  return (
    <section className="space-y-6 scroll-mt-24" id={`tiny-step-${n}`} data-testid={`section-tiny-${n}`}>
      <div className="border-b border-border pb-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-tag text-primary">{n}</span>
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight">{title}</h2>
        </div>
        <p className="text-tag text-muted-foreground mt-1">{sub}</p>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-tag text-muted-foreground block mb-2">
      {children}
    </label>
  );
}

export default function Tiny() {
  const { state, dispatch } = useSession();
  const t = state.tiny;
  const set = (patch: Partial<TinyState>) => dispatch({ type: 'setTiny', patch });
  const [showAll, setShowAll] = useState(false);

  const suggestions = suggestPrinciples(t);
  const suggestedIds = suggestions.slice(0, 6).map((s) => s.id);
  const active = activePrinciples(t);
  const hooks = tinyHooks(t, state.projectName);
  const formats = tinyFormats(t);
  const drafts = crispDrafts(t, state.projectName);
  const n72 = next72Draft(t, state.projectName);
  const checks = tinyChecks(t);
  const steps = tinySteps(t);
  const doneCount = steps.filter((s) => s.done).length;
  const sentence = problemSentence(t);

  const togglePlatform = (p: string) =>
    set({ platforms: t.platforms.includes(p) ? t.platforms.filter((x) => x !== p) : [...t.platforms, p] });

  const togglePrinciple = (id: string) => {
    if (t.principles.includes(id)) set({ principles: t.principles.filter((x) => x !== id) });
    else if (t.principles.length < MAX_PRINCIPLES) set({ principles: [...t.principles, id] });
  };

  const toggleHook = (id: string) =>
    set({ passedHooks: t.passedHooks.includes(id) ? t.passedHooks.filter((x) => x !== id) : [...t.passedHooks, id] });

  const setCrisp = (k: CrispKey, v: string) => set({ crisp: { ...t.crisp, [k]: v } });

  const principleList = showAll
    ? PRINCIPLES.map((p) => p.id)
    : Array.from(new Set([...suggestedIds, ...t.principles]));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="border-b border-border pb-8 mb-10">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-tag text-muted-foreground">TINY MODE</span>
              <span className="font-mono text-tag text-primary" data-testid="text-tiny-progress">
                {String(doneCount).padStart(2, '0')} / 06
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mt-2 tracking-tight">
              Tiny <span className="italic text-primary">Framework.</span>
            </h1>
          </div>
          <Link href="/" data-testid="link-tiny-home">
            <a className="font-mono text-tag text-muted-foreground hover:text-primary">← START</a>
          </Link>
        </div>
        <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Sechs Schritte vom Briefing zum Plan. Kein Deck, keine sieben Module. Am Ende steht ein Strategy Paper
          mit Hooks, Format und dem, was in den nächsten 72 Stunden passiert.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16 min-w-0">
          {/* 01 Inputs */}
          <Step n="01" title="Inputs" sub="Goal, Platform, Audience, Constraint">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="tiny-client">Klient</FieldLabel>
                <Input
                  id="tiny-client"
                  value={state.clientName}
                  onChange={(e) => dispatch({ type: 'setMeta', clientName: e.target.value })}
                  placeholder="z.B. Marke Müller"
                  className={fieldCls}
                  data-testid="input-tiny-client"
                />
              </div>
              <div>
                <FieldLabel htmlFor="tiny-project">Projekt</FieldLabel>
                <Input
                  id="tiny-project"
                  value={state.projectName}
                  onChange={(e) => dispatch({ type: 'setMeta', projectName: e.target.value })}
                  placeholder="z.B. Launch Spring '26"
                  className={fieldCls}
                  data-testid="input-tiny-project"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="tiny-topic">Worüber reden wir? Produkt, Person, Thema</FieldLabel>
              <Input
                id="tiny-topic"
                value={t.topic}
                onChange={(e) => set({ topic: e.target.value })}
                placeholder="z.B. die neue Laufschuh-Linie"
                className={fieldCls}
                data-testid="input-tiny-topic"
              />
            </div>

            <div>
              <FieldLabel>Goal — was ist das Hauptziel?</FieldLabel>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
                {(Object.keys(TINY_GOALS) as TinyGoal[]).map((g) => {
                  const on = t.goal === g;
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => set({ goal: on ? '' : g })}
                      className={`text-left p-4 bg-card transition-colors ${on ? 'ring-2 ring-primary ring-inset' : 'hover-elevate'}`}
                      data-testid={`button-tiny-goal-${g}`}
                      aria-pressed={on}
                    >
                      <div className={`font-serif text-xl leading-tight ${on ? 'text-primary' : ''}`}>
                        {TINY_GOALS[g].label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 leading-snug">{TINY_GOALS[g].sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <FieldLabel>Platform — wo spielt das?</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {TINY_PLATFORMS.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={chip(t.platforms.includes(p))}
                    data-testid={`button-tiny-platform-${p.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-pressed={t.platforms.includes(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="tiny-audience">Audience — für wen genau?</FieldLabel>
              <Input
                id="tiny-audience"
                value={t.audience}
                onChange={(e) => set({ audience: e.target.value })}
                placeholder="z.B. junge Athleten mit Nebenjob"
                className={fieldCls}
                data-testid="input-tiny-audience"
              />
            </div>

            <div>
              <FieldLabel htmlFor="tiny-constraint">Constraint — welche harte Grenze gibt es?</FieldLabel>
              <Input
                id="tiny-constraint"
                value={t.constraint}
                onChange={(e) => set({ constraint: e.target.value })}
                placeholder="z.B. kein Budget, nur Handy, 2 Wochen bis Launch"
                className={fieldCls}
                data-testid="input-tiny-constraint"
              />
            </div>
          </Step>

          {/* 02 Problem */}
          <Step n="02" title={<>Problem-<span className="italic text-primary">Frame</span></>} sub="Business-Issue + BECAUSE, ein Satz">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:items-end">
              <div>
                <FieldLabel htmlFor="tiny-issue">Business-Issue</FieldLabel>
                <Input
                  id="tiny-issue"
                  value={t.problemIssue}
                  onChange={(e) => set({ problemIssue: e.target.value })}
                  placeholder="Wir verlieren Reels-Reach"
                  className={fieldCls}
                  data-testid="input-tiny-issue"
                />
              </div>
              <span className="font-mono text-sm text-primary uppercase tracking-widest md:pb-2">weil</span>
              <div>
                <FieldLabel htmlFor="tiny-because">Kernursache</FieldLabel>
                <Input
                  id="tiny-because"
                  value={t.problemBecause}
                  onChange={(e) => set({ problemBecause: e.target.value })}
                  placeholder="unser Content wie Kampagne aussieht, nicht wie Social"
                  className={fieldCls}
                  data-testid="input-tiny-because"
                />
              </div>
            </div>

            <div>
              <FieldLabel>Problemtyp</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PROBLEM_TYPES) as ProblemType[]).map((pt) => (
                  <button
                    type="button"
                    key={pt}
                    onClick={() => set({ problemType: t.problemType === pt ? '' : pt })}
                    className={chip(t.problemType === pt)}
                    title={PROBLEM_TYPES[pt]}
                    data-testid={`button-tiny-type-${pt.toLowerCase()}`}
                    aria-pressed={t.problemType === pt}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {sentence && (
              <blockquote
                className="border-l-2 border-primary pl-4 font-serif text-2xl md:text-3xl leading-snug"
                data-testid="text-tiny-sentence"
              >
                {sentence}
              </blockquote>
            )}
          </Step>

          {/* 03 Playbook */}
          <Step n="03" title={<>Playbook-<span className="italic text-primary">Scan</span></>} sub={`2–${MAX_PRINCIPLES} Leitplanken wählen`}>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Leo schlägt vor, du entscheidest. Solange du nichts wählst, arbeitet die App mit Leos Top 3:{' '}
              <span className="font-mono text-primary">{active.join(' · ')}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {principleList.map((id) => {
                const p = PRINCIPLES_BY_ID[id];
                if (!p) return null;
                const on = t.principles.includes(id);
                const sug = suggestions.find((s) => s.id === id);
                const full = !on && t.principles.length >= MAX_PRINCIPLES;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => togglePrinciple(id)}
                    disabled={full}
                    className={`text-left p-4 bg-card transition-colors disabled:opacity-40 ${
                      on ? 'ring-2 ring-primary ring-inset' : 'hover-elevate'
                    }`}
                    data-testid={`button-tiny-principle-${id}`}
                    aria-pressed={on}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className={`font-mono text-xs ${on ? 'text-primary' : 'text-muted-foreground'}`}>{p.id}</span>
                      <span className="font-serif text-lg leading-tight">{p.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.leosCheck}</p>
                    {sug && suggestedIds.includes(id) && (
                      <p className="font-mono text-[10px] uppercase tracking-wider text-primary mt-2">
                        Vorschlag · {sug.reasons.slice(0, 2).join(' · ')}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="font-mono text-tag text-muted-foreground hover:text-primary"
              data-testid="button-tiny-show-all"
            >
              {showAll ? '— Nur Vorschläge zeigen' : '+ Alle 25 Prinzipien zeigen'}
            </button>
          </Step>

          {/* 04 Hooks & Formate */}
          <Step n="04" title={<>Hooks &amp; <span className="italic text-primary">Formate</span></>} sub="Group-Chat-Test: würdest du das um 2 Uhr nachts weiterleiten?">
            <div className="space-y-px bg-border border border-border">
              {hooks.map((h, i) => {
                const on = t.passedHooks.includes(h.principleId);
                return (
                  <div key={h.principleId} className="bg-card p-4 flex gap-4 items-start" data-testid={`card-tiny-hook-${h.principleId}`}>
                    <span className="font-mono text-xs text-muted-foreground pt-1">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-xl leading-snug font-semibold">{h.hook}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-2">
                        {h.emotion} · {h.mechanic} · <span className="text-primary">{h.principleId}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleHook(h.principleId)}
                      className={`${chip(on)} shrink-0`}
                      data-testid={`button-tiny-hook-pass-${h.principleId}`}
                      aria-pressed={on}
                      title="Besteht den Group-Chat-Test"
                    >
                      {on ? 'Besteht' : 'Test?'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div>
              <FieldLabel>Format-Mechanik</FieldLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
                {formats.map((f) => (
                  <div key={f.key} className="bg-card p-5 space-y-3" data-testid={`card-tiny-format-${f.key}`}>
                    <h3 className="font-serif text-2xl leading-tight">{f.name}</h3>
                    <p className="text-sm leading-relaxed">{f.mechanic}</p>
                    <dl className="text-xs space-y-1">
                      <div><dt className="inline text-muted-foreground">Rhythmus: </dt><dd className="inline">{f.cadence}</dd></div>
                      <div><dt className="inline text-muted-foreground">Reason to return: </dt><dd className="inline">{f.reasonToReturn}</dd></div>
                    </dl>
                    <p className="font-mono text-[11px] text-primary">{f.principles.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </Step>

          {/* 05 Mini-CRISP */}
          <Step n="05" title={<>Mini-<span className="italic text-primary">CRISP</span></>} sub="Leo entwirft, du schärfst">
            <div className="space-y-6">
              {(Object.keys(CRISP_META) as CrispKey[]).map((k) => {
                const m = CRISP_META[k];
                const draft = drafts[k];
                return (
                  <div key={k} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                      <label htmlFor={`tiny-crisp-${k}`} className="flex items-baseline gap-2">
                        <span className="font-mono text-lg text-primary">{m.letter}</span>
                        <span className="font-serif text-lg">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.hint}</span>
                      </label>
                      {draft && t.crisp[k] !== draft && (
                        <button
                          type="button"
                          onClick={() => setCrisp(k, draft)}
                          className="font-mono text-tag text-muted-foreground hover:text-primary"
                          data-testid={`button-tiny-crisp-draft-${k}`}
                        >
                          Leo-Entwurf einsetzen
                        </button>
                      )}
                    </div>
                    <Textarea
                      id={`tiny-crisp-${k}`}
                      value={t.crisp[k]}
                      onChange={(e) => setCrisp(k, e.target.value)}
                      placeholder={draft || m.hint}
                      rows={k === 'c' || k === 'i' ? 3 : k === 'p' ? 2 : 4}
                      className={fieldCls}
                      data-testid={`input-tiny-crisp-${k}`}
                    />
                  </div>
                );
              })}
            </div>
          </Step>

          {/* 06 Action */}
          <Step n="06" title={<>Next <span className="italic text-primary">72 Hours</span></>} sub="Was wird produziert, gebaut, getestet?">
            <div className="space-y-2">
              <div className="flex justify-end">
                {t.next72 !== n72 && (
                  <button
                    type="button"
                    onClick={() => set({ next72: n72 })}
                    className="font-mono text-tag text-muted-foreground hover:text-primary"
                    data-testid="button-tiny-next72-draft"
                  >
                    Leo-Entwurf einsetzen
                  </button>
                )}
              </div>
              <Textarea
                id="tiny-next72"
                value={t.next72}
                onChange={(e) => set({ next72: e.target.value })}
                placeholder={n72}
                rows={5}
                className={fieldCls}
                data-testid="input-tiny-next72"
              />
            </div>
          </Step>

          {/* 07 Paper */}
          <StrategyPaper />
        </div>

        {/* Side panel */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-8">
            <div>
              <div className="text-tag text-muted-foreground border-b border-border pb-2">Schritte</div>
              <ol className="mt-3 space-y-1">
                {steps.map((s, i) => (
                  <li key={s.label}>
                    <a
                      href={`#/tiny`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(`tiny-step-${String(i + 1).padStart(2, '0')}`)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-baseline gap-3 py-1 hover:text-primary"
                      data-testid={`link-tiny-step-${i + 1}`}
                    >
                      <span className={`font-mono text-xs ${s.done ? 'text-primary' : 'text-muted-foreground'}`}>
                        {s.done ? '■' : '□'} {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {checks.length > 0 && (
              <div>
                <div className="text-tag text-muted-foreground border-b border-border pb-2 mb-3">Leo liest mit</div>
                <div className="space-y-3">
                  {checks.map((c, i) => (
                    <LeoComment key={i} item={c} />
                  ))}
                </div>
              </div>
            )}

            <div className="border border-border p-4 space-y-3">
              <div className="text-tag text-muted-foreground">Mehr Tiefe?</div>
              <p className="text-xs leading-relaxed text-foreground/80">
                Tiny ist für schnelle Format- und Hook-Arbeit. Für Persona, Style-DNA und Case Studies gibt es die sieben Module.
              </p>
              <Link href="/" data-testid="link-tiny-to-lab">
                <a className="font-mono text-tag text-primary hover:underline">Zum Strategy Lab →</a>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Tiny-Session leeren? Klient und Projekt bleiben.')) dispatch({ type: 'resetTiny' });
              }}
              className="font-mono text-tag text-muted-foreground hover:text-destructive"
              data-testid="button-tiny-reset"
            >
              Tiny-Session leeren
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StrategyPaper() {
  const { state } = useSession();
  const t = state.tiny;
  const crisp = resolvedCrisp(state);
  const hooks = paperHooks(state);
  const formats = tinyFormats(t);
  const principles = activePrinciples(t);
  const sentence = problemSentence(t);
  const next = t.next72.trim() || next72Draft(t, state.projectName);

  return (
    <section className="space-y-6 scroll-mt-24" id="tiny-paper" data-testid="section-tiny-paper">
      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-border pb-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-tag text-primary">07</span>
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
            Strategy <span className="italic text-primary">Paper</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={() => exportTinyMarkdown(state)} data-testid="button-tiny-export-md">
            <Download className="h-4 w-4" /> .md
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => exportTinyJSON(state)} data-testid="button-tiny-export-json">
            <FileJson className="h-4 w-4" /> .json
          </Button>
        </div>
      </div>

      <article className="border border-border bg-card p-6 md:p-10 space-y-8" data-testid="article-tiny-paper">
        <header className="space-y-2">
          <div className="font-mono text-tag text-muted-foreground">
            {state.clientName || 'Klient'} · Tiny Framework · {new Date().toLocaleDateString('de-DE')}
          </div>
          <h3 className="font-serif text-4xl md:text-5xl leading-[0.95] tracking-tight">
            {state.projectName || t.topic || 'Unbenanntes Projekt'}
          </h3>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border mt-4">
            {[
              ['Ziel', t.goal ? TINY_GOALS[t.goal].label : '—'],
              ['Plattform', t.platforms.join(', ') || '—'],
              ['Für wen', t.audience || '—'],
              ['Grenze', t.constraint || '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-tag text-muted-foreground">{k}</dt>
                <dd className="text-sm mt-1 leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        {sentence && (
          <div>
            <div className="text-tag text-muted-foreground mb-2">Problem{t.problemType ? ` · ${t.problemType}` : ''}</div>
            <p className="font-serif text-2xl leading-snug">{sentence}</p>
          </div>
        )}

        <div>
          <div className="text-tag text-muted-foreground mb-2">Leitplanken</div>
          <ul className="space-y-1">
            {principles.map((id) => (
              <li key={id} className="text-sm">
                <span className="font-mono text-primary">{id}</span> {PRINCIPLES_BY_ID[id]?.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-tag text-muted-foreground mb-2">
            Hooks{t.passedHooks.length > 0 ? ' · Group-Chat-Test bestanden' : ''}
          </div>
          <ol className="space-y-2">
            {hooks.map((h, i) => (
              <li key={h.principleId} className="text-sm leading-snug">
                <span className="font-mono text-xs text-muted-foreground mr-2">{i + 1}.</span>
                <strong>{h.hook}</strong>{' '}
                <span className="text-muted-foreground">— {h.emotion}, {h.mechanic}, {h.principleId}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="text-tag text-muted-foreground mb-2">Format</div>
          {formats.map((f) => (
            <p key={f.key} className="text-sm leading-relaxed mb-2">
              <strong>{f.name}.</strong> {f.mechanic} <span className="text-muted-foreground">{f.cadence}.</span>
            </p>
          ))}
        </div>

        <div className="space-y-4">
          <div className="text-tag text-muted-foreground">Mini-CRISP</div>
          {(Object.keys(CRISP_META) as CrispKey[]).map((k) =>
            k === 'p' && !crisp.p.trim() ? null : (
              <div key={k} className="grid grid-cols-[2rem_1fr] gap-2">
                <span className="font-mono text-primary">{CRISP_META[k].letter}</span>
                <p className="text-sm leading-relaxed whitespace-pre-line">{crisp[k]}</p>
              </div>
            ),
          )}
        </div>

        <div className="border-t border-border pt-6">
          <div className="text-tag text-primary mb-2">Next 72 Hours</div>
          <p className="text-sm leading-relaxed whitespace-pre-line">{next}</p>
        </div>
      </article>
      <p className="font-mono text-xs text-muted-foreground">
        Felder ohne eigenen Text übernehmen Leos Entwurf. Alles bleibt im Browser — bei Reload weg, also exportieren.
      </p>
    </section>
  );
}
