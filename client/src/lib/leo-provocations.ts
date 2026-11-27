// "Leo stört" — Stör-Fragen statt Pflichtfelder.
// Kuratiert und auf Deutsch neu geschrieben, inspiriert von gängigen Strategen-Fragelisten.
// Deterministisch: Jede Frage hat eine Bedingung. Es werden höchstens 2 gleichzeitig gezeigt.

import type { SessionState, TinyState, ModuleId, LeoCommentItem } from './types';
import { tr } from './i18n';

type Ctx = {
  /** alle Texte zusammen, kleingeschrieben */
  all: string;
  get: (id: string) => string;
  scope: ModuleId | 'tiny' | 'overview';
};

type Provocation = {
  id: string;
  text: string;
  principleId?: string;
  scopes: (ModuleId | 'tiny' | 'overview')[];
  when: (c: Ctx) => boolean;
};

const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
const hasAny = (s: string, list: string[]) => list.some((w) => s.toLowerCase().includes(w));

const BUZZ = ['innovativ', 'einzigartig', 'ganzheitlich', 'synergie', 'mehrwert', 'premium', 'qualität', 'authentisch', 'nachhaltig', 'lösung', 'leidenschaft',
  'innovative', 'unique', 'holistic', 'synergy', 'added value', 'quality', 'authentic', 'sustainable', 'solution', 'passion', 'world-class'];
const BROAD = ['alle', 'jeder', 'menschen', 'kunden', 'zielgruppe', 'jung', 'breite', 'everyone', 'everybody', 'people', 'customers', 'target group', 'young'];
const SYMPTOM = ['reichweite', 'algorithmus', 'sichtbarkeit', 'zu wenig', 'nicht genug', 'engagement', 'reach', 'algorithm', 'visibility', 'not enough', 'too few'];
const TREND = ['trend', 'viral', 'algorithmus', 'hashtag', 'challenge', 'algorithm'];
const OFFLINE = ['offline', 'vor ort', 'event', 'laden', 'halle', 'training', 'verein', 'live', 'store', 'on site', 'in person', 'shop', 'club', 'venue'];

const PROVOCATIONS: Provocation[] = [
  {
    id: 'symptom',
    text: 'Löst du gerade ein Symptom oder die Ursache?',
    scopes: ['tiny', 'brief', 'overview'],
    when: (c) => hasAny(c.get('because') + ' ' + c.get('brief_purpose'), SYMPTOM),
  },
  {
    id: 'who_said',
    text: 'Wer hat entschieden, dass das das richtige Problem ist? Und woher weiß diese Person das?',
    scopes: ['tiny', 'brief'],
    when: (c) => !!c.get('issue') || !!c.get('brief_purpose'),
  },
  {
    id: 'allows',
    text: 'Was macht das Problem überhaupt erst möglich?',
    scopes: ['tiny'],
    when: (c) => !!c.get('because') && words(c.get('because')) < 8,
  },
  {
    id: 'unique_access',
    text: 'Alle kommen an dieselben Kunden ran. Was hat diese Marke, was sonst niemand hat?',
    principleId: 'P05',
    scopes: ['starter', 'deepdive', 'tiny', 'overview'],
    when: (c) => (c.scope === 'tiny' ? !!c.get('audience') : !c.get('brand_competition') || words(c.get('brand_competition')) < 8),
  },
  {
    id: 'twelve',
    text: 'Würde ein Zwölfjähriger verstehen, was ihr macht?',
    scopes: ['starter', 'madlibs', 'overview'],
    when: (c) => words(c.get('work_what')) > 40 || hasAny(c.get('work_what'), BUZZ),
  },
  {
    id: 'what_mean',
    text: 'Was genau meinst du damit? Sag es ohne Adjektive.',
    scopes: ['starter', 'brief', 'product', 'overview'],
    when: (c) => hasAny(c.all, BUZZ),
  },
  {
    id: 'not_selling',
    text: 'Wen sprecht ihr bewusst nicht an?',
    principleId: 'P12',
    scopes: ['starter', 'brief', 'tiny', 'overview'],
    when: (c) => {
      const aud = (c.get('audience') + ' ' + c.get('audience_know') + ' ' + c.get('brief_audience')).toLowerCase();
      return BROAD.some((w) => new RegExp(`(^|[^a-zäöüß])${w}([^a-zäöüß]|$)`).test(aud));
    },
  },
  {
    id: 'so_what',
    text: 'Und? Warum sollte das irgendwen interessieren?',
    scopes: ['brief', 'overview'],
    when: (c) => !!c.get('brief_say') && !c.get('brief_improve'),
  },
  {
    id: 'would_be_true',
    text: 'Was müsste wahr sein, damit das klappt? Schreib den Satz: Wenn ___ wahr ist, können wir …',
    scopes: ['starter', 'brief'],
    when: (c) => !!c.get('mission_goals') || !!c.get('brief_goals'),
  },
  {
    id: 'what_changes',
    text: 'Wenn alles richtig läuft: Was ändert sich konkret, und woran merkst du es?',
    scopes: ['starter', 'tiny'],
    when: (c) => (c.scope === 'tiny' ? !!c.get('goal') && !c.get('shiftNext') : words(c.get('mission_world')) > 0 && words(c.get('mission_world')) < 10),
  },
  {
    id: 'shift_missing',
    text: 'Was glauben die Leute heute über euch, was falsch ist? Ohne diesen Satz gibt es keinen Shift.',
    principleId: 'P24',
    scopes: ['brief', 'tiny', 'overview'],
    when: (c) => !!(c.get('brief_say') || c.get('issue')) && !(c.get('brief_believe_now') || c.get('shiftNow')),
  },
  {
    id: 'controversy',
    text: 'Wo ist die Reibung? Ohne Widerspruch keine Kommentare.',
    principleId: 'P11',
    scopes: ['brief', 'tiny'],
    when: (c) => (c.scope === 'tiny' ? c.get('goal') === 'positioning' || c.get('goal') === 'community' : !!c.get('brief_narrative')),
  },
  {
    id: 'leave_behind',
    text: 'Was lasst ihr bewusst weg?',
    scopes: ['starter', 'product'],
    when: (c) => (c.get('mission_top3') + c.get('pq_can')).split(/[,\n;]/).length > 5,
  },
  {
    id: 'bare_minimum',
    text: 'Was ist das absolute Minimum, das funktionieren muss?',
    scopes: ['tiny'],
    when: (c) => hasAny(c.get('constraint'), ['zeit', 'budget', 'woche', 'tage', 'allein', 'handy', 'time', 'week', 'days', 'alone', 'phone']),
  },
  {
    id: 'offline',
    text: 'Was ist das Relevanteste an dem Thema, das zu 100 % offline passiert?',
    principleId: 'P07',
    scopes: ['tiny', 'product', 'casestudy'],
    when: (c) => (c.get('issue') || c.get('pq_what') || c.get('cs_what')) !== '' && !hasAny(c.all, OFFLINE),
  },
  {
    id: 'halflife',
    text: 'Läuft das in sechs Wochen noch, oder baut ihr auf Sand?',
    principleId: 'P13',
    scopes: ['tiny', 'brief', 'overview'],
    when: (c) => hasAny(c.all, ['trend', 'viral', 'hype']),
  },
  {
    id: 'no_story',
    text: 'Braucht dieser Post überhaupt eine Story? Oder reicht es, klar zu sagen, was es ist?',
    principleId: 'P03',
    scopes: ['tiny', 'brief', 'copyedit', 'overview'],
    when: (c) => hasAny(c.all, ['story', 'geschichte', 'mythos', 'manifest', 'erzählen', 'storytelling', 'narrative', 'myth', 'manifesto']),
  },
  {
    id: 'challenge_behavior',
    text: 'Was könntet ihr tun, das Social-Verhalten herausfordert, statt ihm zu folgen?',
    principleId: 'P21',
    scopes: ['tiny', 'brief', 'overview'],
    when: (c) => hasAny(c.all, TREND),
  },
  {
    id: 'outside_industry',
    text: 'Hast du das jemandem außerhalb der Branche erklärt? Was hat die Person zurückgefragt?',
    scopes: ['starter', 'product'],
    when: (c) => words(c.get('work_industry')) > 25,
  },
  {
    id: 'mood_buy',
    text: 'In welcher Stimmung sind Menschen, wenn sie kaufen oder buchen?',
    scopes: ['tiny', 'product'],
    when: (c) => c.get('goal') === 'conversion' || !!c.get('pq_where'),
  },
  {
    id: 'investigative',
    text: 'Stell dir vor, du recherchierst als Investigativjournalist über deine Zielgruppe. Wo fängst du an?',
    principleId: 'P05',
    scopes: ['starter', 'deepdive'],
    when: (c) => words(c.get('audience_know')) > 0 && words(c.get('audience_know')) < 12,
  },
  {
    id: 'ugly_first',
    text: 'Hast du es erst hässlich geschrieben, bevor du es schön gemacht hast?',
    principleId: 'P01',
    scopes: ['madlibs', 'style'],
    when: (c) => !!c.get('product_name') || !!c.get('style_attract'),
  },
  {
    id: 'now_what',
    text: 'Und jetzt? Was passiert morgen früh als Erstes?',
    scopes: ['tiny', 'brief'],
    when: (c) => (c.scope === 'tiny' ? !!c.get('crisp') && !c.get('next72') : !!c.get('brief_purpose') && !c.get('brief_next')),
  },
];

const TEXT_EN: Record<string, string> = {
  symptom: 'Are you solving a symptom or the cause?',
  who_said: 'Who decided this is the right problem? And how does that person know?',
  allows: 'What makes the problem possible in the first place?',
  unique_access: 'Everyone can reach the same customers. What does this brand have that nobody else has?',
  twelve: 'Would a twelve-year-old understand what you do?',
  what_mean: 'What exactly do you mean? Say it without adjectives.',
  not_selling: 'Who are you deliberately not talking to?',
  so_what: 'So what? Why should anyone care?',
  would_be_true: 'What would have to be true for this to work? Write the sentence: If ___ is true, we can …',
  what_changes: 'If everything goes right: what concretely changes, and how will you notice?',
  shift_missing: 'What do people believe about you today that is wrong? Without that sentence there is no shift.',
  controversy: 'Where is the friction? No contradiction, no comments.',
  leave_behind: 'What are you deliberately leaving out?',
  bare_minimum: 'What is the absolute minimum that has to work?',
  offline: 'What is the most relevant part of this topic that happens 100 % offline?',
  halflife: 'Will this still work in six weeks, or are you building on sand?',
  no_story: 'Does this post even need a story? Or is it enough to say clearly what it is?',
  challenge_behavior: 'What could you do that challenges social behaviour instead of following it?',
  outside_industry: 'Have you explained this to someone outside the industry? What did they ask back?',
  mood_buy: 'What mood are people in when they buy or book?',
  investigative: 'Imagine you are an investigative journalist researching your audience. Where do you start?',
  ugly_first: 'Did you write it ugly first, before you made it pretty?',
  now_what: 'And now? What happens first thing tomorrow morning?',
};

const ofValue = (v: unknown): string =>
  typeof v === 'string' ? v : Array.isArray(v) ? v.join(', ') : '';

function sessionCtx(s: SessionState, scope: Ctx['scope']): Ctx {
  const flat: Record<string, string> = {};
  for (const mod of Object.values(s.modules)) {
    for (const [k, v] of Object.entries(mod.answers)) flat[k] = ofValue(v);
    (mod.caseStudies ?? []).forEach((cs) => {
      for (const [k, v] of Object.entries(cs)) flat[k] = (flat[k] ? flat[k] + ' ' : '') + (v ?? '');
    });
  }
  // nur die Texte des aktuellen Moduls zählen für "all", sonst alles
  const scoped =
    scope !== 'overview' && scope !== 'tiny' && s.modules[scope]
      ? Object.values(s.modules[scope].answers).map(ofValue)
      : Object.values(flat);
  return { all: scoped.join(' ').toLowerCase(), get: (id) => (flat[id] ?? '').trim(), scope };
}

function tinyCtx(t: TinyState): Ctx {
  const map: Record<string, string> = {
    issue: t.problemIssue,
    because: t.problemBecause,
    audience: t.audience,
    constraint: t.constraint,
    goal: t.goal,
    shiftNow: t.shiftNow,
    shiftNext: t.shiftNext,
    crisp: Object.values(t.crisp).join(' '),
    next72: t.next72,
  };
  const all = [t.topic, t.problemIssue, t.problemBecause, t.audience, t.constraint, t.shiftNow, t.shiftNext].join(' ').toLowerCase();
  return { all, get: (id) => (map[id] ?? '').trim(), scope: 'tiny' };
}

// Spezifische Fragen zuerst, die allgemeinen (immer passenden) zuletzt
const GENERIC = ['who_said', 'unique_access', 'would_be_true'];
const ORDERED = [
  ...PROVOCATIONS.filter((p) => !GENERIC.includes(p.id)),
  ...GENERIC.map((id) => PROVOCATIONS.find((p) => p.id === id)!),
];

function pick(c: Ctx, max: number): LeoCommentItem[] {
  return ORDERED.filter((p) => p.scopes.includes(c.scope))
    .filter((p) => {
      try {
        return p.when(c);
      } catch {
        return false;
      }
    })
    .slice(0, max)
    .map((p) => ({ tone: 'question' as const, text: tr(p.text, TEXT_EN[p.id] ?? p.text), principleId: p.principleId }));
}

/** Für die lange Session: Übersicht/Report ('overview') oder ein einzelnes Modul */
export function provocations(s: SessionState, scope: ModuleId | 'overview' = 'overview', max = 2): LeoCommentItem[] {
  return pick(sessionCtx(s, scope), max);
}

export function tinyProvocations(t: TinyState, max = 2): LeoCommentItem[] {
  return pick(tinyCtx(t), max);
}
