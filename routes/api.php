<?php

use App\Http\Controllers\ClassController;
use App\Http\Controllers\StudentExerciseController;
use App\Http\Controllers\StudentExerciseAttemptController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GithubExerciseCallbackController;


Route::post(
    'exercises/github-callback',
    [GithubExerciseCallbackController::class, 'store'],
)
    ->middleware('throttle:30,1')
    ->name('api.exercises.github-callback');

// Protected API routes for authenticated users
Route::middleware(['auth'])->group(function () {
    // Student exercises API endpoints
    Route::get(
        'student/exercises',
        [StudentExerciseController::class, 'index'],
    )->name('api.student.exercises.index');

    Route::get(
        'student/exercises/{exercise}',
        [StudentExerciseController::class, 'show'],
    )->name('api.student.exercises.show');

    // Student exercise attempts API endpoints
    Route::get(
        'student/exercises/{exercise}/attempts',
        [StudentExerciseAttemptController::class, 'index'],
    )->name('api.student.exercises.attempts.index');

    Route::post(
        'student/exercises/{exercise}/attempts',
        [StudentExerciseAttemptController::class, 'store'],
    )->name('api.student.exercises.attempts.store');
});
