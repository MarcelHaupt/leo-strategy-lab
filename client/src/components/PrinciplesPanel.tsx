import { PRINCIPLES_BY_ID, MODULE_PRINCIPLES } from '@/lib/playbook';
import type { ModuleId } from '@/lib/types';

export function PrinciplesPanel({ moduleId }: { moduleId: ModuleId }) {
  const ids = MODULE_PRINCIPLES[moduleId] ?? [];
  if (ids.length === 0) return null;

  return (
    <aside className="space-y-4" data-testid="panel-principles">
      <div className="text-tag text-muted-foreground border-b border-border pb-2">
        Aktive Prinzipien
      </div>
      <div className="space-y-3">
        {ids.map((id) => {
          const p = PRINCIPLES_BY_ID[id];
          if (!p) return null;
          return (
            <div
              key={id}
              className="border border-border p-4 bg-card"
              data-testid={`principle-${id}`}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-primary">{p.id}</span>
                <h4 className="font-serif text-base leading-tight">{p.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.rule}</p>
              <p className="text-xs mt-2 italic leading-relaxed border-l-2 border-primary pl-2">
                {p.leosCheck}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
                {p.source}
              </p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
