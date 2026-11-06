/* ═══════════════════════════════════
   FACETED POINTER
═══════════════════════════════════ */
(function () {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  const pointer = cursor.querySelector('.cursor-pointer');
  if (!pointer) return;
  const root = document.documentElement;
  const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
  const nativeTargets = 'input, textarea, select, iframe, video, object, embed, [contenteditable]:not([contenteditable="false"]), [disabled], [aria-disabled="true"]';
  const interactiveTargets = 'a[href], button, summary, [role="button"], [role="link"], .port-gallery-main, .port-gallery-thumb, .cert-clickable, .lightbox';
  let mouseX = 0, mouseY = 0;
  let scrollFrame = 0, visible = false;

  function hide() {
    visible = false;
    root.classList.remove('custom-cursor-active');
    cursor.classList.remove('is-hovering', 'is-pressed');
    cursor.dataset.action = '';
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }

  function updateTarget(target) {
    if (!(target instanceof Element) || target.closest(nativeTargets)) {
      hide();
      return;
    }
    cursor.classList.toggle('is-hovering', Boolean(target.closest(interactiveTargets)));
    cursor.dataset.action = target.closest('.cert-clickable') ? 'preview' :
      target.closest('.lightbox-close') || target.matches('.lightbox') ? 'close' : '';
    visible = true;
    root.classList.add('custom-cursor-active');
  }

  function move(event) {
    if (!enabled.matches || event.pointerType !== 'mouse') {
      hide();
      return;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;
    // The SVG tip is at (2, 2); place it directly at the mouse hotspot.
    pointer.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;
    updateTarget(event.target);
  }

  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerover', move, { passive: true });
  document.addEventListener('pointerdown', event => {
    move(event);
    if (visible && event.button === 0) cursor.classList.add('is-pressed');
  }, { passive: true });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) hide();
  }, { passive: true });
  document.addEventListener('pointercancel', hide, { passive: true });
  document.addEventListener('dragstart', hide);
  document.addEventListener('contextmenu', hide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') hide();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });
  window.addEventListener('blur', hide);
  // Refresh hover feedback when content scrolls beneath a stationary pointer.
  window.addEventListener('scroll', () => {
    if (!visible || scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateTarget(document.elementFromPoint(mouseX, mouseY));
    });
  }, { passive: true, capture: true });
  enabled.addEventListener('change', hide);
})();

/* ═══════════════════════════════════
   PORTFOLIO GALLERY THUMBNAILS
═══════════════════════════════════ */
document.querySelectorAll('.port-gallery').forEach(gallery => {
  const mainImg   = gallery.querySelector('.port-gallery-main img');
  const mainDiv   = gallery.querySelector('.port-gallery-main');
  const thumbs    = Array.from(gallery.querySelectorAll('.port-gallery-thumb'));
  const prevBtn   = gallery.querySelector('.gallery-prev');
  const nextBtn   = gallery.querySelector('.gallery-next');
  let idx = 0;

  function goTo(i) {
    idx = i;
    const full = thumbs[idx].dataset.full;
    mainImg.src = full;
    mainDiv.dataset.src = full;
    thumbs.forEach((t, ti) => t.classList.toggle('active', ti === idx));
    if (prevBtn) prevBtn.classList.toggle('hidden', idx === 0);
    if (nextBtn) nextBtn.classList.toggle('hidden', idx === thumbs.length - 1);
  }

  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(idx - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(idx + 1); });

  goTo(0);
});

/* ═══════════════════════════════════
   PORTFOLIO SHOW MORE / LESS
═══════════════════════════════════ */
document.querySelectorAll('.port-body p').forEach(p => {
  if (p.scrollHeight <= p.clientHeight) return;
  const btn = document.createElement('button');
  btn.className = 'show-more-btn';
  btn.textContent = 'Show more';
  p.after(btn);
  btn.addEventListener('click', () => {
    const expanded = p.classList.toggle('expanded');
    btn.textContent = expanded ? 'Show less' : 'Show more';
  });
});

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
const crmSubTabs = document.getElementById('crmSubTabs');

const subTabBars = { crm: crmSubTabs };

let activeCategory  = 'ghl';
let activeSubFilter = 'all';

function showCards(category, subfilter) {
  portCards.forEach(card => {
    const matchCat = card.dataset.category === category;
    /* subfilter stays 'all' for categories with no sub-tab row (Zapier, Make) */
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
      const subBtns = bar.querySelectorAll('.sub-tab-btn');
      subBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
      if (subBtns[0]) activeSubFilter = subBtns[0].dataset.subfilter;
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
const lbPrev        = document.getElementById('lbPrev');
const lbNext        = document.getElementById('lbNext');

let lbImages = [];
let lbIdx    = 0;

function openLightbox(imgs, idx) {
  lbImages = imgs;
  lbIdx    = idx;
  lightboxImg.src = lbImages[lbIdx];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  syncArrows();
}

function syncArrows() {
  lbPrev.classList.toggle('hidden', lbIdx === 0);
  lbNext.classList.toggle('hidden', lbIdx === lbImages.length - 1);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

document.querySelectorAll('.cert-clickable').forEach(el => {
  el.addEventListener('click', () => {
    const gallery = el.closest('.port-gallery');
    if (gallery) {
      const imgs = Array.from(gallery.querySelectorAll('.port-gallery-thumb')).map(t => t.dataset.full);
      const curIdx = Array.from(gallery.querySelectorAll('.port-gallery-thumb')).findIndex(t => t.classList.contains('active'));
      openLightbox(imgs, curIdx >= 0 ? curIdx : 0);
    } else {
      openLightbox([el.dataset.src], 0);
    }
  });
});

lbPrev.addEventListener('click', (e) => { e.stopPropagation(); lbIdx--; lightboxImg.src = lbImages[lbIdx]; syncArrows(); });
lbNext.addEventListener('click', (e) => { e.stopPropagation(); lbIdx++; lightboxImg.src = lbImages[lbIdx]; syncArrows(); });
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft'  && lbIdx > 0) { lbIdx--; lightboxImg.src = lbImages[lbIdx]; syncArrows(); }
  if (e.key === 'ArrowRight' && lbIdx < lbImages.length - 1) { lbIdx++; lightboxImg.src = lbImages[lbIdx]; syncArrows(); }
});

/* ═══════════════════════════════════
   3D CARD TILT
═══════════════════════════════════ */
const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canTilt) {
  const MAX_TILT = 9;
  document.querySelectorAll('.port-card, .service-card, .cert-card').forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mouseenter', () => card.classList.add('is-tilting'));

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--glare-x', `${px * 100}%`);
      card.style.setProperty('--glare-y', `${py * 100}%`);
      card.style.transform =
        `perspective(900px) rotateX(${(0.5 - py) * MAX_TILT}deg) ` +
        `rotateY(${(px - 0.5) * MAX_TILT}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  });
}
