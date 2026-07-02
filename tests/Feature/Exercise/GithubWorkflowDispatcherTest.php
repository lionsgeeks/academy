<?php

use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Services\Exercises\GithubWorkflowDispatcher;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;


beforeEach(function () {
    config()->set('services.github.token', 'test-token');
    config()->set('services.github.api_url', 'https://api.github.com');
});

function githubDispatcherAttempt(
    array $exerciseOverrides = [],
    array $attemptOverrides = [],
): ExerciseAttempt {
    $exercise = new Exercise(array_merge([
        'correction_engine' => 'github_actions',
        'github_repo_url' => 'https://github.com/academy/laravel-posts-crud',
        'github_runner_ref' => 'main',
        'github_workflow' => 'evaluate-laravel.yml',
        'github_test_suite' => 'laravel-posts-crud',
    ], $exerciseOverrides));

    $attempt = new ExerciseAttempt(array_merge([
        'source_type' => 'github_repository',
        'repository_url' => 'https://github.com/student/laravel-posts-crud',
        'branch' => 'student-12-laravel-posts-crud',
        'commit_sha' => 'abc123',
        'github_dispatch_token' => '6f0136e9-ff33-45bc-9cb9-3d864f342f77',
    ], $attemptOverrides));

    $attempt->setRelation('exercise', $exercise);

    return $attempt;
}

it('dispatches the trusted GitHub workflow with attempt inputs', function () {
    Http::fake([
        'https://api.github.com/*' => Http::response([], 204),
    ]);

    $attempt = githubDispatcherAttempt();

    app(GithubWorkflowDispatcher::class)->dispatch($attempt);

    Http::assertSent(function (Request $request): bool {
        $data = $request->data();

        return $request->method() === 'POST'
            && $request->url() === 'https://api.github.com/repos/academy/laravel-posts-crud/actions/workflows/evaluate-laravel.yml/dispatches'
            && ($request->header('Authorization')[0] ?? null) === 'Bearer test-token'
            && ($request->header('X-GitHub-Api-Version')[0] ?? null) === '2022-11-28'
            && ($data['ref'] ?? null) === 'main'
            && ($data['inputs'] ?? null) === [
                'attempt_token' => '6f0136e9-ff33-45bc-9cb9-3d864f342f77',
                'student_repository_url' => 'https://github.com/student/laravel-posts-crud',
                'student_branch' => 'student-12-laravel-posts-crud',
                'student_commit_sha' => 'abc123',
                'test_suite' => 'laravel-posts-crud',
            ];
    });

    Http::assertSentCount(1);
});

it('rejects an untrusted runner repository URL before dispatching', function () {
    Http::fake();

    $attempt = githubDispatcherAttempt([
        'github_repo_url' => 'https://gitlab.com/academy/laravel-posts-crud',
    ]);

    expect(fn() => app(GithubWorkflowDispatcher::class)->dispatch($attempt))
        ->toThrow(
            RuntimeException::class,
            'The GitHub runner repository URL must use https://github.com.',
        );

    Http::assertNothingSent();
});

it('does not call GitHub when the actions token is missing', function () {
    config()->set('services.github.token', null);

    Http::fake();

    $attempt = githubDispatcherAttempt();

    expect(fn() => app(GithubWorkflowDispatcher::class)->dispatch($attempt))
        ->toThrow(
            RuntimeException::class,
            'GitHub Actions token is not configured.',
        );

    Http::assertNothingSent();
});
