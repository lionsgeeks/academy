<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Models\User;
use App\Services\Exercises\StudentExerciseAttemptService;
use App\Services\Exercises\StudentExerciseVisibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentExerciseAttemptController extends Controller
{
    public function store(
        Request $request,
        Exercise $exercise,
        StudentExerciseVisibilityService $exerciseVisibility,
        StudentExerciseAttemptService $attemptService,
    ): JsonResponse {
        $student = $this->ensureStudent($request);

        $visibleExercise = $exerciseVisibility
            ->visibleExerciseFor($student, $exercise);

        abort_unless($visibleExercise, 404);

        $validator = Validator::make($request->all(), [
            'source_code' => [
                'nullable',
                'array',
            ],
            'source_code.html' => [
                'nullable',
                'string',
                'max:262144',
            ],
            'source_code.css' => [
                'nullable',
                'string',
                'max:262144',
            ],
            'source_code.javascript' => [
                'nullable',
                'string',
                'max:262144',
            ],
            'repository_url' => [
                'nullable',
                'string',
                'max:2048',
                'url',
            ],
            'branch' => [
                'nullable',
                'string',
                'max:255',
            ],
            'commit_sha' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        $validator->after(function ($validator) use (
            $request,
            $visibleExercise,
        ): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            if ($visibleExercise->correction_engine === 'browser') {
                $this->validateBrowserSourceCode(
                    $validator,
                    $request,
                    $visibleExercise,
                );

                if (
                    $request->filled('repository_url')
                    || $request->filled('branch')
                    || $request->filled('commit_sha')
                ) {
                    $validator->errors()->add(
                        'repository_url',
                        'Browser exercises do not accept repository data.',
                    );
                }

                return;
            }

            if ($visibleExercise->correction_engine === 'github_actions') {
                if ($request->exists('source_code')) {
                    $validator->errors()->add(
                        'source_code',
                        'GitHub Actions exercises do not accept browser source code.',
                    );
                }

                if (! $request->filled('repository_url')) {
                    $validator->errors()->add(
                        'repository_url',
                        'A repository URL is required for a GitHub Actions exercise.',
                    );
                }

                if (! $request->filled('branch')) {
                    $validator->errors()->add(
                        'branch',
                        'A branch is required for a GitHub Actions exercise.',
                    );
                }

                return;
            }

            $validator->errors()->add(
                'source',
                'This exercise does not have a supported correction engine.',
            );
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $attempt = $attemptService->createFor(
            $student,
            $visibleExercise,
            $validator->validated(),
        );

        return response()->json([
            'data' => $this->attemptPayload($attempt),
        ], 201);
    }

    private function ensureStudent(Request $request): User
    {
        $student = $request->user();

        abort_unless(
            $student
            && $student->Roles()
                ->where('role', 'student')
                ->exists(),
            403,
        );

        return $student;
    }

    private function validateBrowserSourceCode(
        $validator,
        Request $request,
        Exercise $exercise,
    ): void {
        $requiredLanguages = match ($exercise->exercise_type) {
            'html' => ['html'],
            'css' => ['css'],
            'javascript' => ['javascript'],
            'html_css_javascript' => ['html', 'css', 'javascript'],
            default => [],
        };

        $sourceCode = $request->input('source_code', []);

        foreach ($requiredLanguages as $language) {
            $value = is_array($sourceCode)
                ? ($sourceCode[$language] ?? null)
                : null;

            if (! is_string($value) || trim($value) === '') {
                $validator->errors()->add(
                    "source_code.{$language}",
                    "The {$language} source code is required for this exercise.",
                );
            }
        }
    }

    private function attemptPayload(ExerciseAttempt $attempt): array
    {
        return [
            'id' => $attempt->id,
            'exercise_id' => $attempt->exercise_id,
            'attempt_number' => $attempt->attempt_number,
            'status' => $attempt->status,
            'source_type' => $attempt->source_type,
            'repository_url' => $attempt->repository_url,
            'branch' => $attempt->branch,
            'commit_sha' => $attempt->commit_sha,
            'submitted_at' => $attempt->submitted_at?->toISOString(),
        ];
    }
}