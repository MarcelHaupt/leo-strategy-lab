import { Button } from '@/components/ui/button';
import { Download, FileJson } from 'lucide-react';
import { useSession } from '@/lib/session-store';
import { exportMarkdown, exportJSON } from '@/lib/export';

export function ExportPanel() {
  const { state } = useSession();

  return (
    <div className="border border-border bg-card p-6 space-y-5" data-testid="panel-export">
      <div>
        <div className="text-tag text-muted-foreground">EXPORT</div>
        <h3 className="font-serif text-2xl mt-2 leading-tight">Den Report mitnehmen</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Alles bleibt in deinem Browser. Bei Reload weg. Markdown zum Lesen, JSON für späteren Import.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          onClick={() => exportMarkdown(state)}
          className="flex-1"
          data-testid="button-export-markdown"
        >
          <Download className="h-4 w-4 mr-2" />
          Markdown (.md)
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => exportJSON(state)}
          className="flex-1 border-border"
          data-testid="button-export-json"
        >
          <FileJson className="h-4 w-4 mr-2" />
          JSON (.json)
        </Button>
      </div>
    </div>
  );
}
