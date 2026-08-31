import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListChecks, RefreshCw } from 'lucide-react';
import { engineLabels } from './exerciseLabHelpers';

export default function ExercisePicker({
    exercises,
    loading,
    selectedExercise,
    onSelectExercise,
    onRefresh,
}) {
    return (
        <section className="border-b border-slate-800 bg-slate-950/95 text-slate-100">
            <div className="flex flex-col gap-4 px-4 py-4 md:px-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <ListChecks className="size-4 text-emerald-400" />
                            <span>Your exercises</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Exercises assigned to your class appear here.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={loading}
                        className="shrink-0 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                    >
                        <RefreshCw className="size-3.5" />
                        <span className="ml-2">Refresh</span>
                    </Button>
                </div>

                {loading ? (
                    <p className="text-sm text-slate-400">
                        Loading your exercises...
                    </p>
                ) : exercises.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
                        No published exercises are available for your class yet.
                    </div>
                ) : (
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {exercises.map((exercise, index) => {
                            const isSelected =
                                selectedExercise?.id === exercise.id;

                            return (
                                <button
                                    key={exercise.id}
                                    type="button"
                                    onClick={() => onSelectExercise(exercise)}
                                    className={`rounded-xl border p-3 text-left transition ${
                                        isSelected
                                            ? 'border-emerald-400 bg-emerald-500/12 shadow-[0_0_0_1px_rgba(74,222,128,0.15)]'
                                            : 'border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-900'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                                Exercise {index + 1}
                                            </p>
                                            <p className="mt-1 truncate text-sm font-semibold text-slate-100">
                                                {exercise.title}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={
                                                isSelected
                                                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                                                    : 'border-slate-700 bg-slate-950/70 text-slate-300'
                                            }
                                        >
                                            {engineLabels[
                                                exercise.correction_engine
                                            ] ?? exercise.correction_engine}
                                        </Badge>
                                    </div>

                                    <div className="mt-3 space-y-2 text-sm text-slate-400">
                                        <p className="line-clamp-2">
                                            {exercise.topic?.concept?.course?.title ?? 'Course'}
                                            {' / '}
                                            {exercise.topic?.concept?.title ?? 'Concept'}
                                            {' / '}
                                            {exercise.topic?.title ?? 'Topic'}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                {exercise.difficulty ?? 'beginner'}
                                            </Badge>
                                            <span className="text-xs text-slate-500">
                                                {exercise.passing_score ?? 0}% to pass
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
