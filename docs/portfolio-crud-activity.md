# Laravel + Inertia.js + React Portfolio Activity

**Student:** Mark Kirby Benitez  
**Course and section:** BSIT 3, Block 5  
**Date:** November 2, 2026  
**Dynamic section:** Projects

## Run the application

Install the project's Composer and npm dependencies, then run `php artisan migrate` and `composer run dev`. Register an account to sign in, open **Manage** or `/projects`, and add a real project so it appears in the public portfolio. Run the full test suite with `php artisan test`; regenerate this report and its source appendix with `npm run docs:pdf`.

## Section and justification

I chose Projects because project entries change as I complete school and personal work. Storing them in the database means I can maintain the portfolio from an authenticated form without editing or rebuilding the React page. The public page reads the saved project records and still displays the portfolio when no records have been added.

## Fields

| Field          | Database type                                                       | Purpose                                                         |
| -------------- | ------------------------------------------------------------------- | --------------------------------------------------------------- |
| `title`        | String, maximum 120 characters, unique                              | Identifies a project and prevents accidental duplicate entries. |
| `description`  | Text, maximum 1,000 characters                                      | Explains what the project does.                                 |
| `category`     | String, limited to `school`, `personal`, or `planned` by validation | Supports portfolio filtering.                                   |
| `technologies` | String, maximum 255 characters                                      | Lists the tools and technologies used.                          |
| `url`          | Nullable string, maximum 2,048 characters                           | Optional link to a live project.                                |

Laravel also adds an integer primary key and `created_at` / `updated_at` timestamps. The five fields above are the meaningful project fields.

## Validation rules

Validation lives in `app/Http/Requests/ProjectRequest.php`, so every create and update request is checked on the server:

1. `title` is required, a string, at most 120 characters, and unique. On update, the current project is excluded from the uniqueness check.
2. `description` is required, a string, and at most 1,000 characters.
3. `category` is required and must be one of the three supported categories.
4. `technologies` is required, a string, and at most 255 characters.
5. `url` may be blank, but when supplied it must be a valid URL and at most 2,048 characters.
6. Custom messages explain duplicate titles and malformed URLs in plain language.

The browser form also provides helpful input constraints, but Laravel remains authoritative because client-side rules can be bypassed.

## Request flow and design decisions

1. `routes/web.php` registers the resource routes inside `auth` middleware. Guests are sent to login before they can manage projects.
2. `ProjectController` performs one focused action for each page or mutation. It queries records, renders an Inertia page, or redirects after a validated write.
3. `ProjectRequest` authorizes signed-in users and applies the same validation rules to both `store` and `update`.
4. The controller passes only `$request->validated()` to `Project::create()` / `update()`. The model's `$fillable` list is the explicit mass-assignment allowlist.
5. Inertia renders the React page named by the controller. `useForm` sends requests, keeps typed values when validation fails, and exposes Laravel's field errors beside their inputs.
6. On success, the controller redirects with a one-request flash message. The Inertia middleware shares that message with React, where the index page announces it.
7. The public `/` route queries the same table and passes projects to the portfolio React page, which renders cards and filters by category.

A separate resource controller keeps HTTP concerns out of the route file and gives each CRUD action a conventional URL and name. The `show` route is omitted because projects are displayed as cards on the public portfolio and the manager index already lists each record. `ProjectForm` is shared between Create and Edit to keep field behavior, validation display, and styling consistent.

### Resource routes used

| Method and URL                  | Name               | Action                                  |
| ------------------------------- | ------------------ | --------------------------------------- |
| `GET /projects`                 | `projects.index`   | List records and show success feedback. |
| `GET /projects/create`          | `projects.create`  | Render the create form.                 |
| `POST /projects`                | `projects.store`   | Validate and create a record.           |
| `GET /projects/{project}/edit`  | `projects.edit`    | Render the edit form.                   |
| `PUT/PATCH /projects/{project}` | `projects.update`  | Validate and update a record.           |
| `DELETE /projects/{project}`    | `projects.destroy` | Delete after browser confirmation.      |

If `$fillable` were removed without adding a `$guarded` policy, Eloquent would normally discard mass-assigned attributes (or throw in strict mode), so the submitted project fields would not be saved. The allowlist makes the fields this form may set explicit and prevents unrelated model fields from being mass-assigned.

## Validation test table

Run with `php artisan test tests/Feature/ProjectManagementTest.php`. The feature tests use an in-memory SQLite database and exercise the server rules and redirect responses.

| #   | Test input                                                                                     | Expected result                                                                  | Actual result                                                              | Pass / fail |
| --- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| 1   | Submit an empty create request.                                                                | Errors for title, description, category, and technologies; no project is stored. | Required-field errors were returned and the projects table remained empty. | Pass        |
| 2   | Submit a title longer than 120 characters.                                                     | A title length validation error; no record is created.                           | The title error was returned.                                              | Pass        |
| 3   | Submit a description longer than 1,000 characters and technologies longer than 255 characters. | Errors appear for both fields.                                                   | Both field errors were returned.                                           | Pass        |
| 4   | Submit an unsupported category and malformed project URL.                                      | Errors appear for category and URL, including the custom URL message.            | Both fields were rejected by validation.                                   | Pass        |
| 5   | Create a second project with an existing title.                                                | The duplicate title is rejected with a custom message.                           | “A project with this title already exists.” was returned.                  | Pass        |
| 6   | Update a project without changing its title.                                                   | Update succeeds because the unique rule ignores the current row.                 | The project saved with the same title and updated description.             | Pass        |

Validation failures redirect back with field errors and flashed input. Inertia's `useForm` retains the component form state on an error response, so values are not cleared while the user corrects a field.

## Screenshots to include in the submitted PDF

Capture these screens from the running app and label each figure. The management screens require a registered, logged-in user.

1. Public portfolio with at least one database-backed project. The current capture is `docs/screenshots/public-portfolio.png` and shows the database-backed Projects empty state; add an actual project and replace this capture for submission.
2. Project manager index.
3. Create project page.
4. Edit project page with existing values.
5. Delete confirmation dialog.
6. Success message after saving or deleting.
7. Validation errors shown next to fields.
8. File/folder structure showing the migration, model, request, controller, routes, pages, and shared form.

## Code map and explanations

The complete implementation is in the files below. Include their source in the final PDF appendix.

| File                                                                           | Explanation                                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `database/migrations/2026_11_01_000000_create_projects_table.php`              | Defines the five project fields and timestamps.                                            |
| `database/migrations/2026_11_02_000001_add_unique_title_to_projects_table.php` | Adds a database-level unique index to reinforce application validation.                    |
| `app/Models/Project.php`                                                       | Defines the Eloquent model and the safe mass-assignment fields.                            |
| `app/Http/Requests/ProjectRequest.php`                                         | Centralizes authorization, field validation, update-aware uniqueness, and custom messages. |
| `app/Http/Controllers/ProjectController.php`                                   | Handles index/create/edit rendering and validated create/update/delete operations.         |
| `routes/web.php`                                                               | Exposes the public portfolio and authenticated resource routes.                            |
| `resources/js/components/projects/project-form.tsx`                            | Reusable form for creating and editing, including inline field errors.                     |
| `resources/js/pages/projects/index.tsx`                                        | Lists projects, links to create/edit, confirms delete, and displays success feedback.      |
| `resources/js/pages/projects/create.tsx`                                       | Wraps the shared form in the authenticated app layout.                                     |
| `resources/js/pages/projects/edit.tsx`                                         | Passes the selected project into the shared form.                                          |
| `resources/js/pages/welcome.tsx`                                               | Renders the public portfolio and database-backed filtered project cards.                   |
| `app/Http/Middleware/HandleInertiaRequests.php`                                | Shares authentication and flash success data with Inertia pages.                           |

## Video demonstration outline

The video must be screen-recorded with the student's own narration; it has not been recorded or uploaded as part of this source-code task. Record it continuously and add the resulting shareable Google Drive or unlisted YouTube URL to the submitted report.

1. Introduce yourself, the portfolio, and why Projects is the dynamic section.
2. Show the migration, model, request, controller, routes, React pages, and shared form.
3. Explain Route → Controller → Form Request validation → Model → Inertia props/redirect → React.
4. Create, view on the public page, edit, and delete a record.
5. Trigger empty-field, malformed URL, and duplicate-title errors.
6. Without stopping the recording, add a new field end-to-end (migration, model allowlist, validation, form, public display), migrate, and demonstrate it.
7. Answer why the controller, `Route::resource`, `$fillable`, server validation, Inertia errors, and shared form are used.

## Reflection prompts

These are reflection drafts based on the implementation. Personalize them to match what you experienced before submitting:

**What was hardest about converting the static page, and how did you solve it?**  
The hardest part was moving the page into the Laravel/Inertia entry point without losing the original theme, navigation, and responsive styling. I rebuilt the page as React components, moved the theme variables into the Tailwind CSS entry point, and used the public route to pass database projects into the page.

**What did you learn about server-side validation?**  
I learned that browser validation is only a convenience because a request can be sent without using the form. Laravel validates every create and update request, returns field errors through Inertia, and preserves the form state so the user can correct the values. I also learned that update-time unique validation must ignore the current row.

**What would you change when adding another dynamic section?**  
I would first define the fields, database constraints, validation rules, and public display requirements together. I would then reuse the existing patterns for a Form Request, resource controller, shared form, flash feedback, and feature tests, while keeping the new section's data model and validation independent.

## Repository and video links

- Repository: add the submitted GitHub URL here.
- Demonstration video: add the shareable Google Drive or unlisted YouTube URL here.
