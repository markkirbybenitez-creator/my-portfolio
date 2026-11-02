import { type Project } from '@/components/projects/project-form';

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <article className="border-line bg-surface flex flex-col rounded-xl border p-6">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-muted mt-2 grow">{project.description}</p>
            <p className="mt-4 font-mono text-sm">{project.technologies}</p>
            {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-accent mt-4 font-semibold underline">
                    View project
                </a>
            )}
        </article>
    );
}
