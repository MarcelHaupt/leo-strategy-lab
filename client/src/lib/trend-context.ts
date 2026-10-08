// Verbindet den Trend-Radar mit Session und Tiny Mode.
import type { SessionState, TinyState, TrackId } from './types';
import { matchTrends, type TrendMatch, type TrendGoal } from './trends';
import { activePrinciples } from './tiny-engine';
import { deriveHooks } from './leo-engine';

const PLATFORM_WORDS: Record<string, string[]> = {
  TikTok: ['tiktok'],
  'Instagram Reels': ['reels', 'reel'],
  'Instagram Stories': ['stories', 'story'],
  Instagram: ['instagram', 'insta'],
  'YouTube Shorts': ['shorts'],
  YouTube: ['youtube'],
  LinkedIn: ['linkedin'],
  Podcast: ['podcast'],
  Pinterest: ['pinterest'],
};

const TRACK_GOAL: Record<TrackId, TrendGoal> = {
  founder: 'positioning',
  product: 'conversion',
  agency: 'positioning',
  refresh: 'positioning',
};

function sessionText(s: SessionState): string {
  const parts: string[] = [s.projectName];
  for (const mod of Object.values(s.modules)) {
    for (const v of Object.values(mod.answers)) parts.push(Array.isArray(v) ? v.join(' ') : String(v ?? ''));
    (mod.caseStudies ?? []).forEach((cs) => parts.push(...Object.values(cs).map((x) => x ?? '')));
  }
  return parts.join(' ').toLowerCase();
}

function detectPlatforms(text: string): string[] {
  return Object.entries(PLATFORM_WORDS)
    .filter(([, words]) => words.some((w) => text.includes(w)))
    .map(([p]) => p);
}

export function sessionTrends(s: SessionState, max = 4): TrendMatch[] {
  const text = sessionText(s);
  return matchTrends(
    {
      text,
      goal: s.track ? TRACK_GOAL[s.track] : '',
      platforms: detectPlatforms(text),
      principles: deriveHooks(s).map((h) => h.principleId),
    },
    max,
  );
}

export function tinyTrends(t: TinyState, max = 3): TrendMatch[] {
  const text = [t.topic, t.audience, t.constraint, t.problemIssue, t.problemBecause, t.shiftNow, t.shiftNext, t.shiftAction]
    .join(' ')
    .toLowerCase();
  return matchTrends({ text, goal: t.goal, platforms: t.platforms, principles: activePrinciples(t) }, max);
}
