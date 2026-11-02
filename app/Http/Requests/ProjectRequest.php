<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $project = $this->route('project');

        return [
            'title' => [
                'required',
                'string',
                'max:120',
                Rule::unique('projects', 'title')->ignore($project),
            ],
            'description' => ['required', 'string', 'max:1000'],
            'category' => ['required', Rule::in(['school', 'personal', 'planned'])],
            'technologies' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.unique' => 'A project with this title already exists.',
            'url.url' => 'Enter a complete project URL, including https://.',
        ];
    }
}
