import { Link } from 'wouter';
import type { ModuleId } from '@/lib/types';
import { MODULE_META } from '@/lib/types';
import { useSession, moduleProgress } from '@/lib/session-store';

export function ModuleCard({ id }: { id: ModuleId }) {
  const { state } = useSession();
  const meta = MODULE_META[id];
  const mod = state.modules[id];
  const prog = moduleProgress(mod);

  const statusLabel =
    prog.status === 'done' ? 'ABGESCHLOSSEN' : prog.status === 'partial' ? 'TEILWEISE' : 'OFFEN';

  return (
    <Link href={`/module/${id}`} data-testid={`card-module-${id}`}>
      <a className="block group">
        <article className="border border-border bg-card p-6 hover-elevate active-elevate-2 transition-colors h-full flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="font-mono text-3xl text-primary leading-none" data-testid={`text-module-number-${id}`}>
              {meta.number}
            </div>
            <span
              className={`text-tag ${
                prog.status === 'done'
                  ? 'text-primary'
                  : prog.status === 'partial'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
              }`}
              data-testid={`status-module-${id}`}
            >
              {statusLabel}
            </span>
          </div>

          <h3 className="font-serif text-2xl mt-6 leading-tight" data-testid={`text-module-title-${id}`}>
            {meta.title}
          </h3>
          <p className="text-tag text-muted-foreground mt-1">{meta.subtitle}</p>

          <p className="text-sm text-muted-foreground mt-4 leading-relaxed flex-1">
            {meta.description}
          </p>

          <div className="mt-6 flex items-center justify-between text-tag border-t border-border pt-3">
            <span className="text-muted-foreground">
              {prog.filled > 0 ? `${prog.filled} Antworten` : 'Noch leer'}
            </span>
            <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </article>
      </a>
    </Link>
  );
}
