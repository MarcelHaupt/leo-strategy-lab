import type { LeoCommentItem } from '@/lib/types';

const ICONS: Record<LeoCommentItem['tone'], string> = {
  praise: '✓',
  flag: '!',
  idea: '*',
  question: '?',
};

const LABELS: Record<LeoCommentItem['tone'], string> = {
  praise: 'LEO LOBT',
  flag: 'LEO STOPPT',
  idea: 'LEO IDEE',
  question: 'LEO STÖRT',
};

export function LeoComment({ item }: { item: LeoCommentItem }) {
  return (
    <div
      className={`border-l-2 pl-4 py-2 ${
        item.tone === 'praise'
          ? 'border-primary'
          : item.tone === 'flag'
            ? 'border-destructive'
            : item.tone === 'question'
              ? 'border-foreground'
              : 'border-accent'
      }`}
      data-testid={`leo-comment-${item.tone}`}
    >
      <div className="flex items-baseline gap-2">
        <span
          className={`font-mono text-tag ${
            item.tone === 'praise'
              ? 'text-primary'
              : item.tone === 'flag'
                ? 'text-destructive'
                : item.tone === 'question'
                  ? 'text-foreground'
                  : 'text-accent'
          }`}
        >
          {ICONS[item.tone]} {LABELS[item.tone]}
        </span>
        {item.principleId && (
          <span className="font-mono text-tag text-muted-foreground">{item.principleId}</span>
        )}
      </div>
      <p className={`text-sm mt-1 leading-relaxed ${item.tone === 'question' ? 'font-serif italic text-base' : 'font-sans'}`}>
        {item.text}
      </p>
    </div>
  );
}
