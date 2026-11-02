import ProjectForm from '@/components/projects/project-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Projects', href: '/projects' },
    { title: 'Create', href: '/projects/create' },
];

export default function CreateProject() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <ProjectForm />
        </AppLayout>
    );
}
