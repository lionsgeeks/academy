<?php

namespace App\Services\Exercises;

use App\Models\ExerciseAttempt;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GithubWorkflowDispatcher
{
    public function dispatch(ExerciseAttempt $attempt): void
    {
        $exercise = $attempt->relationLoaded('exercise')
            ? $attempt->exercise
            : $attempt->exercise()->first();

        if (! $exercise) {
            throw new RuntimeException('The exercise attempt has no exercise.');
        }

        $token = config('services.github.token');

        if (! is_string($token) || $token === '') {
            throw new RuntimeException(
                'GitHub Actions token is not configured.',
            );
        }

        if (
            ! is_string($exercise->github_repo_url)
            || ! is_string($exercise->github_runner_ref)
            || ! is_string($exercise->github_workflow)
            || ! is_string($exercise->github_test_suite)
        ) {
            throw new RuntimeException(
                'The GitHub exercise configuration is incomplete.',
            );
        }

        if (
            ! is_string($attempt->github_dispatch_token)
            || $attempt->github_dispatch_token === ''
        ) {
            throw new RuntimeException(
                'The GitHub attempt dispatch token is missing.',
            );
        }

        [$owner, $repository] = $this->repositoryCoordinates(
            $exercise->github_repo_url,
        );

        $apiUrl = rtrim(
            (string) config('services.github.api_url'),
            '/',
        );

        $response = Http::baseUrl($apiUrl)
            ->withToken($token)
            ->acceptJson()
            ->withHeaders([
                'X-GitHub-Api-Version' => '2022-11-28',
            ])
            ->connectTimeout(5)
            ->timeout(20)
            ->post(
                '/repos/'
                . rawurlencode($owner)
                . '/'
                . rawurlencode($repository)
                . '/actions/workflows/'
                . rawurlencode($exercise->github_workflow)
                . '/dispatches',
                [
                    'ref' => $exercise->github_runner_ref,
                    'inputs' => [
                        'attempt_token' => $attempt->github_dispatch_token,
                        'student_repository_url' => $attempt->repository_url,
                        'student_branch' => $attempt->branch,
                        'student_commit_sha' => $attempt->commit_sha ?? '',
                        'test_suite' => $exercise->github_test_suite,
                    ],
                ],
            );

        $response->throw();
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function repositoryCoordinates(string $repositoryUrl): array
    {
        $parts = parse_url($repositoryUrl);

        if (
            ! is_array($parts)
            || ($parts['scheme'] ?? null) !== 'https'
            || strtolower((string) ($parts['host'] ?? '')) !== 'github.com'
        ) {
            throw new RuntimeException(
                'The GitHub runner repository URL must use https://github.com.',
            );
        }

        $segments = array_values(array_filter(
            explode('/', trim((string) ($parts['path'] ?? ''), '/')),
        ));

        if (count($segments) !== 2) {
            throw new RuntimeException(
                'The GitHub runner repository URL must contain owner and repository.',
            );
        }

        [$owner, $repository] = $segments;

        $repository = preg_replace('/\.git$/i', '', $repository) ?? '';

        if (
            ! preg_match('/^[A-Za-z0-9_.-]+$/', $owner)
            || ! preg_match('/^[A-Za-z0-9_.-]+$/', $repository)
        ) {
            throw new RuntimeException(
                'The GitHub runner repository URL is invalid.',
            );
        }

        return [$owner, $repository];
    }
}