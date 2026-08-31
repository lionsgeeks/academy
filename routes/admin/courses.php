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

    // Student exercises page - serves Inertia view
    Route::get(
        'student/exercises',
        function (Request $request) {
            abort_unless(
                $request->user()
                    && $request->user()
                        ->Roles()
                        ->where('role', 'student')
                        ->exists(),
                403,
            );

            if ($request->expectsJson()) {
                return app(StudentExerciseController::class)->index(
                    $request,
                    app(\App\Services\Exercises\StudentExerciseVisibilityService::class),
                );
            }

            return Inertia::render('student/exercises/index');
        },
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

    // Student exercise detail page - serves Inertia view
    Route::get(
        'student/exercises/{exercise}',
        function (Request $request, \App\Models\Exercise $exercise) {
            abort_unless(
                $request->user()
                    && $request->user()
                        ->Roles()
                        ->where('role', 'student')
                        ->exists(),
                403,
            );

            if ($request->expectsJson()) {
                return app(StudentExerciseController::class)->show(
                    $request,
                    $exercise,
                    app(\App\Services\Exercises\StudentExerciseVisibilityService::class),
                );
            }

            $exerciseVisibility = app(\App\Services\Exercises\StudentExerciseVisibilityService::class);
            $visibleExercise = $exerciseVisibility->visibleExerciseFor($request->user(), $exercise);
            
            abort_unless($visibleExercise, 404);

            return Inertia::render('student/exercises/show', [
                'exercise' => [
                    'id' => $visibleExercise->id,
                    'title' => $visibleExercise->title,
                    'description' => $visibleExercise->description,
                    'difficulty' => $visibleExercise->difficulty,
                    'xp_reward' => $visibleExercise->xp_reward,
                    'correction_engine' => $visibleExercise->correction_engine,
                    'exercise_type' => $visibleExercise->exercise_type,
                    'passing_score' => $visibleExercise->passing_score,
                    'topic' => [
                        'id' => $visibleExercise->topic->id,
                        'title' => $visibleExercise->topic->title,
                        'concept' => [
                            'id' => $visibleExercise->topic->concept->id,
                            'title' => $visibleExercise->topic->concept->title,
                            'course' => [
                                'id' => $visibleExercise->topic->concept->course->id,
                                'title' => $visibleExercise->topic->concept->course->title,
                                'slug' => $visibleExercise->topic->concept->course->slug,
                            ],
                        ],
                    ],
                ],
            ]);
        },
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
