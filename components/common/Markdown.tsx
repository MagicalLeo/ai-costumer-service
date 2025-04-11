import { memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // 引入 rehype-raw 插件

function Markdown({ children, className = "", ...props }: Options) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // 使用 remark-gfm 插件
      rehypePlugins={[rehypeRaw]} // 使用 rehype-raw 插件來處理原始 HTML
      className={`markdown prose dark:prose-invert ${className}`}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}

export default memo(Markdown);