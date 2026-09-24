import type { Question } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { scoreAnswer } from '@/lib/leo-engine';

type Props = {
  question: Question;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
};

export function QuestionField({ question, value, onChange }: Props) {
  const v = (typeof value === 'string' ? value : '') ?? '';
  const showScore = (question.type === 'textarea' || question.type === 'text') && typeof v === 'string' && v.length > 0;
  const result = showScore ? scoreAnswer(v) : null;

  return (
    <div className="space-y-2" data-testid={`field-${question.id}`}>
      <div className="flex items-baseline justify-between gap-4">
        <Label
          htmlFor={`q-${question.id}`}
          className="font-sans text-sm text-foreground leading-snug"
          data-testid={`label-${question.id}`}
        >
          {question.label}
        </Label>
        {result && (
          <span
            className="font-mono text-[10px] text-muted-foreground whitespace-nowrap"
            data-testid={`score-${question.id}`}
          >
            {result.score} / 100
            {result.matchedPrinciples.length > 0 && (
              <span className="text-primary"> · {result.matchedPrinciples.slice(0, 3).join(' ')}</span>
            )}
          </span>
        )}
      </div>

      {question.type === 'textarea' && (
        <Textarea
          id={`q-${question.id}`}
          value={v}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={question.placeholder}
          data-testid={`input-${question.id}`}
          className="font-sans border-border bg-card focus-visible:ring-1"
        />
      )}

      {question.type === 'text' && (
        <Input
          id={`q-${question.id}`}
          value={v}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          data-testid={`input-${question.id}`}
          className="font-sans border-border bg-card focus-visible:ring-1"
        />
      )}

      {question.type === 'select' && question.options && (
        <Select value={v} onValueChange={(val) => onChange(val)}>
          <SelectTrigger
            id={`q-${question.id}`}
            data-testid={`select-${question.id}`}
            className="border-border bg-card"
          >
            <SelectValue placeholder="Bitte wählen" />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((opt) => (
              <SelectItem key={opt} value={opt} data-testid={`option-${question.id}-${opt}`}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {question.type === 'radio' && question.options && (
        <RadioGroup
          value={v}
          onValueChange={(val) => onChange(val)}
          className="space-y-2"
          data-testid={`radio-${question.id}`}
        >
          {question.options.map((opt) => (
            <div key={opt} className="flex items-center gap-3">
              <RadioGroupItem
                value={opt}
                id={`q-${question.id}-${opt}`}
                data-testid={`option-${question.id}-${opt}`}
              />
              <Label
                htmlFor={`q-${question.id}-${opt}`}
                className="font-sans text-sm cursor-pointer"
              >
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
