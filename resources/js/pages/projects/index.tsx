import { type Project } from '@/components/projects/project-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Projects', href: '/projects' }];

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const { flash } = usePage<SharedData>().props;
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);

    function removeProject() {
        if (!deletingProject) return;

        router.delete(`/projects/${deletingProject.id}`, {
            onFinish: () => setDeletingProject(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Projects" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">Manage portfolio projects</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Add, edit, or remove projects shown on your public portfolio.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm underline underline-offset-4">
                            View portfolio
                        </Link>
                        <Link href="/projects/create" className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
                            Add project
                        </Link>
                    </div>
                </div>

                {flash.success && (
                    <p
                        className="rounded-md border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-800 dark:text-green-300"
                        role="status"
                    >
                        {flash.success}
                    </p>
                )}

                {projects.length === 0 ? (
                    <p className="border-sidebar-border/70 text-muted-foreground dark:border-sidebar-border rounded-xl border border-dashed p-6 text-sm">
                        No projects yet. Add your first project to display it on your public portfolio.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <article key={project.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-5">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <h2 className="font-semibold">{project.title}</h2>
                                        <p className="text-muted-foreground mt-1 text-xs capitalize">
                                            {project.category} &middot; {project.technologies}
                                        </p>
                                        <p className="text-muted-foreground mt-3 text-sm">{project.description}</p>
                                        {project.url && (
                                            <a
                                                className="mt-2 inline-block text-sm underline"
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Project link
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Link href={`/projects/${project.id}/edit`} className="border-input rounded-md border px-3 py-1.5 text-sm">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setDeletingProject(project)}
                                            className="border-destructive text-destructive rounded-md border px-3 py-1.5 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
            {deletingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <section
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-project-title"
                        aria-describedby="delete-project-description"
                        className="border-sidebar-border bg-background w-full max-w-md rounded-xl border p-6 shadow-xl"
                    >
                        <h2 id="delete-project-title" className="text-lg font-semibold">
                            Delete project?
                        </h2>
                        <p id="delete-project-description" className="text-muted-foreground mt-2 text-sm">
                            Delete &quot;{deletingProject.title}&quot;? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setDeletingProject(null)}
                                className="border-input rounded-md border px-4 py-2 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={removeProject}
                                className="bg-destructive text-destructive-foreground rounded-md px-4 py-2 text-sm font-medium"
                            >
                                Delete project
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </AppLayout>
    );
}
