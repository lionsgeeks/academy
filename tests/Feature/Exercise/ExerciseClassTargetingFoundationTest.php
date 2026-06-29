<?php

use App\Models\Classes;
use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createExerciseClassTargetingExercise(): Exercise
{
    $coach = User::query()->create([
        'name' => 'Exercise Class Targeting Coach',
        'email' => 'exercise-class-targeting-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Exercise Class Targeting Course',
        'slug' => 'exercise-class-targeting-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Exercise Class Targeting Concept',
        'order_index' => 1,
    ]);

    $topic = Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Exercise Class Targeting Topic',
        'order_index' => 1,
    ]);

    return Exercise::query()->create([
        'topic_id' => $topic->id,
        'title' => 'Build an HTML profile',
        'description' => 'Create a semantic HTML profile page.',
        'difficulty' => 'beginner',
        'xp_reward' => 50,
        'order_index' => 1,
        'correction_engine' => 'browser',
        'exercise_type' => 'html',
        'correction_rules' => [
            'requiredFiles' => ['index.html'],
        ],
        'status' => 'draft',
        'passing_score' => 70,
    ]);
}

function createExerciseTargetClass(
    int $promo,
    string $type,
    int $classNumber,
): Classes {
    return Classes::query()->create([
        'central_id' => random_int(100000, 999999),
        'name' => "Promo {$promo} - {$type} {$classNumber}",
        'promo' => $promo,
        'type' => $type,
        'class' => $classNumber,
        'start_time' => today()->subMonth()->toDateString(),
        'end_time' => today()->addMonths(6)->toDateString(),
    ]);
}

it('links an exercise to exact classes instead of every class in the same promo', function () {
    $exercise = createExerciseClassTargetingExercise();

    $codingClass = createExerciseTargetClass(6, 'coding', 1);
    $mediaClass = createExerciseTargetClass(6, 'media', 1);

    $exercise->classes()->attach($codingClass->id);

    $this->assertDatabaseHas('exercise_classes', [
        'exercise_id' => $exercise->id,
        'classes_id' => $codingClass->id,
    ]);

    $this->assertDatabaseMissing('exercise_classes', [
        'exercise_id' => $exercise->id,
        'classes_id' => $mediaClass->id,
    ]);

    expect($exercise->fresh()->classes->pluck('id')->all())
        ->toBe([$codingClass->id]);

    expect($codingClass->fresh()->exercises->pluck('id')->all())
        ->toBe([$exercise->id]);
});

it('does not create duplicate exercise class links', function () {
    $exercise = createExerciseClassTargetingExercise();
    $class = createExerciseTargetClass(6, 'coding', 1);

    $exercise->classes()->syncWithoutDetaching([$class->id]);
    $exercise->classes()->syncWithoutDetaching([$class->id]);

    expect(
        DB::table('exercise_classes')
            ->where('exercise_id', $exercise->id)
            ->where('classes_id', $class->id)
            ->count(),
    )->toBe(1);
});