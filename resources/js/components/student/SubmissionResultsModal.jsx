import { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function SubmissionResultsModal({ attempt, exercise, onClose, onRetry }) {
    const [expandedCheck, setExpandedCheck] = useState(null);

    if (!attempt) return null;

    const isCompleted = attempt.status === 'completed';
    const isPassed = attempt.passed;
    const isProcessing = attempt.status === 'processing';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className={`p-8 border-b-4 ${
                    isProcessing 
                        ? 'border-blue-400 bg-blue-50'
                        : isPassed
                        ? 'border-green-400 bg-green-50'
                        : 'border-red-400 bg-red-50'
                }`}>
                    <div className="flex items-center gap-4 mb-4">
                        {isProcessing && (
                            <Clock className="w-12 h-12 text-blue-600 animate-spin" />
                        )}
                        {isCompleted && isPassed && (
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        )}
                        {isCompleted && !isPassed && (
                            <AlertCircle className="w-12 h-12 text-red-600" />
                        )}

                        <div className="flex-1">
                            <h2 className={`text-3xl font-bold ${
                                isProcessing 
                                    ? 'text-blue-900'
                                    : isPassed
                                    ? 'text-green-900'
                                    : 'text-red-900'
                            }`}>
                                {isProcessing
                                    ? 'Evaluating your submission...'
                                    : isPassed
                                    ? 'Congratulations! You passed!'
                                    : 'Keep trying!'}
                            </h2>
                            <p className={`text-sm mt-1 ${
                                isProcessing 
                                    ? 'text-blue-700'
                                    : isPassed
                                    ? 'text-green-700'
                                    : 'text-red-700'
                            }`}>
                                {isProcessing
                                    ? 'Your submission is being evaluated. This may take a moment.'
                                    : `Score: ${attempt.score}% (${attempt.score >= exercise.passing_score ? 'passed' : 'failed'})`}
                            </p>
                        </div>

                        {isCompleted && (
                            <div className="text-5xl font-bold text-gray-900">
                                {attempt.score}%
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Failure Reason */}
                    {attempt.failure_reason && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-red-900 mb-2">Error</h3>
                            <p className="text-red-700 text-sm">{attempt.failure_reason}</p>
                        </div>
                    )}

                    {/* Feedback */}
                    {attempt.feedback && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Feedback & Results
                            </h3>

                            {/* Score Summary */}
                            <div className="mb-6 grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Earned Points</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {attempt.feedback.earned_points || 0}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Total Points</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {attempt.feedback.total_points || 0}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Passing Score</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {exercise.passing_score}%
                                    </p>
                                </div>
                            </div>

                            {/* Checks */}
                            {attempt.feedback.checks && attempt.feedback.checks.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900">Test Results</h4>
                                    {attempt.feedback.checks.map((check, idx) => (
                                        <div
                                            key={idx}
                                            className={`border rounded-lg overflow-hidden ${
                                                check.passed
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-red-200 bg-red-50'
                                            }`}
                                        >
                                            <button
                                                onClick={() => setExpandedCheck(
                                                    expandedCheck === idx ? null : idx
                                                )}
                                                className="w-full p-4 flex items-center justify-between hover:opacity-75 transition-opacity"
                                            >
                                                <div className="flex items-center gap-3 flex-1 text-left">
                                                    {check.passed ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                                    )}
                                                    <div>
                                                        <p className={`font-medium ${
                                                            check.passed ? 'text-green-900' : 'text-red-900'
                                                        }`}>
                                                            {check.language && `[${check.language}] `}
                                                            {check.message}
                                                        </p>
                                                        {check.points !== undefined && (
                                                            <p className={`text-xs ${
                                                                check.passed ? 'text-green-700' : 'text-red-700'
                                                            }`}>
                                                                {check.points} points
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {expandedCheck === idx ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                                )}
                                            </button>

                                            {expandedCheck === idx && (
                                                <div className={`border-t ${
                                                    check.passed
                                                        ? 'border-green-200 bg-white'
                                                        : 'border-red-200 bg-white'
                                                } p-4`}>
                                                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {check.details || 'No additional details available'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Processing Message */}
                    {isProcessing && (
                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <p className="text-blue-800 mb-4">
                                Your submission is being evaluated. GitHub Actions is running the test suite...
                            </p>
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                        Close
                    </button>
                    {isCompleted && !isPassed && (
                        <button
                            onClick={onRetry}
                            className="flex-1 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                    {isPassed && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
