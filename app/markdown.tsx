"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        p: ({ children }) => (
          <p className="my-2 leading-7 first:mt-0 last:mb-0">{children}</p>
        ),
        h1: ({ children }) => (
          <h1 className="mt-4 mb-2 text-lg font-semibold first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-4 mb-2 text-base font-semibold first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-3 mb-1 text-sm font-semibold first:mt-0">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="my-2 list-disc space-y-1 pl-5 first:mt-0 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-2 list-decimal space-y-1 pl-5 first:mt-0 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-7">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="my-2 border-l-2 border-zinc-300 pl-3 text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-700" />,
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-zinc-300 dark:border-zinc-700">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-2 py-1 text-left font-semibold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-b border-zinc-100 px-2 py-1 dark:border-zinc-800">
            {children}
          </td>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.875em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={`${className ?? ""} font-mono text-[0.875em]`} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-3 overflow-x-auto rounded-lg bg-zinc-100 p-3 text-[0.875em] leading-6 dark:bg-zinc-950">
            {children}
          </pre>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
