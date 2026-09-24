export type ModuleId =
  | 'starter'
  | 'madlibs'
  | 'product'
  | 'casestudy'
  | 'brief'
  | 'style'
  | 'copyedit';

export const MODULE_ORDER: ModuleId[] = [
  'starter',
  'madlibs',
  'product',
  'casestudy',
  'brief',
  'style',
  'copyedit',
];

export const MODULE_META: Record<
  ModuleId,
  { number: string; title: string; subtitle: string; description: string }
> = {
  starter: {
    number: '01',
    title: 'Starter Questions',
    subtitle: 'Wer bist du, was tust du, für wen',
    description:
      'Das Fundament. Fünf Sektionen — Work, Mission, Audience, Brand, Workflow. Antworte direkt, ohne Marketing-Sprech.',
  },
  madlibs: {
    number: '02',
    title: 'Product Mad Libs',
    subtitle: 'Verdichte das Was in einem Satz',
    description:
      'Lückentext. Du füllst die Wörter aus, der Satz formt sich. Schreibe Varianten, die beste verdichtet was du wirklich tust.',
  },
  product: {
    number: '03',
    title: 'Product Questions',
    subtitle: 'Fakten sammeln, Geschichte erzählen',
    description:
      'Drei Sektionen — Fakten, Story, Anordnung. Hier wird das Produkt anfassbar.',
  },
  casestudy: {
    number: '04',
    title: 'Case Studies',
    subtitle: 'Was du schon gemacht hast — und was es bewirkt hat',
    description:
      'Mehrere Cases möglich. Ergebnisse zählen, nicht Adjektive.',
  },
  brief: {
    number: '05',
    title: 'Project Brief',
    subtitle: 'Summary, Company, Audience, Story, Style',
    description:
      'Das klassische Briefing. Verdichtet und auf den Punkt.',
  },
  style: {
    number: '06',
    title: 'Style Attributes',
    subtitle: 'Wie soll deine Marke klingen',
    description:
      'Fünfundfünfzig Adjektive. Wähle bis zu fünf, die dich anziehen, und drei, die dich abstoßen.',
  },
  copyedit: {
    number: '07',
    title: 'Copyediting Checklist',
    subtitle: 'Style-Guide-Entscheidungen',
    description:
      'Damit Texte konsistent sind. Punkte in Akronymen, Datumsformate, Oxford-Komma — der ganze Kram.',
  },
};

export type QuestionType = 'text' | 'textarea' | 'select' | 'radio';

export type Question = {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  section?: string;
};

export type CaseStudyEntry = {
  cs_name?: string;
  cs_what?: string;
  cs_audience?: string;
  cs_unique?: string;
  cs_results?: string;
  cs_quotes?: string;
};

export type ModuleState = {
  id: ModuleId;
  answers: Record<string, string | string[]>;
  caseStudies?: CaseStudyEntry[];
  completedAt?: number;
};

export type TrackId = 'founder' | 'product' | 'agency' | 'refresh';

export const TRACKS: Record<TrackId, {
  id: TrackId;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  questionCount: number;
}> = {
  founder: {
    id: 'founder',
    code: '01 / FB',
    name: 'Founder Brand',
    subtitle: 'Solo, Coach, Personal Brand, Athlet',
    description: 'Eine Person ist die Marke. Du verkaufst dich selbst — deine Erfahrung, deine Haltung, deine Stimme.',
    questionCount: 28,
  },
  product: {
    id: 'product',
    code: '02 / PL',
    name: 'Product Launch',
    subtitle: 'App, Tool, physisches Produkt, SaaS',
    description: 'Etwas Neues kommt auf den Markt. Hartes Was, klare Zielgruppe, klarer Use-Case.',
    questionCount: 42,
  },
  agency: {
    id: 'agency',
    code: '03 / AS',
    name: 'Agency / Studio',
    subtitle: 'Dienstleister, Kreativbüro, Beratung',
    description: 'Du verkaufst Expertise, nicht Stückgut. Case Studies, Pitch-Logik, Nischen-Autorität.',
    questionCount: 35,
  },
  refresh: {
    id: 'refresh',
    code: '04 / BR',
    name: 'Brand Refresh',
    subtitle: 'Etablierte Marke, Repositioning, Audit',
    description: 'Existiert schon, will sich neu sortieren. Hat Daten, hat Geschichte, hat Altlasten.',
    questionCount: 45,
  },
};

// ---------- Tiny Mode (leo-tiny-framework.md) ----------

export type TinyGoal = 'reach' | 'community' | 'positioning' | 'conversion';
export type ProblemType = 'Category' | 'Product' | 'Brand' | 'Culture';
export type CrispKey = 'c' | 'r' | 'i' | 's' | 'p';

export type TinyState = {
  topic: string;
  goal: TinyGoal | '';
  platforms: string[];
  audience: string;
  constraint: string;
  problemIssue: string;
  problemBecause: string;
  problemType: ProblemType | '';
  principles: string[];
  passedHooks: string[]; // principleIds der Hooks, die den Group-Chat-Test bestehen
  crisp: Record<CrispKey, string>;
  next72: string;
};

export type SessionState = {
  clientName: string;
  projectName: string;
  track: TrackId | null;
  startedAt: number;
  modules: Record<ModuleId, ModuleState>;
  currentModule: ModuleId | null;
  tiny: TinyState;
};

export type Principle = {
  id: string;
  name: string;
  source: string;
  rule: string;
  leosCheck: string;
  triggers: string[];
  antiTriggers: string[];
};

export type LeoCommentItem = {
  tone: 'praise' | 'flag' | 'idea';
  text: string;
  principleId?: string;
};

export type Hook = {
  hook: string;
  format: string;
  platform: string[];
  principleId: string;
  reason: string;
};

export type FormatRecommendation = {
  name: string;
  description: string;
  platforms: string[];
  cadence: string;
  reasonToReturn: string;
  principles: string[];
};

export type Persona = {
  oneLiner: string;
  voice: string[];
  avoid: string[];
  audience: string;
  promise: string;
};
