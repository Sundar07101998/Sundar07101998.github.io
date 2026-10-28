// Mark JS as available so CSS can enable reveal animations
document.documentElement.classList.add('js');

const $ = (s) => document.querySelector(s);

// ---- Mobile menu ----
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
});

// ---- Scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---- Active nav link ----
const links = [...document.querySelectorAll('nav a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

// ---- Back to top ----
const topBtn = $('#top');
window.addEventListener('scroll', () => topBtn.classList.toggle('show', window.scrollY > 600), { passive: true });
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Hero stat count-up (skipped if reduced motion) ----
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(end * p) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// ---- Contact form validation ----
const form = $('#form'), status = $('#status');
const rules = {
  name: (v) => v.trim().length >= 2 || 'Enter your name.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  subject: (v) => v.trim().length >= 3 || 'Enter a subject.',
  message: (v) => v.trim().length >= 10 || 'Write at least 10 characters.'
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  for (const key in rules) {
    const input = form.elements[key], res = rules[key](input.value);
    $('#e-' + key).textContent = res === true ? '' : res;
    input.setAttribute('aria-invalid', res !== true);
    if (res !== true) ok = false;
  }
  if (!ok) { status.textContent = ''; return; }
  // No backend: open the visitor's email app. Swap for fetch() to a form service later.
  const body = `${form.message.value}\n\nFrom: ${form.name.value} (${form.email.value})`;
  location.href = `mailto:sundarvaratharajan222@gmail.com?subject=${encodeURIComponent(form.subject.value)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Opening your email app…';
  form.reset();
});

$('#year').textContent = new Date().getFullYear();
