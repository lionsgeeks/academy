<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/callback/{code}', [AuthController::class, 'loginCallback']);
Route::get('/callback/{code}', [AuthController::class, 'loginCallback']);
Route::get('/login', [AuthController::class, 'login'])->name('login');
