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
        <section className="border-b bg-muted/20">
            <div className="flex min-h-14 items-center gap-3 px-4">
                <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                    <ListChecks className="size-4 text-primary" />
                    <span>Problems</span>
                </div>
                <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-2">
                    {loading ? (
                        <p className="self-center text-sm whitespace-nowrap text-muted-foreground">
                            Loading exercises...
                        </p>
                    ) : exercises.length === 0 ? (
                        <p className="self-center text-sm whitespace-nowrap text-muted-foreground">
                            No published exercises are available.
                        </p>
                    ) : (
                        exercises.map((exercise, index) => {
                            const isSelected =
                                selectedExercise?.id === exercise.id;

                            return (
                                <button
                                    key={exercise.id}
                                    type="button"
                                    onClick={() => onSelectExercise(exercise)}
                                    className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-left text-sm transition hover:border-primary/60 ${
                                        isSelected
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background'
                                    }`}
                                >
                                    <span className="text-xs opacity-70">
                                        {index + 1}.
                                    </span>
                                    <span className="max-w-44 truncate font-medium">
                                        {exercise.title}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={
                                            isSelected
                                                ? 'border-primary-foreground/40 text-primary-foreground'
                                                : ''
                                        }
                                    >
                                        {engineLabels[
                                            exercise.correction_engine
                                        ] ?? exercise.correction_engine}
                                    </Badge>
                                </button>
                            );
                        })
                    )}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={loading}
                    className="shrink-0"
                >
                    <RefreshCw className="size-3.5" />
                    <span className="sr-only">Refresh problems</span>
                </Button>
            </div>
        </section>
    );
}
