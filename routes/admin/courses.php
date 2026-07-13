<?php

use App\Http\Controllers\CourseConceptRoadmapController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\StudentExerciseAttemptController;
use App\Http\Controllers\StudentExerciseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('courses', [CourseController::class, 'index'])
        ->name('courses.index');

    Route::post('courses', [CourseController::class, 'store'])
        ->name('courses.store');

    Route::post('courses/{course}/update', [CourseController::class, 'update'])
        ->name('courses.update.upload');

    Route::put('courses/{course}', [CourseController::class, 'update'])
        ->name('courses.update');

    Route::patch('courses/{course}/status', [CourseController::class, 'updateStatus'])
        ->name('courses.update-status');

    Route::delete('courses/{course}', [CourseController::class, 'destroy'])
        ->name('courses.destroy');

    Route::get('courses/{course}', [CourseConceptRoadmapController::class, 'show'])
        ->name('courses.concepts-roadmap.show');

    Route::post(
        'courses/{course}/concepts-roadmap/concepts',
        [CourseConceptRoadmapController::class, 'storeConcept'],
    )->name('courses.concepts-roadmap.concepts.store');

    Route::put(
        'courses/{course}/concepts-roadmap/concepts/{concept}',
        [CourseConceptRoadmapController::class, 'updateConcept'],
    )->name('courses.concepts-roadmap.concepts.update');

    Route::delete(
        'courses/{course}/concepts-roadmap/concepts/{concept}',
        [CourseConceptRoadmapController::class, 'destroyConcept'],
    )->name('courses.concepts-roadmap.concepts.destroy');

    Route::post(
        'topics/{topic}/exercises',
        [ExerciseController::class, 'store'],
    )->name('topics.exercises.store');

    Route::get(
        'student/exercises',
        [StudentExerciseController::class, 'index'],
    )->name('student.exercises.index');

    Route::get('student/exercise-lab', function (Request $request) {
        abort_unless(
            $request->user()
                && $request->user()
                    ->Roles()
                    ->where('role', 'student')
                    ->exists(),
            403,
        );

        return Inertia::render('student/exercise-lab/index', [
            'csrfToken' => csrf_token(),
        ]);
    })->name('student.exercise-lab.index');

    Route::get(
        'student/exercises/{exercise}',
        [StudentExerciseController::class, 'show'],
    )->name('student.exercises.show');

    Route::post(
        'student/exercises/{exercise}/attempts',
        [StudentExerciseAttemptController::class, 'store'],
    )->name('student.exercises.attempts.store');

    Route::get(
        'student/exercises/{exercise}/attempts',
        [StudentExerciseAttemptController::class, 'index'],
    )->name('student.exercises.attempts.index');
});
