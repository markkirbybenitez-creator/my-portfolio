import { Link } from '@inertiajs/react';
import { useState } from 'react';

type Props = {
    authenticated: boolean;
    theme: 'light' | 'dark';
    onThemeChange: () => void;
};

const links = [
    ['About', 'about'],
    ['Skills', 'skills'],
    ['Projects', 'projects'],
    ['Education', 'education'],
    ['Contact', 'contact'],
];

export default function PortfolioNavbar({ authenticated, theme, onThemeChange }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="border-line bg-bg/90 sticky top-0 z-40 border-b backdrop-blur">
            <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main navigation">
                <a href="#home" className="font-mono text-lg font-semibold">
                    mk<span className="text-accent">.</span>benitez
                </a>
                <ul
                    id="nav-menu"
                    className={`${menuOpen ? 'flex' : 'hidden'} border-line bg-bg absolute inset-x-0 top-full flex-col gap-1 border-b p-4 md:static md:flex md:flex-row md:gap-6 md:border-0 md:p-0`}
                >
                    {links.map(([label, id]) => (
                        <li key={id}>
                            <a className="hover:text-accent block py-2" href={`#${id}`} onClick={() => setMenuOpen(false)}>
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="border-line hover:border-accent rounded-lg border px-3 py-2 font-mono text-sm"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        onClick={onThemeChange}
                    >
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                    <Link
                        href={authenticated ? '/projects' : '/login'}
                        className="border-line hover:border-accent hidden rounded-lg border px-3 py-2 font-mono text-sm sm:block"
                    >
                        {authenticated ? 'Manage' : 'Admin login'}
                    </Link>
                    <button
                        id="menu-toggle"
                        type="button"
                        className="border-line rounded-lg border px-3 py-2 font-mono text-sm md:hidden"
                        aria-expanded={menuOpen}
                        aria-controls="nav-menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        Menu
                    </button>
                </div>
            </nav>
        </header>
    );
}
