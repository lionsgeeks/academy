import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Zap, Star, AlertCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import BrowserExerciseEditor from '@/components/student/BrowserExerciseEditor';
import GitHubRepositoryForm from '@/components/student/GitHubRepositoryForm';
import ZipUploadForm from '@/components/student/ZipUploadForm';
import SubmissionResultsModal from '@/components/student/SubmissionResultsModal';

export default function StudentExerciseShow({ exercise: initialExercise }) {
    const [exercise, setExercise] = useState(initialExercise);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // 'details', 'attempts', 'submit'
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [currentResult, setCurrentResult] = useState(null);
    const [pollingAttemptId, setPollingAttemptId] = useState(null);

    useEffect(() => {
        loadAttempts();
    }, []);

    // Poll for result updates when submission is processing
    useEffect(() => {
        if (!pollingAttemptId) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(route('api.student.exercises.attempts.index', exercise.id), {
                    headers: { Accept: 'application/json' },
                });
                const payload = await response.json();
                const attempts = payload.data || [];
                const attempt = attempts.find((item) => item.id === pollingAttemptId);

                if (attempt) {
                    setCurrentResult(attempt);
                    setAttempts(attempts);

                    // Stop polling if complete
                    if (attempt.status === 'completed') {
                        setPollingAttemptId(null);
                    }
                }
            } catch (err) {
                console.error('Polling failed:', err);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [pollingAttemptId, exercise.id]);

    const loadAttempts = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('api.student.exercises.attempts.index', exercise.id), {
                headers: { Accept: 'application/json' },
            });
            const payload = await response.json();
            setAttempts(payload.data || []);
        } catch (err) {
            console.error('Failed to load attempts:', err);
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

    const bestAttempt = attempts.length > 0
        ? attempts.reduce((best, current) => 
            (current.score || 0) > (best.score || 0) ? current : best
          )
        : null;

    const getExerciseTypeLabel = (type) => {
        const labels = {
            browser: 'Browser Code',
            github_repository: 'GitHub Repository',
            zip_upload: 'ZIP Upload',
        };
        return labels[type] || type;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Exercises', href: route('student.exercises.index') },
                { title: exercise.title, href: route('student.exercises.show', exercise.id) },
            ]}
        >
            <Head title={exercise.title} />

            <div className="min-h-screen p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <a
                        href={route('student.exercises.index')}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Exercises
                    </a>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {exercise.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <Zap className="w-4 h-4" />
                            {exercise.xp_reward} XP
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Star className="w-4 h-4" />
                            {exercise.passing_score}% to pass
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {getExerciseTypeLabel(exercise.exercise_type)}
                        </span>
                    </div>
                </div>

                {/* Best Score Banner */}
                {bestAttempt && (
                    <div className={`mb-8 p-6 rounded-lg border-l-4 ${
                        bestAttempt.passed
                            ? 'bg-green-50 border-green-400'
                            : 'bg-red-50 border-red-400'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {bestAttempt.passed ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                )}
                                <div>
                                    <p className={`font-semibold text-lg ${
                                        bestAttempt.passed ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                        Best Score: {bestAttempt.score}%
                                    </p>
                                    <p className={`text-sm ${
                                        bestAttempt.passed ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                        {bestAttempt.passed ? '✓ Exercise Passed!' : 'Keep trying to reach the passing score'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('attempts')}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View all attempts →
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-1">
                        {['details', 'attempts', 'submit'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                                    activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab === 'details' && 'Details'}
                                {tab === 'attempts' && 'Attempts'}
                                {tab === 'submit' && 'Submit'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercise Description</h2>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {exercise.description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Attempts Tab */}
                {activeTab === 'attempts' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Submission History ({attempts.length})
                        </h2>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : attempts.length === 0 ? (
                            <div className="text-center py-8 text-gray-600">
                                <p>No submissions yet. Submit your first attempt to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {attempts.map((attempt, idx) => (
                                    <AttemptRow
                                        key={attempt.id}
                                        attempt={attempt}
                                        attemptNumber={idx + 1}
                                        total={attempts.length}
                                        onViewFeedback={() => {
                                            setCurrentResult(attempt);
                                            setShowResultsModal(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Tab */}
                {activeTab === 'submit' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Solution</h2>
                        <SubmissionForm
                            exercise={exercise}
                            onSubmit={(attempt) => {
                                setCurrentResult(attempt);
                                setShowResultsModal(true);
                                setPollingAttemptId(attempt.id);
                                setActiveTab('attempts');
                                setTimeout(() => loadAttempts(), 1000);
                            }}
                        />
                    </div>
                )}

                {/* Results Modal */}
                {showResultsModal && (
                    <SubmissionResultsModal
                        attempt={currentResult}
                        exercise={exercise}
                        onClose={() => setShowResultsModal(false)}
                        onRetry={() => {
                            setShowResultsModal(false);
                            setActiveTab('submit');
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}

function AttemptRow({ attempt, attemptNumber, total, onViewFeedback }) {
    const statusColor = attempt.status === 'completed'
        ? (attempt.passed ? 'text-green-600' : 'text-red-600')
        : attempt.status === 'processing'
        ? 'text-blue-600'
        : 'text-gray-600';

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {attempt.status === 'completed' && attempt.passed && (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {attempt.status === 'completed' && !attempt.passed && (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                        {attempt.status === 'processing' && (
                            <Clock className="w-6 h-6 text-blue-600 animate-spin" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">Attempt {total - attemptNumber + 1}</h4>
                        <p className="text-sm text-gray-600">
                            Submitted on {attempt.submitted_at
                                ? new Date(attempt.submitted_at).toLocaleDateString()
                                : 'unknown date'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {attempt.status === 'completed' && (
                    <>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{attempt.score}%</p>
                            <p className={`text-sm font-medium ${statusColor}`}>
                                {attempt.passed ? 'Passed' : 'Failed'}
                            </p>
                        </div>
                        {attempt.feedback && (
                            <button
                                onClick={onViewFeedback}
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                View Feedback
                            </button>
                        )}
                    </>
                )}
                {attempt.status === 'processing' && (
                    <p className="text-sm font-medium text-blue-600">Evaluating...</p>
                )}
            </div>
        </div>
    );
}

function SubmissionForm({ exercise, onSubmit }) {
    const [formData, setFormData] = useState({
        source_code: exercise.exercise_type === 'browser' ? { html: '', css: '', javascript: '' } : null,
        repository_url: '',
        branch: '',
        zip_file: null,
        zip_file_name: null,
        zip_file_size: null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            let payload = {};

            if (exercise.exercise_type === 'browser') {
                payload = { source_code: formData.source_code };
            } else if (exercise.exercise_type === 'github_repository') {
                if (!formData.repository_url || !formData.branch) {
                    setError('Please provide both repository URL and branch name');
                    setSubmitting(false);
                    return;
                }
                payload = {
                    repository_url: formData.repository_url,
                    branch: formData.branch,
                };
            } else if (exercise.exercise_type === 'zip_upload') {
                if (!formData.zip_file) {
                    setError('Please upload a ZIP file');
                    setSubmitting(false);
                    return;
                }
                // Convert FormData for file upload
                const formDataWithFile = new FormData();
                formDataWithFile.append('zip_file', formData.zip_file);

                const response = await fetch(route('api.student.exercises.attempts.store', exercise.id), {
                    method: 'POST',
                    body: formDataWithFile,
                    headers: { Accept: 'application/json' },
                });
                const payloadResponse = await response.json();
                onSubmit(payloadResponse.data);
                return;
            }

            const response = await fetch(route('api.student.exercises.attempts.store', exercise.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const payloadResponse = await response.json();

            onSubmit(payloadResponse.data);
        } catch (err) {
            console.error('Submission failed:', err);
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold">Error</h4>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {exercise.exercise_type === 'browser' && (
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Write your HTML, CSS, and JavaScript code below
                    </label>
                    <BrowserExerciseEditor
                        sourceCode={formData.source_code}
                        onChange={(code) => setFormData({ ...formData, source_code: code })}
                        preview={true}
                    />
                </div>
            )}

            {exercise.exercise_type === 'github_repository' && (
                <GitHubRepositoryForm
                    formData={formData}
                    setFormData={setFormData}
                    exercise={exercise}
                />
            )}

            {exercise.exercise_type === 'zip_upload' && (
                <ZipUploadForm
                    formData={formData}
                    setFormData={setFormData}
                    maxSize={50}
                />
            )}

            <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
                {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
        </form>
    );
}
