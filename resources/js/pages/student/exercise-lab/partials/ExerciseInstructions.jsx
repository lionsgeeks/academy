import { Badge } from '@/components/ui/badge';
import { engineLabels } from './exerciseLabHelpers';

export default function ExerciseInstructions({ selectedExercise }) {
    if (!selectedExercise) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-10 text-center text-sm text-muted-foreground">
                    Select an exercise to view the instructions.
                </div>
            </div>
        );
    }

    return (
        <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950/80 to-background">
            <div className="border-b border-slate-800 px-5 py-3">
                <span className="text-sm font-semibold">Exercise overview</span>
            </div>
            <div className="p-5 md:p-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-semibold tracking-tight text-slate-100">
                            {selectedExercise.title}
                        </h1>
                        <Badge variant="secondary">
                            {engineLabels[selectedExercise.correction_engine] ??
                                selectedExercise.correction_engine}
                        </Badge>
                        <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {selectedExercise.difficulty}
                        </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                        {selectedExercise.topic?.concept?.course?.title ?? 'Course'}{' '}
                        / {selectedExercise.topic?.concept?.title ?? 'Concept'} /{' '}
                        {selectedExercise.topic?.title ?? 'Topic'}
                    </p>

                    <section className="mt-6">
                        <p className="text-sm leading-7 whitespace-pre-wrap text-slate-300">
                            {selectedExercise.description ||
                                'No instructions were provided for this exercise.'}
                        </p>
                    </section>

                    <section className="mt-6 grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm">
                            <span className="text-slate-400">Passing score</span>
                            <p className="mt-1 font-semibold text-slate-100">
                                {selectedExercise.passing_score}%
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm">
                            <span className="text-slate-400">XP reward</span>
                            <p className="mt-1 font-semibold text-slate-100">
                                {selectedExercise.xp_reward ?? 0} XP
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm">
                            <span className="text-slate-400">Type</span>
                            <p className="mt-1 truncate font-semibold text-slate-100">
                                {selectedExercise.exercise_type}
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}
