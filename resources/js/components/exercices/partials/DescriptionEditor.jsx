import { FileCode2, Type } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { cn } from '@/lib/utils';
import MarkdownEditor from './MarkdownEditor';
import TipTapEditor from './TipTapEditor';

export const DESCRIPTION_FORMATS = {
    MARKDOWN: 'markdown',
    TIPTAP: 'tiptap',
};

export default function DescriptionEditor({
    data,
    errors,
    onChange,
    defaultFormat = DESCRIPTION_FORMATS.MARKDOWN,
}) {
    const format = data.description_format ?? defaultFormat;

    return (
        <div className="space-y-3">
            {/* Tab bar */}
            <div className="flex rounded-lg border border-beta/10 bg-beta/5 p-1 dark:border-light/10 dark:bg-light/5">
                {[
                    {
                        value: DESCRIPTION_FORMATS.MARKDOWN,
                        icon: FileCode2,
                        label: <TransText en="Markdown" fr="Markdown" ar="Markdown" />,
                    },
                    {
                        value: DESCRIPTION_FORMATS.TIPTAP,
                        icon: Type,
                        label: <TransText en="Rich text" fr="Rich text" ar="Rich text" />,
                    },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const active = format === tab.value;
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onChange('description_format', tab.value)}
                        className={cn(
                                    'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
                                    active
                                        ? 'bg-dark text-light shadow-sm dark:bg-alpha dark:text-beta'
                                        : 'text-beta/50 hover:text-beta dark:text-light/50 dark:hover:text-light',
                                )}
                        >
                            <Icon className="size-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {format === DESCRIPTION_FORMATS.MARKDOWN ? (
                <MarkdownEditor
                    value={data.description_markdown}
                    onChange={(value) => onChange('description_markdown', value)}
                    error={errors.description}
                />
            ) : (
                <TipTapEditor
                    value={data.description_html}
                    onChange={(html) => onChange('description_html', html)}
                    error={errors.description}
                />
            )}
        </div>
    );
}
