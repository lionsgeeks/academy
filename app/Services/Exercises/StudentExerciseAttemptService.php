<?php

namespace App\Services\Exercises;

use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StudentExerciseAttemptService
{
    public function createFor(
        User $student,
        Exercise $exercise,
        array $data,
    ): ExerciseAttempt {
        $sourceType = match ($exercise->correction_engine) {
            'browser' => 'browser_code',
            'github_actions' => 'github_repository',
            default => throw new InvalidArgumentException(
                'Unsupported correction engine.',
            ),
        };

        return DB::transaction(function () use (
            $student,
            $exercise,
            $data,
            $sourceType,
        ): ExerciseAttempt {
            User::query()
                ->whereKey($student->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lastAttemptNumber = ExerciseAttempt::query()
                ->where('user_id', $student->id)
                ->where('exercise_id', $exercise->id)
                ->max('attempt_number');

            return ExerciseAttempt::query()->create([
                'exercise_id' => $exercise->id,
                'user_id' => $student->id,
                'attempt_number' => ((int) $lastAttemptNumber) + 1,
                'status' => 'queued',
                'source_type' => $sourceType,

                'source_code' => $sourceType === 'browser_code'
                    ? $data['source_code']
                    : null,

                'repository_url' => $sourceType === 'github_repository'
                    ? $data['repository_url']
                    : null,

                'branch' => $sourceType === 'github_repository'
                    ? $data['branch']
                    : null,

                'commit_sha' => $sourceType === 'github_repository'
                    ? ($data['commit_sha'] ?? null)
                    : null,

                'submitted_at' => now(),
            ]);
        }, 3);
    }
}