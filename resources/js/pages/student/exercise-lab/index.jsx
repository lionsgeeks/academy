import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { index as exerciseLabIndex } from '@/routes/student/exercise-lab';
import { index as studentExercisesIndex } from '@/routes/student/exercises';
import {
    index as studentAttemptsIndex,
    store as storeStudentAttempt,
} from '@/routes/student/exercises/attempts';
import AttemptPanel from './partials/AttemptPanel';
import ExerciseInstructions from './partials/ExerciseInstructions';
import ExercisePicker from './partials/ExercisePicker';
import SubmissionForm from './partials/SubmissionForm';
import {
    emptyBrowserSource,
    emptyGithubSource,
    parseJsonResponse,
} from './partials/exerciseLabHelpers';

export default function StudentExerciseLab({ csrfToken }) {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [browserSource, setBrowserSource] = useState(emptyBrowserSource);
    const [githubSource, setGithubSource] = useState(emptyGithubSource);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState('');
    const [loadingExercises, setLoadingExercises] = useState(false);
    const [loadingAttempts, setLoadingAttempts] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadExercises = useCallback(async () => {
        setLoadingExercises(true);
        setNotice('');

        try {
            const response = await fetch(studentExercisesIndex.url(), {
                headers: { Accept: 'application/json' },
            });
            const payload = await parseJsonResponse(response);

            if (!response.ok) {
                throw new Error(
                    payload.message ?? 'Unable to load student exercises.',
                );
            }

            const visibleExercises = payload.data ?? [];

            setExercises(visibleExercises);
            setSelectedExercise((current) => {
                if (
                    current &&
                    visibleExercises.some(
                        (exercise) => exercise.id === current.id,
                    )
                ) {
                    return current;
                }

                return visibleExercises[0] ?? null;
            });
        } catch (error) {
            setNotice(error.message);
        } finally {
            setLoadingExercises(false);
        }
    }, []);

    const loadAttempts = useCallback(async () => {
        if (!selectedExercise) {
            setAttempts([]);
            return;
        }

        setLoadingAttempts(true);
        setNotice('');

        try {
            const response = await fetch(
                studentAttemptsIndex.url(selectedExercise.id),
                {
                    headers: { Accept: 'application/json' },
                },
            );
            const payload = await parseJsonResponse(response);

            if (!response.ok) {
                throw new Error(
                    payload.message ?? 'Unable to load exercise attempts.',
                );
            }

            setAttempts(payload.data ?? []);
        } catch (error) {
            setNotice(error.message);
        } finally {
            setLoadingAttempts(false);
        }
    }, [selectedExercise]);

    useEffect(() => {
        loadExercises();
    }, [loadExercises]);

    useEffect(() => {
        loadAttempts();
    }, [loadAttempts]);

    const selectExercise = (exercise) => {
        setSelectedExercise(exercise);
        setErrors({});
        setNotice('');
        setBrowserSource(emptyBrowserSource);
        setGithubSource(emptyGithubSource);
    };

    const updateBrowserSource = (language, value) => {
        setBrowserSource((current) => ({
            ...current,
            [language]: value,
        }));
    };

    const updateGithubSource = (field, value) => {
        setGithubSource((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submitAttempt = async (event) => {
        event.preventDefault();

        if (!selectedExercise) {
            return;
        }

        setSubmitting(true);
        setErrors({});
        setNotice('');

        const isBrowser = selectedExercise.correction_engine === 'browser';
        const body = isBrowser
            ? { source_code: browserSource }
            : {
                  repository_url: githubSource.repository_url,
                  branch: githubSource.branch,
                  commit_sha: githubSource.commit_sha || null,
              };

        try {
            const response = await fetch(
                storeStudentAttempt.url(selectedExercise.id),
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify(body),
                },
            );
            const payload = await parseJsonResponse(response);

            if (response.status === 422) {
                setErrors(payload.errors ?? {});
                return;
            }

            if (!response.ok) {
                throw new Error(
                    payload.message ?? 'Unable to submit this attempt.',
                );
            }

            setNotice('Attempt submitted. Refresh attempts for async updates.');
            setAttempts((current) => [payload.data, ...current]);
        } catch (error) {
            setNotice(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Exercise lab',
                    href: exerciseLabIndex(),
                },
            ]}
        >
            <Head title="Student Exercise Lab" />

            <div className="min-h-screen p-4 md:p-6">
                <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                    <ExercisePicker
                        exercises={exercises}
                        loading={loadingExercises}
                        selectedExercise={selectedExercise}
                        onSelectExercise={selectExercise}
                        onRefresh={loadExercises}
                    />

                    {notice ? (
                        <p className="border-b bg-muted/40 px-4 py-2 text-sm">
                            {notice}
                        </p>
                    ) : null}

                    <div className="grid min-h-[calc(100vh-11rem)] xl:grid-cols-[minmax(360px,0.88fr)_minmax(480px,1.12fr)]">
                        <div className="min-w-0 border-b xl:border-r xl:border-b-0">
                            <ExerciseInstructions
                                selectedExercise={selectedExercise}
                            />

                            <AttemptPanel
                                selectedExercise={selectedExercise}
                                attempts={attempts}
                                loading={loadingAttempts}
                                onRefresh={loadAttempts}
                            />
                        </div>

                        <div className="min-w-0">
                            <SubmissionForm
                                selectedExercise={selectedExercise}
                                browserSource={browserSource}
                                githubSource={githubSource}
                                errors={errors}
                                submitting={submitting}
                                onBrowserSourceChange={updateBrowserSource}
                                onGithubSourceChange={updateGithubSource}
                                onSubmit={submitAttempt}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
