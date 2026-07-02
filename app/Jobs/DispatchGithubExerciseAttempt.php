<?php

namespace App\Jobs;

use App\Models\ExerciseAttempt;
use App\Services\Exercises\GithubWorkflowDispatcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class DispatchGithubExerciseAttempt implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 30;

    public function __construct(
        public readonly int $attemptId,
    ) {
    }

    public function handle(GithubWorkflowDispatcher $dispatcher): void
    {
        $attempt = $this->prepareAttempt();

        if (! $attempt) {
            return;
        }

        $dispatchToken = (string) $attempt->github_dispatch_token;

        try {
            $dispatcher->dispatch($attempt);
        } catch (Throwable $exception) {
            report($exception);

            $this->markDispatchFailed(
                $attempt->id,
                $dispatchToken,
            );

            return;
        }

        $this->markProcessing(
            $attempt->id,
            $dispatchToken,
        );
    }

    private function prepareAttempt(): ?ExerciseAttempt
    {
        return DB::transaction(function (): ?ExerciseAttempt {
            $attempt = ExerciseAttempt::query()
                ->with('exercise')
                ->lockForUpdate()
                ->find($this->attemptId);

            if (! $attempt || $attempt->status !== 'queued') {
                return null;
            }

            if ($attempt->source_type !== 'github_repository') {
                $this->markFailed(
                    $attempt,
                    'The attempt is not a GitHub repository attempt.',
                );

                return null;
            }

            $exercise = $attempt->exercise;

            if (! $exercise || $exercise->correction_engine !== 'github_actions') {
                $this->markFailed(
                    $attempt,
                    'The exercise is not configured for GitHub Actions.',
                );

                return null;
            }

            if (
                ! is_string($exercise->github_branch_prefix)
                || $exercise->github_branch_prefix === ''
            ) {
                $this->markFailed(
                    $attempt,
                    'The GitHub exercise configuration is incomplete.',
                );

                return null;
            }

            if (
                ! is_string($attempt->branch)
                || ! str_starts_with(
                    $attempt->branch,
                    $exercise->github_branch_prefix,
                )
            ) {
                $this->markFailed(
                    $attempt,
                    'The submitted branch does not match the required prefix.',
                );

                return null;
            }

            $attempt->forceFill([
                'status' => 'dispatching',
                'github_dispatch_token' => (string) Str::uuid(),
                'github_dispatched_at' => null,
                'started_at' => $attempt->started_at ?? now(),
                'completed_at' => null,
                'failure_reason' => null,
            ])->save();

            return $attempt->fresh(['exercise']);
        });
    }

    private function markProcessing(
        int $attemptId,
        string $dispatchToken,
    ): void {
        DB::transaction(function () use ($attemptId, $dispatchToken): void {
            $attempt = ExerciseAttempt::query()
                ->lockForUpdate()
                ->find($attemptId);

            if (
                ! $attempt
                || $attempt->status !== 'dispatching'
                || $attempt->github_dispatch_token !== $dispatchToken
            ) {
                return;
            }

            $attempt->forceFill([
                'status' => 'processing',
                'github_dispatched_at' => now(),
                'failure_reason' => null,
            ])->save();
        });
    }

    private function markDispatchFailed(
        int $attemptId,
        string $dispatchToken,
    ): void {
        DB::transaction(function () use ($attemptId, $dispatchToken): void {
            $attempt = ExerciseAttempt::query()
                ->lockForUpdate()
                ->find($attemptId);

            if (
                ! $attempt
                || $attempt->status !== 'dispatching'
                || $attempt->github_dispatch_token !== $dispatchToken
            ) {
                return;
            }

            $this->markFailed(
                $attempt,
                'GitHub workflow dispatch failed.',
            );
        });
    }

    private function markFailed(
        ExerciseAttempt $attempt,
        string $reason,
    ): void {
        $attempt->forceFill([
            'status' => 'failed',
            'github_dispatch_token' => null,
            'github_dispatched_at' => null,
            'completed_at' => now(),
            'failure_reason' => $reason,
        ])->save();
    }
}