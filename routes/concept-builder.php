<?php

use App\Http\Controllers\ConceptBuilderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/concept/{concept}/edit', [ConceptBuilderController::class, 'edit'])
        ->name('concept.edit');

    Route::put('/concept/{concept}', [ConceptBuilderController::class, 'update'])
        ->name('concept.update');
});
