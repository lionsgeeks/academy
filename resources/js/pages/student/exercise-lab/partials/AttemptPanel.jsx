import { Button } from '@/components/ui/button';
import { History, RefreshCw } from 'lucide-react';
import { formatScore, statusStyles } from './exerciseLabHelpers';

export default function AttemptPanel({
    selectedExercise,
    attempts,
    loading,
    onRefresh,
}) {
    return (
        <section>
            <div className="flex items-center justify-between gap-3 border-b px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <History className="size-4 text-muted-foreground" />
                    Attempts
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={!selectedExercise || loading}
                >
                    <RefreshCw className="size-3.5" />
                    Refresh
                </Button>
            </div>
            <div className="p-5">
                {!selectedExercise ? (
                    <p className="text-sm text-muted-foreground">
                        Select an exercise to view its attempts.
                    </p>
                ) : loading ? (
                    <p className="text-sm text-muted-foreground">
                        Loading attempts...
                    </p>
                ) : attempts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No attempts yet for this exercise.
                    </p>
                ) : (
                    <div className="grid gap-3">
                        {attempts.map((attempt) => (
                            <article
                                key={attempt.id}
                                className="rounded-lg border bg-muted/10 p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Attempt #{attempt.attempt_number}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {attempt.source_type}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-md border px-2 py-1 text-xs font-medium ${
                                                statusStyles[attempt.status] ??
                                                'border-slate-200 bg-slate-50 text-slate-700'
                                            }`}
                                        >
                                            {attempt.status}
                                        </span>
                                        <span className="rounded-md border px-2 py-1 text-xs">
                                            {formatScore(attempt)}
                                        </span>
                                        {attempt.passed !== null &&
                                        attempt.passed !== undefined ? (
                                            <span className="rounded-md border px-2 py-1 text-xs">
                                                {attempt.passed
                                                    ? 'Passed'
                                                    : 'Not passed'}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                {attempt.repository_url ? (
                                    <div className="mt-3 rounded-md bg-muted/40 p-3 text-xs">
                                        <p className="break-all">
                                            {attempt.repository_url}
                                        </p>
                                        <p className="mt-1 text-muted-foreground">
                                            Branch: {attempt.branch || 'none'}
                                        </p>
                                    </div>
                                ) : null}

                                {attempt.failure_reason ? (
                                    <div className="mt-3 rounded-md border border-red-700 bg-red-950/20 p-3 text-xs text-red-200">
                                        <p className="font-medium">Failure reason</p>
                                        <p>{attempt.failure_reason}</p>
                                    </div>
                                ) : null}

                                {attempt.feedback ? (
                                    <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-50">
                                        {JSON.stringify(
                                            attempt.feedback,
                                            null,
                                            2,
                                        )}
                                    </pre>
                                ) : (
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        No feedback JSON is stored yet.
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
