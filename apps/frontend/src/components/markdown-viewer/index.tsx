import { marked } from 'marked';
import { useEffect, useState } from 'react';

export function MarkdownViewer({ url }: { url: string }) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const md = await fetch(url).then(res => res.text());
      setHtml(await marked.parse(md));
    }
    load();
  }, [url]);

  return (
    <div className="markdown">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
