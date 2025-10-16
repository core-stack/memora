/* eslint-disable @typescript-eslint/no-unused-vars */
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

type TextProps = {
  type: "text";
  text: string;
}
type UrlProps = {
  type: "url";
  url: string;
}
type Props = TextProps | UrlProps;

export function MarkdownViewer(props: Props) {
  const [markdown, setMarkdown] = useState<string>(() => props.type === "text" ? props.text : "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (props.type === "url") {
      startTransition(async () => {
        try {
          setMarkdown(await fetch(props.url).then(res => res.text()));
        } catch (error) {
          setError((error as Error).message);
        }
      });
    } else {
      setMarkdown(props.text);
    }
  }, [props]);

  return (
    <>
      {!isPending && !error && markdown && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-medium mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="text-base leading-relaxed mb-3" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-600 underline hover:text-blue-800" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-base" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 text-base" {...props} />,
              li: ({ node, ...props }) => <li className="text-base" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-muted-foreground pl-4 italic" {...props} />,
              // pre: ({ node, ...props }) => <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs" {...props} />,
              img: ({ node, ...props }) => <img className="max-w-full rounded-md my-4" {...props} />,
              table: ({ node, ...props }) => <table className="w-full border border-gray-300 my-6 text-base" {...props} />,
              th: ({ node, ...props }) => <th className="border border-gray-300 px-3 py-2 text-left font-semibold" {...props} />,
              td: ({ node, ...props }) => <td className="border border-gray-300 px-3 py-2" {...props} />,
              code(props) {
                const {children, className, node, ...rest} = props
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    style={atomDark}
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {markdown}
          </Markdown>
        </div>
      )}
      {!isPending && !error && props.type === "url" && !props.url && !markdown && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No documentation content available.</p>
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
