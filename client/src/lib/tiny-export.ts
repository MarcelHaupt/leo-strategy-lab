import type { SessionState, CrispKey } from './types';
import { PRINCIPLES_BY_ID } from './playbook';
import { downloadFile } from './export';
import {
  TINY_GOALS,
  CRISP_META,
  problemSentence,
  activePrinciples,
  tinyHooks,
  tinyFormats,
  crispDrafts,
  next72Draft,
  topicOf,
} from './tiny-engine';

/** Was im Paper landet: eigener Text, sonst Leos Entwurf */
export function resolvedCrisp(s: SessionState): Record<CrispKey, string> {
  const drafts = crispDrafts(s.tiny, s.projectName);
  const out = {} as Record<CrispKey, string>;
  (Object.keys(CRISP_META) as CrispKey[]).forEach((k) => {
    out[k] = s.tiny.crisp[k].trim() || drafts[k];
  });
  return out;
}

export function paperHooks(s: SessionState) {
  const all = tinyHooks(s.tiny, s.projectName);
  const passed = all.filter((h) => s.tiny.passedHooks.includes(h.principleId));
  return passed.length > 0 ? passed : all;
}

export function tinyToMarkdown(s: SessionState): string {
  const t = s.tiny;
  const crisp = resolvedCrisp(s);
  const hooks = paperHooks(s);
  const formats = tinyFormats(t);
  const principles = activePrinciples(t);
  const date = new Date().toLocaleDateString('de-DE');
  const L: string[] = [];

  L.push(`# Strategy Paper — ${s.projectName || topicOf(t)}`);
  L.push(`**Tiny Framework** · ${s.clientName || '—'} · ${date}`);
  L.push('');
  L.push(`**Ziel:** ${t.goal ? TINY_GOALS[t.goal].label : '—'}  `);
  L.push(`**Plattform:** ${t.platforms.join(', ') || '—'}  `);
  L.push(`**Für wen:** ${t.audience || '—'}  `);
  L.push(`**Grenze:** ${t.constraint || '—'}`);
  L.push('');
  L.push('## Problem');
  L.push(problemSentence(t) || '—');
  if (t.problemType) L.push(`_Problemtyp: ${t.problemType}_`);
  L.push('');
  L.push('## Playbook-Leitplanken');
  principles.forEach((id) => {
    const p = PRINCIPLES_BY_ID[id];
    if (p) L.push(`- **${p.id} ${p.name}** — ${p.leosCheck}`);
  });
  L.push('');
  L.push('## Hooks');
  hooks.forEach((h, i) => {
    L.push(`${i + 1}. **${h.hook}**  `);
    L.push(`   ${h.emotion} · ${h.mechanic} · _${h.principleId}_`);
  });
  L.push('');
  L.push('## Format-Mechanik');
  formats.forEach((f) => {
    L.push(`### ${f.name}`);
    L.push(f.mechanic);
    L.push(`- Rhythmus: ${f.cadence}`);
    L.push(`- Reason to return: ${f.reasonToReturn}`);
    L.push(`- Prinzipien: ${f.principles.join(', ')}`);
    L.push('');
  });
  L.push('## Mini-CRISP');
  (Object.keys(CRISP_META) as CrispKey[]).forEach((k) => {
    if (k === 'p' && !crisp.p.trim()) return;
    L.push(`**${CRISP_META[k].letter} — ${CRISP_META[k].name}**`);
    L.push(crisp[k]);
    L.push('');
  });
  L.push('## Next 72 Hours');
  L.push(t.next72.trim() || next72Draft(t, s.projectName));
  L.push('');
  L.push('---');
  L.push('_LEO Strategy Lab · Tiny Framework_');
  return L.join('\n');
}

const slugOf = (s: SessionState) =>
  (s.projectName || s.tiny.topic || 'tiny')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'tiny';

export function exportTinyMarkdown(s: SessionState) {
  downloadFile(`leo-strategy-paper-${slugOf(s)}.md`, tinyToMarkdown(s), 'text/markdown;charset=utf-8');
}

export function exportTinyJSON(s: SessionState) {
  const payload = {
    clientName: s.clientName,
    projectName: s.projectName,
    exportedAt: new Date().toISOString(),
    tiny: s.tiny,
  };
  downloadFile(`leo-strategy-paper-${slugOf(s)}.json`, JSON.stringify(payload, null, 2), 'application/json');
}
