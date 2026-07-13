import { Badge } from '@/components/ui/badge';
import { engineLabels } from './exerciseLabHelpers';

export default function ExerciseInstructions({ selectedExercise }) {
    if (!selectedExercise) {
        return (
            <div className="p-6">
                <div className="py-10">
                    <p className="text-sm text-muted-foreground">
                        Select an exercise to view the instructions.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="border-b">
            <div className="border-b px-5 py-3">
                <span className="text-sm font-semibold">Description</span>
            </div>
            <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-semibold tracking-tight">
                        {selectedExercise.title}
                    </h1>
                    <Badge variant="secondary">
                        {engineLabels[selectedExercise.correction_engine] ??
                            selectedExercise.correction_engine}
                    </Badge>
                    <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">
                        {selectedExercise.difficulty}
                    </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                    {selectedExercise.topic?.concept?.course?.title ?? 'Course'}{' '}
                    / {selectedExercise.topic?.concept?.title ?? 'Concept'} /{' '}
                    {selectedExercise.topic?.title ?? 'Topic'}
                </p>

                <section className="mt-6">
                    <p className="text-sm leading-7 whitespace-pre-wrap text-foreground/90">
                        {selectedExercise.description ||
                            'No instructions were provided for this exercise.'}
                    </p>
                </section>

                <section className="mt-6 grid grid-cols-3 divide-x rounded-lg border bg-muted/20">
                    <div className="p-3 text-sm">
                        <span className="text-muted-foreground">
                            Passing score
                        </span>
                        <p className="mt-1 font-semibold">
                            {selectedExercise.passing_score}%
                        </p>
                    </div>
                    <div className="p-3 text-sm">
                        <span className="text-muted-foreground">XP reward</span>
                        <p className="mt-1 font-semibold">
                            {selectedExercise.xp_reward ?? 0} XP
                        </p>
                    </div>
                    <div className="p-3 text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <p className="mt-1 truncate font-semibold">
                            {selectedExercise.exercise_type}
                        </p>
                    </div>
                </section>
            </div>
        </section>
    );
}
