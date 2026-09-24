// Tiny Mode Engine — deterministisch, kein LLM.
// Bildet leo-tiny-framework.md ab: Inputs → Problem-Frame → Playbook-Scan →
// Hooks & Formate → Mini-CRISP → Next 72 Hours.

import type { TinyState, TinyGoal, ProblemType, CrispKey, LeoCommentItem } from './types';
import { PRINCIPLES, PRINCIPLES_BY_ID } from './playbook';

// ---------- Stammdaten ----------

export const TINY_GOALS: Record<TinyGoal, { label: string; sub: string }> = {
  reach: { label: 'Reichweite', sub: 'Aufmerksamkeit, neue Leute erreichen' },
  community: { label: 'Community', sub: 'Engagement, wiederkommen, mitreden' },
  positioning: { label: 'Positionierung', sub: 'Brand Meaning, wofür man steht' },
  conversion: { label: 'Conversion', sub: 'Performance, Anfragen, Käufe' },
};

export const TINY_PLATFORMS = [
  'TikTok',
  'Instagram Reels',
  'YouTube Shorts',
  'YouTube',
  'LinkedIn',
  'Instagram Stories',
] as const;

export const PROBLEM_TYPES: Record<ProblemType, string> = {
  Category: 'Die Kategorie hat ein Problem',
  Product: 'Das Produkt hat ein Problem',
  Brand: 'Die Marke hat ein Problem',
  Culture: 'Die Kultur hat sich verschoben',
};

export const CRISP_META: Record<CrispKey, { letter: string; name: string; hint: string }> = {
  c: { letter: 'C', name: 'Context', hint: '2 Sätze: Problem und warum es auf Social zählt.' },
  r: { letter: 'R', name: 'Requirements', hint: '3 Bullets: Plattform, Zielgruppe, KPIs.' },
  i: { letter: 'I', name: 'Insight', hint: '1 Empfehlung, answer-first, mit Pxx.' },
  s: { letter: 'S', name: 'Solutions', hint: '3 Maßnahmen mit Owner und Timing.' },
  p: { letter: 'P', name: 'Proof', hint: 'Optional: 1–2 Cases, die ihr wirklich kennt.' },
};

export const MAX_PRINCIPLES = 3;

// ---------- Helfer ----------

const clean = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const hasWord = (text: string, words: string[]) =>
  words.some((w) => new RegExp(`(^|[^a-zäöüß])${w}([^a-zäöüß]|$)`, 'i').test(text));

export function topicOf(t: TinyState, projectName = ''): string {
  return clean(t.topic) || clean(projectName) || 'das Projekt';
}

function platformLabel(t: TinyState): string {
  if (t.platforms.length === 0) return 'die Plattform';
  if (t.platforms.length === 1) return t.platforms[0];
  return `${t.platforms.slice(0, -1).join(', ')} und ${t.platforms[t.platforms.length - 1]}`;
}

const isShortForm = (t: TinyState) =>
  t.platforms.some((p) => ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Instagram Stories'].includes(p));

// ---------- Step 2: Problem-Frame ----------

export function problemSentence(t: TinyState): string {
  const issue = clean(t.problemIssue);
  const because = clean(t.problemBecause);
  if (!issue && !because) return '';
  if (!because) return `${issue}, weil …`;
  if (!issue) return `… weil ${lowerFirst(because)}.`;
  return `${issue}, weil ${lowerFirst(because.replace(/^weil\s+/i, ''))}.`;
}

// ---------- Step 3: Playbook-Scan ----------

const GOAL_PRINCIPLES: Record<TinyGoal, string[]> = {
  reach: ['P03', 'P15', 'P19', 'P10'],
  community: ['P02', 'P04', 'P09', 'P11'],
  positioning: ['P24', 'P16', 'P20', 'P05'],
  conversion: ['P23', 'P07', 'P22', 'P02'],
};

const PLATFORM_PRINCIPLES: Record<string, string[]> = {
  TikTok: ['P17', 'P10', 'P14', 'P19'],
  'Instagram Reels': ['P17', 'P10', 'P03'],
  'YouTube Shorts': ['P17', 'P03', 'P15'],
  YouTube: ['P08', 'P20', 'P06'],
  LinkedIn: ['P23', 'P24', 'P22'],
  'Instagram Stories': ['P22', 'P09', 'P13'],
};

const LOW_BUDGET = ['budget', 'geld', 'handy', 'iphone', 'wenig zeit', 'allein', 'solo', 'klein', 'kein team', 'ohne team'];
const HAS_ASSETS = ['archiv', 'material', 'footage', 'fotos', 'bilder', 'assets', 'bestand'];

export type PrincipleSuggestion = { id: string; score: number; reasons: string[] };

export function suggestPrinciples(t: TinyState): PrincipleSuggestion[] {
  const map = new Map<string, PrincipleSuggestion>();
  const add = (id: string, pts: number, reason: string) => {
    const cur = map.get(id) ?? { id, score: 0, reasons: [] };
    cur.score += pts;
    if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
    map.set(id, cur);
  };

  if (t.goal) GOAL_PRINCIPLES[t.goal].forEach((id, i) => add(id, 4 - i * 0.5, `Ziel ${TINY_GOALS[t.goal as TinyGoal].label}`));
  t.platforms.forEach((p) => (PLATFORM_PRINCIPLES[p] ?? []).forEach((id, i) => add(id, 2.5 - i * 0.4, p)));

  const constraint = t.constraint.toLowerCase();
  if (LOW_BUDGET.some((w) => constraint.includes(w))) {
    add('P01', 3, 'Grenze: kleines Setup');
    add('P25', 2, 'Grenze: kleines Setup');
    add('P13', 1.5, 'Grenze: kleines Setup');
  }
  if (HAS_ASSETS.some((w) => constraint.includes(w))) add('P05', 2, 'Grenze: vorhandenes Material');

  if (t.problemType === 'Culture') add('P04', 2, 'Problemtyp Culture');
  if (t.problemType === 'Brand') add('P24', 1.5, 'Problemtyp Brand');
  if (t.problemType === 'Product') add('P23', 2, 'Problemtyp Product');
  if (t.problemType === 'Category') add('P15', 1.5, 'Problemtyp Category');

  const text = [t.problemIssue, t.problemBecause, t.audience, t.constraint, t.topic].join(' ').toLowerCase();
  if (text.trim()) {
    for (const p of PRINCIPLES) {
      const hit = p.triggers.find((w) => text.includes(w.toLowerCase()));
      if (hit) add(p.id, 1.5, `Stichwort „${hit}“`);
    }
  }

  // Post-Post gehört immer auf den Tisch
  add('P02', 1, 'Post-Post-Check');

  return [...map.values()].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

/** Gewählte Prinzipien, sonst Leos Top 3 */
export function activePrinciples(t: TinyState): string[] {
  if (t.principles.length > 0) return t.principles;
  return suggestPrinciples(t).slice(0, MAX_PRINCIPLES).map((s) => s.id);
}

// ---------- Step 4: Hooks ----------

export type TinyHook = {
  principleId: string;
  hook: string;
  emotion: string;
  mechanic: string;
};

type HookTemplate = (x: { topic: string; audience: string; platform: string; issue: string }) => Omit<TinyHook, 'principleId'>;

const HOOKS: Record<string, HookTemplate> = {
  P01: ({ topic }) => ({ hook: `Ungeschnitten: ${topic}. Kein Licht, kein Skript, ein Take.`, emotion: 'Neugier', mechanic: 'Stitch' }),
  P02: () => ({ hook: `Schick das der einen Person, die genau so ist.`, emotion: 'Wiedererkennung', mechanic: 'DM / Markieren' }),
  P03: ({ topic }) => ({ hook: `Frame 1 zeigt das Ende. ${topic} — rückwärts erzählt.`, emotion: 'Neugier', mechanic: 'Rewatch' }),
  P04: ({ audience }) => ({ hook: `Das verstehen nur ${audience}.`, emotion: 'Zugehörigkeit', mechanic: 'Group-Chat-Share' }),
  P05: ({ audience }) => ({ hook: `Die Frage, die ${audience} uns am häufigsten schicken. Ungefiltert beantwortet.`, emotion: 'Anerkennung', mechanic: 'Kommentar-Antwort' }),
  P06: ({ topic }) => ({ hook: `Tag 1 von ${topic}. Noch geht alles schief.`, emotion: 'Spannung', mechanic: 'Folgen für Teil 2' }),
  P07: ({ topic, audience }) => ({ hook: `Ohne Skript: ${audience} über ${topic}.`, emotion: 'Vertrauen', mechanic: 'Stitch' }),
  P08: ({ topic }) => ({ hook: `Folge 1: ${topic}. Eine Regel pro Woche, ein Ergebnis pro Folge.`, emotion: 'Serienlust', mechanic: 'Folgen / Save' }),
  P09: ({ topic }) => ({ hook: `Ihr entscheidet den nächsten Schritt von ${topic}. A oder B in die Kommentare.`, emotion: 'Mitbestimmung', mechanic: 'Voting' }),
  P10: ({ topic, platform }) => ({ hook: `Kein Spot, kein Cutdown: ${topic}, gebaut für ${platform}.`, emotion: 'Überraschung', mechanic: 'Share' }),
  P11: ({ topic }) => ({ hook: `Wir lesen die härtesten Kommentare zu ${topic} vor.`, emotion: 'Schadenfreude', mechanic: 'Kommentar / Reply-Video' }),
  P12: ({ audience }) => ({ hook: `Für ${audience}. Und nur für die.`, emotion: 'Zugehörigkeit', mechanic: 'Save' }),
  P13: ({ topic }) => ({ hook: `Jeden Dienstag, 30 Sekunden: ${topic}.`, emotion: 'Gewohnheit', mechanic: 'Folgen' }),
  P14: ({ topic }) => ({ hook: `Ton an. So klingt ${topic}.`, emotion: 'Neugier', mechanic: 'Sound-Remix' }),
  P15: ({ topic }) => ({ hook: `Stopp. Das ist nicht, was du bei ${topic} erwartest.`, emotion: 'Überraschung', mechanic: 'Rewatch / Share' }),
  P16: ({ audience }) => ({ hook: `Ein Zeichen, das nur ${audience} lesen können.`, emotion: 'Stolz', mechanic: 'Group-Chat-Share' }),
  P17: ({ topic }) => ({ hook: `Näher kommst du nicht ran: ${topic}.`, emotion: 'Nähe', mechanic: 'Share' }),
  P18: ({ topic }) => ({ hook: `Takeover: Jemand aus der Zielgruppe zeigt ${topic}. Wir halten nur die Kamera.`, emotion: 'Neugier', mechanic: 'Creator-Duet' }),
  P19: ({ topic }) => ({ hook: `Nimm die Vorlage und zeig deine Version von ${topic}.`, emotion: 'Spieltrieb', mechanic: 'Remix / Template' }),
  P20: ({ topic }) => ({ hook: `Teil 1 von 5: ${topic}. Wie es ausgeht, wissen wir selbst noch nicht.`, emotion: 'Spannung', mechanic: 'Folgen / Save' }),
  P21: ({ topic }) => ({ hook: `Kein Trend-Sound, kein Schnitt. 30 Sekunden ${topic}.`, emotion: 'Irritation', mechanic: 'Kommentar' }),
  P22: ({ topic }) => ({ hook: `POV: ${topic}, aus deinen Augen.`, emotion: 'Nähe', mechanic: 'Stitch' }),
  P23: ({ topic }) => ({ hook: `Die echten Zahlen hinter ${topic}. Screenshot inklusive.`, emotion: 'Vertrauen', mechanic: 'Screenshot' }),
  P24: ({ issue, topic }) => ({
    hook: issue ? `${issue}. Und der Grund ist unbequem.` : `Unpopuläre Meinung zu ${topic}.`,
    emotion: 'Ertapptsein',
    mechanic: 'Kommentar / Share',
  }),
  P25: ({ topic }) => ({ hook: `Körnig, schief, echt: ${topic} ohne Filter.`, emotion: 'Nähe', mechanic: 'Save' }),
};

export function tinyHooks(t: TinyState, projectName = ''): TinyHook[] {
  const ctx = {
    topic: topicOf(t, projectName),
    audience: clean(t.audience) || 'eure Leute',
    platform: platformLabel(t),
    issue: clean(t.problemIssue),
  };
  const order = [...activePrinciples(t), ...suggestPrinciples(t).map((s) => s.id)];
  const seen = new Set<string>();
  const out: TinyHook[] = [];
  for (const id of order) {
    if (seen.has(id) || !HOOKS[id]) continue;
    seen.add(id);
    out.push({ principleId: id, ...HOOKS[id](ctx) });
    if (out.length === 5) break;
  }
  return out;
}

// ---------- Step 4: Format-Mechanik ----------

export type TinyFormat = {
  key: string;
  name: string;
  mechanic: string;
  cadence: string;
  reasonToReturn: string;
  principles: string[];
};

const FORMATS: TinyFormat[] = [
  {
    key: 'serie',
    name: 'Serie mit Cliffhanger',
    mechanic: 'Fester Titel, feste Länge, nummerierte Folgen. Jede Folge endet offen.',
    cadence: '1 Folge pro Woche, fester Tag',
    reasonToReturn: 'Man will wissen, wie es weitergeht.',
    principles: ['P08', 'P20', 'P13', 'P06'],
  },
  {
    key: 'challenge',
    name: 'Challenge / Remix-Vorlage',
    mechanic: 'Ihr setzt die Vorlage, die Community liefert die Varianten. Die besten werden reposted.',
    cadence: 'Start-Post plus 2 Repost-Runden in 14 Tagen',
    reasonToReturn: 'Man will sehen, ob die eigene Version gefeatured wird.',
    principles: ['P19', 'P09', 'P18', 'P02'],
  },
  {
    key: 'voxpop',
    name: 'Voxpop / Straßenumfrage',
    mechanic: 'Eine Frage, zehn echte Menschen, harte Schnitte. Keine Moderation.',
    cadence: '2 Clips pro Woche',
    reasonToReturn: 'Jede Folge hat andere Gesichter und eine neue Frage.',
    principles: ['P05', 'P07', 'P04', 'P12'],
  },
  {
    key: 'bts',
    name: 'Behind-the-Scenes-Tagebuch',
    mechanic: 'Der Prozess vor dem Ergebnis, mit Datum im ersten Frame. Fehler bleiben drin.',
    cadence: '3 kurze Einträge pro Woche bis zum Reveal',
    reasonToReturn: 'Der Reveal hat ein Datum, alle wollen dabei sein.',
    principles: ['P06', 'P01', 'P25', 'P22'],
  },
  {
    key: 'receipts',
    name: 'Receipts-Format',
    mechanic: 'Eine Behauptung, dann der Beleg: Screenshot, Zahl, Rohmaterial.',
    cadence: '1 Beleg pro Woche',
    reasonToReturn: 'Man sammelt die Belege — Saves statt Likes.',
    principles: ['P23', 'P24', 'P16'],
  },
  {
    key: 'kommentarshow',
    name: 'Kommentar-Show',
    mechanic: 'Die Kommentare der letzten Woche sind das Skript der nächsten Folge.',
    cadence: '1 Folge pro Woche, jeweils aus den Kommentaren gebaut',
    reasonToReturn: 'Wer kommentiert, landet vielleicht in der nächsten Folge.',
    principles: ['P11', 'P02', 'P05', 'P09'],
  },
];

const GOAL_FORMAT_BONUS: Record<TinyGoal, string[]> = {
  reach: ['challenge', 'voxpop'],
  community: ['kommentarshow', 'challenge'],
  positioning: ['receipts', 'serie'],
  conversion: ['receipts', 'bts'],
};

export function tinyFormats(t: TinyState): TinyFormat[] {
  const active = activePrinciples(t);
  const scored = FORMATS.map((f, idx) => {
    let score = f.principles.filter((p) => active.includes(p)).length * 3;
    if (t.goal && GOAL_FORMAT_BONUS[t.goal].includes(f.key)) score += 2;
    return { f, score, idx };
  }).sort((a, b) => b.score - a.score || a.idx - b.idx);
  return scored.slice(0, 2).map((s) => s.f);
}

// ---------- Step 5: Mini-CRISP-Entwürfe ----------

const SOCIAL_RELEVANCE: Record<TinyGoal, string> = {
  reach: 'Auf Social entscheidet Sekunde eins, ob überhaupt jemand bleibt.',
  community: 'Auf Social zählt nicht, wer den Post sieht, sondern wer danach antwortet.',
  positioning: 'Auf Social merkt sich niemand Claims, sondern Haltung, die sich wiederholt.',
  conversion: 'Auf Social kauft niemand vom Plakat, sondern von dem, dem er schon vertraut.',
};

const KPIS: Record<TinyGoal, string> = {
  reach: 'Hook-Rate (Views über 3 Sekunden), Shares pro 1.000 Views',
  community: 'Kommentare mit mehr als 5 Wörtern, DMs, wiederkehrende Accounts',
  positioning: 'Saves, Profilbesuche, Kommentare, die die Haltung wiederholen',
  conversion: 'Link-Klicks, DM-Anfragen mit Kaufabsicht, Saves',
};

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function crispDrafts(t: TinyState, projectName = ''): Record<CrispKey, string> {
  const sentence = problemSentence(t) || `${topicOf(t, projectName)} braucht einen klaren Zugang auf Social.`;
  const relevance = t.goal ? SOCIAL_RELEVANCE[t.goal] : 'Auf Social zählt, was nach dem Post passiert.';
  const principles = activePrinciples(t);
  const pLine = principles.map((id) => `${id} ${PRINCIPLES_BY_ID[id]?.name ?? ''}`.trim()).join(', ');
  const [f1] = tinyFormats(t);
  const hooks = tinyHooks(t, projectName);

  return {
    c: `${sentence} ${relevance}`,
    r: [
      `- Plattform: ${t.platforms.length ? t.platforms.join(', ') : 'offen'}${isShortForm(t) ? ', 9:16' : ''}`,
      `- Zielgruppe: ${clean(t.audience) || 'offen'}`,
      `- Erfolg: ${t.goal ? KPIS[t.goal] : 'offen — erst Ziel festlegen'}`,
    ].join('\n'),
    i: f1
      ? `Kein Einzelpost, sondern ein Format: ${f1.name} auf ${platformLabel(t)}. Leitplanken: ${pLine}.`
      : `Leitplanken: ${pLine}.`,
    s: [
      `1. Hook-Test: „${hooks[0]?.hook ?? 'Hook 1'}“ in 3 Varianten als Rohschnitt — Owner: offen — bis ${addDays(2)}`,
      `2. Pilot: erste Folge „${f1?.name ?? 'Format'}“ drehen und posten — Owner: offen — bis ${addDays(7)}`,
      `3. Post-Post auswerten: Kommentare und DMs sortieren, Folge 2 daraus bauen — Owner: offen — bis ${addDays(14)}`,
    ].join('\n'),
    p: '',
  };
}

export function next72Draft(t: TinyState, projectName = ''): string {
  const hook = tinyHooks(t, projectName)[0];
  const audience = clean(t.audience) || 'Leuten aus der Zielgruppe';
  return [
    `Bis ${addDays(3)}:`,
    `- „${hook?.hook ?? 'Hook 1'}“ mit dem Handy drehen, 3 Varianten, ungeschnitten.`,
    `- An 5 Menschen schicken, die zu „${audience}“ gehören. Eine Frage: Würdest du das weiterleiten?`,
    `- Die Variante mit den meisten Ja posten. Kommentare der ersten 24 Stunden mitschreiben.`,
  ].join('\n');
}

// ---------- Leo liest mit ----------

const BROAD_AUDIENCE = ['alle', 'jeder', 'jedermann', 'menschen', 'zielgruppe', 'kunden', 'konsumenten', 'millennials', 'gen z', 'junge leute', 'die breite masse'];
const SYMPTOM_WORDS = ['algorithmus', 'reichweite', 'sichtbarkeit', 'zu wenig', 'nicht genug', 'qualität', 'budget'];

export function tinyChecks(t: TinyState): LeoCommentItem[] {
  const out: LeoCommentItem[] = [];
  const aud = t.audience.trim();

  if (aud && (hasWord(aud, BROAD_AUDIENCE) || aud.split(/\s+/).length < 3)) {
    out.push({ tone: 'flag', principleId: 'P12', text: 'Das ist eine Persona, keine Person. Wen genau siehst du vor dir — Alter, Alltag, eine Gewohnheit?' });
  }
  if (t.problemIssue.trim() && !t.problemBecause.trim()) {
    out.push({ tone: 'flag', text: 'Ohne BECAUSE ist das ein Symptom. Warum passiert das?' });
  }
  const because = t.problemBecause.toLowerCase();
  if (because && hasWord(because, SYMPTOM_WORDS) && because.split(/\s+/).length < 10) {
    out.push({ tone: 'flag', text: 'Dein BECAUSE beschreibt das Problem noch mal, statt es zu erklären. Frag eine Ebene tiefer.' });
  }
  if (!t.constraint.trim() && (t.goal || aud)) {
    out.push({ tone: 'idea', text: 'Keine Grenze angegeben. Ohne Grenze wird alles möglich — und nichts fertig. Zeit, Budget, No-Go?' });
  }
  if (t.platforms.length > 2) {
    out.push({ tone: 'idea', principleId: 'P10', text: `${t.platforms.length} Plattformen sind drei Formate. Starte auf einer, die anderen kommen später.` });
  }
  if (t.goal === 'conversion' && t.platforms.includes('TikTok') && !t.principles.includes('P23')) {
    out.push({ tone: 'idea', principleId: 'P23', text: 'Conversion auf TikTok läuft über Beweise, nicht über Claims. P23 mitnehmen.' });
  }
  if (t.problemIssue.trim() && t.problemBecause.trim() && out.every((c) => c.tone !== 'flag')) {
    out.push({ tone: 'praise', text: 'Problem mit BECAUSE steht. Damit kann man arbeiten.' });
  }
  return out;
}

// ---------- Fortschritt ----------

export function tinySteps(t: TinyState): { label: string; done: boolean }[] {
  return [
    { label: 'Inputs', done: !!t.goal && t.platforms.length > 0 && !!t.audience.trim() && !!t.constraint.trim() },
    { label: 'Problem-Frame', done: !!t.problemIssue.trim() && !!t.problemBecause.trim() },
    { label: 'Playbook', done: t.principles.length >= 2 },
    { label: 'Hooks & Formate', done: t.passedHooks.length > 0 },
    { label: 'Mini-CRISP', done: (['c', 'r', 'i', 's'] as CrispKey[]).every((k) => !!t.crisp[k].trim()) },
    { label: 'Next 72 Hours', done: !!t.next72.trim() },
  ];
}
