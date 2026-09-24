type Props = { score: number; size?: number; label?: string };

export function ScoreRing({ score, size = 96, label }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="inline-flex flex-col items-center gap-2" data-testid={`score-ring-${score}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="butt"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono fill-foreground"
          fontSize={size * 0.28}
          fontWeight={500}
        >
          {clamped}
        </text>
      </svg>
      {label && <div className="text-tag text-muted-foreground">{label}</div>}
    </div>
  );
}
