import { useLang, type Lang } from '@/lib/i18n';

const OPTIONS: { id: Lang; label: string; name: string }[] = [
  { id: 'de', label: 'DE', name: 'Deutsch' },
  { id: 'en', label: 'EN', name: 'English' },
];

export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`inline-flex border border-border font-mono text-xs ${className}`}
      role="group"
      aria-label={lang === 'en' ? 'Language' : 'Sprache'}
      data-testid="lang-switch"
    >
      {OPTIONS.map((o) => {
        const on = o.id === lang;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => !on && setLang(o.id)}
            aria-pressed={on}
            title={o.name}
            className={`px-2 py-1 ${on ? 'bg-foreground text-background' : 'text-muted-foreground hover-elevate'}`}
            data-testid={`button-lang-${o.id}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
