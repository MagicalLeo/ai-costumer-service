import { memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";

function Markdown({ children, className = "", ...probs }: Options) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={`markdown prose dark:prose-invert ${className}`}
      {...probs}
    >
      {children}
    </ReactMarkdown>
  );
}

export default memo(Markdown);
