import { Loader2 } from 'lucide-react';
import { marked } from 'marked';
import { useEffect, useState, useTransition } from 'react';

export function MarkdownViewer({ url }: { url?: string }) {
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null); 
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      if (!url) return;
      try {
        const md = await fetch(url).then(res => res.text());
        setHtml(await marked.parse(md));
      } catch (error) {
        setError((error as Error).message);
      }
    });
  }, [url]);

  return (
    <>
      {!isPending && !error && html && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="markdown">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      )}
      {!isPending && !error && !url && !html && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No documentation content available.</p>
        </div>
      )}
      {!isPending && !error && html && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="markdown">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      )}
      {isPending && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading documentation...</span>
        </div>
      )}
      {error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}
    </>
  );
}
