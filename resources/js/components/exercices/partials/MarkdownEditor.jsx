import { Eye, PenLine } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { cn } from '@/lib/utils';
import MarkdownPreview from './MarkdownPreview';

const textareaClass = cn(
    'min-h-[320px] w-full resize-none rounded-md border border-beta/15 bg-transparent px-3 py-2.5',
    'font-mono text-sm text-beta leading-relaxed outline-none',
    'placeholder:text-beta/25 dark:placeholder:text-light/25',
    'focus-visible:border-beta/60 focus-visible:ring-2 focus-visible:ring-beta/20',
    'dark:border-light/15 dark:text-light dark:focus-visible:border-alpha/60 dark:focus-visible:ring-alpha/20',
);

const previewWrapperClass = cn(
    'custom-scrollbar min-h-[320px] overflow-y-auto rounded-md border bg-light/50 px-4 py-3',
    'border-beta/15 dark:border-beta dark:bg-dark_gray',
);

function PaneHeader({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-beta/40 dark:text-light/40">
            <Icon className="size-3" />
            {label}
        </div>
    );
}

export default function MarkdownEditor({ value, onChange, error }) {
    return (
        <div className="space-y-2">
            <div className="grid min-h-[360px] grid-cols-1 gap-3 lg:grid-cols-2">
                {/* Write pane */}
                <div className="flex flex-col gap-1.5">
                    <PaneHeader
                        icon={PenLine}
                        label={
                            <TransText
                                en="Write"
                                fr="Write"
                                ar="Write"
                            />
                        }
                    />
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={'# Exercise\n\nDescribe the task...\n\n- Requirement 1\n- Requirement 2'}
                        className={textareaClass}
                        spellCheck={false}
                    />
                </div>

                {/* Preview pane */}
                <div className="flex flex-col gap-1.5">
                    <PaneHeader
                        icon={Eye}
                        label={
                            <TransText
                                en="Preview"
                                fr="Preview"
                                ar="Preview"
                            />
                        }
                    />
                    <div className={previewWrapperClass}>
                        {value.trim() ? (
                            <MarkdownPreview>{value}</MarkdownPreview>
                        ) : (
                            <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 text-center">
                                <Eye className="size-8 text-beta/10 dark:text-light/10" />
                                <p className="text-xs text-beta/30 dark:text-light/30">
                                    <TransText
                                        en="Preview will appear here"
                                        fr="Preview will appear here"
                                        ar="Preview will appear here"
                                    />
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
        </div>
    );
}
