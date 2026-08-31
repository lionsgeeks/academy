<?php

use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Models\Topic;
use App\Models\User;
use App\Services\Exercises\BrowserExerciseCorrectionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createBrowserCorrectionExercise(
    array $checks,
    int $passingScore = 70,
): Exercise {
    $coach = User::query()->create([
        'name' => 'Browser Correction Coach',
        'email' => 'browser-correction-coach-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Browser Correction Course',
        'slug' => 'browser-correction-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Browser Correction Concept',
        'order_index' => 1,
    ]);

    $topic = Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Browser Correction Topic',
        'order_index' => 1,
    ]);

    return Exercise::query()->create([
        'topic_id' => $topic->id,
        'title' => 'Browser Correction Exercise',
        'description' => 'Build a semantic profile page.',
        'difficulty' => 'beginner',
        'xp_reward' => 50,
        'order_index' => 1,
        'correction_engine' => 'browser',
        'exercise_type' => 'html',
        'correction_rules' => [
            'checks' => $checks,
        ],
        'status' => 'published',
        'passing_score' => $passingScore,
        'published_at' => now(),
    ]);
}

function createBrowserCorrectionAttempt(
    Exercise $exercise,
    array $sourceCode,
): ExerciseAttempt {
    $student = User::query()->create([
        'name' => 'Browser Correction Student',
        'email' => 'browser-correction-student-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    return ExerciseAttempt::query()->create([
        'exercise_id' => $exercise->id,
        'user_id' => $student->id,
        'attempt_number' => 1,
        'status' => 'queued',
        'source_type' => 'browser_code',
        'source_code' => $sourceCode,
        'submitted_at' => now(),
    ]);
}

function browserCorrectionChecks(): array
{
    return [
        [
            'language' => 'html',
            'contains' => '<main',
            'points' => 50,
            'message' => 'Add a semantic main element.',
        ],
        [
            'language' => 'html',
            'contains' => '<h1',
            'points' => 30,
            'message' => 'Add a main heading.',
        ],
        [
            'language' => 'html',
            'contains' => '<section',
            'points' => 20,
            'message' => 'Add a semantic section.',
        ],
    ];
}

it('completes a browser attempt with a passing score when all checks pass', function () {
    $exercise = createBrowserCorrectionExercise(
        browserCorrectionChecks(),
        70,
    );

    $attempt = createBrowserCorrectionAttempt(
        $exercise,
        [
            'html' => '<main><h1>Profile</h1><section>About</section></main>',
        ],
    );

    $correctedAttempt = app(BrowserExerciseCorrectionService::class)
        ->correct($attempt);

    expect($correctedAttempt->status)->toBe('completed')
        ->and($correctedAttempt->score)->toBe(100)
        ->and($correctedAttempt->passed)->toBeTrue()
        ->and($correctedAttempt->started_at)->not->toBeNull()
        ->and($correctedAttempt->completed_at)->not->toBeNull()
        ->and($correctedAttempt->failure_reason)->toBeNull()
        ->and($correctedAttempt->feedback['earned_points'])->toBe(100)
        ->and($correctedAttempt->feedback['total_points'])->toBe(100)
        ->and($correctedAttempt->feedback['checks'][0]['passed'])->toBeTrue()
        ->and($correctedAttempt->feedback['checks'][1]['passed'])->toBeTrue()
        ->and($correctedAttempt->feedback['checks'][2]['passed'])->toBeTrue();
});

it('stores a partial score and fails when the passing score is not reached', function () {
    $exercise = createBrowserCorrectionExercise(
        browserCorrectionChecks(),
        70,
    );

    $attempt = createBrowserCorrectionAttempt(
        $exercise,
        [
            'html' => '<main>Only main exists</main>',
        ],
    );

    $correctedAttempt = app(BrowserExerciseCorrectionService::class)
        ->correct($attempt);

    expect($correctedAttempt->status)->toBe('completed')
        ->and($correctedAttempt->score)->toBe(50)
        ->and($correctedAttempt->passed)->toBeFalse()
        ->and($correctedAttempt->feedback['earned_points'])->toBe(50)
        ->and($correctedAttempt->feedback['total_points'])->toBe(100)
        ->and($correctedAttempt->feedback['checks'][0]['passed'])->toBeTrue()
        ->and($correctedAttempt->feedback['checks'][1]['passed'])->toBeFalse()
        ->and($correctedAttempt->feedback['checks'][2]['passed'])->toBeFalse();
});

it('stores score zero and fails when no browser checks pass', function () {
    $exercise = createBrowserCorrectionExercise(
        browserCorrectionChecks(),
        70,
    );

    $attempt = createBrowserCorrectionAttempt(
        $exercise,
        [
            'html' => '<div>Nothing required is here</div>',
        ],
    );

    $correctedAttempt = app(BrowserExerciseCorrectionService::class)
        ->correct($attempt);

    expect($correctedAttempt->status)->toBe('completed')
        ->and($correctedAttempt->score)->toBe(0)
        ->and($correctedAttempt->passed)->toBeFalse()
        ->and($correctedAttempt->feedback['earned_points'])->toBe(0)
        ->and($correctedAttempt->feedback['total_points'])->toBe(100);

    expect(
        collect($correctedAttempt->feedback['checks'])
            ->every(fn (array $check) => $check['passed'] === false),
    )->toBeTrue();
});