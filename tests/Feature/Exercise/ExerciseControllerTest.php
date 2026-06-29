<?php

use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\Promotion;
use App\Models\Role;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createExerciseControllerCoach(): User
{
    $coach = User::query()->create([
        'name' => 'Exercise Controller Coach',
        'email' => 'exercise-controller-coach-' . Str::lower(Str::random(12)) . '@example.test',
    ]);

    $coachRole = Role::forceCreate([
        'role' => 'coach',
    ]);

    $coach->Roles()->attach($coachRole->id);

    return $coach;
}

function createExerciseControllerTopic(User $coach): Topic
{
    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Exercise Controller Course',
        'slug' => 'exercise-controller-course-' . Str::lower(Str::random(8)),
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

function createEligiblePromotionForCourse(Course $course): Promotion
{
    $promotion = Promotion::query()->create([
        'name' => 'Promo 5',
        'slug' => 'promo-5-' . Str::lower(Str::random(8)),
        'status' => 'active',
    ]);

    $course->promotions()->attach($promotion->id, [
        'status' => 'active',
    ]);

    return $promotion;
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
        'status' => 'draft',
        'promotion_ids' => [],
    ], $overrides);
}

it('allows a course owner to publish an exercise for an eligible promotion', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);
    $promotion = createEligiblePromotionForCourse($topic->concept->course);

    $response = $this
        ->actingAs($coach)
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'promotion_ids' => [$promotion->id],
            ]),
        );

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $exercise = Exercise::query()->firstOrFail();

    expect($exercise->title)->toBe('Build a semantic HTML profile')
        ->and($exercise->correction_engine)->toBe('browser')
        ->and($exercise->exercise_type)->toBe('html')
        ->and($exercise->status)->toBe('published')
        ->and($exercise->published_at)->not->toBeNull()
        ->and($exercise->passing_score)->toBe(70);

    $this->assertDatabaseHas('exercise_promotion', [
        'exercise_id' => $exercise->id,
        'promotion_id' => $promotion->id,
    ]);
});

it('rejects a published exercise without selected promotions', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'promotion_ids' => [],
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('promotion_ids');

    expect(Exercise::query()->count())->toBe(0);
});

it('rejects a promotion that is not eligible for the topic course', function () {
    $coach = createExerciseControllerCoach();
    $topic = createExerciseControllerTopic($coach);

    $archivedPromotion = Promotion::query()->create([
        'name' => 'Graduated Promo',
        'slug' => 'graduated-promo-' . Str::lower(Str::random(8)),
        'status' => 'archived',
    ]);

    $topic->concept->course->promotions()->attach($archivedPromotion->id, [
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($coach)
        ->from('/courses')
        ->post(
            route('topics.exercises.store', $topic),
            validExercisePayload([
                'status' => 'published',
                'promotion_ids' => [$archivedPromotion->id],
            ]),
        );

    $response
        ->assertRedirect('/courses')
        ->assertSessionHasErrors('promotion_ids');

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
