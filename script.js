/* =====================
   SCROLL REVEAL
   ===================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
  revealObserver.observe(el);
});

/* =====================
   STICKY NAVIGATION
   ===================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

/* =====================
   MOBILE MENU
   ===================== */
const mobMenu = document.getElementById('mobMenu');

function openMenu() {
  mobMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on link click
mobMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* =====================
   HERO ENTRANCE ANIMATION
   ===================== */
window.addEventListener('DOMContentLoaded', () => {
  const heroElements = document.querySelectorAll(
    '.hero-badge, .hero-title, .hero-sub, .hero-desc, .hero-actions, .hero-stats'
  );
  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .7s ease ${i * 0.1}s, transform .7s ease ${i * 0.1}s`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    });
  });


});

/* =====================
   CARROSSEL (setas prev/next)
   ===================== */
document.querySelectorAll('[data-car-target]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const track = document.getElementById(btn.dataset.carTarget);
    if (!track) return;
    const card = track.querySelector(':scope > *');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const step = card ? card.getBoundingClientRect().width + gap : 300;
    track.scrollBy({ left: btn.dataset.carDir === 'prev' ? -step : step, behavior: 'smooth' });
  });
});

/* =====================
   SMOOTH ANCHOR SCROLL
   ===================== */
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
