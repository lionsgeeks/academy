<?php

namespace App\Services\Exercises;

use App\Models\ExerciseAttempt;
use InvalidArgumentException;

class BrowserExerciseCorrectionService
{
    public function correct(ExerciseAttempt $attempt): ExerciseAttempt
    {
        $attempt->loadMissing('exercise');

        $exercise = $attempt->exercise;

        if (! $exercise || $exercise->correction_engine !== 'browser') {
            throw new InvalidArgumentException(
                'Only browser exercise attempts can be corrected here.',
            );
        }

        if ($attempt->source_type !== 'browser_code') {
            throw new InvalidArgumentException(
                'The attempt must contain browser source code.',
            );
        }

        $rules = $exercise->correction_rules ?? [];

        $checks = $rules['checks'] ?? [];

        if (! is_array($checks) || $checks === []) {
            throw new InvalidArgumentException(
                'Browser correction rules must contain at least one check.',
            );
        }

        $sourceCode = $attempt->source_code ?? [];

        $results = [];
        $earnedPoints = 0;
        $totalPoints = 0;

        foreach ($checks as $check) {
            if (! is_array($check)) {
                continue;
            }

            $language = $check['language'] ?? null;
            $contains = $check['contains'] ?? null;
            $points = $check['points'] ?? null;
            $message = $check['message'] ?? null;

            if (
                ! in_array(
                    $language,
                    ['html', 'css', 'javascript'],
                    true,
                )
                || ! is_string($contains)
                || trim($contains) === ''
                || ! is_int($points)
                || $points <= 0
            ) {
                continue;
            }

            $totalPoints += $points;

            $code = $sourceCode[$language] ?? '';

            $passed = is_string($code)
                && str_contains($code, $contains);

            if ($passed) {
                $earnedPoints += $points;
            }

            $results[] = [
                'language' => $language,
                'contains' => $contains,
                'points' => $points,
                'passed' => $passed,
                'message' => is_string($message) && trim($message) !== ''
                    ? $message
                    : "Required {$language} code was not found.",
            ];
        }

        if ($totalPoints === 0) {
            throw new InvalidArgumentException(
                'Browser correction rules do not contain valid checks.',
            );
        }

        $score = (int) round(
            ($earnedPoints / $totalPoints) * 100,
        );

        $passed = $score >= $exercise->passing_score;

        $attempt->forceFill([
            'status' => 'completed',
            'score' => $score,
            'passed' => $passed,
            'feedback' => [
                'earned_points' => $earnedPoints,
                'total_points' => $totalPoints,
                'checks' => $results,
            ],
            'started_at' => $attempt->started_at ?? now(),
            'completed_at' => now(),
            'failure_reason' => null,
        ])->save();

        return $attempt->fresh();
    }
}