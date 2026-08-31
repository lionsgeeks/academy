<?php

use App\Models\Classes;
use App\Models\Concept;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\Role;
use App\Models\Topic;
use App\Models\User;
use App\Services\Exercises\StudentExerciseVisibilityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function studentVisibilityRole(string $role): Role
{
    return Role::query()
        ->where('role', $role)
        ->first()
        ?? Role::forceCreate([
            'role' => $role,
        ]);
}

function createStudentVisibilityUser(): User
{
    $student = User::query()->create([
        'name' => 'Exercise Visibility Student',
        'email' => 'exercise-visibility-student-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $student->Roles()->attach(studentVisibilityRole('student')->id);

    return $student;
}

function createStudentVisibilityClass(
    string $name,
    int $classNumber,
): Classes {
    return Classes::query()->create([
        'central_id' => random_int(100000, 999999),
        'name' => $name,
        'promo' => 6,
        'type' => 'coding',
        'class' => $classNumber,
        'start_time' => today()->subMonth()->toDateString(),
        'end_time' => today()->addMonth()->toDateString(),
    ]);
}

function assignStudentVisibilityStudentToClass(
    User $student,
    Classes $class,
): void {
    $student->classes()->syncWithoutDetaching([
        $class->id => [
            'role_id' => studentVisibilityRole('student')->id,
        ],
    ]);
}

function createStudentVisibilityTopic(): Topic
{
    $coach = User::query()->create([
        'name' => 'Exercise Visibility Coach',
        'email' => 'exercise-visibility-coach-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Exercise Visibility Course',
        'slug' => 'exercise-visibility-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Exercise Visibility Concept',
        'order_index' => 1,
    ]);

    return Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Exercise Visibility Topic',
        'order_index' => 1,
    ]);
}

function createStudentVisibilityExercise(
    Topic $topic,
    int $orderIndex,
    string $status = 'published',
): Exercise {
    return Exercise::query()->create([
        'topic_id' => $topic->id,
        'title' => "Exercise Visibility {$orderIndex}",
        'description' => 'Build a semantic HTML page.',
        'difficulty' => 'beginner',
        'xp_reward' => 50,
        'order_index' => $orderIndex,
        'correction_engine' => 'browser',
        'exercise_type' => 'html',
        'correction_rules' => [
            'requiredFiles' => ['index.html'],
        ],
        'status' => $status,
        'passing_score' => 70,
        'published_at' => $status === 'published'
            ? now()
            : null,
    ]);
}

it('returns only published exercises targeted to the student class', function () {
    $student = createStudentVisibilityUser();

    $studentClass = createStudentVisibilityClass(
        'Promo 6 - Coding 1',
        1,
    );

    $otherClass = createStudentVisibilityClass(
        'Promo 6 - Coding 2',
        2,
    );

    assignStudentVisibilityStudentToClass($student, $studentClass);

    $topic = createStudentVisibilityTopic();

    $visibleExercise = createStudentVisibilityExercise($topic, 1);
    $otherClassExercise = createStudentVisibilityExercise($topic, 2);
    $draftExercise = createStudentVisibilityExercise($topic, 3, 'draft');
    $untargetedExercise = createStudentVisibilityExercise($topic, 4);

    $visibleExercise->classes()->attach($studentClass->id);
    $otherClassExercise->classes()->attach($otherClass->id);
    $draftExercise->classes()->attach($studentClass->id);

    $exercises = app(StudentExerciseVisibilityService::class)
        ->visibleExercisesFor($student);

    expect($exercises->pluck('id')->all())
        ->toBe([$visibleExercise->id]);

    expect($exercises->first()->topic->concept->course->id)
        ->toBe($topic->concept->course->id);

    expect($exercises->pluck('id')->all())
        ->not->toContain($otherClassExercise->id)
        ->not->toContain($draftExercise->id)
        ->not->toContain($untargetedExercise->id);
});

it('returns an exercise only once when a student belongs to two targeted classes', function () {
    $student = createStudentVisibilityUser();

    $firstClass = createStudentVisibilityClass(
        'Promo 6 - Coding 1',
        1,
    );

    $secondClass = createStudentVisibilityClass(
        'Promo 6 - Coding 2',
        2,
    );

    assignStudentVisibilityStudentToClass($student, $firstClass);
    assignStudentVisibilityStudentToClass($student, $secondClass);

    $topic = createStudentVisibilityTopic();

    $exercise = createStudentVisibilityExercise($topic, 1);

    $exercise->classes()->attach([
        $firstClass->id,
        $secondClass->id,
    ]);

    $exercises = app(StudentExerciseVisibilityService::class)
        ->visibleExercisesFor($student);

    expect($exercises->pluck('id')->all())
        ->toBe([$exercise->id]);

    expect($exercises)->toHaveCount(1);
});

it('ignores class memberships that are not student memberships', function () {
    $student = createStudentVisibilityUser();

    $class = createStudentVisibilityClass(
        'Promo 6 - Coding 1',
        1,
    );

    $student->classes()->syncWithoutDetaching([
        $class->id => [
            'role_id' => studentVisibilityRole('coach')->id,
        ],
    ]);

    $topic = createStudentVisibilityTopic();

    $exercise = createStudentVisibilityExercise($topic, 1);

    $exercise->classes()->attach($class->id);

    $exercises = app(StudentExerciseVisibilityService::class)
        ->visibleExercisesFor($student);

    expect($exercises)->toBeEmpty();
});