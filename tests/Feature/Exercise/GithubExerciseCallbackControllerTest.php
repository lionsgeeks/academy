<?php

use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    config()->set(
        'services.github.callback_secret',
        'test-callback-secret',
    );
});

function createGithubCallbackAttempt(
    array $attemptOverrides = [],
): ExerciseAttempt {
    $owner = User::query()->create([
        'name' => 'GitHub Callback Coach',
        'email' => 'github-callback-coach-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $owner->id,
        'title' => 'GitHub Callback Course',
        'slug' => 'github-callback-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'GitHub Callback Concept',
        'order_index' => 1,
    ]);

    $topic = Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'GitHub Callback Topic',
        'order_index' => 1,
    ]);

    $exercise = Exercise::query()->create([
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
    ]);

    $student = User::query()->create([
        'name' => 'GitHub Callback Student',
        'email' => 'github-callback-student-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    return ExerciseAttempt::query()->create(array_merge([
        'exercise_id' => $exercise->id,
        'user_id' => $student->id,
        'attempt_number' => 1,
        'status' => 'processing',
        'source_type' => 'github_repository',
        'repository_url' => 'https://github.com/student/laravel-posts-crud',
        'branch' => 'student-12-laravel-posts-crud',
        'commit_sha' => 'abc123',
        'github_dispatch_token' => '6f0136e9-ff33-45bc-9cb9-3d864f342f77',
        'github_dispatched_at' => now(),
        'started_at' => now(),
        'submitted_at' => now(),
    ], $attemptOverrides));
}

/**
 * @return array{0: string, 1: array<string, string>}
 */
function signedGithubCallbackRequest(
    array $payload,
    string $secret = 'test-callback-secret',
): array {
    $rawBody = json_encode($payload, JSON_THROW_ON_ERROR);

    return [
        $rawBody,
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_ACADEMY_SIGNATURE' => 'sha256='
                . hash_hmac('sha256', $rawBody, $secret),
        ],
    ];
}

it('completes a processing attempt from a valid signed callback', function () {
    $attempt = createGithubCallbackAttempt();

    $payload = [
        'attempt_token' => $attempt->github_dispatch_token,
        'status' => 'completed',
        'score' => 85,
        'passed' => true,
        'feedback' => [
            'earned_points' => 85,
            'total_points' => 100,
            'checks' => [
                [
                    'language' => 'php',
                    'points' => 85,
                    'passed' => true,
                    'message' => 'Core checks passed.',
                ],
            ],
        ],
    ];

    [$rawBody, $server] = signedGithubCallbackRequest($payload);

    $this
        ->call(
            'POST',
            route('api.exercises.github-callback'),
            [],
            [],
            [],
            $server,
            $rawBody,
        )
        ->assertNoContent();

    $attempt->refresh();

    expect($attempt->status)->toBe('completed')
        ->and($attempt->score)->toBe(85)
        ->and($attempt->passed)->toBeTrue()
        ->and($attempt->feedback)->toBe($payload['feedback'])
        ->and($attempt->failure_reason)->toBeNull()
        ->and($attempt->completed_at)->not->toBeNull()
        ->and($attempt->github_dispatch_token)->toBeNull()
        ->and($attempt->github_dispatched_at)->not->toBeNull();
});

it('fails a processing attempt from a valid signed callback', function () {
    $attempt = createGithubCallbackAttempt();

    $payload = [
        'attempt_token' => $attempt->github_dispatch_token,
        'status' => 'failed',
        'failure_reason' => 'Evaluation could not be completed.',
    ];

    [$rawBody, $server] = signedGithubCallbackRequest($payload);

    $this
        ->call(
            'POST',
            route('api.exercises.github-callback'),
            [],
            [],
            [],
            $server,
            $rawBody,
        )
        ->assertNoContent();

    $attempt->refresh();

    expect($attempt->status)->toBe('failed')
        ->and($attempt->score)->toBeNull()
        ->and($attempt->passed)->toBeNull()
        ->and($attempt->feedback)->toBeNull()
        ->and($attempt->failure_reason)
        ->toBe('Evaluation could not be completed.')
        ->and($attempt->completed_at)->not->toBeNull()
        ->and($attempt->github_dispatch_token)->toBeNull()
        ->and($attempt->github_dispatched_at)->not->toBeNull();
});

it('rejects a callback with an invalid signature', function () {
    $attempt = createGithubCallbackAttempt();

    $payload = [
        'attempt_token' => $attempt->github_dispatch_token,
        'status' => 'completed',
        'score' => 100,
        'passed' => true,
    ];

    $rawBody = json_encode($payload, JSON_THROW_ON_ERROR);

    $this
        ->call(
            'POST',
            route('api.exercises.github-callback'),
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X_ACADEMY_SIGNATURE' => 'sha256=invalid',
            ],
            $rawBody,
        )
        ->assertUnauthorized();

    $attempt->refresh();

    expect($attempt->status)->toBe('processing')
        ->and($attempt->github_dispatch_token)
        ->toBe('6f0136e9-ff33-45bc-9cb9-3d864f342f77')
        ->and($attempt->completed_at)->toBeNull();
});

it('rejects a replay after the callback token was consumed', function () {
    $attempt = createGithubCallbackAttempt();

    $payload = [
        'attempt_token' => $attempt->github_dispatch_token,
        'status' => 'completed',
        'score' => 100,
        'passed' => true,
    ];

    [$rawBody, $server] = signedGithubCallbackRequest($payload);

    $this
        ->call(
            'POST',
            route('api.exercises.github-callback'),
            [],
            [],
            [],
            $server,
            $rawBody,
        )
        ->assertNoContent();

    $this
        ->call(
            'POST',
            route('api.exercises.github-callback'),
            [],
            [],
            [],
            $server,
            $rawBody,
        )
        ->assertNotFound();

    $attempt->refresh();

    expect($attempt->status)->toBe('completed')
        ->and($attempt->score)->toBe(100)
        ->and($attempt->github_dispatch_token)->toBeNull();
});