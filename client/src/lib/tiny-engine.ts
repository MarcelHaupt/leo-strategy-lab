// Tiny Mode Engine — deterministisch, kein LLM.
// Bildet leo-tiny-framework.md ab: Inputs → Problem-Frame → Playbook-Scan →
// Hooks & Formate → Mini-CRISP → Next 72 Hours.

import type { TinyState, TinyGoal, ProblemType, CrispKey, LeoCommentItem } from './types';
import { PRINCIPLES, PRINCIPLES_BY_ID } from './playbook';
import { tinyProvocations } from './leo-provocations';
import { localized, tr, dateLocale, getLang } from './i18n';

// ---------- Stammdaten ----------

export const TINY_GOALS: Record<TinyGoal, { label: string; sub: string }> = {
  reach: localized({ label: 'Reichweite', sub: 'Aufmerksamkeit, neue Leute erreichen' }, { label: 'Reach', sub: 'Attention, reaching new people' }),
  community: localized({ label: 'Community', sub: 'Engagement, wiederkommen, mitreden' }, { sub: 'Engagement, coming back, joining in' }),
  positioning: localized({ label: 'Positionierung', sub: 'Brand Meaning, wofür man steht' }, { label: 'Positioning', sub: 'Brand meaning, what you stand for' }),
  conversion: localized({ label: 'Conversion', sub: 'Performance, Anfragen, Käufe' }, { sub: 'Performance, enquiries, purchases' }),
};

export const TINY_PLATFORMS = [
  'TikTok',
  'Instagram Reels',
  'YouTube Shorts',
  'YouTube',
  'LinkedIn',
  'Instagram Stories',
] as const;

const PROBLEM_TYPES_EN: Record<ProblemType, string> = {
  Category: 'The category has a problem',
  Product: 'The product has a problem',
  Brand: 'The brand has a problem',
  Culture: 'The culture has shifted',
};
const PROBLEM_TYPES_DE: Record<ProblemType, string> = {
  Category: 'Die Kategorie hat ein Problem',
  Product: 'Das Produkt hat ein Problem',
  Brand: 'Die Marke hat ein Problem',
  Culture: 'Die Kultur hat sich verschoben',
};
export const PROBLEM_TYPES = localized(PROBLEM_TYPES_DE, PROBLEM_TYPES_EN);

export const CRISP_META: Record<CrispKey, { letter: string; name: string; hint: string }> = {
  c: localized({ letter: 'C', name: 'Context', hint: '2 Sätze: Problem und warum es auf Social zählt.' }, { hint: '2 sentences: the problem and why it matters on social.' }),
  r: localized({ letter: 'R', name: 'Requirements', hint: '3 Bullets: Plattform, Zielgruppe, KPIs.' }, { hint: '3 bullets: platform, audience, KPIs.' }),
  i: localized({ letter: 'I', name: 'Insight', hint: '1 Empfehlung, answer-first, mit Pxx.' }, { hint: '1 recommendation, answer first, with Pxx.' }),
  s: localized({ letter: 'S', name: 'Solutions', hint: '3 Maßnahmen mit Owner und Timing.' }, { hint: '3 actions with owner and timing.' }),
  p: localized({ letter: 'P', name: 'Proof', hint: 'Optional: 1–2 Cases, die ihr wirklich kennt.' }, { hint: 'Optional: 1–2 cases you really know.' }),
};

export const MAX_PRINCIPLES = 3;

// ---------- Helfer ----------

const clean = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const hasWord = (text: string, words: string[]) =>
  words.some((w) => new RegExp(`(^|[^a-zäöüß])${w}([^a-zäöüß]|$)`, 'i').test(text));

export function topicOf(t: TinyState, projectName = ''): string {
  return clean(t.topic) || clean(projectName) || tr('das Projekt', 'the project');
}

function platformLabel(t: TinyState): string {
  if (t.platforms.length === 0) return tr('die Plattform', 'the platform');
  if (t.platforms.length === 1) return t.platforms[0];
  return `${t.platforms.slice(0, -1).join(', ')} ${tr('und', 'and')} ${t.platforms[t.platforms.length - 1]}`;
}

const isShortForm = (t: TinyState) =>
  t.platforms.some((p) => ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Instagram Stories'].includes(p));

// ---------- Step 2: Problem-Frame ----------

export function problemSentence(t: TinyState): string {
  const issue = clean(t.problemIssue);
  const because = clean(t.problemBecause);
  if (!issue && !because) return '';
  if (!because) return tr(`${issue}, weil …`, `${issue}, because …`);
  if (!issue) return tr(`… weil ${lowerFirst(because)}.`, `… because ${lowerFirst(because)}.`);
  const b = lowerFirst(because.replace(/^(weil|because)\s+/i, ''));
  return tr(`${issue}, weil ${b}.`, `${issue}, because ${b}.`);
}

// ---------- Step 3: Playbook-Scan ----------

const GOAL_PRINCIPLES: Record<TinyGoal, string[]> = {
  reach: ['P03', 'P15', 'P19', 'P10'],
  community: ['P02', 'P04', 'P09', 'P11', 'P33'],
  positioning: ['P24', 'P16', 'P20', 'P05'],
  conversion: ['P23', 'P07', 'P22', 'P02'],
};

const PLATFORM_PRINCIPLES: Record<string, string[]> = {
  TikTok: ['P17', 'P10', 'P14', 'P19'],
  'Instagram Reels': ['P17', 'P10', 'P03'],
  'YouTube Shorts': ['P17', 'P03', 'P15'],
  YouTube: ['P08', 'P20', 'P06'],
  LinkedIn: ['P23', 'P24', 'P22'],
  'Instagram Stories': ['P22', 'P09', 'P13', 'P34'],
};

const LOW_BUDGET = ['budget', 'geld', 'handy', 'iphone', 'wenig zeit', 'allein', 'solo', 'klein', 'kein team', 'ohne team', 'money', 'phone', 'little time', 'alone', 'small', 'no team'];
const HAS_ASSETS = ['archiv', 'material', 'footage', 'fotos', 'bilder', 'assets', 'bestand', 'archive', 'photos', 'images'];

export type PrincipleSuggestion = { id: string; score: number; reasons: string[] };

export function suggestPrinciples(t: TinyState): PrincipleSuggestion[] {
  const map = new Map<string, PrincipleSuggestion>();
  const add = (id: string, pts: number, reason: string) => {
    const cur = map.get(id) ?? { id, score: 0, reasons: [] };
    cur.score += pts;
    if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
    map.set(id, cur);
  };

  if (t.goal) GOAL_PRINCIPLES[t.goal].forEach((id, i) => add(id, 4 - i * 0.5, `${tr('Ziel', 'Goal')} ${TINY_GOALS[t.goal as TinyGoal].label}`));
  t.platforms.forEach((p) => (PLATFORM_PRINCIPLES[p] ?? []).forEach((id, i) => add(id, 2.5 - i * 0.4, p)));

  const constraint = t.constraint.toLowerCase();
  if (LOW_BUDGET.some((w) => constraint.includes(w))) {
    const small = tr('Grenze: kleines Setup', 'Constraint: small setup');
    add('P01', 3, small);
    add('P25', 2, small);
    add('P13', 1.5, small);
  }
  if (HAS_ASSETS.some((w) => constraint.includes(w))) add('P05', 2, tr('Grenze: vorhandenes Material', 'Constraint: existing material'));

  const pt = tr('Problemtyp', 'Problem type');
  if (t.problemType === 'Culture') add('P04', 2, `${pt} Culture`);
  if (t.problemType === 'Brand') add('P24', 1.5, `${pt} Brand`);
  if (t.problemType === 'Product') add('P23', 2, `${pt} Product`);
  if (t.problemType === 'Category') add('P15', 1.5, `${pt} Category`);

  const text = [t.problemIssue, t.problemBecause, t.audience, t.constraint, t.topic].join(' ').toLowerCase();
  if (text.trim()) {
    for (const p of PRINCIPLES) {
      const hit = p.triggers.find((w) => text.includes(w.toLowerCase()));
      if (hit) add(p.id, 1.5, tr(`Stichwort „${hit}“`, `Keyword “${hit}”`));
    }
  }

  // Playbook 2027: klare Themen holen die neuen Prinzipien nach vorn
  if (/(^|[^a-zäöüß])(ki|ai)([^a-zäöüß]|$)|chatgpt|midjourney|generiert|künstliche intelligenz/.test(text)) add('P35', 2.5, tr('Thema KI', 'Topic: AI'));
  if (['handyfrei', 'phone-free', 'konzert', 'concert', 'vor ort', 'in person', 'live-event', 'offline'].some((w) => text.includes(w))) add('P34', 2, tr('Live-Moment', 'Live moment'));
  if (['newsletter', 'podcast', 'whatsapp', 'discord', 'gruppenchat', 'group chat', 'forum'].some((w) => text.includes(w))) add('P33', 1.5, tr('Kanal unter dem Feed', 'Channel below the feed'));

  // Post-Post gehört immer auf den Tisch
  add('P02', 1, tr('Post-Post-Check', 'Post-post check'));

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
  P01: ({ topic }) => ({ hook: tr(`Ungeschnitten: ${topic}. Kein Licht, kein Skript, ein Take.`, `Uncut: ${topic}. No lights, no script, one take.`), emotion: tr('Neugier', 'Curiosity'), mechanic: 'Stitch' }),
  P02: () => ({ hook: tr(`Schick das der einen Person, die genau so ist.`, `Send this to the one person who is exactly like this.`), emotion: tr('Wiedererkennung', 'Recognition'), mechanic: tr('DM / Markieren', 'DM / tag') }),
  P03: ({ topic }) => ({ hook: tr(`Frame 1 zeigt das Ende. ${topic} — rückwärts erzählt.`, `Frame 1 shows the ending. ${topic}, told backwards.`), emotion: tr('Neugier', 'Curiosity'), mechanic: 'Rewatch' }),
  P04: ({ audience }) => ({ hook: tr(`Das verstehen nur ${audience}.`, `Only ${audience} get this.`), emotion: tr('Zugehörigkeit', 'Belonging'), mechanic: tr('Group-Chat-Share', 'Group chat share') }),
  P05: ({ audience }) => ({ hook: tr(`Die Frage, die ${audience} uns am häufigsten schicken. Ungefiltert beantwortet.`, `The question ${audience} send us most. Answered unfiltered.`), emotion: tr('Anerkennung', 'Recognition'), mechanic: tr('Kommentar-Antwort', 'Comment reply') }),
  P06: ({ topic }) => ({ hook: tr(`Tag 1 von ${topic}. Noch geht alles schief.`, `Day 1 of ${topic}. Everything is still going wrong.`), emotion: tr('Spannung', 'Suspense'), mechanic: tr('Folgen für Teil 2', 'Follow for part 2') }),
  P07: ({ topic, audience }) => ({ hook: tr(`Ohne Skript: ${audience} über ${topic}.`, `No script: ${audience} on ${topic}.`), emotion: tr('Vertrauen', 'Trust'), mechanic: 'Stitch' }),
  P08: ({ topic }) => ({ hook: tr(`Folge 1: ${topic}. Eine Regel pro Woche, ein Ergebnis pro Folge.`, `Episode 1: ${topic}. One rule a week, one result per episode.`), emotion: tr('Serienlust', 'Binge appetite'), mechanic: tr('Folgen / Save', 'Follow / save') }),
  P09: ({ topic }) => ({ hook: tr(`Ihr entscheidet den nächsten Schritt von ${topic}. A oder B in die Kommentare.`, `You decide the next step for ${topic}. A or B in the comments.`), emotion: tr('Mitbestimmung', 'Having a say'), mechanic: 'Voting' }),
  P10: ({ topic, platform }) => ({ hook: tr(`Kein Spot, kein Cutdown: ${topic}, gebaut für ${platform}.`, `No ad, no cutdown: ${topic}, built for ${platform}.`), emotion: tr('Überraschung', 'Surprise'), mechanic: 'Share' }),
  P11: ({ topic }) => ({ hook: tr(`Wir lesen die härtesten Kommentare zu ${topic} vor.`, `We read out the harshest comments about ${topic}.`), emotion: tr('Schadenfreude', 'Schadenfreude'), mechanic: tr('Kommentar / Reply-Video', 'Comment / reply video') }),
  P12: ({ audience }) => ({ hook: tr(`Für ${audience}. Und nur für die.`, `For ${audience}. And only for them.`), emotion: tr('Zugehörigkeit', 'Belonging'), mechanic: 'Save' }),
  P13: ({ topic }) => ({ hook: tr(`Jeden Dienstag, 30 Sekunden: ${topic}.`, `Every Tuesday, 30 seconds: ${topic}.`), emotion: tr('Gewohnheit', 'Habit'), mechanic: tr('Folgen', 'Follow') }),
  P14: ({ topic }) => ({ hook: tr(`Ton an. So klingt ${topic}.`, `Sound on. This is what ${topic} sounds like.`), emotion: tr('Neugier', 'Curiosity'), mechanic: 'Sound-Remix' }),
  P15: ({ topic }) => ({ hook: tr(`Stopp. Das ist nicht, was du bei ${topic} erwartest.`, `Stop. This is not what you expect from ${topic}.`), emotion: tr('Überraschung', 'Surprise'), mechanic: 'Rewatch / Share' }),
  P16: ({ audience }) => ({ hook: tr(`Ein Zeichen, das nur ${audience} lesen können.`, `A sign only ${audience} can read.`), emotion: tr('Stolz', 'Pride'), mechanic: tr('Group-Chat-Share', 'Group chat share') }),
  P17: ({ topic }) => ({ hook: tr(`Näher kommst du nicht ran: ${topic}.`, `You will not get closer than this: ${topic}.`), emotion: tr('Nähe', 'Closeness'), mechanic: 'Share' }),
  P18: ({ topic }) => ({ hook: tr(`Takeover: Jemand aus der Zielgruppe zeigt ${topic}. Wir halten nur die Kamera.`, `Takeover: someone from the audience shows ${topic}. We just hold the camera.`), emotion: tr('Neugier', 'Curiosity'), mechanic: 'Creator-Duet' }),
  P19: ({ topic }) => ({ hook: tr(`Nimm die Vorlage und zeig deine Version von ${topic}.`, `Take the template and show your version of ${topic}.`), emotion: tr('Spieltrieb', 'Playfulness'), mechanic: 'Remix / Template' }),
  P20: ({ topic }) => ({ hook: tr(`Teil 1 von 5: ${topic}. Wie es ausgeht, wissen wir selbst noch nicht.`, `Part 1 of 5: ${topic}. We do not know how it ends either.`), emotion: tr('Spannung', 'Suspense'), mechanic: tr('Folgen / Save', 'Follow / save') }),
  P21: ({ topic }) => ({ hook: tr(`Kein Trend-Sound, kein Schnitt. 30 Sekunden ${topic}.`, `No trending sound, no cuts. 30 seconds of ${topic}.`), emotion: tr('Irritation', 'Irritation'), mechanic: tr('Kommentar', 'Comment') }),
  P22: ({ topic }) => ({ hook: tr(`POV: ${topic}, aus deinen Augen.`, `POV: ${topic}, through your eyes.`), emotion: tr('Nähe', 'Closeness'), mechanic: 'Stitch' }),
  P23: ({ topic }) => ({ hook: tr(`Die echten Zahlen hinter ${topic}. Screenshot inklusive.`, `The real numbers behind ${topic}. Screenshot included.`), emotion: tr('Vertrauen', 'Trust'), mechanic: 'Screenshot' }),
  P24: ({ issue, topic }) => ({
    hook: issue ? tr(`${issue}. Und der Grund ist unbequem.`, `${issue}. And the reason is uncomfortable.`) : tr(`Unpopuläre Meinung zu ${topic}.`, `Unpopular opinion on ${topic}.`),
    emotion: tr('Ertapptsein', 'Feeling caught out'),
    mechanic: tr('Kommentar / Share', 'Comment / share'),
  }),
  P25: ({ topic }) => ({ hook: tr(`Körnig, schief, echt: ${topic} ohne Filter.`, `Grainy, crooked, real: ${topic} without filters.`), emotion: tr('Nähe', 'Closeness'), mechanic: 'Save' }),
  P33: ({ audience }) => ({ hook: tr(`Was ${audience} im Gruppenchat sagen, aber nie in die Kommentare schreiben.`, `What ${audience} say in the group chat but never write in the comments.`), emotion: tr('Ertapptsein', 'Feeling caught out'), mechanic: tr('DM / Weiterleiten', 'DM / forward') }),
  P34: ({ topic }) => ({ hook: tr(`Handys weg. Das ist ${topic}, wenn niemand filmt. Die Bilder gibt es morgen.`, `Phones away. This is ${topic} when nobody films. Photos tomorrow.`), emotion: tr('Dabei sein', 'Being there'), mechanic: tr('Folgen / Save', 'Follow / save') }),
  P35: ({ topic }) => ({ hook: tr(`${topic}: zu 0 % KI. So ist es entstanden.`, `${topic}: 0 % AI. This is how it was made.`), emotion: tr('Vertrauen', 'Trust'), mechanic: tr('Kommentar / Save', 'Comment / save') }),
};

export function tinyHooks(t: TinyState, projectName = ''): TinyHook[] {
  const ctx = {
    topic: topicOf(t, projectName),
    audience: clean(t.audience) || tr('eure Leute', 'your people'),
    platform: platformLabel(t),
    issue: clean(t.problemIssue),
  };
  const order = [...activePrinciples(t), ...suggestPrinciples(t).map((s) => s.id)];
  const seen = new Set<string>();
  const out: TinyHook[] = [];
  // Shift-Hook zuerst: das Vorurteil der Zielgruppe aussprechen und brechen (ersetzt die P24-Vorlage)
  const now = clean(t.shiftNow);
  if (now) {
    seen.add('P24');
    out.push({
      principleId: 'P24',
      hook: tr(`Alle denken: ${now}. Stimmt nicht.`, `Everyone thinks: ${now}. Not true.`),
      emotion: tr('Ertapptsein', 'Feeling caught out'),
      mechanic: tr('Kommentar / Stitch', 'Comment / stitch'),
    });
  }
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
  localized(
    {
      key: 'serie',
      name: 'Serie mit Cliffhanger',
      mechanic: 'Fester Titel, feste Länge, nummerierte Folgen. Jede Folge endet offen.',
      cadence: '1 Folge pro Woche, fester Tag',
      reasonToReturn: 'Man will wissen, wie es weitergeht.',
      principles: ['P08', 'P20', 'P13', 'P06'],
    },
    {
      name: 'Series with a cliffhanger',
      mechanic: 'Fixed title, fixed length, numbered episodes. Every episode ends open.',
      cadence: '1 episode a week, fixed day',
      reasonToReturn: 'People want to know what happens next.',
    },
  ),
  localized(
    {
      key: 'challenge',
      name: 'Challenge / Remix-Vorlage',
      mechanic: 'Ihr setzt die Vorlage, die Community liefert die Varianten. Die besten werden reposted.',
      cadence: 'Start-Post plus 2 Repost-Runden in 14 Tagen',
      reasonToReturn: 'Man will sehen, ob die eigene Version gefeatured wird.',
      principles: ['P19', 'P09', 'P18', 'P02'],
    },
    {
      name: 'Challenge / remix template',
      mechanic: 'You set the template, the community delivers the variants. The best ones get reposted.',
      cadence: 'Launch post plus 2 repost rounds within 14 days',
      reasonToReturn: 'People want to see if their version gets featured.',
    },
  ),
  localized(
    {
      key: 'voxpop',
      name: 'Voxpop / Straßenumfrage',
      mechanic: 'Eine Frage, zehn echte Menschen, harte Schnitte. Keine Moderation.',
      cadence: '2 Clips pro Woche',
      reasonToReturn: 'Jede Folge hat andere Gesichter und eine neue Frage.',
      principles: ['P05', 'P07', 'P04', 'P12'],
    },
    {
      name: 'Vox pop / street interviews',
      mechanic: 'One question, ten real people, hard cuts. No host.',
      cadence: '2 clips a week',
      reasonToReturn: 'Every episode has new faces and a new question.',
    },
  ),
  localized(
    {
      key: 'bts',
      name: 'Behind-the-Scenes-Tagebuch',
      mechanic: 'Der Prozess vor dem Ergebnis, mit Datum im ersten Frame. Fehler bleiben drin.',
      cadence: '3 kurze Einträge pro Woche bis zum Reveal',
      reasonToReturn: 'Der Reveal hat ein Datum, alle wollen dabei sein.',
      principles: ['P06', 'P01', 'P25', 'P22'],
    },
    {
      name: 'Behind-the-scenes diary',
      mechanic: 'The process before the result, with the date in the first frame. Mistakes stay in.',
      cadence: '3 short entries a week until the reveal',
      reasonToReturn: 'The reveal has a date and everyone wants to be there.',
    },
  ),
  localized(
    {
      key: 'receipts',
      name: 'Receipts-Format',
      mechanic: 'Eine Behauptung, dann der Beleg: Screenshot, Zahl, Rohmaterial.',
      cadence: '1 Beleg pro Woche',
      reasonToReturn: 'Man sammelt die Belege — Saves statt Likes.',
      principles: ['P23', 'P24', 'P16'],
    },
    {
      name: 'Receipts format',
      mechanic: 'A claim, then the proof: screenshot, number, raw material.',
      cadence: '1 receipt a week',
      reasonToReturn: 'People collect the receipts: saves instead of likes.',
    },
  ),
  localized(
    {
      key: 'kommentarshow',
      name: 'Kommentar-Show',
      mechanic: 'Die Kommentare der letzten Woche sind das Skript der nächsten Folge.',
      cadence: '1 Folge pro Woche, jeweils aus den Kommentaren gebaut',
      reasonToReturn: 'Wer kommentiert, landet vielleicht in der nächsten Folge.',
      principles: ['P11', 'P02', 'P05', 'P09'],
    },
    {
      name: 'Comment show',
      mechanic: 'Last week’s comments are the script for the next episode.',
      cadence: '1 episode a week, each built from the comments',
      reasonToReturn: 'If you comment, you might end up in the next episode.',
    },
  ),
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

const SOCIAL_RELEVANCE: Record<TinyGoal, string> = localized(
  {
    reach: 'Auf Social entscheidet Sekunde eins, ob überhaupt jemand bleibt.',
    community: 'Auf Social zählt nicht, wer den Post sieht, sondern wer danach antwortet.',
    positioning: 'Auf Social merkt sich niemand Claims, sondern Haltung, die sich wiederholt.',
    conversion: 'Auf Social kauft niemand vom Plakat, sondern von dem, dem er schon vertraut.',
  },
  {
    reach: 'On social, the first second decides whether anyone stays at all.',
    community: 'On social, what counts is not who sees the post but who replies afterwards.',
    positioning: 'On social, nobody remembers claims. They remember a stance that keeps showing up.',
    conversion: 'On social, nobody buys from a billboard. They buy from someone they already trust.',
  },
);

const KPIS: Record<TinyGoal, string> = localized(
  {
    reach: 'Hook-Rate (Views über 3 Sekunden), Shares pro 1.000 Views',
    community: 'Kommentare mit mehr als 5 Wörtern, DMs, wiederkehrende Accounts',
    positioning: 'Saves, Profilbesuche, Kommentare, die die Haltung wiederholen',
    conversion: 'Link-Klicks, DM-Anfragen mit Kaufabsicht, Saves',
  },
  {
    reach: 'Hook rate (views over 3 seconds), shares per 1,000 views',
    community: 'Comments longer than 5 words, DMs, returning accounts',
    positioning: 'Saves, profile visits, comments that repeat the stance',
    conversion: 'Link clicks, DM enquiries with purchase intent, saves',
  },
);

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString(dateLocale(), { weekday: 'long', day: 'numeric', month: 'long' });
}

export function crispDrafts(t: TinyState, projectName = ''): Record<CrispKey, string> {
  const sentence = problemSentence(t) || tr(`${topicOf(t, projectName)} braucht einen klaren Zugang auf Social.`, `${topicOf(t, projectName)} needs a clear way in on social.`);
  const relevance = t.goal ? SOCIAL_RELEVANCE[t.goal] : tr('Auf Social zählt, was nach dem Post passiert.', 'On social, what counts is what happens after the post.');
  const principles = activePrinciples(t);
  const pLine = principles.map((id) => `${id} ${PRINCIPLES_BY_ID[id]?.name ?? ''}`.trim()).join(', ');
  const [f1] = tinyFormats(t);
  const hooks = tinyHooks(t, projectName);

  return {
    c: `${sentence} ${relevance}`,
    r: [
      `- ${tr('Plattform', 'Platform')}: ${t.platforms.length ? t.platforms.join(', ') : tr('offen', 'open')}${isShortForm(t) ? ', 9:16' : ''}`,
      `- ${tr('Zielgruppe', 'Audience')}: ${clean(t.audience) || tr('offen', 'open')}`,
      `- ${tr('Erfolg', 'Success')}: ${t.goal ? KPIS[t.goal] : tr('offen — erst Ziel festlegen', 'open: set a goal first')}${clean(t.shiftAction) ? `. ${tr('Handlung', 'Action')}: ${clean(t.shiftAction)}` : ''}`,
    ].join('\n'),
    i: [
      clean(t.shiftNow) && clean(t.shiftNext)
        ? tr(`Shift: von „${clean(t.shiftNow)}“ zu „${clean(t.shiftNext)}“.`, `Shift: from “${clean(t.shiftNow)}” to “${clean(t.shiftNext)}”.`)
        : '',
      f1
        ? tr(`Kein Einzelpost, sondern ein Format: ${f1.name} auf ${platformLabel(t)}. Leitplanken: ${pLine}.`, `Not a single post but a format: ${f1.name} on ${platformLabel(t)}. Guardrails: ${pLine}.`)
        : tr(`Leitplanken: ${pLine}.`, `Guardrails: ${pLine}.`),
    ]
      .filter(Boolean)
      .join(' '),
    s: [
      tr(
        `1. Hook-Test: „${hooks[0]?.hook ?? 'Hook 1'}“ in 3 Varianten als Rohschnitt — Owner: offen — bis ${addDays(2)}`,
        `1. Hook test: “${hooks[0]?.hook ?? 'Hook 1'}” in 3 variants as a rough cut. Owner: open. By ${addDays(2)}`,
      ),
      tr(
        `2. Pilot: erste Folge „${f1?.name ?? 'Format'}“ drehen und posten — Owner: offen — bis ${addDays(7)}`,
        `2. Pilot: shoot and post the first episode of “${f1?.name ?? 'Format'}”. Owner: open. By ${addDays(7)}`,
      ),
      tr(
        `3. Post-Post auswerten: Kommentare und DMs sortieren, Folge 2 daraus bauen — Owner: offen — bis ${addDays(14)}`,
        `3. Review the post-post: sort comments and DMs, build episode 2 from them. Owner: open. By ${addDays(14)}`,
      ),
    ].join('\n'),
    p: '',
  };
}

export function next72Draft(t: TinyState, projectName = ''): string {
  const hook = tinyHooks(t, projectName)[0];
  const audience = clean(t.audience) || tr('Leuten aus der Zielgruppe', 'people from the audience');
  if (getLang() === 'en') {
    return [
      `By ${addDays(3)}:`,
      `- Shoot “${hook?.hook ?? 'Hook 1'}” on your phone, 3 variants, uncut.`,
      `- Send it to 5 people who belong to “${audience}”. One question: would you forward this?`,
      `- Post the variant with the most yeses. Note down the comments from the first 24 hours.`,
    ].join('\n');
  }
  return [
    `Bis ${addDays(3)}:`,
    `- „${hook?.hook ?? 'Hook 1'}“ mit dem Handy drehen, 3 Varianten, ungeschnitten.`,
    `- An 5 Menschen schicken, die zu „${audience}“ gehören. Eine Frage: Würdest du das weiterleiten?`,
    `- Die Variante mit den meisten Ja posten. Kommentare der ersten 24 Stunden mitschreiben.`,
  ].join('\n');
}

// ---------- Leo liest mit ----------

const BROAD_AUDIENCE = ['alle', 'jeder', 'jedermann', 'menschen', 'zielgruppe', 'kunden', 'konsumenten', 'millennials', 'gen z', 'junge leute', 'die breite masse',
  'everyone', 'everybody', 'people', 'target group', 'customers', 'consumers', 'young people', 'the masses'];
const SYMPTOM_WORDS = ['algorithmus', 'reichweite', 'sichtbarkeit', 'zu wenig', 'nicht genug', 'qualität', 'budget', 'algorithm', 'reach', 'visibility', 'not enough', 'quality'];

export function tinyChecks(t: TinyState): LeoCommentItem[] {
  const out: LeoCommentItem[] = [];
  const aud = t.audience.trim();

  if (aud && (hasWord(aud, BROAD_AUDIENCE) || aud.split(/\s+/).length < 3)) {
    out.push({ tone: 'flag', principleId: 'P12', text: tr('Das ist eine Persona, keine Person. Wen genau siehst du vor dir — Alter, Alltag, eine Gewohnheit?', 'That is a persona, not a person. Who exactly do you see? Age, daily life, one habit?') });
  }
  if (t.problemIssue.trim() && !t.problemBecause.trim()) {
    out.push({ tone: 'flag', text: tr('Ohne BECAUSE ist das ein Symptom. Warum passiert das?', 'Without a BECAUSE this is a symptom. Why does it happen?') });
  }
  const because = t.problemBecause.toLowerCase();
  if (because && hasWord(because, SYMPTOM_WORDS) && because.split(/\s+/).length < 10) {
    out.push({ tone: 'flag', text: tr('Dein BECAUSE beschreibt das Problem noch mal, statt es zu erklären. Frag eine Ebene tiefer.', 'Your BECAUSE describes the problem again instead of explaining it. Ask one level deeper.') });
  }
  if (!t.constraint.trim() && (t.goal || aud)) {
    out.push({ tone: 'idea', text: tr('Keine Grenze angegeben. Ohne Grenze wird alles möglich — und nichts fertig. Zeit, Budget, No-Go?', 'No constraint given. Without one, everything is possible and nothing gets finished. Time, budget, no-go?') });
  }
  if (t.platforms.length > 2) {
    out.push({ tone: 'idea', principleId: 'P10', text: tr(`${t.platforms.length} Plattformen sind ${t.platforms.length} Formate. Starte auf einer, die anderen kommen später.`, `${t.platforms.length} platforms are ${t.platforms.length} formats. Start on one, the others come later.`) });
  }
  if (t.goal === 'conversion' && t.platforms.includes('TikTok') && !t.principles.includes('P23')) {
    out.push({ tone: 'idea', principleId: 'P23', text: tr('Conversion auf TikTok läuft über Beweise, nicht über Claims. P23 mitnehmen.', 'Conversion on TikTok runs on proof, not claims. Take P23 along.') });
  }
  if (t.problemIssue.trim() && t.problemBecause.trim() && out.every((c) => c.tone !== 'flag')) {
    out.push({ tone: 'praise', text: tr('Problem mit BECAUSE steht. Damit kann man arbeiten.', 'Problem with a BECAUSE is in place. You can work with that.') });
  }
  return [...out, ...tinyProvocations(t, 2)];
}

// ---------- Fortschritt ----------

export function tinySteps(t: TinyState): { label: string; done: boolean }[] {
  return [
    { label: tr('Inputs', 'Inputs'), done: !!t.goal && t.platforms.length > 0 && !!t.audience.trim() && !!t.constraint.trim() },
    { label: tr('Problem-Frame', 'Problem frame'), done: !!t.problemIssue.trim() && !!t.problemBecause.trim() },
    { label: tr('Playbook', 'Playbook'), done: t.principles.length >= 2 },
    { label: tr('Hooks & Formate', 'Hooks & formats'), done: t.passedHooks.length > 0 },
    { label: 'Mini-CRISP', done: (['c', 'r', 'i', 's'] as CrispKey[]).every((k) => !!t.crisp[k].trim()) },
    { label: tr('Next 72 Hours', 'Next 72 hours'), done: !!t.next72.trim() },
  ];
}
