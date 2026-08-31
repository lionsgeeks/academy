import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Star, Zap, BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function StudentExercisesIndex() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('api.student.exercises.index'), {
                headers: { Accept: 'application/json' },
            });
            const payload = await response.json();
            setExercises(payload.data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch exercises:', err);
            setError('Failed to load exercises. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'bg-green-100 text-green-800',
            intermediate: 'bg-yellow-100 text-yellow-800',
            advanced: 'bg-red-100 text-red-800',
            expert: 'bg-purple-100 text-purple-800',
        };
        return colors[difficulty] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (attempt) => {
        if (!attempt) return null;
        
        switch (attempt.status) {
            case 'completed':
                return attempt.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                );
            case 'processing':
                return <Clock className="w-5 h-5 text-blue-600" />;
            default:
                return null;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Exercises', href: route('student.exercises.index') },
            ]}
        >
            <Head title="Exercises" />

            <div className="min-h-screen p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Available Exercises
                    </h1>
                    <p className="text-gray-600">
                        Practice coding and earn XP by completing exercises assigned to your class and published for you.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && exercises.length === 0 && !error && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">
                            No published exercises are assigned to you yet
                        </h3>
                        <p className="text-gray-600">
                            New exercises will appear here once your class is assigned and published.
                        </p>
                    </div>
                )}

                {/* Exercises Grid */}
                {!loading && exercises.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.map((exercise) => (
                            <ExerciseCard
                                key={exercise.id}
                                exercise={exercise}
                                getDifficultyColor={getDifficultyColor}
                                getStatusIcon={getStatusIcon}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function ExerciseCard({ exercise, getDifficultyColor, getStatusIcon }) {
    const [attempts, setAttempts] = useState([]);
    const [loadingAttempts, setLoadingAttempts] = useState(false);
    const [showAttempts, setShowAttempts] = useState(false);

    const loadAttempts = async () => {
        if (loadingAttempts || showAttempts) {
            setShowAttempts(!showAttempts);
            return;
        }

        try {
            setLoadingAttempts(true);
            const response = await fetch(route('api.student.exercises.attempts.index', exercise.id), {
                headers: { Accept: 'application/json' },
            });
            const payload = await response.json();
            setAttempts(payload.data || []);
            setShowAttempts(true);
        } catch (err) {
            console.error('Failed to load attempts:', err);
        } finally {
            setLoadingAttempts(false);
        }
    };

    const bestAttempt = attempts.length > 0
        ? attempts.reduce((best, current) => 
            (current.score || 0) > (best.score || 0) ? current : best
          )
        : null;

    const latestAttempt = attempts.length > 0 ? attempts[0] : null;

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {exercise.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {exercise.description}
                </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {/* Difficulty */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                    </span>

                    {/* XP Reward */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Zap className="w-3 h-3" />
                        {exercise.xp_reward} XP
                    </span>

                    {/* Assignment Visibility */}
                    {exercise.assigned_to_student && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Assigned to you
                        </span>
                    )}

                    {/* Passing Score */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="w-3 h-3" />
                        {exercise.passing_score}% pass
                    </span>
                </div>

                {/* Best Score */}
                {bestAttempt && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Best Score</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(bestAttempt)}
                                <span className="text-lg font-bold text-gray-900">
                                    {bestAttempt.score || 0}%
                                </span>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                                bestAttempt.passed
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {bestAttempt.passed ? 'Passed' : 'Failed'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Attempt History */}
                {attempts.length > 0 && (
                    <div className="mb-4">
                        <button
                            onClick={loadAttempts}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {showAttempts ? '▼' : '▶'} {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
                        </button>

                        {showAttempts && (
                            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                                {attempts.map((attempt, idx) => (
                                    <div
                                        key={attempt.id}
                                        className="p-2 bg-gray-50 rounded text-xs flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(attempt)}
                                            <span className="text-gray-700">
                                                Attempt {idx + 1}: {attempt.score || 0}%
                                            </span>
                                        </div>
                                        <span className="text-gray-500">
                                            {attempt.submitted_at
                                                ? new Date(attempt.submitted_at).toLocaleDateString()
                                                : 'pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <a
                    href={route('student.exercises.show', exercise.id)}
                    className="flex-1 px-4 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                    View Details
                </a>
                <button
                    onClick={loadAttempts}
                    className="flex-1 px-4 py-2 text-center rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                    {attempts.length > 0 ? 'History' : 'Start'}
                </button>
            </div>
        </div>
    );
}
