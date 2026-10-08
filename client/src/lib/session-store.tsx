import { createContext, useContext, useReducer, useMemo, type ReactNode } from 'react';
import type { SessionState, ModuleId, ModuleState, CaseStudyEntry, TrackId, TinyState } from './types';
import { MODULE_ORDER } from './types';

const emptyModule = (id: ModuleId): ModuleState => ({
  id,
  answers: {},
  caseStudies: id === 'casestudy' ? [{}] : undefined,
});

export const emptyTiny = (): TinyState => ({
  topic: '',
  goal: '',
  platforms: [],
  audience: '',
  constraint: '',
  problemIssue: '',
  problemBecause: '',
  problemType: '',
  principles: [],
  shiftNow: '',
  shiftNext: '',
  shiftAction: '',
  shiftOneThing: '',
  passedHooks: [],
  crisp: { c: '', r: '', i: '', s: '', p: '' },
  next72: '',
});

const initialSession = (): SessionState => ({
  clientName: '',
  projectName: '',
  track: null,
  startedAt: 0,
  modules: Object.fromEntries(
    MODULE_ORDER.map((id) => [id, emptyModule(id)]),
  ) as Record<ModuleId, ModuleState>,
  currentModule: null,
  tiny: emptyTiny(),
});

type Action =
  | { type: 'init'; clientName: string; projectName: string; track: TrackId }
  | { type: 'setTrack'; track: TrackId }
  | { type: 'reset' }
  | { type: 'setAnswer'; moduleId: ModuleId; questionId: string; value: string | string[] }
  | { type: 'setCaseStudy'; index: number; entry: CaseStudyEntry }
  | { type: 'addCaseStudy' }
  | { type: 'removeCaseStudy'; index: number }
  | { type: 'completeModule'; moduleId: ModuleId }
  | { type: 'setCurrentModule'; moduleId: ModuleId | null }
  | { type: 'setMeta'; clientName?: string; projectName?: string }
  | { type: 'setTiny'; patch: Partial<TinyState> }
  | { type: 'resetTiny' };

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'init':
      return {
        ...initialSession(),
        clientName: action.clientName,
        projectName: action.projectName,
        track: action.track,
        startedAt: Date.now(),
        tiny: state.tiny, // Tiny-Session überlebt den Start der langen Session
      };
    case 'setTrack':
      return { ...state, track: action.track };
    case 'reset':
      return initialSession();
    case 'setAnswer': {
      const mod = state.modules[action.moduleId];
      return {
        ...state,
        modules: {
          ...state.modules,
          [action.moduleId]: {
            ...mod,
            answers: { ...mod.answers, [action.questionId]: action.value },
          },
        },
      };
    }
    case 'setCaseStudy': {
      const mod = state.modules.casestudy;
      const list = [...(mod.caseStudies ?? [])];
      list[action.index] = action.entry;
      return {
        ...state,
        modules: { ...state.modules, casestudy: { ...mod, caseStudies: list } },
      };
    }
    case 'addCaseStudy': {
      const mod = state.modules.casestudy;
      const list = [...(mod.caseStudies ?? []), {}];
      return {
        ...state,
        modules: { ...state.modules, casestudy: { ...mod, caseStudies: list } },
      };
    }
    case 'removeCaseStudy': {
      const mod = state.modules.casestudy;
      const list = (mod.caseStudies ?? []).filter((_, i) => i !== action.index);
      return {
        ...state,
        modules: {
          ...state.modules,
          casestudy: {
            ...mod,
            caseStudies: list.length === 0 ? [{}] : list,
          },
        },
      };
    }
    case 'completeModule': {
      const mod = state.modules[action.moduleId];
      return {
        ...state,
        modules: {
          ...state.modules,
          [action.moduleId]: { ...mod, completedAt: Date.now() },
        },
      };
    }
    case 'setCurrentModule':
      return { ...state, currentModule: action.moduleId };
    case 'setMeta':
      return {
        ...state,
        clientName: action.clientName ?? state.clientName,
        projectName: action.projectName ?? state.projectName,
      };
    case 'setTiny':
      return { ...state, tiny: { ...state.tiny, ...action.patch } };
    case 'resetTiny':
      return { ...state, tiny: emptyTiny() };
    default:
      return state;
  }
}

type SessionContextValue = {
  state: SessionState;
  dispatch: React.Dispatch<Action>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialSession);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

export function moduleProgress(mod: ModuleState | undefined): {
  filled: number;
  total: number;
  status: 'pending' | 'partial' | 'done';
} {
  if (!mod) return { filled: 0, total: 0, status: 'pending' };
  const answered = Object.values(mod.answers).filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === 'string' && v.trim().length > 0;
  }).length;
  if (mod.id === 'casestudy') {
    const cs = mod.caseStudies ?? [];
    const filled = cs.filter((c) => c.cs_name || c.cs_what || c.cs_results).length;
    return {
      filled,
      total: cs.length || 1,
      status: filled === 0 ? 'pending' : mod.completedAt ? 'done' : 'partial',
    };
  }
  if (mod.id === 'style') {
    const a = (mod.answers.style_attract as string[] | undefined)?.length ?? 0;
    const b = (mod.answers.style_avoid as string[] | undefined)?.length ?? 0;
    const filled = a + b;
    return {
      filled: a,
      total: 5,
      status: filled === 0 ? 'pending' : mod.completedAt ? 'done' : 'partial',
    };
  }
  return {
    filled: answered,
    total: 0,
    status: answered === 0 ? 'pending' : mod.completedAt ? 'done' : 'partial',
  };
}
