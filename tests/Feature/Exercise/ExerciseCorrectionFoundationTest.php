<?php

use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\Promotion;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createCorrectionFoundationExercise(array $attributes = []): Exercise
{
    $coach = User::query()->create([
        'name' => 'Exercise Foundation Coach',
        'email' => 'exercise-coach-' . Str::lower(Str::random(12)) . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Exercise Foundation Course',
        'slug' => 'exercise-foundation-course-' . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Exercise Foundation Concept',
        'order_index' => 1,
    ]);

    $topic = Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Exercise Foundation Topic',
        'order_index' => 1,
    ]);

    return Exercise::query()->create(array_merge([
        'topic_id' => $topic->id,
        'title' => 'Exercise Foundation Exercise',
        'difficulty' => 'beginner',
        'xp_reward' => 10,
        'order_index' => 1,
    ], $attributes));
}

it('stores correction foundation defaults for an exercise', function () {
    $exercise = createCorrectionFoundationExercise()->fresh();

    expect($exercise->correction_engine)->toBeNull()
        ->and($exercise->exercise_type)->toBeNull()
        ->and($exercise->status)->toBe('draft')
        ->and($exercise->passing_score)->toBe(70)
        ->and($exercise->published_at)->toBeNull();
});

it('stores configured correction fields for an exercise', function () {
    $publishedAt = now()->startOfSecond();

    $exercise = createCorrectionFoundationExercise([
        'correction_engine' => 'browser',
        'exercise_type' => 'html',
        'status' => 'published',
        'passing_score' => 80,
        'published_at' => $publishedAt,
    ])->fresh();

    expect($exercise->correction_engine)->toBe('browser')
        ->and($exercise->exercise_type)->toBe('html')
        ->and($exercise->status)->toBe('published')
        ->and($exercise->passing_score)->toBe(80)
        ->and($exercise->published_at?->equalTo($publishedAt))->toBeTrue();
});

it('links an exercise to a manually selected promotion', function () {
    $exercise = createCorrectionFoundationExercise();

    $promotion = Promotion::query()->create([
        'name' => 'Promo 5',
        'slug' => 'promo-5',
        'status' => 'active',
    ]);

    $exercise->promotions()->sync([$promotion->id]);

    $this->assertDatabaseHas('exercise_promotion', [
        'exercise_id' => $exercise->id,
        'promotion_id' => $promotion->id,
    ]);

    expect(
        $exercise->fresh()->promotions()->whereKey($promotion->id)->exists()
    )->toBeTrue();

    expect(
        $promotion->exercises()->whereKey($exercise->id)->exists()
    )->toBeTrue();
});
