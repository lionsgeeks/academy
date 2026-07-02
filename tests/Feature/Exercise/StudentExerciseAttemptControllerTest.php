<?php

use App\Models\Classes;
use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\ExerciseAttempt;
use App\Models\Role;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use App\Jobs\DispatchGithubExerciseAttempt;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

function studentAttemptRole(string $role): Role
{
    return Role::query()
        ->where('role', $role)
        ->first()
        ?? Role::forceCreate([
            'role' => $role,
        ]);
}

function createStudentAttemptUser(string $role = 'student'): User
{
    $user = User::query()->create([
        'name' => "Student Attempt {$role}",
        'email' => 'student-attempt-'
            . $role
            . '-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $user->Roles()->attach(studentAttemptRole($role)->id);

    return $user;
}

function createStudentAttemptClass(int $classNumber): Classes
{
    return Classes::query()->create([
        'central_id' => random_int(100000, 999999),
        'name' => "Promo 6 - Coding {$classNumber}",
        'promo' => 6,
        'type' => 'coding',
        'class' => $classNumber,
        'start_time' => today()->subMonth()->toDateString(),
        'end_time' => today()->addMonth()->toDateString(),
    ]);
}

function assignStudentAttemptUserToClass(
    User $student,
    Classes $class,
): void {
    $student->classes()->syncWithoutDetaching([
        $class->id => [
            'role_id' => studentAttemptRole('student')->id,
        ],
    ]);
}

function createStudentAttemptTopic(): Topic
{
    $coach = User::query()->create([
        'name' => 'Student Attempt Coach',
        'email' => 'student-attempt-coach-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Student Attempt Course',
        'slug' => 'student-attempt-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Student Attempt Concept',
        'order_index' => 1,
    ]);

    return Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Student Attempt Topic',
        'order_index' => 1,
    ]);
}

function createStudentAttemptExercise(
    Topic $topic,
    int $orderIndex = 1,
    string $engine = 'browser',
    string $exerciseType = 'html',
): Exercise {
    return Exercise::query()->create([
        'topic_id' => $topic->id,
        'title' => "Student Attempt Exercise {$orderIndex}",
        'description' => 'Build a semantic HTML page.',
        'difficulty' => 'beginner',
        'xp_reward' => 50,
        'order_index' => $orderIndex,
        'correction_engine' => $engine,
        'exercise_type' => $engine === 'github_actions'
            ? 'laravel'
            : $exerciseType,
        'correction_rules' => $engine === 'browser'
            ? [
                'checks' => [
                    [
                        'language' => 'html',
                        'contains' => '<main',
                        'points' => 50,
                        'message' => 'Add a semantic main element.',
                    ],
                    [
                        'language' => 'html',
                        'contains' => '<h1',
                        'points' => 50,
                        'message' => 'Add a main heading.',
                    ],
                ],
            ]
            : null,
        'status' => 'published',
        'passing_score' => 70,
        'published_at' => now(),
    ]);
}

function makeStudentAttemptExerciseVisibleTo(
    Exercise $exercise,
    User $student,
    int $classNumber = 1,
): void {
    $class = createStudentAttemptClass($classNumber);

    assignStudentAttemptUserToClass($student, $class);

    $exercise->classes()->attach($class->id);
}

function createStudentAttemptHistoryRecord(
    User $student,
    Exercise $exercise,
    int $attemptNumber,
    array $overrides = [],
): ExerciseAttempt {
    return ExerciseAttempt::query()->create(array_merge([
        'exercise_id' => $exercise->id,
        'user_id' => $student->id,
        'attempt_number' => $attemptNumber,
        'status' => 'completed',
        'source_type' => 'browser_code',
        'source_code' => [
            'html' => "<main><h1>Attempt {$attemptNumber}</h1></main>",
        ],
        'score' => 100,
        'passed' => true,
        'feedback' => [
            'earned_points' => 100,
            'total_points' => 100,
            'checks' => [
                [
                    'language' => 'html',
                    'contains' => '<main',
                    'points' => 100,
                    'passed' => true,
                    'message' => 'Main element found.',
                ],
            ],
        ],
        'submitted_at' => now(),
        'started_at' => now(),
        'completed_at' => now(),
    ], $overrides));
}

it('creates and corrects a browser code attempt for a visible exercise', function () {
    $student = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    makeStudentAttemptExerciseVisibleTo($exercise, $student);

    $response = $this
        ->actingAs($student)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'source_code' => [
                    'html' => '<main><h1>Hello Academy</h1></main>',
                ],
            ],
        );

    $response
        ->assertCreated()
        ->assertJsonPath('data.exercise_id', $exercise->id)
        ->assertJsonPath('data.attempt_number', 1)
        ->assertJsonPath('data.status', 'completed')
        ->assertJsonPath('data.source_type', 'browser_code')
        ->assertJsonPath('data.score', 100)
        ->assertJsonPath('data.passed', true)
        ->assertJsonPath('data.feedback.earned_points', 100)
        ->assertJsonPath('data.feedback.total_points', 100);

    $attempt = ExerciseAttempt::query()->firstOrFail();
    expect($attempt->status)->toBe('completed')
        ->and($attempt->score)->toBe(100)
        ->and($attempt->passed)->toBeTrue()
        ->and($attempt->source_code)->toBe([
            'html' => '<main><h1>Hello Academy</h1></main>',
        ])
        ->and($attempt->repository_url)->toBeNull()
        ->and($attempt->branch)->toBeNull()
        ->and($attempt->source_path)->toBeNull();

    expect($attempt->source_code)->toBe([
        'html' => '<main><h1>Hello Academy</h1></main>',
    ])
        ->and($attempt->repository_url)->toBeNull()
        ->and($attempt->branch)->toBeNull()
        ->and($attempt->source_path)->toBeNull();
});

it('rejects browser source data that is missing required code', function () {
    $student = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    makeStudentAttemptExerciseVisibleTo($exercise, $student);

    $this
        ->actingAs($student)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'repository_url' => 'https://github.com/example/wrong-source',
                'branch' => 'main',
            ],
        )
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'source_code.html',
            'repository_url',
        ]);

    expect(ExerciseAttempt::query()->count())->toBe(0);
});

it('creates a queued GitHub repository attempt for a visible GitHub exercise', function () {
    Queue::fake();

    $student = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise(
        $topic,
        1,
        'github_actions',
    );

    makeStudentAttemptExerciseVisibleTo($exercise, $student);

    $response = $this
        ->actingAs($student)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'repository_url' => 'https://github.com/example/student-project',
                'branch' => 'student-1-laravel-posts-crud',
                'commit_sha' => 'abc123',
            ],
        );

    $response
        ->assertCreated()
        ->assertJsonPath('data.exercise_id', $exercise->id)
        ->assertJsonPath('data.attempt_number', 1)
        ->assertJsonPath('data.status', 'queued')
        ->assertJsonPath('data.source_type', 'github_repository')
        ->assertJsonPath(
            'data.repository_url',
            'https://github.com/example/student-project',
        )
        ->assertJsonPath(
            'data.branch',
            'student-1-laravel-posts-crud',
        );

    $this->assertDatabaseHas('exercise_attempts', [
        'exercise_id' => $exercise->id,
        'user_id' => $student->id,
        'attempt_number' => 1,
        'source_type' => 'github_repository',
        'repository_url' => 'https://github.com/example/student-project',
        'branch' => 'student-1-laravel-posts-crud',
        'commit_sha' => 'abc123',
    ]);

    $attempt = ExerciseAttempt::query()->firstOrFail();

    Queue::assertPushedOn(
        'github-exercises',
        DispatchGithubExerciseAttempt::class,
        function (DispatchGithubExerciseAttempt $job) use ($attempt): bool {
            return $job->attemptId === $attempt->id;
        },
    );
});


it('creates sequential attempt numbers for the same student exercise', function () {
    $student = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    makeStudentAttemptExerciseVisibleTo($exercise, $student);

    $this
        ->actingAs($student)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'source_code' => [
                    'html' => '<h1>First attempt</h1>',
                ],
            ],
        )
        ->assertCreated()
        ->assertJsonPath('data.attempt_number', 1);

    $this
        ->actingAs($student)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'source_code' => [
                    'html' => '<h1>Second attempt</h1>',
                ],
            ],
        )
        ->assertCreated()
        ->assertJsonPath('data.attempt_number', 2);

    expect(
        ExerciseAttempt::query()
            ->where('user_id', $student->id)
            ->where('exercise_id', $exercise->id)
            ->orderBy('attempt_number')
            ->pluck('attempt_number')
            ->all(),
    )->toBe([1, 2]);
});

it('rejects browser source code for a GitHub Actions exercise', function () {
    $student = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise(
        $topic,
        1,
        'github_actions',
    );

    makeStudentAttemptExerciseVisibleTo($exercise, $student);

    $this
        ->actingAs($student)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'source_code' => [
                    'html' => '<h1>This should not be accepted</h1>',
                ],
            ],
        )
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'source_code',
            'repository_url',
            'branch',
        ]);

    expect(ExerciseAttempt::query()->count())->toBe(0);
});

it('returns not found when the exercise is not visible to the student', function () {
    $student = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    $this
        ->actingAs($student)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'source_code' => [
                    'html' => '<h1>Not allowed</h1>',
                ],
            ],
        )
        ->assertNotFound();

    expect(ExerciseAttempt::query()->count())->toBe(0);
});

it('forbids a non-student from creating an attempt', function () {
    $coach = createStudentAttemptUser('coach');
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    $this
        ->actingAs($coach)
        ->postJson(
            route('student.exercises.attempts.store', $exercise),
            [
                'source_code' => [
                    'html' => '<h1>Coach cannot submit</h1>',
                ],
            ],
        )
        ->assertForbidden();

    expect(ExerciseAttempt::query()->count())->toBe(0);
});

it('returns only the current student attempts newest first', function () {
    $student = createStudentAttemptUser();
    $otherStudent = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    makeStudentAttemptExerciseVisibleTo($exercise, $student);

    createStudentAttemptHistoryRecord($student, $exercise, 1);

    createStudentAttemptHistoryRecord($student, $exercise, 2, [
        'score' => 50,
        'passed' => false,
        'feedback' => [
            'earned_points' => 50,
            'total_points' => 100,
            'checks' => [
                [
                    'language' => 'html',
                    'contains' => '<main',
                    'points' => 50,
                    'passed' => true,
                    'message' => 'Main element found.',
                ],
                [
                    'language' => 'html',
                    'contains' => '<h1',
                    'points' => 50,
                    'passed' => false,
                    'message' => 'Add a main heading.',
                ],
            ],
        ],
    ]);

    createStudentAttemptHistoryRecord($otherStudent, $exercise, 1);

    $response = $this
        ->actingAs($student)
        ->getJson(
            route('student.exercises.attempts.index', $exercise),
        );

    $response
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.attempt_number', 2)
        ->assertJsonPath('data.0.score', 50)
        ->assertJsonPath('data.0.passed', false)
        ->assertJsonPath('data.1.attempt_number', 1)
        ->assertJsonPath('data.1.score', 100)
        ->assertJsonPath('data.1.passed', true);

    $attempts = $response->json('data');

    expect($attempts[0])->not->toHaveKey('source_code')
        ->and($attempts[0]['feedback']['checks'][0])
        ->not->toHaveKey('contains')
        ->and($attempts[1])->not->toHaveKey('source_code');
});

it('returns not found for attempt history when the exercise is not visible', function () {
    $student = createStudentAttemptUser();
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    $this
        ->actingAs($student)
        ->getJson(
            route('student.exercises.attempts.index', $exercise),
        )
        ->assertNotFound();
});

it('forbids a non-student from reading attempt history', function () {
    $coach = createStudentAttemptUser('coach');
    $topic = createStudentAttemptTopic();

    $exercise = createStudentAttemptExercise($topic);

    $this
        ->actingAs($coach)
        ->getJson(
            route('student.exercises.attempts.index', $exercise),
        )
        ->assertForbidden();
});
