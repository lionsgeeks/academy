<?php

use App\Jobs\DispatchGithubExerciseAttempt;
use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Models\Topic;
use App\Models\User;
use App\Services\Exercises\GithubWorkflowDispatcher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createGithubDispatchExercise(
    array $overrides = [],
): Exercise {
    $owner = User::query()->create([
        'name' => 'GitHub Dispatch Coach',
        'email' => 'github-dispatch-coach-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $owner->id,
        'title' => 'GitHub Dispatch Course',
        'slug' => 'github-dispatch-course-' . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'GitHub Dispatch Concept',
        'order_index' => 1,
    ]);

    $topic = Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'GitHub Dispatch Topic',
        'order_index' => 1,
    ]);

    return Exercise::query()->create(array_merge([
        'topic_id' => $topic->id,
        'title' => 'Laravel Posts CRUD',
        'description' => 'Build the required Laravel CRUD project.',
        'difficulty' => 'intermediate',
        'xp_reward' => 100,
        'order_index' => 1,
        'correction_engine' => 'github_actions',
        'correction_rules' => null,
        'github_repo_url' => 'https://github.com/academy/laravel-posts-crud',
        'github_runner_ref' => 'main',
        'github_workflow' => 'evaluate-laravel.yml',
        'github_test_suite' => 'laravel-posts-crud',
        'github_branch_prefix' => 'student-',
        'exercise_type' => 'laravel',
        'status' => 'published',
        'passing_score' => 70,
        'published_at' => now(),
    ], $overrides));
}

function createGithubDispatchAttempt(
    Exercise $exercise,
    array $overrides = [],
): ExerciseAttempt {
    $student = User::query()->create([
        'name' => 'GitHub Dispatch Student',
        'email' => 'github-dispatch-student-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    return ExerciseAttempt::query()->create(array_merge([
        'exercise_id' => $exercise->id,
        'user_id' => $student->id,
        'attempt_number' => 1,
        'status' => 'queued',
        'source_type' => 'github_repository',
        'repository_url' => 'https://github.com/student/laravel-posts-crud',
        'branch' => 'student-12-laravel-posts-crud',
        'commit_sha' => 'abc123',
        'submitted_at' => now(),
    ], $overrides));
}

it('dispatches a queued GitHub attempt and marks it processing', function () {
    $exercise = createGithubDispatchExercise();
    $attempt = createGithubDispatchAttempt($exercise);

    $dispatcher = \Mockery::mock(GithubWorkflowDispatcher::class);

    $dispatcher
        ->shouldReceive('dispatch')
        ->once()
        ->withArgs(function (ExerciseAttempt $dispatchedAttempt) use ($attempt): bool {
            return $dispatchedAttempt->is($attempt)
                && $dispatchedAttempt->status === 'dispatching'
                && is_string($dispatchedAttempt->github_dispatch_token)
                && Str::isUuid($dispatchedAttempt->github_dispatch_token);
        });

    (new DispatchGithubExerciseAttempt($attempt->id))
        ->handle($dispatcher);

    $attempt->refresh();

    $token = $attempt->github_dispatch_token;

    expect($attempt->status)->toBe('processing')
        ->and($token)->toBeString()
        ->and(Str::isUuid($token))->toBeTrue()
        ->and($attempt->started_at)->not->toBeNull()
        ->and($attempt->github_dispatched_at)->not->toBeNull()
        ->and($attempt->failure_reason)->toBeNull();
});

it('fails an attempt whose branch does not match the required prefix', function () {
    $exercise = createGithubDispatchExercise([
        'github_branch_prefix' => 'student-',
    ]);

    $attempt = createGithubDispatchAttempt($exercise, [
        'branch' => 'feature/unfinished-work',
    ]);

    $dispatcher = \Mockery::mock(GithubWorkflowDispatcher::class);
    $dispatcher->shouldReceive('dispatch')->never();

    (new DispatchGithubExerciseAttempt($attempt->id))
        ->handle($dispatcher);

    $attempt->refresh();

    expect($attempt->status)->toBe('failed')
        ->and($attempt->github_dispatch_token)->toBeNull()
        ->and($attempt->github_dispatched_at)->toBeNull()
        ->and($attempt->completed_at)->not->toBeNull()
        ->and($attempt->failure_reason)
        ->toBe('The submitted branch does not match the required prefix.');
});

it('does nothing when the attempt is no longer queued', function () {
    $exercise = createGithubDispatchExercise();

    $attempt = createGithubDispatchAttempt($exercise, [
        'status' => 'completed',
        'score' => 100,
        'passed' => true,
        'completed_at' => now(),
    ]);

    $dispatcher = \Mockery::mock(GithubWorkflowDispatcher::class);
    $dispatcher->shouldReceive('dispatch')->never();

    (new DispatchGithubExerciseAttempt($attempt->id))
        ->handle($dispatcher);

    $attempt->refresh();

    expect($attempt->status)->toBe('completed')
        ->and($attempt->github_dispatch_token)->toBeNull()
        ->and($attempt->github_dispatched_at)->toBeNull();
});

it('fails an attempt when GitHub workflow dispatch throws an exception', function () {
    $exercise = createGithubDispatchExercise();
    $attempt = createGithubDispatchAttempt($exercise);

    $dispatcher = \Mockery::mock(GithubWorkflowDispatcher::class);

    $dispatcher
        ->shouldReceive('dispatch')
        ->once()
        ->andThrow(new \RuntimeException('GitHub returned a private error.'));

    (new DispatchGithubExerciseAttempt($attempt->id))
        ->handle($dispatcher);

    $attempt->refresh();

    expect($attempt->status)->toBe('failed')
        ->and($attempt->github_dispatch_token)->toBeNull()
        ->and($attempt->github_dispatched_at)->toBeNull()
        ->and($attempt->completed_at)->not->toBeNull()
        ->and($attempt->failure_reason)
        ->toBe('GitHub workflow dispatch failed.');
});