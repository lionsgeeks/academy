import { Check, Cloud, Loader2, Type } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DESCRIPTION_FORMATS } from './DescriptionEditor';
import DescriptionEditor from './DescriptionEditor';
import ExerciseField from './ExerciseField';

const inputClass =
    'h-10 border-beta/15 text-beta placeholder:text-beta/35 focus-visible:border-beta/60 focus-visible:ring-beta/20 dark:border-light/15 dark:text-light dark:focus-visible:border-alpha/60 dark:focus-visible:ring-alpha/20';

function AutosaveBadge({ status }) {
    const base = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium';

    if (status === 'saving') {
        return (
            <span className={cn(base, 'bg-beta/5 text-beta/50 dark:bg-light/5 dark:text-light/50')}>
                <Loader2 className="size-3 animate-spin" />
                <TransText en="Saving..." fr="Saving..." ar="Saving..." />
            </span>
        );
    }
    if (status === 'saved') {
        return (
            <span className={cn(base, 'bg-good/10 text-good')}>
                <Check className="size-3" />
                <TransText en="Draft saved" fr="Draft saved" ar="Draft saved" />
            </span>
        );
    }
    return (
        <span className={cn(base, 'bg-beta/5 text-beta/40 dark:bg-light/5 dark:text-light/40')}>
            <Cloud className="size-3" />
            <TransText en="Auto-save on" fr="Auto-save on" ar="Auto-save on" />
        </span>
    );
}

export default function StepContent({
    data,
    errors,
    onChange,
    autosaveStatus,
    coachType = 'coding',
}) {
    const defaultFormat =
        coachType === 'media'
            ? DESCRIPTION_FORMATS.TIPTAP
            : DESCRIPTION_FORMATS.MARKDOWN;

    return (
        <div className="space-y-6">
            {/* Title */}
            <ExerciseField
                id="title"
                label={<TransText en="Exercise title" fr="Exercise title" ar="Exercise title" />}
                error={errors.title}
            >
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="e.g. Build a responsive navbar"
                    className={inputClass}
                    autoFocus
                />
            </ExerciseField>

            {/* Description section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Type className="size-3.5 text-beta/50 dark:text-light/50" />
                        <span className="text-sm font-medium text-beta dark:text-light">
                            <TransText
                                en="Description"
                                fr="Description"
                                ar="Description"
                            />
                        </span>
                    </div>
                    <AutosaveBadge status={autosaveStatus} />
                </div>

                <DescriptionEditor
                    data={data}
                    errors={errors}
                    onChange={onChange}
                    defaultFormat={defaultFormat}
                />
            </div>
        </div>
    );
}
