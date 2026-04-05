<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function() {
    return response()->json(['message' => 'API is working!']);
});

Route::post('/fetch-courses', [CourseController::class, 'fetchCourses']);
Route::get('/playlists', [CourseController::class, 'getPlaylists']);
Route::get('/categories', [CourseController::class, 'getCategories']);

