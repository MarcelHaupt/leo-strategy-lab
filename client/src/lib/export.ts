import type { SessionState } from './types';
import { MODULE_ORDER, MODULE_META, TRACKS } from './types';
import { QUESTIONS, optionLabel, styleLabel } from './questions';
import { tr, dateLocale } from './i18n';
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
  const date = new Date(s.startedAt || Date.now()).toLocaleDateString(dateLocale());

  const lines: string[] = [];
  lines.push(`# ${tr('Strategie-Report', 'Strategy Report')} — ${s.projectName || tr('Unbenanntes Projekt', 'Untitled project')}`);
  lines.push(`**Track:** ${s.track ? `${TRACKS[s.track].code} — ${TRACKS[s.track].name}` : '—'}`);
  lines.push(`**${tr('Klient', 'Client')}:** ${s.clientName || '—'}`);
  lines.push(`**${tr('Erstellt', 'Created')}:** ${date}`);
  lines.push(`**${tr('Social-First-Score', 'Social-first score')}:** ${score} / 100`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Persona
  lines.push(tr('## Verdichtete Persona', '## Condensed Persona'));
  lines.push(persona.oneLiner);
  lines.push('');
  lines.push(`**Audience:** ${persona.audience}`);
  lines.push(`**Promise:** ${persona.promise}`);
  lines.push(`**Voice:** ${persona.voice.join(', ') || '—'}`);
  lines.push(`**${tr('Vermeiden', 'Avoid')}:** ${persona.avoid.join(', ') || '—'}`);
  lines.push('');
  if (persona.shift.now || persona.shift.next) {
    lines.push('## Shift');
    lines.push(`**${tr('Heute glauben sie', 'Today they believe')}:** ${persona.shift.now || '—'}  `);
    lines.push(`**${tr('Danach sollen sie glauben', 'Afterwards they should believe')}:** ${persona.shift.next || '—'}  `);
    if (persona.shift.action) lines.push(`**${tr('Handlung', 'Action')}:** ${persona.shift.action}  `);
    if (persona.shift.oneThing) lines.push(`**${tr('Der eine Satz', 'The one sentence')}:** ${persona.shift.oneThing}`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Hooks
  lines.push(tr('## 5 Content-Hooks', '## 5 Content Hooks'));
  hooks.forEach((h, i) => {
    lines.push(
      `${i + 1}. **${h.hook}** — ${h.format} · ${h.platform.join(', ')} · _${h.principleId}_`,
    );
    lines.push(`   ${h.reason}`);
  });
  lines.push('');

  // Formats
  lines.push(tr('## 3 Format-Empfehlungen', '## 3 Format Recommendations'));
  formats.forEach((f) => {
    lines.push(`### ${f.name}`);
    lines.push(f.description);
    lines.push(`- ${tr('Plattformen', 'Platforms')}: ${f.platforms.join(', ')}`);
    lines.push(`- ${tr('Frequenz', 'Cadence')}: ${f.cadence}`);
    lines.push(`- Reason to Return: ${f.reasonToReturn}`);
    lines.push(`- ${tr('Prinzipien', 'Principles')}: ${f.principles.join(', ')}`);
    lines.push('');
  });

  // Trend-Kontext
  const trends = sessionTrends(s, 4);
  if (trends.length > 0) {
    lines.push(tr('## Trend-Kontext', '## Trend Context'));
    trends.forEach(({ signal: t }) => {
      lines.push(`### ${t.title} (${TREND_DOMAINS[t.domain]})`);
      lines.push(t.insight);
      lines.push(`- ${tr('So nutzt du es', 'How to use it')}: ${t.move}`);
      lines.push(`- ${tr('Finger weg', 'Hands off')}: ${t.skip}`);
      lines.push(`- ${tr('Prinzipien', 'Principles')}: ${t.principles.join(', ')}`);
      if (t.strength) lines.push(`- ${tr('Signalstärke', 'Signal strength')}: ${'●'.repeat(t.strength)}${'○'.repeat(4 - t.strength)} (${t.strength === 4 ? tr('4 oder mehr', '4 or more') : t.strength} ${t.strength === 1 ? 'Report' : 'Reports'})`);
      lines.push(`- ${tr('Quelle', 'Source')}: ${t.sources.map((src) => `[${src.label}](${src.url}), ${formatSourceDate(src.date)}`).join('; ')}`);
      lines.push('');
    });
  }

  // Risks
  lines.push(tr('## Risiken & Schwachstellen', '## Risks & Weak Spots'));
  if (r.violatedPrinciples.length === 0 && r.weakAnswers.length === 0) {
    lines.push(tr('Keine harten Verstöße gefunden. Bleib wachsam.', 'No hard violations found. Stay alert.'));
  } else {
    if (r.violatedPrinciples.length > 0) {
      lines.push(tr('**Verletzte Prinzipien:**', '**Violated principles:**'));
      r.violatedPrinciples.forEach(({ id, count }) => {
        const p = PRINCIPLES_BY_ID[id];
        lines.push(`- ${id} ${p?.name ?? ''} — ${count}× ${tr('verletzt', 'violated')}`);
      });
      lines.push('');
    }
    if (r.weakAnswers.length > 0) {
      lines.push(tr('**Schwache Antworten (Score < 25):**', '**Weak answers (score < 25):**'));
      r.weakAnswers.forEach((w) => {
        lines.push(`- ${w.moduleId}/${w.questionId} (Score ${w.score})`);
      });
      lines.push('');
    }
  }

  // Style DNA
  lines.push(tr('## Style-DNA', '## Style DNA'));
  lines.push(`**${tr('Anziehen', 'Attract')}:** ${persona.voice.join(', ') || '—'}`);
  lines.push(`**${tr('Abstoßen', 'Repel')}:** ${persona.avoid.join(', ') || '—'}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Raw answers
  lines.push(tr('## Roh-Antworten', '## Raw Answers'));
  for (const moduleId of MODULE_ORDER) {
    const meta = MODULE_META[moduleId];
    const mod = s.modules[moduleId];
    lines.push(`### ${tr('Modul', 'Module')} ${meta.number} — ${meta.title}`);
    if (moduleId === 'casestudy') {
      const cs = mod.caseStudies ?? [];
      cs.forEach((c, i) => {
        lines.push(`#### Case Study ${i + 1}`);
        if (c.cs_name) lines.push(`**Name:** ${c.cs_name}`);
        if (c.cs_what) lines.push(`**${tr('Was gemacht', 'What was done')}:** ${c.cs_what}`);
        if (c.cs_audience) lines.push(`**Audience:** ${c.cs_audience}`);
        if (c.cs_unique) lines.push(`**${tr('Einzigartig', 'Unique')}:** ${c.cs_unique}`);
        if (c.cs_results) lines.push(`**${tr('Ergebnisse', 'Results')}:** ${c.cs_results}`);
        if (c.cs_quotes) lines.push(`**${tr('Zitate', 'Quotes')}:** ${c.cs_quotes}`);
        lines.push('');
      });
    } else if (moduleId === 'style') {
      const a = (mod.answers.style_attract as string[]) ?? [];
      const v = (mod.answers.style_avoid as string[]) ?? [];
      lines.push(`**${tr('Anziehen', 'Attract')}:** ${a.map(styleLabel).join(', ') || '—'}`);
      lines.push(`**${tr('Abstoßen', 'Repel')}:** ${v.map(styleLabel).join(', ') || '—'}`);
      lines.push('');
    } else {
      const qs = QUESTIONS[moduleId];
      qs.forEach((q) => {
        const v = mod.answers[q.id];
        if (v && (typeof v === 'string' ? v.trim() : v.length)) {
          const val = Array.isArray(v) ? v.map((x) => optionLabel(q, x)).join(', ') : optionLabel(q, v);
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
