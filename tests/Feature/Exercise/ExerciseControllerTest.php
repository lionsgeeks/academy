<?php

use App\Models\Classes;
use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\Role;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function exerciseControllerRole(string $role): Role
{
    return Role::query()
        ->where('role', $role)
        ->first()
        ?? Role::forceCreate([
            'role' => $role,
        ]);
}

function createExerciseControllerUser(string $role = 'coach'): User
{
    $user = User::query()->create([
        'name' => "Exercise Controller {$role}",
        'email' => 'exercise-controller-'
            . $role
            . '-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $user->Roles()->attach(exerciseControllerRole($role)->id);

    return $user;
}

function createExerciseControllerCoach(): User
{
    return createExerciseControllerUser('coach');
}

function createExerciseControllerTopic(User $coach): Topic
{
    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Exercise Controller Course',
        'slug' => 'exercise-controller-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Exercise Controller Concept',
        'order_index' => 1,
    ]);

    return Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Exercise Controller Topic',
        'order_index' => 1,
    ]);
}

function createExerciseControllerClass(
    int $promo = 6,
    string $type = 'coding',
    int $classNumber = 1,
    ?string $startTime = null,
    ?string $endTime = null,
): Classes {
    return Classes::query()->create([
        'central_id' => random_int(100000, 999999),
        'name' => "Promo {$promo} - {$type} {$classNumber}",
        'promo' => $promo,
        'type' => $type,
        'class' => $classNumber,
        'start_time' => $startTime ?? today()->subMonth()->toDateString(),
        'end_time' => $endTime ?? today()->addMonth()->toDateString(),
    ]);
}

function assignExerciseControllerCoachToClass(
    User $coach,
    Classes $class,
): void {
    $coach->classes()->syncWithoutDetaching([
        $class->id => [
            'role_id' => exerciseControllerRole('coach')->id,
        ],
    ]);
}

function validExercisePayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Build a semantic HTML profile',
        'description' => 'Create a profile page using semantic HTML.',
        'difficulty' => 'beginner',
        'xp_reward' => 50,
        'order_index' => 1,
        'correction_engine' => 'browser',
        'exercise_type' => 'html',
        'correction_rules' => [
            'requiredFiles' => ['index.html'],
            'minimumScore' => 70,
        ],
        'status' => 'draft',
        'class_ids' => [],
    ], $overrides);
}

it('allows a course owner to publish an exercise for an assigned current class', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $class = createExerciseControllerClass();
    assignExerciseControllerCoachToClass($coach, $class);

    $response = $this
        ->actingAs($coach)
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'class_ids' => [$class->id],
            ]),
        );

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $exercise = Exercise::query()->firstOrFail();

    expect($exercise->title)->toBe('Build a semantic HTML profile')
        ->and($exercise->correction_engine)->toBe('browser')
        ->and($exercise->exercise_type)->toBe('html')
        ->and($exercise->correction_rules)->toBe([
            'requiredFiles' => ['index.html'],
            'minimumScore' => 70,
        ])
        ->and($exercise->status)->toBe('published')
        ->and($exercise->published_at)->not->toBeNull()
        ->and($exercise->passing_score)->toBe(70)
        ->and($exercise->classes->pluck('id')->all())
        ->toBe([$class->id]);

    $this->assertDatabaseHas('exercise_classes', [
        'exercise_id' => $exercise->id,
        'classes_id' => $class->id,
    ]);
});

it('rejects a published exercise without selected classes', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'class_ids' => [],
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('class_ids');

    expect(Exercise::query()->count())->toBe(0);
});

it('rejects a current class that is not assigned to the coach', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $class = createExerciseControllerClass();

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'class_ids' => [$class->id],
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('class_ids');

    expect(Exercise::query()->count())->toBe(0);
});

it('rejects an older running promo when a newer promo is currently running', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $olderClass = createExerciseControllerClass(
        promo: 5,
        classNumber: 1,
    );

    $newerClass = createExerciseControllerClass(
        promo: 6,
        classNumber: 1,
    );

    assignExerciseControllerCoachToClass($coach, $olderClass);

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'class_ids' => [$olderClass->id],
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('class_ids');

    expect($newerClass->id)->not->toBe($olderClass->id)
        ->and(Exercise::query()->count())->toBe(0);
});

it('rejects a class that has not started yet', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $futureClass = createExerciseControllerClass(
        promo: 6,
        startTime: today()->addDay()->toDateString(),
        endTime: today()->addMonths(6)->toDateString(),
    );

    assignExerciseControllerCoachToClass($coach, $futureClass);

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'class_ids' => [$futureClass->id],
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('class_ids');

    expect(Exercise::query()->count())->toBe(0);
});

it('rejects correction engine and exercise type mismatches', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'correction_engine' => 'browser',
                'exercise_type' => 'laravel',
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('exercise_type');

    expect(Exercise::query()->count())->toBe(0);
});

it('forbids a coach from creating an exercise in another coach course', function () {
    $owner = createExerciseControllerCoach();
    $otherCoach = createExerciseControllerCoach();

    $topic = createExerciseControllerTopic($owner);

    $response = $this
        ->actingAs($otherCoach)
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload(),
        );

    $response->assertForbidden();

    expect(Exercise::query()->count())->toBe(0);
});

it('rejects a browser exercise without correction rules', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'correction_rules' => null,
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('correction_rules');

    expect(Exercise::query()->count())->toBe(0);
});

it('allows a github actions exercise without browser correction rules', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $response = $this
        ->actingAs($coach)
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'correction_engine' => 'github_actions',
                'exercise_type' => 'laravel',
                'correction_rules' => null,
            ]),
        );

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Exercise::query()->count())->toBe(1)
        ->and(
            Exercise::query()
                ->firstOrFail()
                ->correction_rules,
        )
        ->toBeNull();
});

it('allows an admin to publish to any current class', function () {
    $admin = createExerciseControllerUser('admin');
    $topic = createExerciseControllerTopic($admin);

    $class = createExerciseControllerClass();

    $response = $this
        ->actingAs($admin)
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'class_ids' => [$class->id],
            ]),
        );

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $exercise = Exercise::query()->firstOrFail();

    $this->assertDatabaseHas('exercise_classes', [
        'exercise_id' => $exercise->id,
        'classes_id' => $class->id,
    ]);
});