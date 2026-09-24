type Props = { className?: string; showWordmark?: boolean };

// Inline MH-Logo, currentColor for theme-awareness.
export function MHMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 595.3 841.9"
      className={className}
      role="img"
      aria-label="Marcel Hilger Logo"
      data-testid="logo-mark"
    >
      <path
        fill="currentColor"
        d="M285.9,264.6c-80.8,0-146.5,65.7-146.5,146.5s65.7,146.5,146.5,146.5,146.5-65.7,146.5-146.5-65.7-146.5-146.5-146.5ZM297.6,287.3c58.9,5.5,106,52.3,112,111.1h-112v-111.1ZM274.1,287.3c-3,61.8-51.3,111.8-112.4,117.4,3.1-61.7,51.4-111.7,112.4-117.4ZM162.6,427.5c46.9-3.9,87.5-30,111.5-67.6v175c-57.6-5.4-103.9-50.3-111.5-107.3ZM297.6,534.8v-113h112.1c-5.1,59.7-52.6,107.4-112.1,113Z"
      />
    </svg>
  );
}

export function Logo({ className = '', showWordmark = true }: Props) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} data-testid="logo-leo">
      <MHMark className="h-9 w-9 text-foreground shrink-0" />
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[10px] tracking-widest text-foreground uppercase">
            Strategy Lab
          </span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
            25 Principles
          </span>
        </div>
      )}
    </div>
  );
}
