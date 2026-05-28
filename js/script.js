/* ═══════════════════════════════════
   CURSOR MIRAGE TRAIL
═══════════════════════════════════ */
(function () {
  const TRAIL_COUNT = 8;
  const container   = document.getElementById('cursorMirage');
  const dots        = [];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-trail';
    el.style.opacity = (1 - i / TRAIL_COUNT) * 0.55;
    el.style.transform = `translate(-50%,-50%) scale(${1 - i * 0.07})`;
    container.appendChild(el);
    dots.push({ el, x: -200, y: -200 });
  }

  let mouseX = -200, mouseY = -200;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    let x = mouseX, y = mouseY;
    dots.forEach((dot, i) => {
      dot.el.style.left = x + 'px';
      dot.el.style.top  = y + 'px';
      const prev = dots[i] || { x, y };
      x = prev.x + (x - prev.x) * 0.5;
      y = prev.y + (y - prev.y) * 0.5;
      dot.x = x;
      dot.y = y;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ═══════════════════════════════════
   SUBTITLE FLIP ROTATOR
═══════════════════════════════════ */
const subtitleEl = document.getElementById('heroSubtitle');
const subtitles  = [
  'Your Technical Virtual Assistant',
  'Your Automation Specialist',
  'Your GHL Expert'
];
let subtitleIdx = 0;

setInterval(() => {
  subtitleEl.classList.add('flipping-out');
  setTimeout(() => {
    subtitleIdx = (subtitleIdx + 1) % subtitles.length;
    subtitleEl.textContent = subtitles[subtitleIdx];
    subtitleEl.classList.remove('flipping-out');
    subtitleEl.classList.add('flipping-in');
    setTimeout(() => subtitleEl.classList.remove('flipping-in'), 350);
  }, 350);
}, 3000);


/* ═══════════════════════════════════
   NAVBAR — scroll effect + mobile menu
═══════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ═══════════════════════════════════
   DARK / LIGHT THEME TOGGLE
═══════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const moonSVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunSVG  = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
  themeToggle.innerHTML = isLight ? moonSVG : sunSVG;
});

/* ═══════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - navbar.offsetHeight - 8, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════
   SCROLL-IN ANIMATIONS
   Sibling groups cached once at setup so the observer callback
   doesn't re-query the DOM on every intersection event.
═══════════════════════════════════ */
const siblingGroups = new Map();

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const siblings = siblingGroups.get(entry.target) || [];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('in-view'), idx * 90);
    animObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-up').forEach(el => {
  if (!siblingGroups.has(el)) {
    const group = Array.from(el.parentElement.querySelectorAll('.animate-up'));
    group.forEach(sib => siblingGroups.set(sib, group));
  }
  animObserver.observe(el);
});

/* ═══════════════════════════════════
   PORTFOLIO TABS
═══════════════════════════════════ */
const tabBtns    = document.querySelectorAll('.tab-btn');
const portCards  = document.querySelectorAll('.port-card');
const ghlSubTabs = document.getElementById('ghlSubTabs');
const n8nSubTabs = document.getElementById('n8nSubTabs');

const subTabBars = { ghl: ghlSubTabs, n8n: n8nSubTabs };

let activeCategory  = 'zapier';
let activeSubFilter = 'all';

function showCards(category, subfilter) {
  portCards.forEach(card => {
    const matchCat = card.dataset.category === category;
    const matchSub = subfilter === 'all' || !card.dataset.subcategory || card.dataset.subcategory === subfilter;
    const show = matchCat && matchSub;
    card.style.display = show ? '' : 'none';
    if (show) {
      card.classList.remove('in-view');
      requestAnimationFrame(() => setTimeout(() => card.classList.add('in-view'), 60));
    }
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory  = btn.dataset.filter;
    activeSubFilter = 'all';

    Object.values(subTabBars).forEach(bar => bar && bar.classList.remove('visible'));

    const bar = subTabBars[activeCategory];
    if (bar) {
      bar.classList.add('visible');
      bar.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.subfilter === 'all'));
    }

    showCards(activeCategory, activeSubFilter);
  });
});

document.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const bar = btn.closest('.sub-tab-bar');
    bar.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSubFilter = btn.dataset.subfilter;
    showCards(activeCategory, activeSubFilter);
  });
});

if (tabBtns.length) tabBtns[0].click();

/* ═══════════════════════════════════
   RESUME MODAL
═══════════════════════════════════ */
const resumeModal = document.getElementById('resumeModal');
const resumeFrame = document.getElementById('resumeFrame');
const resumeClose = document.getElementById('resumeClose');
const RESUME_URL  = 'https://drive.google.com/file/d/1EcTcWl2VAlZBifFtNmM-GvL7lCS18QB0/preview';

document.getElementById('resumeBtn').addEventListener('click', (e) => {
  e.preventDefault();
  resumeFrame.src = RESUME_URL;
  resumeModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeResume() {
  resumeModal.classList.remove('open');
  resumeFrame.src = '';
  document.body.style.overflow = '';
}

resumeClose.addEventListener('click', closeResume);
resumeModal.addEventListener('click', (e) => { if (e.target === resumeModal) closeResume(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeResume(); });

/* ═══════════════════════════════════
   CERTIFICATE LIGHTBOX
═══════════════════════════════════ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.cert-clickable').forEach(thumb => {
  thumb.addEventListener('click', () => {
    lightboxImg.src = thumb.dataset.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
