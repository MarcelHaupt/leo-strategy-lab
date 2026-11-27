import type { SessionState, LeoCommentItem, Hook, FormatRecommendation, Persona, TrackId } from './types';
import { PRINCIPLES } from './playbook';
import { provocations } from './leo-provocations';
import { tr, getLang } from './i18n';
import { styleLabel } from './questions';

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
      text: tr('Hier steckt Substanz. Du arbeitest, du redest nicht nur. P05 wird sichtbar.', 'There is substance here. You are working, not just talking. P05 shows.'),
      principleId: 'P05',
    });
  }

  // Flag: marketing-speak
  const marketingFlags = ['innovativ', 'lösung', 'synergi', 'best-in-class', 'world-class', 'next level', 'state of the art', 'disruptiv', 'innovative', 'solution', 'game-chang', 'cutting-edge'];
  const flagsHit = marketingFlags.filter((f) => totalText.includes(f));
  if (flagsHit.length >= 1) {
    out.push({
      tone: 'flag',
      text: tr(
        `Wörter wie „${flagsHit[0]}“ sind Pitch-Deck-Möbel. P04 fehlt — das klingt nach Broadcast, nicht nach Subkultur.`,
        `Words like “${flagsHit[0]}” are pitch-deck furniture. P04 is missing: this sounds like broadcast, not subculture.`,
      ),
      principleId: 'P04',
    });
  }

  // Flag: vagueness
  const vagueAnswers = answers.filter((a) => a.text.trim().split(/\s+/).length < 6 && a.text.trim().length > 0);
  if (vagueAnswers.length >= 4) {
    out.push({
      tone: 'flag',
      text: tr(
        `${vagueAnswers.length} Antworten haben weniger als sechs Wörter. Das ist keine Strategie, das sind Notizen. Geh nochmal rein.`,
        `${vagueAnswers.length} answers have fewer than six words. That is not a strategy, those are notes. Go back in.`,
      ),
    });
  }

  // Idea: BTS
  const work = (s.modules.starter?.answers.work_what as string) ?? '';
  const workflow = (s.modules.starter?.answers.workflow_feedback as string) ?? '';
  if (work.length > 30 || workflow.length > 30) {
    out.push({
      tone: 'idea',
      text: tr('Aus der Workflow-Antwort: Mach daraus eine BTS-Serie. Drei Folgen, ein Cliffhanger pro Post. P06 lebt.', 'From your workflow answer: turn it into a BTS series. Three episodes, one cliffhanger per post. P06 comes alive.'),
      principleId: 'P06',
    });
  }

  // Praise: numbers / receipts
  const receiptHits = totalText.match(/\d+/g)?.length ?? 0;
  if (receiptHits >= 3) {
    out.push({
      tone: 'praise',
      text: tr('Zahlen statt Adjektive. P23 — Receipts and Proof. Genau so.', 'Numbers instead of adjectives. P23, Receipts and Proof. Exactly.'),
      principleId: 'P23',
    });
  }

  // Idea: niche
  const audienceText = answers.filter((a) => a.questionId.includes('audience')).map((a) => a.text).join(' ');
  if (audienceText.length > 50 && !audienceText.toLowerCase().match(/breit|alle|jeder|massen|everyone|everybody|broad|mass/)) {
    out.push({
      tone: 'idea',
      text: tr('Die Zielgruppe ist scharf gezeichnet. Bau einen Insider-Code ein — ein Wort, das nur diese Leute sofort erkennen. P16.', 'The audience is sharply drawn. Build in an insider code: a word only these people recognise instantly. P16.'),
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
        text: tr('Keine Case Studies. Ohne Receipts ist die Position nur behauptet, nicht bewiesen. P23.', 'No case studies. Without receipts the position is only claimed, not proven. P23.'),
        principleId: 'P23',
      });
    }
  }

  // Idea: format derivation
  const productName = (s.modules.madlibs?.answers.product_name as string) ?? '';
  if (productName) {
    out.push({
      tone: 'idea',
      text: tr(
        `„${productName}“ hat einen Namen — jetzt braucht es ein Format. TV-Logik: Serial mit drei Folgen, ein Reason-to-Return pro Post. P08.`,
        `“${productName}” has a name. Now it needs a format. TV logic: a three-episode serial, one reason to return per post. P08.`,
      ),
      principleId: 'P08',
    });
  }

  // Praise: style picked
  const attractCount = (s.modules.style?.answers.style_attract as string[] | undefined)?.length ?? 0;
  if (attractCount >= 3) {
    out.push({
      tone: 'praise',
      text: tr(
        `${attractCount} Voice-Attribute gewählt. Damit hat dein Content endlich einen Ton, den man wiedererkennt. P14.`,
        `${attractCount} voice attributes chosen. Now your content finally has a tone people recognise. P14.`,
      ),
      principleId: 'P14',
    });
  }

  const folklore = (s.modules.deepdive?.answers.dd_folklore as string) ?? '';
  if (folklore.trim().split(/\s+/).length >= 8) {
    out.push({
      tone: 'praise',
      text: tr('Folklore gefunden. Das ist Content, den keine Konkurrenz kopieren kann. P16.', 'Folklore found. That is content no competitor can copy. P16.'),
      principleId: 'P16',
    });
  }

  // Leo stört: höchstens 2 Stör-Fragen, immer am Ende
  return [...out.slice(0, 6), ...provocations(s, 'overview', 2)];
}

// 4. Verdichtung
export function compressPersona(s: SessionState): Persona {
  const ml = s.modules.madlibs?.answers ?? {};
  const starter = s.modules.starter?.answers ?? {};
  const styleMod = s.modules.style?.answers ?? {};

  const oneLiner = buildOneLiner(s);
  const voice = ((styleMod.style_attract as string[]) ?? []).slice(0, 5).map(styleLabel);
  const avoid = ((styleMod.style_avoid as string[]) ?? []).slice(0, 3).map(styleLabel);

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

  const brief = s.modules.brief?.answers ?? {};
  const shift = {
    now: firstSentence((brief.brief_believe_now as string) ?? ''),
    next: firstSentence((brief.brief_believe_next as string) ?? ''),
    action: firstSentence((brief.brief_action as string) ?? ''),
    oneThing: firstSentence((brief.brief_one_thing as string) ?? ''),
  };

  return { oneLiner, voice, avoid, audience, promise, shift };
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
  const name = (ml.product_name as string) ?? (s.projectName || tr('Das Produkt', 'The product'));
  const helpsRaw = (ml.helps_lets as string) ?? 'hilft';
  const helps = getLang() === 'en' ? (helpsRaw === 'lässt' ? 'lets' : 'helps') : helpsRaw;
  const audience = (ml.audience_noun as string) ?? tr('Menschen', 'people');
  const verb1 = (ml.verb1 as string) ?? '';
  const verb2 = (ml.verb2 as string) ?? '';
  const object = (ml.object as string) ?? '';
  const verb3 = (ml.verb3 as string) ?? '';
  const adverb = (ml.adverb as string) ?? '';

  if (verb1 && audience && object) {
    const line = tr(
      `${name} ${helps} ${audience} ${verb1}${verb2 ? ` und ${verb2}` : ''} ${object}${verb3 ? `, damit sie ${verb3} ${adverb}` : ''}.`,
      `${name} ${helps} ${audience} ${verb1}${verb2 ? ` and ${verb2}` : ''} ${object}${verb3 ? ` so they can ${verb3} ${adverb}` : ''}.`,
    );
    return line.replace(/\s+/g, ' ').replace(/\s+([.,])/g, '$1').trim();
  }
  // Fallback: starter work_what
  const work = (s.modules.starter?.answers.work_what as string) ?? '';
  if (work) return firstSentence(work);
  return tr('Eine Marke, die noch verdichtet werden muss.', 'A brand that still needs boiling down.');
}

// 5. Hooks — track-aware
export function deriveHooks(s: SessionState): Hook[] {
  const persona = compressPersona(s);
  const ml = s.modules.madlibs?.answers ?? {};
  const starter = s.modules.starter?.answers ?? {};
  const product = s.modules.product?.answers ?? {};

  const productName = (ml.product_name as string) || s.projectName || tr('das Produkt', 'the product');
  const audience = (ml.audience_noun as string) || tr('sie', 'they');
  const verb1 = (ml.verb1 as string) || tr('arbeiten', 'working');
  const industry = ((starter.work_industry as string) || tr('der Branche', 'the industry')).split(/[.,\n]/)[0].trim();
  const workflow = ((starter.workflow_feedback as string) || '').split(/\n/)[0];
  const process = ((product.pq_process as string) || '').split(/\n/)[0];
  const clientName = s.clientName || productName;

  // Track-spezifische Hooks
  const trackHooks: Record<TrackId, Hook[]> = {
    founder: [
      {
        hook: tr(`Drei Dinge, die mich gekostet haben, bevor ich sie kapiert habe.`, `Three things that cost me before I understood them.`),
        format: 'Reel',
        platform: ['Instagram', 'TikTok'],
        principleId: 'P22',
        reason: tr('Founder-Voice: Lessons aus erster Hand schlagen jede Theorie.', 'Founder voice: first-hand lessons beat any theory.'),
      },
      {
        hook: tr(`Was ich heute meinem 25-jährigen Ich sagen würde — über ${industry}.`, `What I would tell my 25-year-old self today about ${industry}.`),
        format: 'POV-Video',
        platform: ['TikTok', 'Instagram Reels'],
        principleId: 'P07',
        reason: tr('Real-Life-First. Eine Person, eine Wahrheit, kein Skript.', 'Real life first. One person, one truth, no script.'),
      },
      {
        hook: tr(`Die unbequeme Frage, die ${audience} sich nie laut stellen.`, `The uncomfortable question ${audience} never ask out loud.`),
        format: 'Story',
        platform: ['Instagram Stories'],
        principleId: 'P25',
        reason: tr('Provokation als Einladung. Stories sind dein Beichtstuhl.', 'Provocation as an invitation. Stories are your confessional.'),
      },
      {
        hook: workflow
          ? tr(`Mein Tag, bevor ich verstanden habe, dass ${verb1} der falsche Hebel war.`, `My day before I understood that ${verb1} was the wrong lever.`)
          : tr(`Ein Tag in 60 Sekunden — ohne den Hochglanz-Filter.`, `A day in 60 seconds, without the glossy filter.`),
        format: 'Reel',
        platform: ['Instagram', 'TikTok'],
        principleId: 'P01',
        reason: tr('Smartly Unpolished. Lo-fi schlägt Marken-Optik.', 'Smartly unpolished. Lo-fi beats brand gloss.'),
      },
      {
        hook: tr(`${clientName} antwortet auf eure DMs — die schwierigen.`, `${clientName} answers your DMs. The difficult ones.`),
        format: tr('Story-Reihe', 'Story series'),
        platform: ['Instagram Stories'],
        principleId: 'P09',
        reason: tr('Audience als Co-Conspirator. DM-Mining ist kostenlose Content-Pipeline.', 'Audience as co-conspirator. Mining your DMs is a free content pipeline.'),
      },
    ],
    product: [
      {
        hook: tr(`Was ${productName} kann — in einem Frame. Kein Voiceover, kein Logo.`, `What ${productName} can do, in one frame. No voiceover, no logo.`),
        format: 'Carousel',
        platform: ['Instagram', 'LinkedIn'],
        principleId: 'P03',
        reason: tr('Single-Frame Ambush. Frame 1 ist die ganze Geschichte.', 'Single-frame ambush. Frame 1 is the whole story.'),
      },
      {
        hook: tr(`Drei Versuche, bevor ${productName} so funktioniert hat, wie wir wollten.`, `Three attempts before ${productName} worked the way we wanted.`),
        format: 'BTS',
        platform: ['Instagram Reels', 'TikTok'],
        principleId: 'P06',
        reason: tr('BTS-First. Der Build ist spannender als der Launch.', 'BTS first. The build is more exciting than the launch.'),
      },
      {
        hook: tr(`Der Moment, in dem ${productName} zum ersten Mal richtig lief.`, `The moment ${productName} worked properly for the first time.`),
        format: 'Reveal',
        platform: ['TikTok', 'Instagram'],
        principleId: 'P19',
        reason: tr('Aha-Moment als Format. Catharsis verkauft.', 'The aha moment as a format. Catharsis sells.'),
      },
      {
        hook: workflow
          ? tr(`So sieht unser Feedback-Loop aus — der Teil, der es nie ins Deck schafft.`, `This is our feedback loop: the part that never makes it into the deck.`)
          : tr(`${audience}, die ${productName} testen — ungeschnitten.`, `${audience} testing ${productName}, uncut.`),
        format: tr('Story-Reihe', 'Story series'),
        platform: ['Instagram Stories'],
        principleId: 'P23',
        reason: tr('Receipts statt Behauptungen. Echte Reaktionen, echte Zahlen.', 'Receipts instead of claims. Real reactions, real numbers.'),
      },
      {
        hook: process
          ? tr(`${productName}: was wir gelernt haben, bevor wir launchen konnten.`, `${productName}: what we learned before we could launch.`)
          : tr(`Eine Frage an euch: Was soll ${productName} als Nächstes können?`, `A question for you: what should ${productName} do next?`),
        format: 'Vote / Poll',
        platform: ['Instagram', 'TikTok'],
        principleId: 'P09',
        reason: tr('Co-Creation. Die Roadmap wird zum Content.', 'Co-creation. The roadmap becomes content.'),
      },
    ],
    agency: [
      {
        hook: tr(`${clientName} × ${audience}: was wir gemacht haben, was es bewirkt hat.`, `${clientName} × ${audience}: what we did and what it changed.`),
        format: 'Case Study',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P23',
        reason: tr('Receipts. Ohne Cases ist Expertise nur eine Behauptung.', 'Receipts. Without cases, expertise is just a claim.'),
      },
      {
        hook: tr(`Drei Pitches, die wir abgelehnt haben — und warum.`, `Three pitches we turned down, and why.`),
        format: 'Carousel',
        platform: ['LinkedIn'],
        principleId: 'P12',
        reason: tr('Anti-Selling als Positionierung. Wer Nein sagen kann, hat einen Standpunkt.', 'Anti-selling as positioning. If you can say no, you have a stance.'),
      },
      {
        hook: tr(`Was wir letzte Woche gelernt haben — der ehrliche Recap.`, `What we learned last week: the honest recap.`),
        format: 'Newsletter',
        platform: ['Email', 'LinkedIn'],
        principleId: 'P20',
        reason: tr('Long-Form für die, die Tiefe wollen. Die Inbox ist ein Vertrauens-Kanal.', 'Long form for those who want depth. The inbox is a channel of trust.'),
      },
      {
        hook: tr(`Was niemand über ${industry} laut sagt.`, `What nobody says out loud about ${industry}.`),
        format: 'Carousel',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P25',
        reason: tr('Hot-Take als Hook. Eine klare Meinung schneidet durch.', 'A hot take as the hook. A clear opinion cuts through.'),
      },
      {
        hook: workflow
          ? tr(`Wie wir ${audience} briefen — der echte Workshop, nicht das Deck.`, `How we brief ${audience}: the real workshop, not the deck.`)
          : tr(`Drei Methoden, die in jedem unserer Projekte vorkommen.`, `Three methods that show up in every one of our projects.`),
        format: 'BTS',
        platform: ['Instagram Reels', 'TikTok'],
        principleId: 'P06',
        reason: tr('BTS verkauft Service besser als jeder Pitch.', 'BTS sells a service better than any pitch.'),
      },
    ],
    refresh: [
      {
        hook: tr(`${clientName} im Jahr X — und warum wir jetzt einen anderen Weg gehen.`, `${clientName} in year X, and why we are taking a different path now.`),
        format: 'Manifesto',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P24',
        reason: tr('Manifesto-Moment. Repositioning braucht eine klare Ansage.', 'Manifesto moment. Repositioning needs a clear statement.'),
      },
      {
        hook: tr(`Was wir loslassen — und was bleibt.`, `What we let go of, and what stays.`),
        format: 'Series',
        platform: ['Instagram', 'LinkedIn'],
        principleId: 'P21',
        reason: tr('Vorher / Nachher als Content-Architektur.', 'Before and after as content architecture.'),
      },
      {
        hook: tr(`Anti-Recap: was bei ${clientName} nicht mehr funktioniert.`, `Anti-recap: what no longer works at ${clientName}.`),
        format: 'Anti-Recap',
        platform: ['LinkedIn'],
        principleId: 'P13',
        reason: tr('Selbstkritik öffentlich machen. Mut zur Lücke ist Differenzierer.', 'Make self-criticism public. Owning the gaps sets you apart.'),
      },
      {
        hook: tr(`Drei Annahmen, mit denen wir aufräumen — und was stattdessen gilt.`, `Three assumptions we are clearing out, and what holds instead.`),
        format: 'Carousel',
        platform: ['LinkedIn', 'Instagram'],
        principleId: 'P25',
        reason: tr('Konfrontation als Refresh-Logik. Nicht renovieren — neu denken.', 'Confrontation as refresh logic. Do not renovate, rethink.'),
      },
      {
        hook: process
          ? tr(`Wie wir ${clientName} neu sortiert haben — der ungeschnittene Prozess.`, `How we reordered ${clientName}: the uncut process.`)
          : tr(`${clientName} hat sich verändert. Hier ist, was du als Nächstes siehst.`, `${clientName} has changed. Here is what you will see next.`),
        format: 'BTS',
        platform: ['Instagram Reels', 'TikTok'],
        principleId: 'P06',
        reason: tr('BTS-First. Der Refresh selbst ist Content.', 'BTS first. The refresh itself is content.'),
      },
    ],
  };

  const base = s.track ? trackHooks[s.track] : trackHooks.product;

  // Inject voice if present
  if (persona.voice.length > 0 && base[2]) {
    base[2] = { ...base[2], reason: base[2].reason + ` Voice: ${persona.voice.slice(0, 3).join(', ')}.` };
  }

  // Hooks aus Shift und Deep-Dive kommen zuerst — sie stammen aus echten Antworten
  return [...insightHooks(s, persona.shift, clientName), ...base].slice(0, 5);
}

function insightHooks(s: SessionState, shift: Persona['shift'], clientName: string): Hook[] {
  const dd = s.modules.deepdive?.answers ?? {};
  const misperception = firstSentence((dd.dd_misperception as string) ?? '');
  const folklore = firstSentence((dd.dd_folklore as string) ?? '');
  const out: Hook[] = [];

  if (shift.now) {
    out.push({
      hook: tr(`Alle denken: ${stripEnd(shift.now)}. Stimmt nicht.`, `Everyone thinks: ${stripEnd(shift.now)}. Not true.`),
      format: 'Reel',
      platform: ['Instagram Reels', 'TikTok'],
      principleId: 'P24',
      reason: shift.next
        ? tr(
            `Shift statt Claim: erst das Vorurteil aussprechen, dann brechen. Danach soll hängen bleiben: ${stripEnd(shift.next)}.`,
            `Shift instead of claim: say the prejudice out loud first, then break it. What should stick afterwards: ${stripEnd(shift.next)}.`,
          )
        : tr('Shift statt Claim: erst das Vorurteil aussprechen, dann brechen.', 'Shift instead of claim: say the prejudice out loud first, then break it.'),
    });
  }
  if (misperception) {
    out.push({
      hook: tr(
        `Das größte Missverständnis über ${clientName}: ${stripEnd(misperception).replace(/^Dass /, 'dass ')}.`,
        `The biggest misunderstanding about ${clientName}: ${stripEnd(misperception).replace(/^That /, 'that ')}.`,
      ),
      format: 'Reel',
      platform: ['TikTok', 'Instagram Reels'],
      principleId: 'P11',
      reason: tr(
        'Ein Missverständnis offen aussprechen holt die Kommentare, die du sonst nie bekommst.',
        'Naming a misunderstanding openly gets you the comments you would never get otherwise.',
      ),
    });
  }
  if (folklore) {
    out.push({
      hook: tr(`Die Geschichte, die man sich bei ${clientName} intern erzählt.`, `The story people tell each other inside ${clientName}.`),
      format: tr('Story-Reihe', 'Story series'),
      platform: ['Instagram Stories', 'TikTok'],
      principleId: 'P16',
      reason: tr(
        `Insider Codes: Folklore macht aus Followern Eingeweihte. Material: ${stripEnd(folklore)}.`,
        `Insider codes: folklore turns followers into insiders. Material: ${stripEnd(folklore)}.`,
      ),
    });
  }
  if (shift.oneThing) {
    out.push({
      hook: stripEnd(shift.oneThing) + '.',
      format: 'Carousel',
      platform: ['Instagram', 'LinkedIn'],
      principleId: 'P03',
      reason: tr('Der eine Satz gehört in Frame 1, nicht ans Ende.', 'The one sentence belongs in frame 1, not at the end.'),
    });
  }
  return out.slice(0, 3);
}

function stripEnd(t: string): string {
  return t.trim().replace(/[.!?…]+$/, '');
}

// 6. Format-Empfehlungen — track-aware
export function formatRecommendations(s: SessionState): FormatRecommendation[] {
  const ml = s.modules.madlibs?.answers ?? {};
  const productName = (ml.product_name as string) || s.projectName || tr('die Marke', 'the brand');
  const audience = (ml.audience_noun as string) || tr('die Community', 'the community');
  const clientName = s.clientName || productName;
  const weekly = tr('wöchentlich', 'weekly');
  const twiceWeekly = tr('zweimal wöchentlich', 'twice a week');

  const byTrack: Record<TrackId, FormatRecommendation[]> = {
    founder: [
      {
        name: 'POV-Reels: Lessons from the Field',
        description: tr(
          `Wöchentliches Reel: ${clientName} teilt eine konkrete Lektion. Eine Kamera, ein Take, kein Skript.`,
          `Weekly reel: ${clientName} shares one concrete lesson. One camera, one take, no script.`,
        ),
        platforms: ['Instagram Reels', 'TikTok'],
        cadence: weekly,
        reasonToReturn: tr('Jede Woche eine neue Lektion. Keine, die nicht weh tut.', 'A new lesson every week. None that does not sting.'),
        principles: ['P22', 'P07', 'P01'],
      },
      {
        name: tr('DM-Sprechstunde', 'DM Office Hours'),
        description: tr(
          `Story-Format: echte Fragen aus den DMs werden in Stories beantwortet. Niedrigschwellig, schnell, persönlich.`,
          `Story format: real questions from the DMs get answered in Stories. Low barrier, fast, personal.`,
        ),
        platforms: ['Instagram Stories'],
        cadence: twiceWeekly,
        reasonToReturn: tr('Wer fragt, sieht sich selbst — und folgt.', 'Whoever asks sees themselves, and follows.'),
        principles: ['P09', 'P05', 'P14'],
      },
      {
        name: 'Studio Diary',
        description: tr(
          `Kurze, lo-fi Snapshots aus dem Alltag. Schreibtisch, Spaziergang, Trainingseinheit. Kein Inszenierungs-Budget.`,
          `Short lo-fi snapshots from everyday life. Desk, walk, training session. No staging budget.`,
        ),
        platforms: ['Instagram', 'TikTok'],
        cadence: tr('täglich', 'daily'),
        reasonToReturn: tr(
          'Nähe als Currency. Die Marke ist eine Person — also zeig die Person.',
          'Closeness as currency. The brand is a person, so show the person.',
        ),
        principles: ['P25', 'P01', 'P07'],
      },
    ],
    product: [
      {
        name: 'Behind-the-Build Serial',
        description: tr(
          `Wöchentliche Folge über die Entstehung von ${productName}. Rohmaterial, Sackgassen, Fehlversuche. Erst BTS, dann Reveal.`,
          `A weekly episode on how ${productName} comes together. Raw footage, dead ends, failed attempts. BTS first, then the reveal.`,
        ),
        platforms: ['Instagram Reels', 'TikTok'],
        cadence: weekly,
        reasonToReturn: tr(
          'Cliffhanger am Ende jeder Folge. Nächste Woche: was nicht funktioniert hat.',
          'A cliffhanger at the end of every episode. Next week: what did not work.',
        ),
        principles: ['P06', 'P08', 'P01'],
      },
      {
        name: `${audience} Voice Drops`,
        description: tr(
          `Kurze Audiogramme aus DMs, Comments und Sprachnachrichten von echten ${audience}. Nicht inszeniert, ungeschnitten.`,
          `Short audiograms from DMs, comments and voice notes by real ${audience}. Not staged, uncut.`,
        ),
        platforms: ['TikTok', 'Instagram Stories'],
        cadence: twiceWeekly,
        reasonToReturn: tr(
          'Jede Folge eine andere Stimme aus der Szene. Wer als Nächstes? Die Community entscheidet.',
          'Every episode a different voice from the scene. Who is next? The community decides.',
        ),
        principles: ['P05', 'P09', 'P14'],
      },
      {
        name: 'Single-Frame Reveals',
        description: tr(
          `Carousel oder Reel, dessen erstes Frame schon alles sagt. ${productName} in einem Bild — der Rest ist Beweis.`,
          `A carousel or reel whose first frame already says it all. ${productName} in one image; the rest is proof.`,
        ),
        platforms: ['Instagram', 'LinkedIn'],
        cadence: weekly,
        reasonToReturn: tr('Jeder Post ist ein neuer Standpunkt. Wer den Stil kennt, klickt.', 'Every post is a new stance. Whoever knows the style clicks.'),
        principles: ['P03', 'P19', 'P23'],
      },
    ],
    agency: [
      {
        name: 'Case Study Drops',
        description: tr(
          `Pro Projekt ein 6-Slide-Carousel: Problem, Insight, Idee, Execution, Ergebnis, Learnings. ${clientName} liefert die Belege.`,
          `One 6-slide carousel per project: problem, insight, idea, execution, result, learnings. ${clientName} brings the receipts.`,
        ),
        platforms: ['LinkedIn', 'Instagram'],
        cadence: tr('monatlich', 'monthly'),
        reasonToReturn: tr('Echte Receipts. Wer hier folgt, hat Pitch-Material.', 'Real receipts. Whoever follows here gets pitch material.'),
        principles: ['P23', 'P12', 'P20'],
      },
      {
        name: tr('Methoden-Newsletter', 'Methods Newsletter'),
        description: tr(
          `Zweiwöchentlicher Newsletter mit einer angewandten Methode aus echten Projekten. Tools, Templates, Frames.`,
          `A fortnightly newsletter with one applied method from real projects. Tools, templates, frames.`,
        ),
        platforms: ['Email', 'LinkedIn'],
        cadence: tr('zweiwöchentlich', 'every two weeks'),
        reasonToReturn: tr('Long-Form-Tiefe für Entscheider. Inbox als Vertrauens-Channel.', 'Long-form depth for decision makers. The inbox as a channel of trust.'),
        principles: ['P20', 'P12', 'P23'],
      },
      {
        name: 'Pitch BTS',
        description: tr(
          `Reels aus dem Maschinenraum: Brainstorm, Wand voller Post-its, Kunden-Calls (anonymisiert). Die Arbeit IST der Content.`,
          `Reels from the engine room: brainstorms, a wall full of post-its, client calls (anonymised). The work IS the content.`,
        ),
        platforms: ['Instagram Reels', 'TikTok'],
        cadence: weekly,
        reasonToReturn: tr('Wer den Prozess sieht, kauft schneller die Expertise.', 'Whoever sees the process buys the expertise faster.'),
        principles: ['P06', 'P25', 'P01'],
      },
    ],
    refresh: [
      {
        name: tr('Repositioning-Manifesto', 'Repositioning Manifesto'),
        description: tr(
          `Eine zentrale Manifest-Kommunikation in mehreren Episoden: was bleibt, was geht, warum jetzt. ${clientName} setzt einen klaren Pflock.`,
          `One central manifesto told in several episodes: what stays, what goes, why now. ${clientName} plants a clear stake.`,
        ),
        platforms: ['LinkedIn', 'Instagram'],
        cadence: tr('einmalig + Echo', 'once + echo'),
        reasonToReturn: tr('Repositioning als Story, nicht als Press-Release.', 'Repositioning as a story, not as a press release.'),
        principles: ['P24', 'P21', 'P20'],
      },
      {
        name: tr('Anti-Recap-Serie', 'Anti-Recap Series'),
        description: tr(
          `Was wir nicht mehr machen. Was wir falsch gesehen haben. Was wir lernen mussten. Wöchentlich, zwei Minuten, kein Hochglanz.`,
          `What we no longer do. What we got wrong. What we had to learn. Weekly, two minutes, no gloss.`,
        ),
        platforms: ['LinkedIn', 'Instagram Reels'],
        cadence: weekly,
        reasonToReturn: tr('Selbstkritik baut mehr Vertrauen auf als jede Erfolgsmeldung.', 'Self-criticism builds more trust than any success story.'),
        principles: ['P13', 'P21', 'P01'],
      },
      {
        name: 'Refresh Diary',
        description: tr(
          `BTS des Refreshes selbst: Mood-Boards, verworfene Versionen, Kund:innen-Reaktionen. Der Wandel als laufende Geschichte.`,
          `BTS of the refresh itself: mood boards, discarded versions, customer reactions. The change as an ongoing story.`,
        ),
        platforms: ['Instagram Stories', 'TikTok'],
        cadence: tr('mehrfach pro Woche', 'several times a week'),
        reasonToReturn: tr('Veränderung ist ein Prozess. Wer dranbleibt, fühlt sich beteiligt.', 'Change is a process. Whoever sticks with it feels involved.'),
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
