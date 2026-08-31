<?php

use App\Jobs\DispatchGithubExerciseAttempt;
use App\Models\ExerciseAttempt;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('qjob:dispatch {attemptId} {--now}', function (string $attemptId) {
    $attempt = ExerciseAttempt::query()->find((int) $attemptId);

    if (! $attempt) {
        $this->error(json_encode([
            'status' => 'error',
            'message' => 'Exercise attempt not found.',
            'attempt_id' => $attemptId,
        ], JSON_UNESCAPED_SLASHES));

        return 1;
    }

    if ($this->option('now')) {
        try {
            dispatch_sync(new DispatchGithubExerciseAttempt($attempt->id));
        } catch (\Throwable $exception) {
            $attempt->refresh();

            $this->error(json_encode([
                'status' => 'error',
                'message' => 'Synchronous dispatch failed.',
                'attempt_id' => $attempt->id,
                'attempt_status' => $attempt->status,
                'failure_reason' => $attempt->failure_reason,
                'exception' => $exception->getMessage(),
            ], JSON_UNESCAPED_SLASHES));

            return 1;
        }

        $attempt->refresh();

        $this->line(json_encode([
            'status' => 'ok',
            'attempt_id' => $attempt->id,
            'attempt_status' => $attempt->status,
            'github_dispatch_token' => $attempt->github_dispatch_token,
            'github_dispatched_at' => $attempt->github_dispatched_at?->toDateTimeString(),
            'failure_reason' => $attempt->failure_reason,
        ], JSON_UNESCAPED_SLASHES));

        return 0;
    }

    DispatchGithubExerciseAttempt::dispatch($attempt->id)
        ->onQueue('github-exercises');

    $this->line(json_encode([
        'status' => 'queued',
        'attempt_id' => $attempt->id,
        'queued' => true,
    ], JSON_UNESCAPED_SLASHES));

    return 0;
})->purpose('Dispatch a GitHub exercise attempt by attempt ID');
