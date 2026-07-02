<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome/index')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});


// Route::middleware('auth')->get('/concept', function () {
//     return Inertia::render('Concept');
// });


require __DIR__."/admin/management.php";
require __DIR__."/admin/classes.php";
require __DIR__."/admin/courses.php";
require __DIR__."/auth.php";
require __DIR__.'/settings.php';
require __DIR__.'/concept-builder.php';