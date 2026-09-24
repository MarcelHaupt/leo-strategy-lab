import { useSession } from '@/lib/session-store';
import { STYLE_ATTRIBUTES } from '@/lib/questions';

type Mode = 'attract' | 'avoid';

const LIMITS: Record<Mode, number> = { attract: 5, avoid: 3 };
const STATE_KEY: Record<Mode, string> = { attract: 'style_attract', avoid: 'style_avoid' };

export function StyleAttributePicker({ mode }: { mode: Mode }) {
  const { state, dispatch } = useSession();
  const stateKey = STATE_KEY[mode];
  const selected = (state.modules.style.answers[stateKey] as string[]) ?? [];
  const limit = LIMITS[mode];

  const toggle = (de: string) => {
    const isSelected = selected.includes(de);
    let next: string[];
    if (isSelected) {
      next = selected.filter((s) => s !== de);
    } else {
      if (selected.length >= limit) return;
      next = [...selected, de];
    }
    dispatch({ type: 'setAnswer', moduleId: 'style', questionId: stateKey, value: next });
  };

  const isAttract = mode === 'attract';

  return (
    <div className="space-y-4" data-testid={`style-picker-${mode}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-2xl">
          {isAttract ? 'Anziehen' : 'Abstoßen'}
        </h3>
        <span className="font-mono text-tag text-muted-foreground" data-testid={`count-${mode}`}>
          {selected.length} / {limit}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {isAttract
          ? 'Wie soll deine Marke klingen? Wähle bis zu fünf Adjektive.'
          : 'Was passt explizit NICHT zu dir? Wähle bis zu drei.'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {STYLE_ATTRIBUTES.map(({ de, en }) => {
          const isSelected = selected.includes(de);
          const isDisabled = !isSelected && selected.length >= limit;

          return (
            <button
              key={de}
              type="button"
              onClick={() => toggle(de)}
              disabled={isDisabled}
              data-testid={`attr-${mode}-${de}`}
              className={`text-left border p-3 transition-colors hover-elevate active-elevate-2 ${
                isSelected
                  ? isAttract
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-foreground'
              } ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-serif text-base leading-tight">{de}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider opacity-60 mt-1">
                {en}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
