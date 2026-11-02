<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('projects/index', [
            'projects' => Project::query()->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('projects/create');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('projects/edit', [
            'project' => $project,
        ]);
    }

    public function store(ProjectRequest $request): RedirectResponse
    {
        Project::query()->create($request->validated());

        return to_route('projects.index')->with('success', 'Project created.');
    }

    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        $project->update($request->validated());

        return to_route('projects.index')->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return to_route('projects.index')->with('success', 'Project deleted.');
    }
}
