<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExerciseAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GithubExerciseCallbackController extends Controller
{
    public function store(Request $request)
    {
        Log::info('GitHub callback received', [
            'path' => $request->path(),
            'headers' => [
                'x-academy-signature' => $request->header('X-Academy-Signature'),
            ],
            'body' => $request->all(),
        ]);

        $this->ensureValidSignature($request);

        $data = $request->validate([
            'attempt_token' => [
                'required',
                'uuid',
            ],
            'status' => [
                'required',
                'string',
                'in:completed,failed,passed',
            ],
            'score' => [
                'nullable',
                'integer',
                'min:0',
                'max:100',
                'required_if:status,completed',
                'required_if:status,passed',
            ],
            'passed' => [
                'nullable',
                'boolean',
                'required_if:status,completed',
            ],
            'feedback' => [
                'nullable',
                'array',
            ],
            'feedback.earned_points' => [
                'nullable',
                'integer',
                'min:0',
            ],
            'feedback.total_points' => [
                'nullable',
                'integer',
                'min:0',
            ],
            'feedback.checks' => [
                'nullable',
                'array',
            ],
            'feedback.checks.*' => [
                'array',
            ],
            'feedback.checks.*.language' => [
                'nullable',
                'string',
                'max:50',
            ],
            'feedback.checks.*.points' => [
                'nullable',
                'integer',
                'min:0',
            ],
            'feedback.checks.*.passed' => [
                'nullable',
                'boolean',
            ],
            'feedback.checks.*.message' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'failure_reason' => [
                'nullable',
                'string',
                'max:1000',
                'required_if:status,failed',
            ],
        ]);

        DB::transaction(function () use ($data): void {
            $attempt = ExerciseAttempt::query()
                ->where(
                    'github_dispatch_token',
                    $data['attempt_token'],
                )
                ->lockForUpdate()
                ->first();

            abort_unless(
                $attempt && $attempt->status === 'processing',
                404,
            );

            if ($data['status'] === 'failed') {
                $attempt->forceFill([
                    'status' => 'failed',
                    'score' => null,
                    'passed' => null,
                    'feedback' => null,
                    'failure_reason' => $data['failure_reason'],
                    'completed_at' => now(),
                    'github_dispatch_token' => null,
                ])->save();

                return;
            }

            $attempt->forceFill([
                'status' => 'completed',
                'score' => $data['score'],
                'passed' => $data['status'] === 'passed' ? true : $data['passed'],
                'feedback' => $this->safeFeedback($data),
                'failure_reason' => null,
                'completed_at' => now(),
                'github_dispatch_token' => null,
            ])->save();
        });

        return response()->noContent();
    }

    private function ensureValidSignature(Request $request): void
    {
        $secret = config('services.github.callback_secret');

        $signature = $request->header('X-Academy-Signature');

        if (
            ! is_string($secret)
            || $secret === ''
            || ! is_string($signature)
            || $signature === ''
        ) {
            abort(401);
        }

        $expectedSignature = 'sha256=' . hash_hmac(
            'sha256',
            $request->getContent(),
            $secret,
        );

        abort_unless(
            hash_equals($expectedSignature, $signature),
            401,
        );
    }

    private function safeFeedback(array $data): ?array
    {
        $feedback = $data['feedback'] ?? null;

        if (! is_array($feedback)) {
            return null;
        }

        $checks = [];

        foreach ($feedback['checks'] ?? [] as $check) {
            if (! is_array($check)) {
                continue;
            }

            $checks[] = [
                'language' => $check['language'] ?? null,
                'points' => $check['points'] ?? null,
                'passed' => $check['passed'] ?? false,
                'message' => $check['message'] ?? null,
            ];
        }

        return [
            'earned_points' => $feedback['earned_points'] ?? 0,
            'total_points' => $feedback['total_points'] ?? 0,
            'checks' => $checks,
        ];
    }
}