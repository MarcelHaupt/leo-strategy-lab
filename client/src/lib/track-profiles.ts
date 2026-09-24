import type { TrackId, ModuleId } from './types';

// Welche Module sind für einen Track sichtbar?
export const MODULES_PER_TRACK: Record<TrackId, ModuleId[]> = {
  founder:  ['starter', 'madlibs',                          'brief', 'style', 'copyedit'],
  product:  ['starter', 'madlibs', 'product',               'brief', 'style', 'copyedit'],
  agency:   ['starter', 'madlibs', 'product', 'casestudy',  'brief', 'style', 'copyedit'],
  refresh:  ['starter', 'madlibs', 'product', 'casestudy',  'brief', 'style', 'copyedit'],
};

// Welche Fragen-IDs sind pro Track in einem Modul relevant?
export const QUESTION_VISIBILITY: Record<TrackId, Record<ModuleId, string[] | 'ALL'>> = {
  founder: {
    starter: [
      'work_what','work_favorite',
      'mission_why','mission_matter','mission_goals','mission_world','mission_top3',
      'audience_know','audience_why','audience_findyou','audience_friend','audience_core',
      'brand_competition','brand_person','brand_inspires','brand_avoid',
    ],
    madlibs: 'ALL',
    product: [],
    casestudy: [],
    brief: [
      'brief_purpose','brief_know','brief_next',
      'brief_audience','brief_needs',
      'brief_say','brief_narrative','brief_care',
      'brief_traits','brief_voice','brief_tone',
    ],
    style: 'ALL',
    copyedit: 'ALL',
  },
  product: {
    starter: [
      'work_what','work_favorite','work_industry',
      'mission_why','mission_matter','mission_goals','mission_world','mission_top3',
      'audience_know','audience_why','audience_findyou','audience_sensitive','audience_friend','audience_core',
      'brand_competition','brand_person','brand_inspires','brand_avoid',
      'workflow_tools','workflow_feedback','workflow_schedule',
    ],
    madlibs: 'ALL',
    product: 'ALL',
    casestudy: [],
    brief: 'ALL',
    style: 'ALL',
    copyedit: 'ALL',
  },
  agency: {
    starter: [
      'work_what','work_favorite','work_industry',
      'mission_why','mission_matter','mission_goals','mission_world','mission_top3',
      'audience_know','audience_why','audience_findyou','audience_sensitive','audience_friend','audience_core',
      'brand_competition','brand_person','brand_inspires','brand_avoid',
      'workflow_tools','workflow_feedback',
    ],
    madlibs: 'ALL',
    product: [
      'pq_what','pq_who','pq_can','pq_how',
      'pq_purpose','pq_history','pq_competition','pq_reputation','pq_use_cases',
    ],
    casestudy: 'ALL',
    brief: 'ALL',
    style: 'ALL',
    copyedit: 'ALL',
  },
  refresh: {
    starter: 'ALL',
    madlibs: 'ALL',
    product: 'ALL',
    casestudy: 'ALL',
    brief: 'ALL',
    style: 'ALL',
    copyedit: 'ALL',
  },
};

export function isQuestionVisible(track: TrackId | null, module: ModuleId, questionId: string): boolean {
  if (!track) return true;
  const moduleSpec = QUESTION_VISIBILITY[track][module];
  if (moduleSpec === 'ALL') return true;
  return moduleSpec.includes(questionId);
}

export function isModuleVisible(track: TrackId | null, module: ModuleId): boolean {
  if (!track) return true;
  return MODULES_PER_TRACK[track].includes(module);
}

export function visibleModulesForTrack(track: TrackId | null): ModuleId[] {
  if (!track) return [];
  return MODULES_PER_TRACK[track];
}
