import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground hover-elevate active-elevate-2"
      aria-label={theme === 'dark' ? 'Light mode aktivieren' : 'Dark mode aktivieren'}
      data-testid="button-theme-toggle"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
