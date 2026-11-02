// ===== 1. MOBILE MENU TOGGLE =====
const menuBtn = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('hidden') === false; // true when menu is now visible
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});
// Close the menu after a link is clicked (mobile)
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ===== 2. DARK / LIGHT MODE (saved in localStorage) =====
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  root.classList.toggle('dark', theme === 'dark');
  themeBtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
applyTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

// ===== 3. PROJECT FILTER BY CATEGORY =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach((b) => {
      const active = b === btn;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('bg-accent', active);
      b.classList.toggle('text-bg', active);
    });
    projects.forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});
document.querySelector('.filter-btn[data-filter="all"]').click(); // highlight "All" on load

// ===== 4. CONTACT FORM VALIDATION (front-end only) =====
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(id, message) {
  document.getElementById(id + '-error').textContent = message; // textContent, not innerHTML (safe)
  document.getElementById(id).setAttribute('aria-invalid', message ? 'true' : 'false');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let valid = true;

  showError('name', name ? '' : 'Please enter your name.');
  showError('email', emailPattern.test(email) ? '' : 'Please enter a valid email address.');
  showError('message', message.length >= 10 ? '' : 'Message must be at least 10 characters.');
  if (!name || !emailPattern.test(email) || message.length < 10) valid = false;

  status.textContent = valid ? 'Thank you! Your message was validated (demo only, nothing was sent).' : '';
  if (valid) form.reset();
});
