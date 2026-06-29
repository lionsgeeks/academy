<?php

use App\Models\Classes;
use App\Models\Role;
use App\Models\User;
use App\Services\Exercises\ExerciseClassEligibilityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function eligibilityServiceRole(string $role): Role
{
    return Role::query()
        ->where('role', $role)
        ->first()
        ?? Role::forceCreate([
            'role' => $role,
        ]);
}

function createEligibilityServiceUser(string $role): User
{
    $user = User::query()->create([
        'name' => "Eligibility Service {$role}",
        'email' => 'eligibility-service-'
            . $role
            . '-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $user->Roles()->attach(eligibilityServiceRole($role)->id);

    return $user;
}

function createEligibilityServiceClass(array $overrides = []): Classes
{
    return Classes::query()->create(array_merge([
        'central_id' => random_int(100000, 999999),
        'name' => 'Promo 6 - Coding 1',
        'promo' => 6,
        'type' => 'coding',
        'class' => 1,
        'start_time' => today()->subMonth()->toDateString(),
        'end_time' => today()->addMonth()->toDateString(),
    ], $overrides));
}

function assignEligibilityServiceCoachToClass(
    User $coach,
    Classes $class,
): void {
    $coach->classes()->syncWithoutDetaching([
        $class->id => [
            'role_id' => eligibilityServiceRole('coach')->id,
        ],
    ]);
}

it('returns only the coach assigned classes from the highest running promo', function () {
    $coach = createEligibilityServiceUser('coach');

    $olderPromoClass = createEligibilityServiceClass([
        'promo' => 5,
        'name' => 'Promo 5 - Coding 1',
    ]);

    $assignedCurrentClass = createEligibilityServiceClass([
        'promo' => 6,
        'name' => 'Promo 6 - Coding 1',
        'type' => 'coding',
        'class' => 1,
    ]);

    $unassignedCurrentClass = createEligibilityServiceClass([
        'promo' => 6,
        'name' => 'Promo 6 - Media 1',
        'type' => 'media',
        'class' => 1,
    ]);

    $futurePromoClass = createEligibilityServiceClass([
        'promo' => 7,
        'name' => 'Promo 7 - Coding 1',
        'start_time' => today()->addDay()->toDateString(),
        'end_time' => today()->addMonths(6)->toDateString(),
    ]);

    assignEligibilityServiceCoachToClass($coach, $olderPromoClass);
    assignEligibilityServiceCoachToClass($coach, $assignedCurrentClass);
    assignEligibilityServiceCoachToClass($coach, $futurePromoClass);

    $classes = app(ExerciseClassEligibilityService::class)
        ->currentClassesFor($coach);

    expect($classes->pluck('id')->all())
        ->toBe([$assignedCurrentClass->id]);

    expect($classes->first()->promo)->toBe(6)
        ->and($classes->first()->type)->toBe('coding')
        ->and($classes->first()->class)->toBe(1);

    expect($classes->pluck('id')->all())
        ->not->toContain($olderPromoClass->id)
        ->not->toContain($unassignedCurrentClass->id)
        ->not->toContain($futurePromoClass->id);
});

it('allows an admin to target every class from the highest running promo', function () {
    $admin = createEligibilityServiceUser('admin');

    $codingClass = createEligibilityServiceClass([
        'promo' => 6,
        'name' => 'Promo 6 - Coding 1',
        'type' => 'coding',
        'class' => 1,
    ]);

    $mediaClass = createEligibilityServiceClass([
        'promo' => 6,
        'name' => 'Promo 6 - Media 1',
        'type' => 'media',
        'class' => 1,
    ]);

    createEligibilityServiceClass([
        'promo' => 5,
        'name' => 'Promo 5 - Coding 1',
        'type' => 'coding',
        'class' => 1,
    ]);

    $classes = app(ExerciseClassEligibilityService::class)
        ->currentClassesFor($admin);

    expect($classes->pluck('id')->sort()->values()->all())
        ->toBe([
            $codingClass->id,
            $mediaClass->id,
        ]);
});

it('ignores classes that are finished, not started, or missing an end date', function () {
    $admin = createEligibilityServiceUser('admin');

    createEligibilityServiceClass([
        'promo' => 8,
        'name' => 'Promo 8 - Finished',
        'end_time' => today()->subDay()->toDateString(),
    ]);

    createEligibilityServiceClass([
        'promo' => 9,
        'name' => 'Promo 9 - Future',
        'start_time' => today()->addDay()->toDateString(),
        'end_time' => today()->addMonths(6)->toDateString(),
    ]);

    createEligibilityServiceClass([
        'promo' => 10,
        'name' => 'Promo 10 - No End Date',
        'end_time' => null,
    ]);

    $classes = app(ExerciseClassEligibilityService::class)
        ->currentClassesFor($admin);

    expect($classes)->toBeEmpty();
});