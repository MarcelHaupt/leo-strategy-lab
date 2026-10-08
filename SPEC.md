# LEO Strategy Lab — Build Spec

## Produktidee

Eine Single-Page Web-App, in der Kunden geführt durch 7 Strategie-Frameworks gehen.
Alle Antworten werden gegen ein Social-First Playbook (25 Prinzipien) geprüft.
Am Ende steht ein verdichteter Strategie-Report, den der Kunde + Marcel (LEO) auswerten kann.

**Sprache:** Deutsch (alle UI-Texte, alle LEO-Kommentare). Englisch nur für die englischen Originalbegriffe der Frameworks (z.B. "Mad Libs").

**User:** Marcel = LEO (Creative Director, Stratege). Seine Kunden = Werbeagenturen, Sportmarken, Medienformate, Athleten.

## Technologie

- Vite + React + TypeScript + Tailwind v3 + shadcn/ui (das Template ist bereits gesetzt)
- **Kein Backend nötig.** Daten leben im React-State während der Session und werden als JSON/Markdown exportiert.
- Hash-Routing (wouter mit useHashLocation) — Pflicht.
- Dark Mode Pflicht (default = system, mit Toggle).

## Visuelles Design — Editorial Sport Brutalism

Marcel ist Sport-Fotograf + Creative Director. Das Tool soll wie ein Magazin-Workspace aussehen, nicht wie ein SaaS.

**Inspiration:** The Players' Tribune, Mundial Magazine, 032c, Bloomberg Terminal — aber editorial, nicht Daten.

**Farbpalette (dark-first, da kreative Profis meist im Dark Mode arbeiten):**

```css
/* Light mode */
--background: 40 12% 96%;   /* warm paper */
--foreground: 30 10% 10%;
--muted: 40 10% 88%;
--muted-foreground: 30 6% 35%;
--card: 0 0% 100%;
--border: 30 8% 82%;
--primary: 18 90% 52%;      /* signal orange — sport, energy */
--primary-foreground: 0 0% 100%;
--accent: 200 80% 40%;      /* deep electric blue for secondary */
--accent-foreground: 0 0% 100%;
--destructive: 0 70% 50%;
--ring: 18 90% 52%;
--radius: 0.25rem;          /* hard, magazine-y corners */

/* Dark mode */
--background: 30 8% 8%;
--foreground: 40 10% 92%;
--muted: 30 6% 15%;
--muted-foreground: 40 6% 65%;
--card: 30 6% 12%;
--border: 30 6% 20%;
--primary: 18 95% 58%;
--accent: 195 70% 55%;
```

**Typografie:** Editorial, hart, redaktionell.
- Display: **'Instrument Serif'** (Fontshare/Google) für H1 + Modul-Titel — schmaler, kantiger Serif.
- Body: **'Inter'** für UI, oder besser **'Geist'** (Vercel) für moderne Sachlichkeit.
- Mono-Akzent: **'JetBrains Mono'** für IDs, Codes (P01, P02), Scores, Module-Numbers.

Lade die Schriften via CDN-Link in `client/index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

In `index.css` als font-family Variablen mappen, dann via Tailwind `font-serif`, `font-sans`, `font-mono`.

**Stil-Regeln:**
- Hard corners (`--radius: 0.25rem`) — keine pillow-buttons.
- Großzügige Whitespace-Inseln, dann sehr dichte Info-Blöcke (Magazinrhythmus).
- Modul-Nummern groß und Mono ("01 / 07", "P14"), wie auf einem Magazin-Cover.
- Eine Akzentfarbe (signal orange) für aktive States, CTAs, Score-Highlights — sonst nur Neutrals.
- Keine Schatten, keine Gradients. Stattdessen: harte Kanten, dünne 1px Linien, Typografie-Hierarchie.
- Keine Emojis im UI.

## Architektur — Datenmodell

Lege diese Typen in `client/src/lib/types.ts` an:

```ts
export type ModuleId =
  | 'starter' | 'madlibs' | 'product' | 'casestudy'
  | 'brief' | 'style' | 'copyedit';

export type Answer = {
  questionId: string;
  value: string | string[];
};

export type ModuleState = {
  id: ModuleId;
  answers: Record<string, string | string[]>;
  completedAt?: number;
};

export type SessionState = {
  clientName: string;
  projectName: string;
  startedAt: number;
  modules: Record<ModuleId, ModuleState>;
  currentModule: ModuleId | null;
};

export type Principle = {
  id: string;          // P01 ... P25
  name: string;
  source: string;
  rule: string;        // kurze Zusammenfassung
  leosCheck: string;   // Leos Frage zur Idee
  triggers: string[];  // Keywords, die hinweisen, dass das Prinzip relevant ist
  antiTriggers: string[]; // Keywords, die das Prinzip verletzen
};
```

## Die 7 Module — vollständige Inhalte

### Modul 01 — Starter Questions
Pfad: `/#/module/starter`
Sektionen (aus `2_Starter_Questions.md`):

**Work**
- `work_what` (textarea): "In 1–3 Sätzen: Was machst du / euer Unternehmen?"
- `work_favorite` (textarea): "Was ist dein Lieblingsteil daran?"
- `work_industry` (textarea): "Beschreibe deine Branche. Was ist sie und wie funktioniert sie?"

**Mission und Vision**
- `mission_why` (textarea): "Warum hast du dieses Unternehmen / Projekt gestartet? Was hat zur Idee geführt?"
- `mission_matter` (textarea): "Warum ist diese Arbeit wichtig?"
- `mission_goals` (textarea): "Was sind deine Ziele für die nächsten 3–6 Monate?"
- `mission_world` (textarea): "Beschreibe, wo du Menschen hinbringen willst. Wie sieht die Welt aus, wenn du erfolgreich bist?"
- `mission_top3` (textarea): "Was sind die Top 3 Ziele für diesen Bereich? Was sollen Menschen tun?"

**Audience**
- `audience_know` (textarea): "Was weißt du über deine Kunden? Was ist ihnen wichtig?"
- `audience_why` (textarea): "Warum nutzen Menschen deine Website / dein Produkt? Warum sollen sie es?"
- `audience_findyou` (textarea): "Wie finden die meisten Menschen zu dir?"
- `audience_sensitive` (textarea): "Gibt es Themen, auf die deine Zielgruppe sensibel reagiert?"
- `audience_friend` (textarea): "Wenn ein Kunde einem Freund von dir erzählt — was soll er sagen?"
- `audience_core` (textarea): "Was sind deine Kernbotschaften? Was sollen Menschen verstehen?"

**Brand und Persönlichkeit**
- `brand_competition` (textarea): "Wer ist deine Konkurrenz? Wie unterscheidest du dich?"
- `brand_person` (textarea): "Wenn deine Marke eine Person wäre — wie würdest du sie beschreiben? Liste so viele Eigenschaften wie möglich."
- `brand_inspires` (textarea): "Wer inspiriert dich online oder offline? Wem willst du nacheifern?"
- `brand_avoid` (textarea): "Welche Assoziationen willst du vermeiden? Was würde deine Leser abschrecken?"

**Workflow**
- `workflow_tools` (textarea): "Welche Tools nutzt euer Team zum Schreiben und Veröffentlichen?"
- `workflow_feedback` (textarea): "Wie haltet ihr Feedback während des Prozesses fest?"
- `workflow_schedule` (select): "Welcher Update-Rhythmus für veraltete Inhalte ist realistisch?"
  Optionen: Quartalsweise / Halbjährlich / Jährlich / Ad hoc

### Modul 02 — Product Mad Libs
Pfad: `/#/module/madlibs`
Lückentext-Interface — jede Lücke ist ein Input-Feld inline im Satz.

Satz 1:
"**[product_name]** **[helps_lets]** **[audience_noun]** **[verb1]** und **[verb2]** **[object]**, damit sie **[verb3]** **[adverb]** können."

- `product_name` (text)
- `helps_lets` (select): hilft / lässt
- `audience_noun` (text, z.B. "Athleten")
- `verb1` (text)
- `verb2` (text)
- `object` (text)
- `verb3` (text)
- `adverb` (text)

Satz 2:
"**[signup_join]** **[product_name_2]**, um **[verb4]** **[plural_noun]** mit **[secondary_audience]** zu."

- `signup_join` (select): Registriere dich für / Werde Teil von
- `product_name_2` (text)
- `verb4` (text)
- `plural_noun` (text)
- `secondary_audience` (text)

Tipp im UI: "Schreibe mehrere Varianten auf. Die beste verdichtet, was du wirklich tust."

### Modul 03 — Product Questions
Pfad: `/#/module/product`
Drei Untersektionen ("Fakten sammeln", "Geschichte erzählen", "Anordnen & überarbeiten").

**Name & Zweck**
- `pq_what` (textarea): "Was ist es?"
- `pq_who` (textarea): "Für wen ist es? Wie hilft es ihnen oder verbessert ihren Tag?"

**Features & Facetten**
- `pq_can` (textarea): "Was kann man damit tun? Warum sind diese Features wichtig?"
- `pq_how` (textarea): "Wie funktioniert es?"
- `pq_senses` (textarea): "Erinnere dich an die fünf Sinne. Wie schmeckt, fühlt, sieht, riecht, klingt es?"
- `pq_made` (textarea): "Woraus besteht es? Warum diese Materialien? Wie pflegt man es?"
- `pq_size` (textarea): "Wie groß ist es? Verschiedene Größen, Farben, Formate?"
- `pq_packaging` (textarea): "Gibt es etwas Besonderes an der Verpackung? Passt es zu etwas oder ist es ein gutes Geschenk?"

**Pricing & Verfügbarkeit**
- `pq_cost` (textarea): "Wie viel kostet es? Wie viele Stücke sind enthalten?"
- `pq_where` (textarea): "Wo bekommt man es?"
- `pq_make_time` (textarea): "Wie lange dauert Herstellung & Verpackung?"
- `pq_shipping` (textarea): "Welche Versandoptionen? Wie lange dauert die Lieferung?"

**Geschichte erzählen**
- `pq_purpose` (textarea): "Wie passt es zu deiner Mission?"
- `pq_history` (textarea): "Warum hast du es entschieden zu machen? Was hat zur Idee geführt?"
- `pq_process` (textarea): "Wie hast du es gemacht? Was hast du dabei gelernt?"
- `pq_competition` (textarea): "Wie unterscheidet es sich von ähnlichen Dingen?"
- `pq_reputation` (textarea): "Was sagen Menschen darüber? Was sollen sie sagen?"
- `pq_use_cases` (textarea): "Wie nutzen Menschen es?"

### Modul 04 — Case Study Questions
Pfad: `/#/module/casestudy`

Allow user to add multiple case studies (Array). Jede Case Study hat:
- `cs_name` (text): "Name des Kunden / Klienten + Web-Adresse"
- `cs_what` (textarea): "Was hast du für sie gemacht?"
- `cs_audience` (textarea): "Wer war die Zielgruppe?"
- `cs_unique` (textarea): "Was war einzigartig am Projekt? Habt ihr interessante Probleme gelöst?"
- `cs_results` (textarea): "Was waren die Ergebnisse? Welche Metriken habt ihr verbessert?"
- `cs_quotes` (textarea): "Gibt es Zitate, Pressestimmen, Testimonials? Links sind willkommen."

UI: "+ Weitere Case Study hinzufügen" Button.

### Modul 05 — Project Brief
Pfad: `/#/module/brief`

**Summary**
- `brief_purpose` (textarea): "Was ist der Zweck des Projekts? Was ist bisher passiert?"
- `brief_know` (textarea): "Was sollen Menschen wissen? Welche Entscheidungen stehen an?"
- `brief_next` (textarea): "Was passiert als Nächstes?"

**Company**
- `brief_values` (textarea): "Was ist der Organisation wichtig?"
- `brief_mission` (textarea): "Was versucht die Organisation zu tun? Was ist das ultimative Ziel?"
- `brief_goals` (textarea): "Was sind die Ziele dieses Projekts?"

**Audience**
- `brief_audience` (textarea): "Wer ist primäre und sekundäre Zielgruppe?"
- `brief_needs` (textarea): "Was brauchen sie?"

**Story**
- `brief_say` (textarea): "Was wollen wir über das Produkt sagen?"
- `brief_narrative` (textarea): "Was ist das Narrativ?"
- `brief_care` (textarea): "Warum sollten Menschen sich kümmern?"
- `brief_improve` (textarea): "Wie verbessert das Produkt / der Service Leben?"

**Style**
- `brief_traits` (textarea): "Was definiert die Marke? Welche Eigenschaften hat sie?"
- `brief_voice` (textarea): "Wie klingt das Unternehmen? Wie kommt die Persönlichkeit durch?"
- `brief_tone` (textarea): "Wie fühlt sich das Unternehmen gegenüber der Zielgruppe? Welche Stimmung? Wer spricht?"

### Modul 06 — Style Attributes
Pfad: `/#/module/style`

Multi-Select Karten mit allen 55 Adjektiven aus `7_Style_Attributes-6.md`:
Accurate, Alive, Articulate, Calming, Challenging, Clear, Clever, Compelling, Concise, Confident, Conversational, Crisp, Direct, Eloquent, Engrossing, Fascinating, Fast-paced, Fluid, Flowing, Friendly, Generous, Heartfelt, Honest, Illuminating, Incisive, Informal, Insightful, Inviting, Joyful, Layered, Light, Lively, Luminous, Moving, Nuanced, Open, Organized, Precise, Provocative, Purposeful, Readable, Resonating, Rhythmic, Riveting, Simple, Slowing, Solid, Straightforward, Strong, Thoughtful, Transcendant, Trustworthy, Useful, Vibrant, Vivid

Übersetze die Begriffe ins Deutsche, behalte das englische Original als Untertitel.
Beispiel: "Direkt — Direct", "Fesselnd — Compelling".

Zwei Modi:
1. **Anziehen (max 5)** — "Wie soll deine Marke klingen?"
2. **Abstoßen (max 3)** — "Was passt explizit NICHT zu dir?"

State: `style_attract: string[]`, `style_avoid: string[]`.

UI: Karten in Grid 3-4 Spalten. Aktive Karten haben Akzentfarbe (orange für anziehen, schwarz/border für abstoßen).

### Modul 07 — Copyediting Checklist
Pfad: `/#/module/copyedit`

Style-Guide-Entscheidungen als Yes/No oder Auswahl.

- `ce_publisher` (text): "Verlagsname / Marke"
- `ce_dictionary` (text): "Bevorzugtes Wörterbuch (z.B. Duden, Wahrig)"
- `ce_styleguide` (text): "Style-Manual (z.B. CD-Manual, hauseigener Guide)"

Akronyme & Abkürzungen
- `ce_latin` (radio): "Lateinische Abkürzungen oder deutsche Äquivalente?" → "Latein (z.B. e.g., i.e.)" / "Deutsch (z.B., d.h.)"
- `ce_periods` (radio): "Punkte in Akronymen?" → "Mit Punkten" / "Ohne Punkte"
- `ce_caps` (radio): "Voll-Kapitälchen oder gemischt?" → "Voll" / "Gemischt"
- `ce_define` (radio): "Bei Erstnennung definieren?" → "Klammer hinter Begriff" / "Begriff in Klammern"
- `ce_dates` (radio): "Datum-Format?" → "1. Mai 2026" / "01.05.2026" / "2026-05-01"

Zahlen
- `ce_decades` (text): "Wie schreibst du Jahrzehnte? (z.B. 90er, 1990er)"
- `ce_spellnumbers` (radio): "Zahlen unter 100 ausschreiben?" → "Ja" / "Nein"
- `ce_units` (radio): "Maßeinheiten — immer Ziffern?" → "Ja" / "Nein"
- `ce_percent` (radio): "Prozent ausschreiben oder Symbol?" → "Wort" / "%"

Interpunktion
- `ce_serial` (radio): "Oxford-Komma?" → "Ja" / "Nein"
- `ce_hyphen` (textarea): "Wann Bindestrich verwenden? (z.B. Composita)"

Spelling
- `ce_swiss` (radio): "Schweizer Schreibweise (ss statt ß)?" → "Ja" / "Nein"
- `ce_contractions` (radio): "Kontraktionen?" → "Ausschreiben" / "Erlaubt"

Formatting
- `ce_links` (radio): "Externe Links?" → "Neuer Tab" / "Selbes Fenster"
- `ce_lists` (textarea): "Listen-Konventionen (Punkte am Ende? Großschreibung?)"

## Das Social-First Playbook — 25 Prinzipien

Lege `client/src/lib/playbook.ts` an mit allen 25 Prinzipien.
Da der User-Prompt nur P01–P09 zeigt, hier die vollständige Liste — generiere die fehlenden basierend auf dem etablierten Stil und The Drum's "Crowdsourced Social Playbook 2025"-Spirit. Jedes Prinzip braucht: id, name, source, rule (2–3 Sätze auf Deutsch), leosCheck (1 scharfe Frage), triggers (5–8 Keywords), antiTriggers (3–5 Keywords).

P01: Smartly Unpolished (Tiah Slattery, Dept) — wie im Prompt
P02: Post-Post Thinking (Alexandra Mathieu, Open Influence) — wie im Prompt
P03: Single-Frame Ambush (Emily Charlton-Smith, Anything is Possible) — wie im Prompt
P04: Subculture over Broadcast (Nadine Müller, Jung von Matt) — wie im Prompt
P05: Listen First (Judith Tulkens, Adam&EveDDB London) — wie im Prompt
P06: BTS-First — Drama vor dem Reveal (Kat Lee, Kettle) — wie im Prompt
P07: Fan Fuel — Real Life First (James Kirkham, Iconic) — wie im Prompt
P08: TV-Format Logic for Social (Richard Boon, Oh Six) — wie im Prompt
P09: Co-Creation — Audience as Co-Conspirator (Daniel Hirsch, Left Field Labs) — wie im Prompt
P10: Native Beats Adapted — Plattformlogik > Content-Recycling
P11: Comment-Section as the Real Show — die Bühne sind die Reaktionen
P12: Niche Down to Scale Up — kleine, scharfe Zielgruppen schlagen breite
P13: Frequency over Polish — Konsistenz schlägt Perfektion
P14: Sound-On Strategy — Audio als Unterscheidungsmerkmal
P15: Pattern Interrupt — Brüche in Format, Farbe, Tempo
P16: Insider Codes — Zeichen, die nur Eingeweihte verstehen
P17: Vertical-First — Mobile als Default, nicht als Anpassung
P18: Creator Collab > Brand Solo — Communities haben eigene Stimmen
P19: Memetic Surfaces — Content als Vorlage zum Remixen
P20: Story Arc Across Posts — Narrative über mehrere Beiträge
P21: Anti-Algorithm Moves — bewusst gegen die Plattform spielen
P22: First-Person Camera — Ego-Perspektive für Nähe
P23: Receipts and Proof — echte Belege, echte Screenshots
P24: Polarization Tax — bewusst Position beziehen
P25: The Texture of Real — körnig, schief, lebendig

Schreibe jedes Prinzip in Leos Stimme — direkt, klug, ein Hauch Frechheit. Keine Marketing-Floskeln.

## LEO-Layer — Scoring & Kommentar-Engine

Lege `client/src/lib/leo-engine.ts` an.

```ts
import type { SessionState } from './types';
import { PRINCIPLES } from './playbook';

// 1. Score-Berechnung
export function scoreAnswer(text: string): {
  score: number;            // 0–100
  matchedPrinciples: string[];
  violatedPrinciples: string[];
} {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  const violated: string[] = [];

  for (const p of PRINCIPLES) {
    const triggerHits = p.triggers.filter(t => lower.includes(t.toLowerCase())).length;
    const antiHits = p.antiTriggers.filter(t => lower.includes(t.toLowerCase())).length;
    if (triggerHits >= 1) matched.push(p.id);
    if (antiHits >= 1) violated.push(p.id);
  }

  // Score = Länge & Spezifität (Anti-Wischiwaschi) + matched - violated
  const wordCount = text.trim().split(/\s+/).length;
  const lengthScore = Math.min(40, wordCount * 0.8); // bis 50 Wörter linear
  const specificityScore = (text.match(/\d+|"[^"]+"|„[^"]+"/g)?.length ?? 0) * 5;
  const principleScore = Math.min(40, matched.length * 8) - violated.length * 6;
  const total = Math.max(0, Math.min(100, lengthScore + specificityScore + principleScore));

  return { score: Math.round(total), matchedPrinciples: matched, violatedPrinciples: violated };
}

// 2. Session-Score = Durchschnitt aller textlichen Antworten
export function sessionScore(s: SessionState): number;

// 3. LEO-Kommentar-Generator
// Gibt 5–8 Kommentare zurück, je nach Mustern in den Antworten.
export function leoComments(s: SessionState): { tone: 'praise' | 'flag' | 'idea'; text: string; principleId?: string }[];

// 4. Verdichtung
export function compressPersona(s: SessionState): {
  oneLiner: string;       // verdichtetes WAS
  voice: string[];        // 3–5 Adjektive aus style_attract
  avoid: string[];
  audience: string;       // verdichtet aus audience_*
  promise: string;        // verdichtet aus mission_*
};

// 5. Content-Hooks ableiten
export function deriveHooks(s: SessionState): {
  hook: string;             // 1-Zeiler-Hook
  format: string;           // Reel / Story / Carousel / Newsletter / Event
  platform: string[];       // empfohlene Plattformen
  principleId: string;      // welches Playbook-Prinzip steckt dahinter
  reason: string;           // 1 Satz warum
}[];

// 6. Format-Empfehlungen
export function formatRecommendations(s: SessionState): {
  name: string;             // z.B. "Behind-the-Build Serial"
  description: string;
  platforms: string[];
  cadence: string;          // wöchentlich / täglich
  reasonToReturn: string;
  principles: string[];
}[]; // 3 Stück
```

Wichtig: Keine externe LLM-Anbindung. Alles **deterministisch in TypeScript**. Die Engine arbeitet mit Pattern-Matching, Keyword-Maps und Templates. Das ist robust, kostenlos, sofort verfügbar.

Hooks-Templates Beispiele (in der Engine als Funktionen, die mit Persona-Daten gefüttert werden):
- "Was niemand über {industry} zeigt: {workflow_feedback in 1 Zeile}" → Format: Reel, Prinzip: P06
- "{audience_noun}, die nicht aufhören können {verb1} zu — eine Serie." → Format: Serial, Prinzip: P08
- "Drei Dinge, die wir an {product_name} ändern mussten, bevor es funktioniert hat" → Format: Carousel, Prinzip: P01

## Routing & Pages

```
/#/                         — Welcome / Setup (Klient-Name, Projekt-Name eingeben → Start)
/#/modules                  — Modul-Übersicht (7 Karten, Status: pending/done, Score)
/#/module/:id               — Modul-Flow
/#/report                   — Strategie-Report (Auswertung)
/#/about                    — Was ist LEO Strategy Lab? (Marcels Erklärung für Kunden)
```

## Komponenten-Struktur

```
client/src/
  App.tsx                          — Router, Theme
  pages/
    Welcome.tsx                    — Setup
    Modules.tsx                    — Übersicht aller 7 Module
    Module.tsx                     — Generischer Modul-Renderer
    Report.tsx                     — Verdichteter Report mit Tabs (Persona, Hooks, Formate, Risiken, Style-DNA, Roh-Antworten)
    About.tsx                      — Erklärseite
  components/
    SessionHeader.tsx              — Klient + Projekt + Score-Pill oben
    ModuleCard.tsx                 — Karte für Modul-Übersicht
    QuestionField.tsx              — Renderer für textarea/text/select/radio
    StyleAttributePicker.tsx       — Multi-Select-Karten
    MadLibsBlock.tsx               — Inline-Lückentext
    CaseStudyList.tsx              — Mehrfach-Case-Studies
    PrinciplesPanel.tsx            — Side-Panel: aktive Prinzipien des Moduls
    LeoComment.tsx                 — Inline-Kommentar-Bubble (Tone: praise/flag/idea)
    ScoreRing.tsx                  — kreisrunder Score (0-100)
    ExportPanel.tsx                — Markdown + JSON Download
    ThemeToggle.tsx
  lib/
    types.ts
    playbook.ts                    — alle 25 Prinzipien
    leo-engine.ts                  — Scoring + Kommentare + Verdichtung
    questions.ts                   — alle Fragen pro Modul (siehe oben)
    export.ts                      — toMarkdown(), toJSON()
    session-store.ts               — React Context + useReducer für Session-State
```

**WICHTIG: Keine Storage-API.** State lebt im React-Context. Beim Navigieren zwischen Modulen bleibt alles im Speicher. Beim Reload wäre alles weg — das ist OK, der User exportiert am Ende. Erwähne das im Welcome-Screen klar: "Ende-zu-Ende in deinem Browser. Bei Reload geht alles verloren — exportiere am Ende."

## Welcome-Screen — Tonalität

Header (Instrument Serif, groß):
"LEO STRATEGY LAB"

Untertitel (Mono):
"01 / Briefing-Werkstatt für Social-First Marken"

Lead-Text (max 60 Wörter):
"Sieben Frameworks. Fünfundzwanzig Prinzipien. Ein Strategie-Report.
Beantworte die Fragen, wie du sie deinem besten Freund beantworten würdest — schnell, ehrlich, ohne Marketing-Sprech. Am Ende stehen Hooks, Formate und eine Persona, mit denen wir wirklich arbeiten können."

Inputs:
- "Wer bist du? (Klient-Name)"
- "Was ist das Projekt?"
- Button: "Loslegen →"

Footer-Hinweis (klein, mono):
"Alles bleibt in deinem Browser. Bei Reload weg. Am Ende exportieren."

## Report-Page — Aufbau

Tabs (oben):
1. **Persona** — One-Liner, Voice, Audience, Promise (verdichtet)
2. **Hooks** — 5 Content-Hooks als Karten
3. **Formate** — 3 Format-Empfehlungen mit Cadence + Plattform
4. **Risiken** — verletzte Prinzipien, schwache Antworten (rot markiert)
5. **Style-DNA** — die anziehenden + abstoßenden Adjektive als Karte
6. **Roh-Daten** — alle Antworten lesbar
7. **Export** — Buttons: Markdown (.md), JSON (.json), beides per Browser-Download (kein Backend)

## Export — Markdown-Struktur

```md
# Strategie-Report — {projectName}
**Klient:** {clientName}
**Erstellt:** {date}
**Social-First-Score:** {score} / 100

---

## Verdichtete Persona
{oneLiner}

**Audience:** {audience}
**Promise:** {promise}
**Voice:** {voice.join(', ')}
**Vermeiden:** {avoid.join(', ')}

---

## 5 Content-Hooks
1. **{hook1.hook}** — {hook1.format} · {hook1.platform.join(', ')} · _{hook1.principleId}_
   {hook1.reason}
...

## 3 Format-Empfehlungen
### {format1.name}
{format1.description}
- Plattformen: {format1.platforms}
- Frequenz: {format1.cadence}
- Reason to Return: {format1.reasonToReturn}
...

## Risiken & Schwachstellen
{verletzte Prinzipien als Liste}

## Style-DNA
**Anziehen:** ...
**Abstoßen:** ...

---

## Roh-Antworten
### Modul 01 — Starter Questions
**Was machst du?** {work_what}
...
```

JSON ist die rohe `SessionState`.

## Modul-Page Layout

Header: Modul-Nummer (Mono, groß), Modul-Name (Serif), Fortschritt.
Body: Fragen sequentiell. Optional: "Springe zur nächsten unbeantworteten Frage" Knopf.
Side-Panel (rechts, ab lg): "Aktive Prinzipien für dieses Modul" — zeigt 3–5 P-Cards.
Footer: "Zurück" / "Modul abschließen → nächstes Modul".

Bei Verlassen ohne Vollständigkeit: Modul wird mit "Teilweise" markiert auf Übersicht.

## About-Page — Marcels Pitch

Eine ruhige Magazinseite mit Marcels Erklärung an Kunden, warum sie das ausfüllen sollen. ca. 200 Wörter im Stil:

"Ich bin Marcel — Creative Athlete in Storytelling. Vor jedem guten Foto, jeder guten Kampagne, jedem guten Format steht eine harte Frage: **Was willst du wirklich sagen?**

Dieses Lab ist der Werkzeugkasten, mit dem ich seit Jahren arbeite — sieben Frameworks aus der Welt der besten Texter und Strategen, gefiltert durch das, was auf Social heute wirklich funktioniert.

Du füllst es aus, ich werte aus. Im Briefing-Call haben wir keinen leeren Tisch mehr, sondern eine Persona, fünf Hooks und drei Formate, mit denen wir sofort produzieren können.

Es dauert 30–60 Minuten. Beantworte schnell. Du kannst zurückkehren. Am Ende exportierst du deinen Report — der Rest passiert zwischen uns."

— LEO

## Branding — Der LEO-Wortbildmarke

Lege als SVG-Logo eine harte typografische Marke an:
- "LEO" in Instrument Serif Italic, schwarz
- darunter ein Mono-Tag: "STRATEGY LAB / 25 PRINCIPLES"
- Gesamthöhe ~40px in Header

Inline SVG, currentColor-Strokes, dark/light kompatibel.

## QA-Anforderungen

- Hash-Routing korrekt (Wouter mit useHashLocation, Pflicht — sonst 404 nach Deploy).
- KEIN localStorage / sessionStorage.
- Alle Buttons & Inputs haben `data-testid`.
- Mobil benutzbar (375px min).
- Dark + Light Mode beide funktionieren.
- Kein placeholder Lorem Ipsum im finalen Build.
- Export erzeugt eine echte .md und .json Datei (Blob + Download-Link).

## Reihenfolge der Implementierung

1. `index.css` aktualisieren — Farben, Fonts laden, Tailwind-Config syncen
2. `tailwind.config.ts` — fontFamily.serif/sans/mono, radius, evtl. Custom-Animations
3. `lib/types.ts`, `lib/questions.ts`, `lib/playbook.ts` — Daten
4. `lib/session-store.ts` — Context + Reducer
5. `lib/leo-engine.ts` — Scoring + Kommentare
6. `lib/export.ts` — Markdown/JSON
7. `App.tsx` — Router + ThemeProvider
8. `pages/Welcome.tsx` → `pages/Modules.tsx` → `pages/Module.tsx` → `pages/Report.tsx` → `pages/About.tsx`
9. Components: alle wie oben gelistet
10. Visual QA via Playwright (Welcome, Modules, ein Modul, Report) im Dark + Light Mode
11. `npm run build` & deploy

## Tonalität — alle UI-Texte

Schreibe wie Leo: direkt, klug, knapp. Keine Smileys, keine Ausrufezeichen, keine Floskeln.
Beispiele für Kommentare:
- (praise) "Hier riecht es nach Wahrheit. P01 lebt."
- (flag) "Das klingt wie ein Pitch-Deck. P04 fehlt."
- (idea) "Mach daraus eine Serie. Drei Folgen, ein Cliffhanger pro Post."

## Deliverable

Funktionsfähige App im Verzeichnis `/home/user/workspace/leo-strategy-lab`.
Build erfolgreich. Mit `deploy_website` deploybar.

## Tiny Mode (`/#/tiny`)

Schnellstart nach `leo-tiny-framework.md`, läuft neben den 7 Modulen und braucht keinen Track.

- **01 Inputs**: Klient, Projekt, Thema, Goal (Reichweite / Community / Positionierung / Conversion), Platform (Mehrfachauswahl), Audience, Constraint
- **02 Problem-Frame**: Business-Issue + BECAUSE → ein Satz, Problemtyp (Category / Product / Brand / Culture)
- **03 Playbook-Scan**: Leo schlägt Pxx vor (Ziel, Plattform, Grenze, Stichworte), User wählt 2–3. Ohne Auswahl gelten Leos Top 3.
- **04 Hooks & Formate**: 5 Hooks mit Emotion + Mechanik + Pxx, Group-Chat-Test per Toggle; 2 Format-Mechaniken
- **05 Mini-CRISP**: C/R/I/S/P-Felder mit Leo-Entwurf als Platzhalter und „Leo-Entwurf einsetzen"
- **06 Next 72 Hours**: kleinster nächster Schritt, mit Datum
- **07 Strategy Paper**: Vorschau + Export `.md` / `.json`. Leere Felder übernehmen Leos Entwurf.

Code: `lib/tiny-engine.ts` (deterministisch), `lib/tiny-export.ts`, `pages/Tiny.tsx`, State unter `SessionState.tiny`.

## Erweiterungen Oktober 2026

- **Shift** (Brief-Sektion + Tiny Step 02): `brief_believe_now`, `brief_believe_next`, `brief_action`, `brief_one_thing` bzw. `tiny.shiftNow/Next/Action/OneThing`. Ersetzt `brief_know` und `brief_care`. Erscheint in der Persona (Report), im Export und erzeugt den ersten Hook („Alle denken: … Stimmt nicht.“, P24).
- **Leo stört** (`lib/leo-provocations.ts`): ca. 20 Stör-Fragen als Kommentar-Typ `question`. Jede Frage hat eine Bedingung, max. 2 gleichzeitig. Sichtbar in Modul-Seitenleiste, Übersicht/Report und Tiny.
- **Modul 08 Business Deep-Dive** (`deepdive`): 12 Fragen, optional, nur Tracks Agency und Brand Refresh. Missverständnis und Folklore erzeugen eigene Hooks (P11, P16).
- **Pflicht-Elemente** im Copyediting: Logo, Kontakt, Produkte, Rechtstexte/Kennzeichnung, Disclaimer.

## Trend-Radar (`/#/trends`)

- Daten: `lib/trends.ts` mit 47 Signalen in 7 Feldern (Kommunikation, Design, Kultur, Marketing, Musik, Gesundheit, Lifestyle) und 23 Radar-Quellen. Jedes Signal: Insight mit Zahl, „So nutzt du es“, „Finger weg“, Pxx, Plattformen, Ziele, Stichworte, Quellen mit Datum, Ablaufdatum.
- Abgelaufene Signale fallen automatisch raus (`expires`). Recherche-Stand Oktober 2026, Pflege einmal pro Quartal.
- Matching (`matchTrends`): Stichworte in den Antworten, Ziel, Plattform, aktive Prinzipien. Max. 2 Treffer pro Feld.
- Einbindung: Report-Tab „Trends“, Markdown-Export „Trend-Kontext“, Tiny Strategy Paper + Export, eigene Radar-Seite mit Filter. Stör-Frage „Läuft das in sechs Wochen noch?“ bei Trend-Wörtern.
