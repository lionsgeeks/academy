<?php

namespace App\Console\Commands;

use App\Models\ExerciseAttempt;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SimulateGithubCallback extends Command
{
    protected $signature = 'test:github-callback {attemptId} {--score=85} {--passed=1}';

    protected $description = 'Simulate a GitHub Actions callback for testing';

    public function handle(): int
    {
        $attemptId = (int) $this->argument('attemptId');
        $score = (int) $this->option('score');
        $passed = (bool) $this->option('passed');

        $attempt = ExerciseAttempt::find($attemptId);

        if (! $attempt) {
            $this->error("Attempt $attemptId not found");
            return 1;
        }

        if ($attempt->status !== 'processing') {
            $this->error("Attempt is not in processing status (current: {$attempt->status})");
            return 1;
        }

        $token = $attempt->github_dispatch_token;

        if (! $token) {
            $this->error('Attempt has no dispatch token');
            return 1;
        }

        $this->info("Simulating GitHub Actions callback for attempt $attemptId");
        $this->line("Token: $token");
        $this->line("Score: $score");
        $this->line("Passed: " . ($passed ? 'Yes' : 'No'));

        // Build payload
        $payload = [
            'attempt_token' => $token,
            'status' => 'completed',
            'score' => $score,
            'passed' => $passed,
            'feedback' => [
                'earned_points' => $score,
                'total_points' => 100,
                'checks' => [
                    [
                        'language' => 'php',
                        'points' => $score,
                        'passed' => $passed,
                        'message' => $passed
                            ? 'All tests passed'
                            : 'Some tests failed',
                    ],
                ],
            ],
        ];

        $rawBody = json_encode($payload);

        // Create signature
        $secret = config('services.github.callback_secret');
        $signature = 'sha256=' . hash_hmac('sha256', $rawBody, $secret);

        $this->line('');
        $this->info('Sending callback...');

        // Send callback
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Academy-Signature' => $signature,
        ])->post(
            url('/api/exercises/github-callback'),
            $payload,
        );

        $this->line('');
        $this->line('Response Status: ' . $response->status());

        if ($response->status() === 204 || $response->ok()) {
            $this->info('✓ Callback sent successfully!');
        } else {
            $this->error('✗ Callback failed');
            $this->line('Response: ' . $response->body());
            return 1;
        }

        // Refresh attempt
        $attempt->refresh();

        $this->line('');
        $this->info('Updated Attempt Details:');
        $this->line('Status: ' . $attempt->status);
        $this->line('Score: ' . $attempt->score);
        $this->line('Passed: ' . ($attempt->passed ? 'Yes' : 'No'));
        $this->line('Completed At: ' . $attempt->completed_at);

        if ($attempt->feedback) {
            $this->line('');
            $this->info('Feedback:');
            $this->line(json_encode($attempt->feedback, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }

        return 0;
    }
}
