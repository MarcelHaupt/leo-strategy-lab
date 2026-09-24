import { useSession } from '@/lib/session-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import type { CaseStudyEntry } from '@/lib/types';

const FIELDS: { key: keyof CaseStudyEntry; label: string; type: 'text' | 'textarea' }[] = [
  { key: 'cs_name', label: 'Name der Kundin oder des Kunden + Web-Adresse', type: 'text' },
  { key: 'cs_what', label: 'Was hast du für sie gemacht?', type: 'textarea' },
  { key: 'cs_audience', label: 'Wer war die Zielgruppe?', type: 'textarea' },
  { key: 'cs_unique', label: 'Was war einzigartig am Projekt? Habt ihr spannende Probleme gelöst?', type: 'textarea' },
  { key: 'cs_results', label: 'Was waren die Ergebnisse? Welche Metriken habt ihr verbessert?', type: 'textarea' },
  { key: 'cs_quotes', label: 'Gibt es Zitate, Pressestimmen, Testimonials? Links sind willkommen.', type: 'textarea' },
];

export function CaseStudyList() {
  const { state, dispatch } = useSession();
  const list = state.modules.casestudy.caseStudies ?? [{}];

  return (
    <div className="space-y-12">
      {list.map((cs, i) => (
        <div key={i} className="border border-border bg-card p-6 space-y-5" data-testid={`case-study-${i}`}>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="font-mono text-tag text-primary">CASE STUDY {String(i + 1).padStart(2, '0')}</div>
            {list.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: 'removeCaseStudy', index: i })}
                data-testid={`button-remove-cs-${i}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Entfernen
              </Button>
            )}
          </div>

          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-2">
              <label className="text-sm font-sans text-foreground" data-testid={`label-cs-${i}-${f.key}`}>
                {f.label}
              </label>
              {f.type === 'text' ? (
                <Input
                  value={(cs[f.key] as string) ?? ''}
                  onChange={(e) =>
                    dispatch({
                      type: 'setCaseStudy',
                      index: i,
                      entry: { ...cs, [f.key]: e.target.value },
                    })
                  }
                  className="border-border bg-background"
                  data-testid={`input-cs-${i}-${f.key}`}
                />
              ) : (
                <Textarea
                  value={(cs[f.key] as string) ?? ''}
                  onChange={(e) =>
                    dispatch({
                      type: 'setCaseStudy',
                      index: i,
                      entry: { ...cs, [f.key]: e.target.value },
                    })
                  }
                  rows={3}
                  className="border-border bg-background"
                  data-testid={`textarea-cs-${i}-${f.key}`}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => dispatch({ type: 'addCaseStudy' })}
        className="w-full border-dashed border-border"
        data-testid="button-add-case-study"
      >
        <Plus className="h-4 w-4 mr-2" /> Weitere Case Study hinzufügen
      </Button>
    </div>
  );
}
