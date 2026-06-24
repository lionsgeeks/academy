import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

import 'highlight.js/styles/github.min.css';

export const markdownPreviewClass = cn(
    'markdown-preview text-sm text-beta dark:text-light',
    '[&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold dark:[&_h1]:text-light',
    '[&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold dark:[&_h2]:text-light',
    '[&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold dark:[&_h3]:text-light',
    '[&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5',
    '[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5',
    '[&_a]:text-alpha [&_a]:underline',
    '[&_blockquote]:border-l-4 [&_blockquote]:border-alpha/50 [&_blockquote]:pl-3 [&_blockquote]:italic',
    'dark:[&_blockquote]:border-alpha dark:[&_blockquote]:text-light/70',
    '[&_table]:w-full [&_th]:border [&_th]:border-beta/15 [&_th]:px-2 [&_th]:py-1',
    '[&_td]:border [&_td]:border-beta/15 [&_td]:px-2 [&_td]:py-1',
    'dark:[&_th]:border-beta dark:[&_td]:border-beta dark:[&_th]:bg-dark_gray dark:[&_th]:text-light',
    '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-beta/10 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.9em]',
    'dark:[&_:not(pre)>code]:bg-dark_gray dark:[&_:not(pre)>code]:text-alpha',
    '[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md',
    'dark:[&_pre]:border dark:[&_pre]:border-beta dark:[&_pre]:bg-dark',
    '[&_pre_code.hljs]:block [&_pre_code.hljs]:p-3 [&_pre_code.hljs]:text-sm',
);

export default function MarkdownPreview({ children, className }) {
    return (
        <div className={cn(markdownPreviewClass, className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
