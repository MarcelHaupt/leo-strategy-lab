import type { SessionState } from './types';
import { MODULE_ORDER, MODULE_META, TRACKS } from './types';
import { QUESTIONS } from './questions';
import {
  sessionScore,
  compressPersona,
  deriveHooks,
  formatRecommendations,
  risks,
} from './leo-engine';
import { PRINCIPLES_BY_ID } from './playbook';
import { sessionTrends } from './trend-context';
import { TREND_DOMAINS, formatSourceDate } from './trends';

export function toJSON(s: SessionState): string {
  return JSON.stringify(s, null, 2);
}

export function toMarkdown(s: SessionState): string {
  const score = sessionScore(s);
  const persona = compressPersona(s);
  const hooks = deriveHooks(s);
  const formats = formatRecommendations(s);
  const r = risks(s);
  const date = new Date(s.startedAt || Date.now()).toLocaleDateString('de-DE');

  const lines: string[] = [];
  lines.push(`# Strategie-Report — ${s.projectName || 'Unbenanntes Projekt'}`);
  lines.push(`**Track:** ${s.track ? `${TRACKS[s.track].code} — ${TRACKS[s.track].name}` : '—'}`);
  lines.push(`**Klient:** ${s.clientName || '—'}`);
  lines.push(`**Erstellt:** ${date}`);
  lines.push(`**Social-First-Score:** ${score} / 100`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Persona
  lines.push('## Verdichtete Persona');
  lines.push(persona.oneLiner);
  lines.push('');
  lines.push(`**Audience:** ${persona.audience}`);
  lines.push(`**Promise:** ${persona.promise}`);
  lines.push(`**Voice:** ${persona.voice.join(', ') || '—'}`);
  lines.push(`**Vermeiden:** ${persona.avoid.join(', ') || '—'}`);
  lines.push('');
  if (persona.shift.now || persona.shift.next) {
    lines.push('## Shift');
    lines.push(`**Heute glauben sie:** ${persona.shift.now || '—'}  `);
    lines.push(`**Danach sollen sie glauben:** ${persona.shift.next || '—'}  `);
    if (persona.shift.action) lines.push(`**Handlung:** ${persona.shift.action}  `);
    if (persona.shift.oneThing) lines.push(`**Der eine Satz:** ${persona.shift.oneThing}`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Hooks
  lines.push('## 5 Content-Hooks');
  hooks.forEach((h, i) => {
    lines.push(
      `${i + 1}. **${h.hook}** — ${h.format} · ${h.platform.join(', ')} · _${h.principleId}_`,
    );
    lines.push(`   ${h.reason}`);
  });
  lines.push('');

  // Formats
  lines.push('## 3 Format-Empfehlungen');
  formats.forEach((f) => {
    lines.push(`### ${f.name}`);
    lines.push(f.description);
    lines.push(`- Plattformen: ${f.platforms.join(', ')}`);
    lines.push(`- Frequenz: ${f.cadence}`);
    lines.push(`- Reason to Return: ${f.reasonToReturn}`);
    lines.push(`- Prinzipien: ${f.principles.join(', ')}`);
    lines.push('');
  });

  // Trend-Kontext
  const trends = sessionTrends(s, 4);
  if (trends.length > 0) {
    lines.push('## Trend-Kontext');
    trends.forEach(({ signal: t }) => {
      lines.push(`### ${t.title} (${TREND_DOMAINS[t.domain]})`);
      lines.push(t.insight);
      lines.push(`- So nutzt du es: ${t.move}`);
      lines.push(`- Finger weg: ${t.skip}`);
      lines.push(`- Prinzipien: ${t.principles.join(', ')}`);
      lines.push(`- Quelle: ${t.sources.map((src) => `[${src.label}](${src.url}), ${formatSourceDate(src.date)}`).join('; ')}`);
      lines.push('');
    });
  }

  // Risks
  lines.push('## Risiken & Schwachstellen');
  if (r.violatedPrinciples.length === 0 && r.weakAnswers.length === 0) {
    lines.push('Keine harten Verstöße gefunden. Bleib wachsam.');
  } else {
    if (r.violatedPrinciples.length > 0) {
      lines.push('**Verletzte Prinzipien:**');
      r.violatedPrinciples.forEach(({ id, count }) => {
        const p = PRINCIPLES_BY_ID[id];
        lines.push(`- ${id} ${p?.name ?? ''} — ${count}× verletzt`);
      });
      lines.push('');
    }
    if (r.weakAnswers.length > 0) {
      lines.push('**Schwache Antworten (Score < 25):**');
      r.weakAnswers.forEach((w) => {
        lines.push(`- ${w.moduleId}/${w.questionId} (Score ${w.score})`);
      });
      lines.push('');
    }
  }

  // Style DNA
  lines.push('## Style-DNA');
  lines.push(`**Anziehen:** ${persona.voice.join(', ') || '—'}`);
  lines.push(`**Abstoßen:** ${persona.avoid.join(', ') || '—'}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Raw answers
  lines.push('## Roh-Antworten');
  for (const moduleId of MODULE_ORDER) {
    const meta = MODULE_META[moduleId];
    const mod = s.modules[moduleId];
    lines.push(`### Modul ${meta.number} — ${meta.title}`);
    if (moduleId === 'casestudy') {
      const cs = mod.caseStudies ?? [];
      cs.forEach((c, i) => {
        lines.push(`#### Case Study ${i + 1}`);
        if (c.cs_name) lines.push(`**Name:** ${c.cs_name}`);
        if (c.cs_what) lines.push(`**Was gemacht:** ${c.cs_what}`);
        if (c.cs_audience) lines.push(`**Audience:** ${c.cs_audience}`);
        if (c.cs_unique) lines.push(`**Einzigartig:** ${c.cs_unique}`);
        if (c.cs_results) lines.push(`**Ergebnisse:** ${c.cs_results}`);
        if (c.cs_quotes) lines.push(`**Zitate:** ${c.cs_quotes}`);
        lines.push('');
      });
    } else if (moduleId === 'style') {
      const a = (mod.answers.style_attract as string[]) ?? [];
      const v = (mod.answers.style_avoid as string[]) ?? [];
      lines.push(`**Anziehen:** ${a.join(', ') || '—'}`);
      lines.push(`**Abstoßen:** ${v.join(', ') || '—'}`);
      lines.push('');
    } else {
      const qs = QUESTIONS[moduleId];
      qs.forEach((q) => {
        const v = mod.answers[q.id];
        if (v && (typeof v === 'string' ? v.trim() : v.length)) {
          const val = Array.isArray(v) ? v.join(', ') : v;
          lines.push(`**${q.label}**`);
          lines.push(val);
          lines.push('');
        }
      });
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportMarkdown(s: SessionState) {
  const slug = (s.projectName || 'projekt').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  downloadFile(`leo-report-${slug || 'projekt'}.md`, toMarkdown(s), 'text/markdown;charset=utf-8');
}

export function exportJSON(s: SessionState) {
  const slug = (s.projectName || 'projekt').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  downloadFile(`leo-report-${slug || 'projekt'}.json`, toJSON(s), 'application/json');
}
