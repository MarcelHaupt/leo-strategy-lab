import type { SessionState, LeoCommentItem, Hook, FormatRecommendation, Persona, TrackId } from './types';
import { PRINCIPLES } from './playbook';

const TRACK_HOOK_BIAS: Record<TrackId, { formats: string[]; principles: string[] }> = {
  founder:  { formats: ['Reel', 'Story', 'POV-Video'],            principles: ['P22', 'P07', 'P25'] },
  product:  { formats: ['Carousel', 'Reveal', 'BTS'],             principles: ['P06', 'P03', 'P19'] },
  agency:   { formats: ['Case Study', 'Carousel', 'Newsletter'],  principles: ['P23', 'P12', 'P20'] },
  refresh:  { formats: ['Manifesto', 'Series', 'Anti-Recap'],     principles: ['P24', 'P21', 'P13'] },
};

// 1. Score-Berechnung pro Antwort
export function scoreAnswer(text: string): {
  score: number;
  matchedPrinciples: string[];
  violatedPrinciples: string[];
} {
  if (!text || !text.trim()) {
    return { score: 0, matchedPrinciples: [], violatedPrinciples: [] };
  }
  const lower = text.toLowerCase();
  const matched: string[] = [];
  const violated: string[] = [];

  for (const p of PRINCIPLES) {
    const triggerHits = p.triggers.filter((t) => lower.includes(t.toLowerCase())).length;
    const antiHits = p.antiTriggers.filter((t) => lower.includes(t.toLowerCase())).length;
    if (triggerHits >= 1) matched.push(p.id);
    if (antiHits >= 1) violated.push(p.id);
  }

  const wordCount = text.trim().split(/\s+/).length;
  const lengthScore = Math.min(40, wordCount * 0.8);
  const specificityScore = Math.min(20, (text.match(/\d+|"[^"]+"|„[^"]+"/g)?.length ?? 0) * 5);
  const principleScore = Math.min(40, matched.length * 8) - violated.length * 6;
  const total = Math.max(0, Math.min(100, lengthScore + specificityScore + principleScore));

  return { score: Math.round(total), matchedPrinciples: matched, violatedPrinciples: violated };
}

// Helper: collect all text answers across modules
function allAnswers(s: SessionState): { moduleId: string; questionId: string; text: string }[] {
  const out: { moduleId: string; questionId: string; text: string }[] = [];
  for (const [moduleId, mod] of Object.entries(s.modules)) {
    for (const [qid, val] of Object.entries(mod.answers)) {
      if (typeof val === 'string') out.push({ moduleId, questionId: qid, text: val });
    }
    if (moduleId === 'casestudy' && mod.caseStudies) {
      mod.caseStudies.forEach((cs, i) => {
        for (const [k, v] of Object.entries(cs)) {
          if (typeof v === 'string' && v) out.push({ moduleId, questionId: `${k}_${i}`, text: v });
        }
      });
    }
  }
  return out;
}

// 2. Session-Score
export function sessionScore(s: SessionState): number {
  const answers = allAnswers(s).filter((a) => a.text.trim().length > 0);
  if (answers.length === 0) return 0;
  const sum = answers.reduce((acc, a) => acc + scoreAnswer(a.text).score, 0);
  return Math.round(sum / answers.length);
}

// 3. LEO Kommentar-Generator
export function leoComments(s: SessionState): LeoCommentItem[] {
  const out: LeoCommentItem[] = [];
  const answers = allAnswers(s);
  const totalText = answers.map((a) => a.text).join(' ').toLowerCase();
  const totalWords = answers.reduce((acc, a) => acc + a.text.trim().split(/\s+/).length, 0);

  // Praise: substantive answers
  if (totalWords > 200) {
    out.push({
      tone: 'praise',
      text: 'Hier steckt Substanz. Du arbeitest, du redest nicht nur. P05 wird sichtbar.',
      principleId: 'P05',
    });
  }

  // Flag: marketing-speak
  const marketingFlags = ['innovativ', 'lösung', 'synergi', 'best-in-class', 'world-class', 'next level', 'state of the art', 'disruptiv'];
  const flagsHit = marketingFlags.filter((f) => totalText.includes(f));
  if (flagsHit.length >= 1) {
    out.push({
      tone: 'flag',
      text: `Wörter wie „${flagsHit[0]}“ sind Pitch-Deck-Möbel. P04 fehlt — das klingt nach Broadcast, nicht nach Subkultur.`,
      principleId: 'P04',
    });
  }

  // Flag: vagueness
  const vagueAnswers = answers.filter((a) => a.text.trim().split(/\s+/).length < 6 && a.text.trim().length > 0);
  if (vagueAnswers.length >= 4) {
    out.push({
      tone: 'flag',
      text: `${vagueAnswers.length} Antworten haben weniger als sechs Wörter. Das ist keine Strategie, das sind Notizen. Geh nochmal rein.`,
    });
  }

  // Idea: BTS
  const work = (s.modules.starter?.answers.work_what as string) ?? '';
  const workflow = (s.modules.starter?.answers.workflow_feedback as string) ?? '';
  if (work.length > 30 || workflow.length > 30) {
    out.push({
      tone: 'idea',
      text: 'Aus der Workflow-Antwort: Mach daraus eine BTS-Serie. Drei Folgen, ein Cliffhanger pro Post. P06 lebt.',
      principleId: 'P06',
    });
  }

  // Praise: numbers / receipts
  const receiptHits = totalText.match(/\d+/g)?.length ?? 0;
  if (receiptHits >= 3) {
    out.push({
      tone: 'praise',
      text: 'Zahlen statt Adjektive. P23 — Receipts and Proof. Genau so.',
      principleId: 'P23',
    });
  }

  // Idea: niche
  const audienceText = answers.filter((a) => a.questionId.includes('audience')).map((a) => a.text).join(' ');
  if (audienceText.length > 50 && !audienceText.toLowerCase().match(/breit|alle|jeder|massen/)) {
    out.push({
      tone: 'idea',
      text: 'Die Zielgruppe ist scharf gezeichnet. Bau einen Insider-Code ein — ein Wort, das nur diese Leute sofort erkennen. P16.',
      principleId: 'P16',
    });
  }

  // Flag: missing case studies (nur für Tracks, in denen Cases sichtbar sind)
  const csTrackRelevant = s.track === 'agency' || s.track === 'refresh' || s.track === null;
  if (csTrackRelevant) {
    const cs = s.modules.casestudy?.caseStudies ?? [];
    const csFilled = cs.filter((c) => c.cs_results || c.cs_what).length;
    if (csFilled === 0) {
      out.push({
        tone: 'flag',
        text: 'Keine Case Studies. Ohne Receipts ist die Position nur behauptet, nicht bewiesen. P23.',
        principleId: 'P23',
      });
    }
  }

  // Idea: format derivation
  const productName = (s.modules.madlibs?.answers.product_name as string) ?? '';
  if (productName) {
    out.push({
      tone: 'idea',
      text: `„${productName}“ hat einen Namen — jetzt braucht es ein Format. TV-Logik: Serial mit drei Folgen, ein Reason-to-Return pro Post. P08.`,
      principleId: 'P08',
    });
  }

  // Praise: style picked
  const attractCount = (s.modules.style?.answers.style_attract as string[] | undefined)?.length ?? 0;
  if (attractCount >= 3) {
    out.push({
      tone: 'praise',
      text: `${attractCount} Voice-Attribute gewählt. Damit hat dein Content endlich einen Ton, den man wiedererkennt. P14.`,
      principleId: 'P14',
    });
  }

  return out.slice(0, 8);
}

// 4. Verdichtung
export function compressPersona(s: SessionState): Persona {
  const ml = s.modules.madlibs?.answers ?? {};
  const starter = s.modules.starter?.answers ?? {};
  const styleMod = s.modules.style?.answers ?? {};

  const oneLiner = buildOneLiner(s);
  const voice = ((styleMod.style_attract as string[]) ?? []).slice(0, 5);
  const avoid = ((styleMod.style_avoid as string[]) ?? []).slice(0, 3);

  const audience = compress([
    ml.audience_noun as string,
    starter.audience_know as string,
    starter.audience_friend as string,
  ]);

  const promise = compress([
    starter.mission_world as string,
    starter.mission_matter as string,
    starter.mission_why as string,
  ]);

  return { oneLiner, voice, avoid, audience, promise };
}

function compress(parts: (string | undefined)[]): string {
  const filled = parts.filter((p) => p && p.trim()).map((p) => firstSentence(p!));
  if (filled.length === 0) return '—';
  return filled[0];
}

function firstSentence(text: string): string {
  const s = text.trim().split(/[.!?\n]/)[0];
  return s.length > 160 ? s.slice(0, 157) + '…' : s;
}

function buildOneLiner(s: SessionState): string {
  const ml = s.modules.madlibs?.answers ?? {};
  const name = (ml.product_name as string) ?? (s.projectName || 'Das Produkt');
  const helps = (ml.helps_lets as string) ?? 'hilft';
  const audience = (ml.audience_noun as string) ?? 'Menschen';
  const verb1 = (ml.verb1 as string) ?? '';
  const verb2 = (ml.verb2 as string) ?? '';
  const object = (ml.object as string) ?? '';
  const verb3 = (ml.verb3 as string) ?? '';
  const adverb = (ml.adverb as string) ?? '';

  if (verb1 && audience && object) {
    return `${name} ${helps} ${audience} ${verb1}${verb2 ? ` und ${verb2}` : ''} ${object}${verb3 ? `, damit sie ${verb3} ${adverb}` : ''}.`.replace(/\s+/g, ' ').trim();
  }
  // Fallback: starter work_what
  const work = (s.modules.starter?.answers.work_what as string) ?? '';
  if (work) return firstSentence(work);
  return 'Eine Marke, die noch verdichtet werden muss.';
}

// 5. Hooks — track-aware
export function deriveHooks(s: SessionState): Hook[] {
  const persona = compressPersona(s);
  const ml = s.modules.madlibs?.answers ?? {};
  const starter = s.modules.starter?.answers ?? {};
  const product = s.modules.product?.answers ?? {};

  const productName = (ml.product_name as string) || s.projectName || 'das Produkt';
  const audience = (ml.audience_noun as string) || 'sie';
  const verb1 = (ml.verb1 as string) || 'arbeiten';
  const industry = ((starter.work_industry as string) || 'der Branche').split(/[.,\n]/)[0].trim();
  const workflow = ((starter.workflow_feedback as string) || '').split(/\n/)[0];
  const process = ((product.pq_process as string) || '').split(/\n/)[0];
  const clientName = s.clientName || productName;

  // Track-spezifische Hooks
  const trackHooks: Record<TrackId, Hook[]> = {
    founder: [
      {
        hook: `Drei Dinge, die mich gekostet haben, bevor ich sie kapiert habe.`,
        format: 'Reel',
        platform: ['Instagram', 'TikTok'],
        principleId: 'P22',
        reason: 'Founder-Voice: Lessons aus erster Hand schlagen jede Theorie.',
      },
      {
        hook: `Was ich heute meinem 25-jährigen Ich sagen würde — über ${industry}.`,
        format: 'POV-Video',
        platform: ['TikTok', 'Instagram Reels'],
        principleId: 'P07',
        reason: 'Real-Life-First. Eine Person, eine Wahrheit, kein Skript.',
      },
      {
        hook: `Die unbequeme Frage, die ${audience} sich nie laut stellen.`,
        format: 'Story',
        platform: ['Instagram Stories'],
        principleId: 'P25',
        reason: 'Provokation als Einladung. Stories sind dein Beichtstuhl.',
      },
      {
        hook: workflow
          ? `Mein Tag, bevor ich verstanden habe, dass ${verb1} der falsche Hebel war.`
          : `Ein Tag in 60 Sekunden — ohne den Hochglanz-Filter.`,
        format: 'Reel',
        platform: ['Instagram', 'TikTok'],
        principleId: 'P01',
        reason: 'Smartly Unpolished. Lo-fi schlägt Marken-Optik.',
      },
      {
        hook: `${clientName} antwortet auf eure DMs — die schwierigen.`,
        format: 'Story-Reihe',
        platform: ['Instagram Stories'],
        principleId: 'P09',
        reason: 'Audience als Co-Conspirator. DM-Mining ist kostenlose Content-Pipeline.',
      },
    ],
    product: [
      {
        hook: `Was ${productName} kann — in einem Frame. Kein Voiceover, kein Logo.`,
        format: 'Carousel',
        platform: ['Instagram', 'LinkedIn'],
        principleId: 'P03',
        reason: 'Single-Frame Ambush. Frame 1 ist die ganze Geschichte.',
      },
      {
        hook: `Drei Versuche, bevor ${productName} so funktioniert hat, wie wir wollten.`,
        format: 'BTS',
        platform: ['Instagram Reels', 'TikTok'],
        principleId: 'P06',
        reason: 'BTS-First. Der Build ist spannender als der Launch.',
      },
      {
        hook: `Der Moment, in dem ${productName} zum ersten Mal richtig lief.`,
        format: 'Reveal',
        platform: ['TikTok', 'Instagram'],
        principleId: 'P19',
        reason: 'Aha-Moment als Format. Catharsis verkauft.',
      },
      {
        hook: workflow
          ? `So sieht unser Feedback-Loop aus — der Teil, der es nie ins Deck schafft.`
          : `${audience}, die ${productName} testen — ungeschnitten.`,
        format: 'Story-Reihe',
        platform: ['Instagram Stories'],
        principleId: 'P23',
        reason: 'Receipts statt Behauptungen. Echte Reaktionen, echte Zahlen.',
      },
      {
        hook: process
          ? `${productName}: was wir gelernt haben, bevor wir launchen konnten.`
          : `Eine Frage an euch: Was soll ${productName} als Nächstes können?`,
        format: 'Vote / Poll',
        platform: ['Instagram', 'TikTok'],
        principleId: 'P09',
        reason: 'Co-Creation. Die Roadmap wird zum Content.',
      },
    ],
    agency: [
      {
        hook: `${clientName} × ${audience}: was wir gemacht haben, was es bewirkt hat.`,
        format: 'Case Study',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P23',
        reason: 'Receipts. Ohne Cases ist Expertise nur eine Behauptung.',
      },
      {
        hook: `Drei Pitches, die wir abgelehnt haben — und warum.`,
        format: 'Carousel',
        platform: ['LinkedIn'],
        principleId: 'P12',
        reason: 'Anti-Selling als Positionierung. Wer Nein sagen kann, hat einen Standpunkt.',
      },
      {
        hook: `Was wir letzte Woche gelernt haben — der ehrliche Recap.`,
        format: 'Newsletter',
        platform: ['Email', 'LinkedIn'],
        principleId: 'P20',
        reason: 'Long-Form für die, die Tiefe wollen. Die Inbox ist ein Vertrauens-Kanal.',
      },
      {
        hook: `Was niemand über ${industry} laut sagt.`,
        format: 'Carousel',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P25',
        reason: 'Hot-Take als Hook. Eine klare Meinung schneidet durch.',
      },
      {
        hook: workflow
          ? `Wie wir ${audience} briefen — der echte Workshop, nicht das Deck.`
          : `Drei Methoden, die in jedem unserer Projekte vorkommen.`,
        format: 'BTS',
        platform: ['Instagram Reels', 'TikTok'],
        principleId: 'P06',
        reason: 'BTS verkauft Service besser als jeder Pitch.',
      },
    ],
    refresh: [
      {
        hook: `${clientName} im Jahr X — und warum wir jetzt einen anderen Weg gehen.`,
        format: 'Manifesto',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P24',
        reason: 'Manifesto-Moment. Repositioning braucht eine klare Ansage.',
      },
      {
        hook: `Was wir loslassen — und was bleibt.`,
        format: 'Series',
        platform: ['Instagram', 'LinkedIn'],
        principleId: 'P21',
        reason: 'Vorher / Nachher als Content-Architektur.',
      },
      {
        hook: `Anti-Recap: was bei ${clientName} nicht mehr funktioniert.`,
        format: 'Anti-Recap',
        platform: ['LinkedIn'],
        principleId: 'P13',
        reason: 'Selbstkritik öffentlich machen. Mut zur Lücke ist Differenzierer.',
      },
      {
        hook: `Drei Annahmen, mit denen wir aufräumen — und was stattdessen gilt.`,
        format: 'Carousel',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P25',
        reason: 'Konfrontation als Refresh-Logik. Nicht renovieren — neu denken.',
      },
      {
        hook: process
          ? `Wie wir ${clientName} neu sortiert haben — der ungeschnittene Prozess.`
          : `${clientName} hat sich verändert. Hier ist, was du als Nächstes siehst.`,
        format: 'BTS',
        platform: ['Instagram Reels', 'TikTok'],
        principleId: 'P06',
        reason: 'BTS-First. Der Refresh selbst ist Content.',
      },
    ],
  };

  const hooks = s.track ? trackHooks[s.track] : trackHooks.product;

  // Inject voice if present
  if (persona.voice.length > 0 && hooks[2]) {
    hooks[2].reason += ` Voice: ${persona.voice.slice(0, 3).join(', ')}.`;
  }

  return hooks;
}

// 6. Format-Empfehlungen — track-aware
export function formatRecommendations(s: SessionState): FormatRecommendation[] {
  const ml = s.modules.madlibs?.answers ?? {};
  const productName = (ml.product_name as string) || s.projectName || 'die Marke';
  const audience = (ml.audience_noun as string) || 'die Community';
  const clientName = s.clientName || productName;

  const byTrack: Record<TrackId, FormatRecommendation[]> = {
    founder: [
      {
        name: 'POV-Reels: Lessons from the Field',
        description: `Wöchentliches Reel: ${clientName} teilt eine konkrete Lektion. Eine Kamera, ein Take, kein Skript.`,
        platforms: ['Instagram Reels', 'TikTok'],
        cadence: 'wöchentlich',
        reasonToReturn: 'Jede Woche eine neue Lektion. Keine, die nicht weh tut.',
        principles: ['P22', 'P07', 'P01'],
      },
      {
        name: 'DM-Sprechstunde',
        description: `Story-Format: echte Fragen aus den DMs werden in Stories beantwortet. Niedrigschwellig, schnell, persönlich.`,
        platforms: ['Instagram Stories'],
        cadence: 'zweimal wöchentlich',
        reasonToReturn: 'Wer fragt, sieht sich selbst — und folgt.',
        principles: ['P09', 'P05', 'P14'],
      },
      {
        name: 'Studio-Diary',
        description: `Kurze, lo-fi Snapshots aus dem Alltag. Schreibtisch, Spaziergang, Trainingseinheit. Kein Inszenierungs-Budget.`,
        platforms: ['Instagram', 'TikTok'],
        cadence: 'täglich',
        reasonToReturn: 'Nähe als Currency. Die Marke ist eine Person — also zeig die Person.',
        principles: ['P25', 'P01', 'P07'],
      },
    ],
    product: [
      {
        name: 'Behind-the-Build Serial',
        description: `Wöchentliche Folge über die Entstehung von ${productName}. Rohmaterial, Sackgassen, Fehlversuche. Erst BTS, dann Reveal.`,
        platforms: ['Instagram Reels', 'TikTok'],
        cadence: 'wöchentlich',
        reasonToReturn: 'Cliffhanger am Ende jeder Folge. Nächste Woche: was nicht funktioniert hat.',
        principles: ['P06', 'P08', 'P01'],
      },
      {
        name: `${audience}-Voice Drops`,
        description: `Kurze Audiogramme aus DMs, Comments und Sprachnachrichten von echten ${audience}. Nicht inszeniert, ungeschnitten.`,
        platforms: ['TikTok', 'Instagram Stories'],
        cadence: 'zweimal wöchentlich',
        reasonToReturn: 'Jede Folge eine andere Stimme aus der Szene. Wer als Nächstes? Die Community entscheidet.',
        principles: ['P05', 'P09', 'P14'],
      },
      {
        name: 'Single-Frame Reveals',
        description: `Carousel oder Reel, dessen erstes Frame schon alles sagt. ${productName} in einem Bild — der Rest ist Beweis.`,
        platforms: ['Instagram', 'LinkedIn'],
        cadence: 'wöchentlich',
        reasonToReturn: 'Jeder Post ist ein neuer Standpunkt. Wer den Stil kennt, klickt.',
        principles: ['P03', 'P19', 'P23'],
      },
    ],
    agency: [
      {
        name: 'Case Study Drops',
        description: `Pro Projekt ein 6-Slide-Carousel: Problem, Insight, Idee, Execution, Ergebnis, Learnings. ${clientName} liefert die Belege.`,
        platforms: ['LinkedIn', 'Instagram'],
        cadence: 'monatlich',
        reasonToReturn: 'Echte Receipts. Wer hier folgt, hat Pitch-Material.',
        principles: ['P23', 'P12', 'P20'],
      },
      {
        name: 'Methoden-Newsletter',
        description: `Zweiwöchentlicher Newsletter mit einer angewandten Methode aus echten Projekten. Tools, Templates, Frames.`,
        platforms: ['Email', 'LinkedIn'],
        cadence: 'zweiwöchentlich',
        reasonToReturn: 'Long-Form-Tiefe für Entscheider. Inbox als Vertrauens-Channel.',
        principles: ['P20', 'P12', 'P23'],
      },
      {
        name: 'Pitch-BTS',
        description: `Reels aus dem Maschinenraum: Brainstorm, Wand voller Post-its, Kunden-Calls (anonymisiert). Die Arbeit IST der Content.`,
        platforms: ['Instagram Reels', 'TikTok'],
        cadence: 'wöchentlich',
        reasonToReturn: 'Wer den Prozess sieht, kauft schneller die Expertise.',
        principles: ['P06', 'P25', 'P01'],
      },
    ],
    refresh: [
      {
        name: 'Repositioning-Manifesto',
        description: `Eine zentrale Manifest-Kommunikation in mehreren Episoden: was bleibt, was geht, warum jetzt. ${clientName} setzt einen klaren Pflock.`,
        platforms: ['LinkedIn', 'Instagram'],
        cadence: 'einmalig + Echo',
        reasonToReturn: 'Repositioning als Story, nicht als Press-Release.',
        principles: ['P24', 'P21', 'P20'],
      },
      {
        name: 'Anti-Recap-Serie',
        description: `Was wir nicht mehr machen. Was wir falsch gesehen haben. Was wir lernen mussten. Wöchentlich, zwei Minuten, kein Hochglanz.`,
        platforms: ['LinkedIn', 'Instagram Reels'],
        cadence: 'wöchentlich',
        reasonToReturn: 'Selbstkritik baut mehr Vertrauen auf als jede Erfolgsmeldung.',
        principles: ['P13', 'P21', 'P01'],
      },
      {
        name: 'Refresh-Diary',
        description: `BTS des Refreshes selbst: Mood-Boards, verworfene Versionen, Kund:innen-Reaktionen. Der Wandel als laufende Geschichte.`,
        platforms: ['Instagram Stories', 'TikTok'],
        cadence: 'mehrfach pro Woche',
        reasonToReturn: 'Veränderung ist ein Prozess. Wer dranbleibt, fühlt sich beteiligt.',
        principles: ['P06', 'P09', 'P25'],
      },
    ],
  };

  return s.track ? byTrack[s.track] : byTrack.product;
}

export function trackBias(track: TrackId | null) {
  if (!track) return null;
  return TRACK_HOOK_BIAS[track];
}

// Risiken: aggregate violated principles + low-score answers
export function risks(s: SessionState): {
  violatedPrinciples: { id: string; count: number }[];
  weakAnswers: { moduleId: string; questionId: string; score: number }[];
} {
  const counter: Record<string, number> = {};
  const weak: { moduleId: string; questionId: string; score: number }[] = [];
  for (const a of allAnswers(s)) {
    if (!a.text.trim()) continue;
    const r = scoreAnswer(a.text);
    for (const p of r.violatedPrinciples) counter[p] = (counter[p] ?? 0) + 1;
    if (r.score < 25 && a.text.trim().length > 0) {
      weak.push({ moduleId: a.moduleId, questionId: a.questionId, score: r.score });
    }
  }
  const violatedPrinciples = Object.entries(counter)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
  return { violatedPrinciples, weakAnswers: weak.slice(0, 8) };
}
