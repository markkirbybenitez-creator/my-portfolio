import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

export type Project = {
    id: number;
    title: string;
    description: string;
    category: 'school' | 'personal' | 'planned';
    technologies: string;
    url: string | null;
};

type ProjectData = Omit<Project, 'id'>;

const categories: ProjectData['category'][] = ['school', 'personal', 'planned'];

export default function ProjectForm({ project }: { project?: Project }) {
    const form = useForm<ProjectData>({
        title: project?.title ?? '',
        description: project?.description ?? '',
        category: project?.category ?? 'school',
        technologies: project?.technologies ?? '',
        url: project?.url ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const options = {
            onSuccess: () => form.reset(),
        };

        if (project) {
            form.put(`/projects/${project.id}`, options);
        } else {
            form.post('/projects', options);
        }
    }

    return (
        <>
            <Head title={project ? 'Edit Project' : 'Create Project'} />
            <div className="mx-auto w-full max-w-2xl p-4">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{project ? 'Edit project' : 'Create a project'}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Fields marked required must be filled in.</p>
                    </div>
                    <Link href="/projects" className="text-sm underline underline-offset-4">
                        Back to projects
                    </Link>
                </div>

                <form onSubmit={submit} className="border-sidebar-border/70 dark:border-sidebar-border space-y-5 rounded-xl border p-6">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium">
                            Title <span aria-hidden="true">*</span>
                        </label>
                        <Input
                            id="title"
                            value={form.data.title}
                            onChange={(event) => form.setData('title', event.target.value)}
                            maxLength={120}
                            required
                            aria-invalid={Boolean(form.errors.title)}
                            aria-describedby={form.errors.title ? 'title-error' : undefined}
                        />
                        {form.errors.title && (
                            <p id="title-error" className="text-destructive mt-1 text-sm" role="alert">
                                {form.errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-1 block text-sm font-medium">
                            Description <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            value={form.data.description}
                            onChange={(event) => form.setData('description', event.target.value)}
                            maxLength={1000}
                            required
                            className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden"
                            aria-invalid={Boolean(form.errors.description)}
                            aria-describedby={form.errors.description ? 'description-error' : undefined}
                        />
                        {form.errors.description && (
                            <p id="description-error" className="text-destructive mt-1 text-sm" role="alert">
                                {form.errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="category" className="mb-1 block text-sm font-medium">
                            Category <span aria-hidden="true">*</span>
                        </label>
                        <select
                            id="category"
                            value={form.data.category}
                            onChange={(event) => {
                                const category = categories.find((option) => option === event.target.value);
                                if (category) form.setData('category', category);
                            }}
                            required
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            aria-invalid={Boolean(form.errors.category)}
                            aria-describedby={form.errors.category ? 'category-error' : undefined}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {form.errors.category && (
                            <p id="category-error" className="text-destructive mt-1 text-sm" role="alert">
                                {form.errors.category}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="technologies" className="mb-1 block text-sm font-medium">
                            Technologies <span aria-hidden="true">*</span>
                        </label>
                        <Input
                            id="technologies"
                            value={form.data.technologies}
                            onChange={(event) => form.setData('technologies', event.target.value)}
                            placeholder="React, Laravel, Tailwind CSS"
                            maxLength={255}
                            required
                            aria-invalid={Boolean(form.errors.technologies)}
                            aria-describedby={form.errors.technologies ? 'technologies-error' : undefined}
                        />
                        {form.errors.technologies && (
                            <p id="technologies-error" className="text-destructive mt-1 text-sm" role="alert">
                                {form.errors.technologies}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="url" className="mb-1 block text-sm font-medium">
                            Project URL <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <Input
                            id="url"
                            type="url"
                            value={form.data.url ?? ''}
                            onChange={(event) => form.setData('url', event.target.value)}
                            maxLength={2048}
                            aria-invalid={Boolean(form.errors.url)}
                            aria-describedby={form.errors.url ? 'url-error' : undefined}
                        />
                        {form.errors.url && (
                            <p id="url-error" className="text-destructive mt-1 text-sm" role="alert">
                                {form.errors.url}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                        >
                            {form.processing ? 'Saving…' : project ? 'Save changes' : 'Create project'}
                        </button>
                        <Link href="/projects" className="border-input rounded-md border px-4 py-2 text-sm">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
