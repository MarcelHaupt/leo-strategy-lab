import { useSession } from '@/lib/session-store';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type Field = {
  id: string;
  type: 'text' | 'select';
  width?: string;
  placeholder?: string;
  options?: string[];
};

const sentence1Fields: (Field | string)[] = [
  { id: 'product_name', type: 'text', placeholder: 'Produktname', width: 'w-44' },
  { id: 'helps_lets', type: 'select', options: ['hilft', 'lässt'], width: 'w-28' },
  { id: 'audience_noun', type: 'text', placeholder: 'Athleten', width: 'w-40' },
  { id: 'verb1', type: 'text', placeholder: 'trainieren', width: 'w-36' },
  'und',
  { id: 'verb2', type: 'text', placeholder: 'dokumentieren', width: 'w-44' },
  { id: 'object', type: 'text', placeholder: 'ihre Performance', width: 'w-52' },
  ', damit sie',
  { id: 'verb3', type: 'text', placeholder: 'wachsen', width: 'w-32' },
  { id: 'adverb', type: 'text', placeholder: 'ohne Plateau', width: 'w-44' },
  'können.',
];

const sentence2Fields: (Field | string)[] = [
  { id: 'signup_join', type: 'select', options: ['Registriere dich für', 'Werde Teil von'], width: 'w-56' },
  { id: 'product_name_2', type: 'text', placeholder: 'Produktname', width: 'w-44' },
  ', um',
  { id: 'verb4', type: 'text', placeholder: 'teilen', width: 'w-32' },
  { id: 'plural_noun', type: 'text', placeholder: 'Trainings', width: 'w-36' },
  'mit',
  { id: 'secondary_audience', type: 'text', placeholder: 'Coaches', width: 'w-40' },
  'zu.',
];

function FieldInput({ f }: { f: Field }) {
  const { state, dispatch } = useSession();
  const value = (state.modules.madlibs.answers[f.id] as string) ?? '';

  if (f.type === 'select' && f.options) {
    return (
      <span className={`inline-block ${f.width ?? 'w-40'} align-middle`}>
        <Select
          value={value}
          onValueChange={(v) =>
            dispatch({ type: 'setAnswer', moduleId: 'madlibs', questionId: f.id, value: v })
          }
        >
          <SelectTrigger
            className="h-9 border-0 border-b border-primary rounded-none bg-transparent font-serif italic text-lg px-1 focus:ring-0"
            data-testid={`select-${f.id}`}
          >
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            {f.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </span>
    );
  }

  return (
    <Input
      value={value}
      onChange={(e) =>
        dispatch({ type: 'setAnswer', moduleId: 'madlibs', questionId: f.id, value: e.target.value })
      }
      placeholder={f.placeholder}
      className={`inline-block ${f.width ?? 'w-40'} h-9 border-0 border-b border-primary rounded-none bg-transparent font-serif italic text-lg px-1 focus-visible:ring-0 focus-visible:border-primary`}
      data-testid={`input-${f.id}`}
    />
  );
}

function renderSentence(parts: (Field | string)[], key: string) {
  return (
    <p
      key={key}
      className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground"
      data-testid={`sentence-${key}`}
    >
      {parts.map((p, i) => {
        if (typeof p === 'string') {
          return (
            <span key={i} className="mx-1">
              {p}
            </span>
          );
        }
        return (
          <span key={p.id} className="mx-1 inline-block">
            <FieldInput f={p} />
          </span>
        );
      })}
    </p>
  );
}

export function MadLibsBlock() {
  return (
    <div className="space-y-12">
      <p className="text-tag text-muted-foreground">
        Tipp: Schreibe mehrere Varianten. Die beste verdichtet, was du wirklich tust.
      </p>

      <div className="space-y-4">
        <div className="text-tag text-muted-foreground">SATZ 01</div>
        {renderSentence(sentence1Fields, 'sentence1')}
      </div>

      <div className="space-y-4">
        <div className="text-tag text-muted-foreground">SATZ 02</div>
        {renderSentence(sentence2Fields, 'sentence2')}
      </div>
    </div>
  );
}
