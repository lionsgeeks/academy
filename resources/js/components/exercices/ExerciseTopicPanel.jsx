import { ClipboardList, Layers3 } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { cn } from '@/lib/utils';
import Exercises from './index';

export default function ExerciseTopicPanel({
    topic,
    publishableClasses = [],
    className,
}) {
    if (!topic?.id) {
        return null;
    }

    const exercisesCount = topic.exercises?.length ?? 0;

    return (
        <section
            className={cn(
                'rounded-2xl border border-beta/10 bg-light p-5 shadow-sm dark:border-light/10 dark:bg-dark_gray',
                className,
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-alpha/15 text-beta dark:bg-alpha/10 dark:text-alpha">
                            <Layers3 className="size-4" />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-beta/45 dark:text-light/45">
                                <TransText
                                    en="Topic exercises"
                                    fr="Exercices du sujet"
                                    ar="تمارين الموضوع"
                                />
                            </p>

                            <h3 className="truncate text-base font-semibold text-beta dark:text-light">
                                {topic.title}
                            </h3>
                        </div>
                    </div>

                    {topic.description && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-beta/60 dark:text-light/60">
                            {topic.description}
                        </p>
                    )}

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-beta/50 dark:text-light/50">
                        <ClipboardList className="size-3.5" />

                        <TransText
                            en={`${exercisesCount} exercise${exercisesCount === 1 ? '' : 's'}`}
                            fr={`${exercisesCount} exercice${exercisesCount === 1 ? '' : 's'}`}
                            ar={`${exercisesCount} تمرين`}
                        />
                    </div>
                </div>

                <div className="shrink-0">
                    <Exercises
                        topicId={topic.id}
                        publishableClasses={publishableClasses}
                    />
                </div>
            </div>

            {exercisesCount > 0 && (
                <div className="mt-5 space-y-2 border-t border-beta/10 pt-4 dark:border-light/10">
                    {topic.exercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-beta/10 bg-beta/5 px-4 py-3 dark:border-light/10 dark:bg-light/5"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-beta dark:text-light">
                                    {exercise.title}
                                </p>

                                <p className="mt-0.5 text-xs text-beta/50 dark:text-light/50">
                                    {exercise.exercise_type ?? '—'} ·{' '}
                                    {exercise.status ?? 'draft'}
                                </p>
                            </div>

                            <span className="shrink-0 rounded-full border border-alpha/35 bg-alpha/10 px-2.5 py-1 text-xs font-medium text-beta dark:text-alpha">
                                +{exercise.xp_reward ?? 0} XP
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}