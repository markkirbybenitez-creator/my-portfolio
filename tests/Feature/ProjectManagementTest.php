<?php

use App\Models\Project;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the public portfolio displays saved projects', function () {
    $project = Project::query()->create([
        'title' => 'Portfolio redesign',
        'description' => 'A responsive portfolio project.',
        'category' => 'personal',
        'technologies' => 'React, Laravel',
        'url' => 'https://example.com',
    ]);

    $this->withoutVite()->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('projects', 1)
            ->where('projects.0.id', $project->id)
            ->where('projects.0.title', 'Portfolio redesign'));
});

test('guests cannot manage projects', function () {
    $this->get('/projects')->assertRedirect('/login');
    $this->get('/projects/create')->assertRedirect('/login');
    $this->post('/projects')->assertRedirect('/login');
});

test('authenticated users can view project create and edit pages', function () {
    $this->withoutVite()->actingAs(User::factory()->create());
    $project = Project::query()->create([
        'title' => 'A unique project',
        'description' => 'Project description.',
        'category' => 'school',
        'technologies' => 'React',
    ]);

    $this->get('/projects')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/index')
            ->has('projects', 1));
    $this->get('/projects/create')->assertOk()->assertInertia(fn (Assert $page) => $page->component('projects/create'));
    $this->get("/projects/{$project->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/edit')
            ->where('project.id', $project->id));
});

test('an authenticated user can create a project', function () {
    $this->actingAs(User::factory()->create())
        ->post('/projects', [
            'title' => 'Portfolio redesign',
            'description' => 'A responsive portfolio project.',
            'category' => 'personal',
            'technologies' => 'React, Laravel',
            'url' => 'https://example.com',
        ])
        ->assertRedirect('/projects')
        ->assertSessionHas('success', 'Project created.');

    $this->assertDatabaseHas('projects', [
        'title' => 'Portfolio redesign',
        'category' => 'personal',
    ]);
});

test('all required project fields are validated when the form is empty', function () {
    $this->actingAs(User::factory()->create())
        ->from('/projects')
        ->post('/projects', [])
        ->assertSessionHasErrors(['title', 'description', 'category', 'technologies']);

    $this->assertDatabaseCount('projects', 0);
});

test('project text fields cannot exceed their maximum lengths', function () {
    $this->actingAs(User::factory()->create())
        ->from('/projects/create')
        ->post('/projects', [
            'title' => str_repeat('a', 121),
            'description' => str_repeat('a', 1001),
            'category' => 'school',
            'technologies' => str_repeat('a', 256),
            'url' => '',
        ])
        ->assertSessionHasErrors(['title', 'description', 'technologies'])
        ->assertSessionHas('_old_input.title', str_repeat('a', 121));

    $this->assertDatabaseCount('projects', 0);
});

test('project category and URL must use supported formats', function () {
    $this->actingAs(User::factory()->create())
        ->from('/projects/create')
        ->post('/projects', [
            'title' => 'Invalid project',
            'description' => 'A valid description.',
            'category' => 'other',
            'technologies' => 'React',
            'url' => 'not-a-url',
        ])
        ->assertSessionHasErrors([
            'category',
            'url' => 'Enter a complete project URL, including https://.',
        ]);
});

test('project titles must be unique and show a custom validation message', function () {
    $this->actingAs(User::factory()->create());
    Project::query()->create([
        'title' => 'Existing title',
        'description' => 'Existing description.',
        'category' => 'school',
        'technologies' => 'React',
    ]);

    $this->from('/projects/create')
        ->post('/projects', [
            'title' => 'Existing title',
            'description' => 'Another description.',
            'category' => 'personal',
            'technologies' => 'Laravel',
            'url' => '',
        ])
        ->assertSessionHasErrors([
            'title' => 'A project with this title already exists.',
        ]);
});

test('updating a project without changing its unique title is valid', function () {
    $this->actingAs(User::factory()->create());
    $project = Project::query()->create([
        'title' => 'Keep this title',
        'description' => 'Original description.',
        'category' => 'school',
        'technologies' => 'HTML, CSS',
    ]);

    $this->put("/projects/{$project->id}", [
        'title' => 'Keep this title',
        'description' => 'Updated description.',
        'category' => 'planned',
        'technologies' => 'React',
        'url' => '',
    ])->assertRedirect('/projects')->assertSessionHas('success', 'Project updated.');

    $this->assertDatabaseHas('projects', [
        'id' => $project->id,
        'title' => 'Keep this title',
        'description' => 'Updated description.',
    ]);
});

test('an authenticated user can update and delete a project', function () {
    $this->actingAs(User::factory()->create());
    $project = Project::query()->create([
        'title' => 'Original project',
        'description' => 'Original description.',
        'category' => 'school',
        'technologies' => 'HTML, CSS',
    ]);

    $this->put("/projects/{$project->id}", [
        'title' => 'Updated project',
        'description' => 'Updated description.',
        'category' => 'planned',
        'technologies' => 'React',
        'url' => '',
    ])->assertRedirect('/projects');

    $this->assertDatabaseHas('projects', [
        'id' => $project->id,
        'title' => 'Updated project',
        'category' => 'planned',
    ]);

    $this->delete("/projects/{$project->id}")
        ->assertRedirect('/projects')
        ->assertSessionHas('success', 'Project deleted.');
    $this->assertDatabaseMissing('projects', ['id' => $project->id]);
});
