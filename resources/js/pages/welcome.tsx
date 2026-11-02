import PortfolioFooter from '@/components/portfolio-footer';
import PortfolioNavbar from '@/components/portfolio-navbar';
import ProjectCard from '@/components/projects/project-card';
import { type Project } from '@/components/projects/project-form';
import SectionTitle from '@/components/section-title';
import { Head } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';

type Props = {
    projects: Project[];
    auth: { user: { id: number } | null };
};

const filters = ['all', 'school', 'personal', 'planned'] as const;
type ProjectFilter = (typeof filters)[number];

export default function Welcome({ projects, auth }: Props) {
    const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [themeReady, setThemeReady] = useState(false);
    const [contactStatus, setContactStatus] = useState('');
    const visibleProjects = projects.filter((project) => activeFilter === 'all' || project.category === activeFilter);

    useEffect(() => {
        let savedTheme: string | null = null;
        try {
            savedTheme = window.localStorage.getItem('appearance');
        } catch {
            savedTheme = null;
        }
        setTheme(
            savedTheme === 'dark' || savedTheme === 'light'
                ? savedTheme
                : window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light',
        );
        setThemeReady(true);
    }, []);

    useEffect(() => {
        if (!themeReady) return;

        document.documentElement.classList.toggle('dark', theme === 'dark');
        try {
            window.localStorage.setItem('appearance', theme);
        } catch {
            // Keep the selected theme for this page even when storage is unavailable.
        }
    }, [theme, themeReady]);

    function submitContact(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setContactStatus('Thank you! Your message was validated (demo only, nothing was sent).');
        event.currentTarget.reset();
    }

    return (
        <>
            <Head title="Mark Kirby Benitez | BSIT Portfolio">
                <meta name="description" content="Portfolio of Mark Kirby Benitez, BSIT 3 student and aspiring IT professional." />
            </Head>
            <div className="bg-bg text-ink min-h-screen font-sans antialiased">
                <a href="#main" className="bg-accent text-bg sr-only fixed top-2 left-2 z-50 rounded px-4 py-2 focus:not-sr-only">
                    Skip to content
                </a>
                <PortfolioNavbar
                    authenticated={Boolean(auth.user)}
                    theme={theme}
                    onThemeChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />

                <main id="main">
                    <section id="home" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
                        <div>
                            <p className="text-accent mb-3 font-mono">BSIT 3 &middot; Block 5</p>
                            <h1 className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">Hi, I&apos;m Mark Kirby Benitez.</h1>
                            <p className="text-muted mt-5 max-w-prose text-lg">
                                Aspiring IT professional building clean, responsive, and accessible web experiences.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a href="#projects" className="bg-accent text-bg rounded-lg px-6 py-3 font-semibold hover:opacity-90">
                                    View my projects
                                </a>
                                <a href="#contact" className="border-line hover:border-accent rounded-lg border px-6 py-3">
                                    Contact me
                                </a>
                            </div>
                        </div>
                        <div
                            className="border-line bg-surface rounded-xl border p-5 font-mono text-sm leading-relaxed"
                            aria-label="Profile summary card"
                        >
                            <p className="text-muted">// profile.js</p>
                            <p>
                                <span className="text-accent">const</span> me = {'{'}
                            </p>
                            <p className="pl-4">name: &quot;Mark Kirby Benitez&quot;,</p>
                            <p className="pl-4">program: &quot;BSIT&quot;,</p>
                            <p className="pl-4">year: 3, block: 5,</p>
                            <p className="pl-4">focus: &quot;Web development&quot;</p>
                            <p>{'}'};</p>
                        </div>
                    </section>

                    <section id="about" className="border-line mx-auto max-w-6xl border-t px-4 py-14">
                        <SectionTitle>About Me</SectionTitle>
                        <div className="grid items-start gap-8 md:grid-cols-3">
                            <div className="mx-auto md:mx-0">
                                <img
                                    src="/images/me.jpg"
                                    alt="Portrait photo of Mark Kirby Benitez in a navy suit and polka-dot tie"
                                    width="600"
                                    height="600"
                                    className="border-accent h-48 w-48 rounded-full border-4 object-cover md:h-56 md:w-56"
                                />
                            </div>
                            <div className="text-muted space-y-4 md:col-span-2">
                                <p>
                                    I&apos;m a third-year Bachelor of Science in Information Technology student who enjoys learning how technology can
                                    solve practical problems.
                                </p>
                                <p>
                                    <strong className="text-ink">My goals:</strong> To keep growing as a developer and build useful, accessible
                                    applications for people and communities.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="skills" className="border-line mx-auto max-w-6xl border-t px-4 py-14">
                        <SectionTitle>Skills</SectionTitle>
                        <div className="grid gap-6 md:grid-cols-2">
                            {[
                                { title: 'Technical', skills: ['HTML5', 'CSS', 'Tailwind CSS', 'JavaScript', 'React', 'PHP'] },
                                { title: 'Soft skills', skills: ['Teamwork', 'Problem solving', 'Communication', 'Adaptability'] },
                            ].map(({ title, skills }) => (
                                <article key={title} className="border-line bg-surface rounded-xl border p-6">
                                    <h3 className="mb-4 text-xl font-bold">{title}</h3>
                                    <ul className="flex flex-wrap gap-2 font-mono text-sm">
                                        {skills.map((skill) => (
                                            <li key={skill} className="border-line rounded-full border px-3 py-1">
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="projects" className="border-line mx-auto max-w-6xl border-t px-4 py-14">
                        <SectionTitle className="mb-6">Projects</SectionTitle>
                        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    className={`border-line rounded-full border px-4 py-1.5 font-mono text-sm capitalize ${activeFilter === filter ? 'bg-accent text-bg' : ''}`}
                                    aria-pressed={activeFilter === filter}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                            {visibleProjects.length === 0 && (
                                <p className="text-muted">
                                    {projects.length === 0 ? 'Projects will appear here soon.' : 'No projects in this category yet.'}
                                </p>
                            )}
                        </div>
                    </section>

                    <section id="education" className="border-line mx-auto max-w-6xl border-t px-4 py-14">
                        <SectionTitle>Education &amp; Experience</SectionTitle>
                        <ol className="border-accent space-y-8 border-l-2 pl-6">
                            <li>
                                <p className="text-accent font-mono text-sm">Currently</p>
                                <h3 className="text-xl font-bold">Bachelor of Science in Information Technology</h3>
                                <p className="text-muted">Currently BSIT 3, Block 5</p>
                            </li>
                            <li>
                                <p className="text-accent font-mono text-sm">Learning</p>
                                <h3 className="text-xl font-bold">Web development</h3>
                                <p className="text-muted">Building responsive web applications and strengthening full-stack development skills.</p>
                            </li>
                        </ol>
                    </section>

                    <section id="contact" className="border-line mx-auto max-w-6xl border-t px-4 py-14">
                        <SectionTitle>Contact</SectionTitle>
                        <div className="grid gap-10 md:grid-cols-2">
                            <form className="space-y-5" onSubmit={submitContact}>
                                <div>
                                    <label htmlFor="name" className="mb-1 block font-semibold">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="border-line bg-surface w-full rounded-lg border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="mb-1 block font-semibold">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="border-line bg-surface w-full rounded-lg border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="mb-1 block font-semibold">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        minLength={10}
                                        required
                                        className="border-line bg-surface w-full rounded-lg border px-3 py-2"
                                    />
                                </div>
                                <button type="submit" className="bg-accent text-bg rounded-lg px-6 py-3 font-semibold hover:opacity-90">
                                    Send message
                                </button>
                                <p className="font-semibold" role="status">
                                    {contactStatus}
                                </p>
                            </form>
                            <div>
                                <h3 className="mb-4 text-xl font-bold">Find me online</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a className="hover:text-accent underline" href="mailto:your.email@example.com">
                                            your.email@example.com
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="hover:text-accent underline"
                                            href="https://github.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            GitHub
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="hover:text-accent underline"
                                            href="https://www.linkedin.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            LinkedIn
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </main>

                <PortfolioFooter />
            </div>
        </>
    );
}
