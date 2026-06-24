import {
    FileJson,
    Flame,
    Hash,
    Leaf,
    Star,
    Type,
    Zap,
} from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { DESCRIPTION_FORMATS } from './DescriptionEditor';
import MarkdownPreview from './MarkdownPreview';

const DIFFICULTY_CONFIG = {
    beginner: {
        icon: Leaf,
        label: <TransText en="Beginner" fr="Beginner" ar="Beginner" />,
        cls: 'border-good/40 bg-good/10 text-good',
    },
    intermediate: {
        icon: Flame,
        label: <TransText en="Intermediate" fr="Intermediate" ar="Intermediate" />,
        cls: 'border-alpha/50 bg-alpha/10 text-alpha',
    },
    advanced: {
        icon: Zap,
        label: <TransText en="Advanced" fr="Advanced" ar="Advanced" />,
        cls: 'border-error/40 bg-error/10 text-error',
    },
};

const htmlPreviewClass = cn(
    'text-sm text-beta dark:text-light',
    '[&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold',
    '[&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5',
    '[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5',
);

function ReviewSection({ icon: Icon, label, children }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-beta/40 dark:text-light/40" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-beta/40 dark:text-light/40">
                    {label}
                </span>
            </div>
            {children}
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, valueClass = '' }) {
    return (
        <div className="flex flex-col gap-1 rounded-xl border border-beta/10 bg-beta/5 px-4 py-3 dark:border-light/10 dark:bg-light/5">
            <div className="flex items-center gap-1.5 text-xs text-beta/50 dark:text-light/50">
                <Icon className="size-3.5" />
                {label}
            </div>
            <span className={cn('text-lg font-bold text-beta dark:text-light', valueClass)}>
                {value}
            </span>
        </div>
    );
}

export default function StepReview({ data }) {
    const isMarkdown = data.description_format === DESCRIPTION_FORMATS.MARKDOWN;
    const difficulty = DIFFICULTY_CONFIG[data.difficulty];

    return (
        <div className="space-y-6">
            {/* Title */}
            <ReviewSection
                icon={Type}
                label={<TransText en="Title" fr="Title" ar="Title" />}
            >
                <p className="rounded-xl border border-beta/10 bg-beta/5 px-4 py-3 text-sm font-medium text-beta dark:border-light/10 dark:bg-light/5 dark:text-light">
                    {data.title || '—'}
                </p>
            </ReviewSection>

            <Separator className="bg-beta/8 dark:bg-light/8" />

            {/* Description */}
            <ReviewSection
                icon={Type}
                label={
                    <span className="flex items-center gap-2">
                        <TransText en="Description" fr="Description" ar="Description" />
                        <Badge
                            variant="outline"
                            className="rounded-full px-2 py-0 text-[10px] capitalize text-beta/50 dark:text-light/50"
                        >
                            {isMarkdown ? 'Markdown' : 'Rich text'}
                        </Badge>
                    </span>
                }
            >
                <div
                    className={cn(
                        'custom-scrollbar max-h-52 overflow-y-auto rounded-xl border border-beta/10 bg-beta/5 px-4 py-3 dark:border-light/10 dark:bg-light/5',
                        !isMarkdown && htmlPreviewClass,
                    )}
                >
                    {isMarkdown ? (
                        data.description_markdown.trim() ? (
                            <MarkdownPreview>{data.description_markdown}</MarkdownPreview>
                        ) : (
                            <span className="text-sm text-beta/30 dark:text-light/30">—</span>
                        )
                    ) : data.description_html.replace(/<[^>]*>/g, '').trim() ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: data.description_html }}
                        />
                    ) : (
                        <span className="text-sm text-beta/30 dark:text-light/30">—</span>
                    )}
                </div>
            </ReviewSection>

            <Separator className="bg-beta/8 dark:bg-light/8" />

            {/* Difficulty + metrics */}
            <div className="space-y-4">
                {/* Difficulty badge */}
                {difficulty ? (
                    <ReviewSection
                        icon={difficulty.icon}
                        label={<TransText en="Difficulty" fr="Difficulty" ar="Difficulty" />}
                    >
                        <div
                            className={cn(
                                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold',
                                difficulty.cls,
                            )}
                        >
                            <difficulty.icon className="size-4" />
                            {difficulty.label}
                        </div>
                    </ReviewSection>
                ) : null}

                {/* XP + Order metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <MetricCard
                        icon={Star}
                        label={<TransText en="XP reward" fr="XP reward" ar="XP reward" />}
                        value={`+${data.xp_reward}`}
                        valueClass="text-beta dark:text-alpha"
                    />
                    <MetricCard
                        icon={Hash}
                        label={<TransText en="Order" fr="Order" ar="Order" />}
                        value={`#${data.order_index}`}
                    />
                </div>
            </div>

            <Separator className="bg-beta/8 dark:bg-light/8" />

            {/* Rules */}
            <ReviewSection
                icon={FileJson}
                label={<TransText en="Grading rules" fr="Grading rules" ar="Grading rules" />}
            >
                {data.rules ? (
                    <div className="space-y-2">
                        {data.rulesFileName && (
                            <div className="flex items-center gap-2 text-xs text-beta/50 dark:text-light/50">
                                <FileJson className="size-3.5 text-beta dark:text-alpha" />
                                {data.rulesFileName}
                            </div>
                        )}
                        <pre className="custom-scrollbar max-h-44 overflow-auto rounded-xl border border-beta/10 bg-beta/5 p-3 text-xs text-beta dark:border-light/10 dark:bg-light/5 dark:text-light">
                            {JSON.stringify(data.rules, null, 2)}
                        </pre>
                    </div>
                ) : (
                    <span className="text-sm text-beta/30 dark:text-light/30">—</span>
                )}
            </ReviewSection>
        </div>
    );
}
