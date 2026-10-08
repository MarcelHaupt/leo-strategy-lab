import { useEffect, useMemo } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useSession, moduleProgress } from '@/lib/session-store';
import { MODULE_META, MODULE_ORDER, type ModuleId } from '@/lib/types';
import { QUESTIONS } from '@/lib/questions';
import { isQuestionVisible, visibleModulesForTrack } from '@/lib/track-profiles';
import { QuestionField } from '@/components/QuestionField';
import { PrinciplesPanel } from '@/components/PrinciplesPanel';
import { MadLibsBlock } from '@/components/MadLibsBlock';
import { CaseStudyList } from '@/components/CaseStudyList';
import { StyleAttributePicker } from '@/components/StyleAttributePicker';
import { Button } from '@/components/ui/button';
import { LeoComment } from '@/components/LeoComment';
import { provocations } from '@/lib/leo-provocations';

const VALID_IDS: ModuleId[] = MODULE_ORDER;

export default function Module() {
  const [, params] = useRoute<{ id: string }>('/module/:id');
  const [, navigate] = useLocation();
  const { state, dispatch } = useSession();

  useEffect(() => {
    if (state.startedAt === 0) navigate('/');
  }, [state.startedAt, navigate]);

  const id = params?.id as ModuleId | undefined;
  const isValid = id && VALID_IDS.includes(id);

  const meta = isValid ? MODULE_META[id!] : null;
  const allQuestions = isValid ? QUESTIONS[id!] : [];
  const questions = useMemo(
    () => allQuestions.filter((q) => isQuestionVisible(state.track, id!, q.id)),
    [allQuestions, state.track, id],
  );
  const mod = isValid ? state.modules[id!] : undefined;

  const sections = useMemo(() => {
    const map = new Map<string, typeof questions>();
    for (const q of questions) {
      const sec = q.section ?? 'Fragen';
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec)!.push(q);
    }
    // Drop sections without any visible questions (already implicitly handled)
    return Array.from(map.entries()).filter(([, qs]) => qs.length > 0);
  }, [questions]);

  if (!isValid || !meta || !mod) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-serif text-4xl">Modul nicht gefunden</h1>
        <Link href="/modules">
          <a className="font-mono text-sm text-primary mt-4 inline-block">← Zurück zur Übersicht</a>
        </Link>
      </div>
    );
  }

  const trackOrder = state.track ? visibleModulesForTrack(state.track) : MODULE_ORDER;
  const idx = trackOrder.indexOf(id!);
  const prev = idx > 0 ? trackOrder[idx - 1] : null;
  const next = idx >= 0 && idx < trackOrder.length - 1 ? trackOrder[idx + 1] : null;
  const trackTotal = trackOrder.length;
  const moduleNumberInTrack = idx >= 0 ? idx + 1 : MODULE_ORDER.indexOf(id!) + 1;
  const prog = moduleProgress(mod);

  const finishAndGo = () => {
    dispatch({ type: 'completeModule', moduleId: id! });
    if (next) navigate(`/module/${next}`);
    else navigate('/report');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="border-b border-border pb-8 mb-10">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-tag text-muted-foreground">
                MODUL {String(moduleNumberInTrack).padStart(2, '0')} / {String(trackTotal).padStart(2, '0')}
              </span>
              <span
                className={`font-mono text-tag ${
                  prog.status === 'done'
                    ? 'text-primary'
                    : prog.status === 'partial'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                }`}
              >
                {prog.status === 'done' ? 'ABGESCHLOSSEN' : prog.status === 'partial' ? 'TEILWEISE' : 'OFFEN'}
              </span>
            </div>
            <h1
              className="font-serif text-5xl md:text-6xl leading-none mt-2 tracking-tight"
              data-testid="text-module-title"
            >
              {meta.title}
            </h1>
            <p className="text-tag text-muted-foreground mt-2">{meta.subtitle}</p>
          </div>
          <Link href="/modules" data-testid="link-back-modules">
            <a className="font-mono text-tag text-muted-foreground hover:text-primary">
              ← ÜBERSICHT
            </a>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          {meta.description}
        </p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {id === 'madlibs' && <MadLibsBlock />}
          {id === 'casestudy' && <CaseStudyList />}
          {id === 'style' && (
            <div className="space-y-12">
              <StyleAttributePicker mode="attract" />
              <div className="border-t border-border" />
              <StyleAttributePicker mode="avoid" />
            </div>
          )}

          {id !== 'madlibs' && id !== 'casestudy' && id !== 'style' &&
            sections.map(([sec, qs]) => (
              <section key={sec} className="space-y-6">
                <div className="flex items-baseline gap-3 border-b border-border pb-2">
                  <span className="font-mono text-tag text-primary">
                    {String(sections.findIndex(([s]) => s === sec) + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-2xl">{sec}</h2>
                </div>
                <div className="space-y-6">
                  {qs.map((q) => (
                    <QuestionField
                      key={q.id}
                      question={q}
                      value={mod.answers[q.id]}
                      onChange={(v) =>
                        dispatch({
                          type: 'setAnswer',
                          moduleId: id!,
                          questionId: q.id,
                          value: v,
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            ))}

          {/* Footer nav */}
          <div className="border-t border-border pt-8 flex items-center justify-between gap-4 flex-wrap">
            {prev ? (
              <Link href={`/module/${prev}`} data-testid="link-prev-module">
                <a className="font-mono text-tag text-muted-foreground hover:text-primary">
                  ← {MODULE_META[prev].number} {MODULE_META[prev].title}
                </a>
              </Link>
            ) : (
              <Link href="/modules" data-testid="link-back">
                <a className="font-mono text-tag text-muted-foreground hover:text-primary">
                  ← Zurück
                </a>
              </Link>
            )}
            <Button
              type="button"
              onClick={finishAndGo}
              className="font-mono uppercase text-sm tracking-widest"
              data-testid="button-finish-module"
            >
              {next ? `Modul abschließen → ${MODULE_META[next].number} ${MODULE_META[next].title}` : 'Modul abschließen → Report'}
            </Button>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="space-y-8">
              <PrinciplesPanel moduleId={id!} />
              {(() => {
                const qs = provocations(state, id!, 2);
                return qs.length > 0 ? (
                  <div className="space-y-3" data-testid="panel-provocations">
                    <div className="text-tag text-muted-foreground border-b border-border pb-2">Leo stört</div>
                    {qs.map((c, i) => (
                      <LeoComment key={i} item={c} />
                    ))}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
