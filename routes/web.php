<?php

use App\Http\Controllers\ProjectController;
use App\Models\Project;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'projects' => Project::query()->latest()->get(),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('projects', ProjectController::class)->except(['show']);

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
