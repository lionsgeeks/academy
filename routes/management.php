<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\GetClassesDataController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/class', [ClassController::class, "index"]);
    Route::get("/getclass", [GetClassesDataController::class, "getClasses"]);
    });
    
    Route::get('/callback/{code}', [AuthController::class, 'loginCallback']);
Route::get('/login', [AuthController::class, 'login'])
        ->name('login');
