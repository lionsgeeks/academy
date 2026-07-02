<?php

use App\Http\Controllers\ClassController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GithubExerciseCallbackController;


Route::post(
    'exercises/github-callback',
    [GithubExerciseCallbackController::class, 'store'],
)
    ->middleware('throttle:30,1')
    ->name('api.exercises.github-callback');
