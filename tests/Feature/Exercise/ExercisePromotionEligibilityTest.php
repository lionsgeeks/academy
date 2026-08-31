<?php

use App\Models\Course;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function createCourseForExercisePromotionEligibility(): Course
{
    $coach = User::query()->create([
        'name' => 'Exercise Promotion Coach',
        'email' => 'exercise-promotion-coach-'.Str::lower(Str::random(12)).'@example.test',
    ]);

    return Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Exercise Promotion Course',
        'slug' => 'exercise-promotion-course-'.Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);
}

it('returns only active promotions with an active course assignment', function () {
    $course = createCourseForExercisePromotionEligibility();

    $promoFive = Promotion::query()->create([
        'name' => 'Promo 5',
        'slug' => 'promo-5-'.Str::lower(Str::random(8)),
        'status' => 'active',
    ]);

    $graduatedPromo = Promotion::query()->create([
        'name' => 'Promo 4',
        'slug' => 'promo-4-'.Str::lower(Str::random(8)),
        'status' => 'archived',
    ]);

    $inactiveCoursePromo = Promotion::query()->create([
        'name' => 'Promo 6',
        'slug' => 'promo-6-'.Str::lower(Str::random(8)),
        'status' => 'active',
    ]);

    $course->promotions()->attach($promoFive->id, [
        'status' => 'active',
    ]);

    $course->promotions()->attach($graduatedPromo->id, [
        'status' => 'active',
    ]);

    $course->promotions()->attach($inactiveCoursePromo->id, [
        'status' => 'archived',
    ]);

    $publishablePromotionIds = $course
        ->fresh()
        ->publishablePromotions()
        ->pluck('promotions.id')
        ->all();

    expect($publishablePromotionIds)
        ->toContain($promoFive->id)
        ->not->toContain($graduatedPromo->id)
        ->not->toContain($inactiveCoursePromo->id)
        ->and($publishablePromotionIds)->toHaveCount(1);
});