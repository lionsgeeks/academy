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

function studentExerciseEndpointRole(string $role): Role
{
    return Role::query()
        ->where('role', $role)
        ->first()
        ?? Role::forceCreate([
            'role' => $role,
        ]);
}

function createStudentExerciseEndpointUser(string $role = 'student'): User
{
    $user = User::query()->create([
        'name' => "Student Exercise Endpoint {$role}",
        'email' => 'student-exercise-endpoint-'
            . $role
            . '-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $user->Roles()->attach(studentExerciseEndpointRole($role)->id);

    return $user;
}

function createStudentExerciseEndpointClass(int $classNumber): Classes
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

function assignStudentExerciseEndpointStudentToClass(
    User $student,
    Classes $class,
): void {
    $student->classes()->syncWithoutDetaching([
        $class->id => [
            'role_id' => studentExerciseEndpointRole('student')->id,
        ],
    ]);
}

function createStudentExerciseEndpointTopic(): Topic
{
    $coach = User::query()->create([
        'name' => 'Student Exercise Endpoint Coach',
        'email' => 'student-exercise-endpoint-coach-'
            . Str::lower(Str::random(12))
            . '@example.test',
    ]);

    $course = Course::query()->create([
        'created_by' => $coach->id,
        'title' => 'Student Exercise Endpoint Course',
        'slug' => 'student-exercise-endpoint-course-'
            . Str::lower(Str::random(8)),
        'status' => 'draft',
    ]);

    $concept = Concept::query()->create([
        'course_id' => $course->id,
        'title' => 'Student Exercise Endpoint Concept',
        'order_index' => 1,
    ]);

    return Topic::query()->create([
        'concept_id' => $concept->id,
        'title' => 'Student Exercise Endpoint Topic',
        'order_index' => 1,
    ]);
}

function createStudentExerciseEndpointExercise(
    Topic $topic,
    int $orderIndex,
    string $status = 'published',
): Exercise {
    return Exercise::query()->create([
        'topic_id' => $topic->id,
        'title' => "Student Endpoint Exercise {$orderIndex}",
        'description' => 'Build a semantic HTML profile page.',
        'difficulty' => 'beginner',
        'xp_reward' => 50,
        'order_index' => $orderIndex,
        'correction_engine' => 'browser',
        'exercise_type' => 'html',
        'correction_rules' => [
            'requiredFiles' => ['index.html'],
            'privateSelector' => '.hidden-test-only',
        ],
        'status' => $status,
        'passing_score' => 70,
        'published_at' => $status === 'published'
            ? now()
            : null,
    ]);
}

it('returns only visible student exercises without private correction rules', function () {
    $student = createStudentExerciseEndpointUser();

    $studentClass = createStudentExerciseEndpointClass(1);
    $otherClass = createStudentExerciseEndpointClass(2);

    assignStudentExerciseEndpointStudentToClass($student, $studentClass);

    $topic = createStudentExerciseEndpointTopic();

    $visibleExercise = createStudentExerciseEndpointExercise($topic, 1);
    $otherClassExercise = createStudentExerciseEndpointExercise($topic, 2);
    $draftExercise = createStudentExerciseEndpointExercise($topic, 3, 'draft');

    $visibleExercise->classes()->attach($studentClass->id);
    $otherClassExercise->classes()->attach($otherClass->id);
    $draftExercise->classes()->attach($studentClass->id);

    $response = $this
        ->actingAs($student)
        ->getJson(route('student.exercises.index'));

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $visibleExercise->id)
        ->assertJsonPath('data.0.title', $visibleExercise->title)
        ->assertJsonPath('data.0.topic.id', $topic->id)
        ->assertJsonPath('data.0.topic.concept.id', $topic->concept->id)
        ->assertJsonPath(
            'data.0.topic.concept.course.id',
            $topic->concept->course->id,
        );

    expect($response->json('data.0'))
        ->not->toHaveKey('correction_rules');

    expect($response->json('data.0.id'))
        ->not->toBe($otherClassExercise->id)
        ->not->toBe($draftExercise->id);
});

it('returns an empty list when a student has no matching exercise', function () {
    $student = createStudentExerciseEndpointUser();

    $class = createStudentExerciseEndpointClass(1);

    assignStudentExerciseEndpointStudentToClass($student, $class);

    $response = $this
        ->actingAs($student)
        ->getJson(route('student.exercises.index'));

    $response
        ->assertOk()
        ->assertExactJson([
            'data' => [],
        ]);
});

it('forbids a non student from reading the student exercise endpoint', function () {
    $coach = createStudentExerciseEndpointUser('coach');

    $response = $this
        ->actingAs($coach)
        ->getJson(route('student.exercises.index'));

    $response->assertForbidden();
});