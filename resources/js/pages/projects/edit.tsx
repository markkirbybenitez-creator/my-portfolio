import ProjectForm, { type Project } from '@/components/projects/project-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function EditProject({ project }: { project: Project }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Projects', href: '/projects' },
        { title: 'Edit', href: `/projects/${project.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <ProjectForm project={project} />
        </AppLayout>
    );
}
