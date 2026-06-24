import { Check } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { cn } from '@/lib/utils';

const STEPS = [
    { number: 1, label: <TransText en="Content" fr="Content" ar="Content" /> },
    {
        number: 2,
        label: (
            <TransText
                en="Settings & rules"
                fr="Settings & rules"
                ar="Settings & rules"
            />
        ),
    },
    { number: 3, label: <TransText en="Review" fr="Review" ar="Review" /> },
];

export default function ExerciseStepIndicator({ currentStep }) {
    return (
        <div className="flex items-center gap-0">
            {STEPS.map((step, index) => {
                const isDone = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                const isPending = step.number > currentStep;
                const isLast = index === STEPS.length - 1;

                return (
                    <div key={step.number} className="flex flex-1 items-center">
                        {/* Circle + label */}
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
                                    isDone && [
                                        'border-dark bg-dark text-light',
                                        'dark:border-alpha dark:bg-alpha dark:text-beta',
                                    ],
                                    isCurrent && [
                                        'border-dark bg-dark text-light shadow-md shadow-dark/20',
                                        'dark:border-alpha dark:bg-alpha dark:text-beta dark:shadow-alpha/30',
                                    ],
                                    isPending && [
                                        'border-beta/20 bg-transparent text-beta/30',
                                        'dark:border-light/20 dark:text-light/30',
                                    ],
                                )}
                            >
                                {isDone ? (
                                    <Check className="size-4" strokeWidth={2.5} />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span
                                className={cn(
                                    'whitespace-nowrap text-[11px] font-medium transition-colors',
                                    (isDone || isCurrent)
                                        ? 'text-beta dark:text-alpha'
                                        : 'text-beta/30 dark:text-light/30',
                                )}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {!isLast && (
                            <div className="mb-5 h-px flex-1 transition-all duration-500">
                                <div
                                    className={cn(
                                        'h-full transition-all duration-500',
                                        step.number < currentStep
                                            ? 'bg-dark dark:bg-alpha'
                                            : 'bg-beta/15 dark:bg-light/15',
                                    )}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
