<?php

use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createExerciseAttemptFoundationUser(): User
{
    return User::query()->create([
        'name' => 'Exercise Attempt Student',
        'email' => 'exercise-attempt-student-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);
}

function createExerciseAttemptFoundationExercise(): Exercise
{
    $coach = User::query()->create([
        'name' => 'Exercise Attempt Coach',
        'email' => 'exercise-attempt-coach-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Exercise Attempt Course',
        'slug' => 'exercise-attempt-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Exercise Attempt Concept',
        'order_index' => 1,
    ]);

    $topic = Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Exercise Attempt Topic',
        'order_index' => 1,
    ]);

    return Exercise::query()->create([
        'topic_id' => $topic->id,
        'title' => 'Exercise Attempt Foundation',
        'description' => 'Create a semantic HTML page.',
        'difficulty' => 'beginner',
        'xp_reward' => 50,
        'order_index' => 1,
        'correction_engine' => 'browser',
        'exercise_type' => 'html',
        'correction_rules' => [
            'requiredFiles' => ['index.html'],
        ],
        'status' => 'published',
        'passing_score' => 70,
        'published_at' => now(),
    ]);
}

function createExerciseAttemptFoundationAttempt(
    User $student,
    Exercise $exercise,
    int $attemptNumber,
): ExerciseAttempt {
    return ExerciseAttempt::query()->create([
        'exercise_id' => $exercise->id,
        'user_id' => $student->id,
        'attempt_number' => $attemptNumber,
        'source_type' => 'browser_archive',
        'source_path' => "exercise-attempts/{$student->id}/attempt-{$attemptNumber}.zip",
        'submitted_at' => now(),
    ]);
}

it('stores a queued browser archive attempt with its user and exercise', function () {
    $student = createExerciseAttemptFoundationUser();
    $exercise = createExerciseAttemptFoundationExercise();

    $attempt = createExerciseAttemptFoundationAttempt(
        $student,
        $exercise,
        1,
    )->fresh();

    expect($attempt->status)->toBe('queued')
        ->and($attempt->score)->toBeNull()
        ->and($attempt->passed)->toBeNull()
        ->and($attempt->exercise->id)->toBe($exercise->id)
        ->and($attempt->user->id)->toBe($student->id);

    $this->assertDatabaseHas('exercise_attempts', [
        'id' => $attempt->id,
        'exercise_id' => $exercise->id,
        'user_id' => $student->id,
        'attempt_number' => 1,
        'status' => 'queued',
        'source_type' => 'browser_archive',
    ]);
});

it('allows sequential attempt numbers for the same user and exercise', function () {
    $student = createExerciseAttemptFoundationUser();
    $exercise = createExerciseAttemptFoundationExercise();

    createExerciseAttemptFoundationAttempt($student, $exercise, 1);
    createExerciseAttemptFoundationAttempt($student, $exercise, 2);

    expect(
        $student->exerciseAttempts()
            ->where('exercise_id', $exercise->id)
            ->orderBy('attempt_number')
            ->pluck('attempt_number')
            ->all(),
    )->toBe([1, 2]);

    expect(
        $exercise->attempts()
            ->where('user_id', $student->id)
            ->count(),
    )->toBe(2);
});

it('prevents duplicate attempt numbers for the same user and exercise', function () {
    $student = createExerciseAttemptFoundationUser();
    $exercise = createExerciseAttemptFoundationExercise();

    createExerciseAttemptFoundationAttempt($student, $exercise, 1);

    expect(function () use ($student, $exercise): void {
        createExerciseAttemptFoundationAttempt($student, $exercise, 1);
    })->toThrow(QueryException::class);
});