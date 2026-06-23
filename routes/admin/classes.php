<?php

use App\Http\Controllers\ClassController;
use App\Http\Controllers\GetClassesDataController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth',])->group(function () {
    Route::get('/classes', [ClassController::class, "index"]);
});
Route::get("/getclass", [GetClassesDataController::class, "getClasses"])->middleware("suAdmin");
