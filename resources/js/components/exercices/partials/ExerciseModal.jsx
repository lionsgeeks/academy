import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Plus,
    Save,
    Settings2,
    Sparkles,
} from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useExerciseAutosave } from '../hooks/useExerciseAutosave';
import { DESCRIPTION_FORMATS } from './DescriptionEditor';
import ExerciseStepIndicator from './ExerciseStepIndicator';
import StepContent from './StepContent';
import StepReview from './StepReview';
import StepSettings from './StepSettings';

const TOTAL_STEPS = 3;

export const EMPTY_EXERCISE_FORM = {
    title: '',
    description_format: DESCRIPTION_FORMATS.MARKDOWN,
    description_markdown: '',
    description_html: '',
    difficulty: '',
    xp_reward: 50,
    order_index: 1,
    rules: null,
    rulesSource: 'paste',
    rulesFileName: '',
};

const STEP_META = {
    1: {
        icon: ClipboardList,
        title: <TransText en="Content" fr="Content" ar="Content" />,
        hint: (
            <TransText
                en="Write the exercise title and description."
                fr="Write the exercise title and description."
                ar="Write the exercise title and description."
            />
        ),
    },
    2: {
        icon: Settings2,
        title: <TransText en="Settings & rules" fr="Settings & rules" ar="Settings & rules" />,
        hint: (
            <TransText
                en="Configure difficulty, XP rewards, and grading rules."
                fr="Configure difficulty, XP rewards, and grading rules."
                ar="Configure difficulty, XP rewards, and grading rules."
            />
        ),
    },
    3: {
        icon: Sparkles,
        title: <TransText en="Review" fr="Review" ar="Review" />,
        hint: (
            <TransText
                en="Review everything before publishing the exercise."
                fr="Review everything before publishing the exercise."
                ar="Review everything before publishing the exercise."
            />
        ),
    },
};

function hasDescriptionContent(data) {
    if (data.description_format === DESCRIPTION_FORMATS.MARKDOWN) {
        return Boolean(data.description_markdown.trim());
    }
    return Boolean(data.description_html.replace(/<[^>]*>/g, '').trim());
}

function validateStep(step, data) {
    const errors = {};

    if (step === 1) {
        if (!data.title.trim()) errors.title = 'Title is required.';
        if (!hasDescriptionContent(data)) {
            errors.description = 'Description is required.';
        }
    }

    if (step === 2) {
        if (!data.difficulty) errors.difficulty = 'Difficulty is required.';
        if (data.xp_reward < 0) errors.xp_reward = 'XP must be 0 or more.';
        if (data.order_index < 1) errors.order_index = 'Order must be at least 1.';
        if (!data.rules) errors.rules = 'Valid rules JSON is required.';
    }

    return errors;
}

function buildPayload(data) {
    return {
        title: data.title,
        description_format: data.description_format,
        description:
            data.description_format === DESCRIPTION_FORMATS.MARKDOWN
                ? data.description_markdown
                : data.description_html,
        description_markdown: data.description_markdown,
        description_html: data.description_html,
        difficulty: data.difficulty,
        xp_reward: data.xp_reward,
        order_index: data.order_index,
        rules: data.rules,
        rulesSource: data.rulesSource,
        rulesFileName: data.rulesFileName,
    };
}

export default function ExerciseModal({
    open,
    onOpenChange,
    isEditing = false,
    initialData,
    onSubmit,
    topicId,
    coachType = 'coding',
}) {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        ...EMPTY_EXERCISE_FORM,
        ...initialData,
    });

    const draftKey = `academy:exercise-draft:${topicId ?? 'new'}`;
    const { status: autosaveStatus, restoreDraft, clearDraft } = useExerciseAutosave(
        draftKey,
        data,
        open,
    );

    useEffect(() => {
        if (!open) return;

        const defaultFormat =
            coachType === 'media'
                ? DESCRIPTION_FORMATS.TIPTAP
                : DESCRIPTION_FORMATS.MARKDOWN;
        const draft = restoreDraft();

        if (draft && !initialData) {
            setData({ ...EMPTY_EXERCISE_FORM, ...draft });
        } else {
            setData({
                ...EMPTY_EXERCISE_FORM,
                description_format: defaultFormat,
                ...initialData,
            });
        }
        setStep(1);
        setErrors({});
    }, [open, initialData, coachType, restoreDraft]);

    const updateField = (key, value) => {
        setData((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) {
            setStep(1);
            setErrors({});
        }
        onOpenChange?.(nextOpen);
    };

    const goNext = () => {
        const stepErrors = validateStep(step, data);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }
        setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    };

    const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = (event) => {
        event.preventDefault();
        const payload = buildPayload(data);
        onSubmit?.(payload);
        clearDraft();
        handleOpenChange(false);
    };

    const StepIcon = STEP_META[step].icon;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn(
                    'flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0',
                    step === 1 ? 'sm:max-w-5xl' : 'sm:max-w-2xl',
                )}
            >
                {/* ── Header ── */}
                <div className="space-y-5 border-b border-beta/10 px-6 pb-5 pt-6 dark:border-beta">
                    {/* title row */}
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-beta/10 text-beta dark:bg-alpha/10 dark:text-alpha">
                            <StepIcon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-beta dark:text-alpha">
                                <TransText
                                    en={`Step ${step} of ${TOTAL_STEPS}`}
                                    fr={`Step ${step} of ${TOTAL_STEPS}`}
                                    ar={`Step ${step} of ${TOTAL_STEPS}`}
                                />
                            </p>
                            <h2 className="text-lg font-semibold leading-tight text-beta dark:text-light">
                                {isEditing ? (
                                    <TransText
                                        en="Edit exercise"
                                        fr="Edit exercise"
                                        ar="Edit exercise"
                                    />
                                ) : (
                                    <TransText
                                        en="Create exercise"
                                        fr="Create exercise"
                                        ar="Create exercise"
                                    />
                                )}
                                {' — '}
                                <span className="font-normal text-beta/60 dark:text-light/60">
                                    {STEP_META[step].title}
                                </span>
                            </h2>
                            <p className="mt-0.5 text-sm text-beta/50 dark:text-light/50">
                                {STEP_META[step].hint}
                            </p>
                        </div>
                    </div>

                    {/* step indicator */}
                    <ExerciseStepIndicator currentStep={step} />
                </div>

                {/* ── Scrollable body ── */}
                <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-5">
                    <form id="exercise-form" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                            >
                                {step === 1 && (
                                    <StepContent
                                        data={data}
                                        errors={errors}
                                        onChange={updateField}
                                        autosaveStatus={autosaveStatus}
                                        coachType={coachType}
                                    />
                                )}
                                {step === 2 && (
                                    <StepSettings
                                        data={data}
                                        errors={errors}
                                        onChange={updateField}
                                    />
                                )}
                                {step === 3 && <StepReview data={data} />}
                            </motion.div>
                        </AnimatePresence>
                    </form>
                </div>

                {/* ── Sticky footer ── */}
                <div className="shrink-0 border-t border-beta/10 dark:border-beta">
                    <DialogFooter className="flex items-center justify-between gap-2 px-6 py-4 sm:justify-between">
                        <div>
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-1.5 border-beta/20 text-beta/70 hover:border-beta/40 hover:text-beta dark:border-light/20 dark:text-light/70 dark:hover:border-light/40 dark:hover:text-light"
                                    onClick={goBack}
                                >
                                    <ChevronLeft className="size-4" />
                                    <TransText en="Back" fr="Back" ar="Back" />
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-beta/20 text-beta/70 dark:border-light/20 dark:text-light/70"
                                onClick={() => handleOpenChange(false)}
                            >
                                <TransText en="Cancel" fr="Cancel" ar="Cancel" />
                            </Button>

                            {step < TOTAL_STEPS ? (
                                <Button
                                    type="button"
                                    className="gap-1.5 bg-dark text-light hover:bg-dark/85 dark:bg-alpha dark:text-beta dark:hover:bg-alpha/85"
                                    onClick={goNext}
                                >
                                    <TransText en="Next" fr="Next" ar="Next" />
                                    <ChevronRight className="size-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    form="exercise-form"
                                    className="gap-1.5 bg-dark text-light hover:bg-dark/85 dark:bg-alpha dark:text-beta dark:hover:bg-alpha/85"
                                >
                                    {isEditing ? (
                                        <Save className="size-4" />
                                    ) : (
                                        <Plus className="size-4" />
                                    )}
                                    {isEditing ? (
                                        <TransText
                                            en="Save changes"
                                            fr="Save changes"
                                            ar="Save changes"
                                        />
                                    ) : (
                                        <TransText
                                            en="Create exercise"
                                            fr="Create exercise"
                                            ar="Create exercise"
                                        />
                                    )}
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
