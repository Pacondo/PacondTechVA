/* Native touch scrolling, keyboard navigation, and mouse dragging for landing designs. */
(() => {
  document.querySelectorAll('.landing-gallery').forEach(gallery => {
    const track = gallery.querySelector('.landing-design-grid');
    if (!track || gallery.dataset.galleryReady) return;
    gallery.dataset.galleryReady = 'true';

    const slides = [...track.children].filter(item => item.classList.contains('landing-design-card'));
    const controls = gallery.querySelector('.landing-gallery-controls');
    const previous = gallery.querySelector('.landing-gallery-prev');
    const next = gallery.querySelector('.landing-gallery-next');
    const status = gallery.querySelector('.landing-gallery-status');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let pointer = null;
    let suppressClick = false;
    let clickTimer;
    let scrollTimer;
    let lastWidth = track.clientWidth;

    if (controls) controls.hidden = slides.length < 2;
    if (slides.length < 2) track.tabIndex = -1;

    slides.forEach((slide, position) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${position + 1} of ${slides.length}`);
      slide.querySelectorAll('img').forEach(image => { image.draggable = false; });
    });

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function offsetFor(position) {
      return Math.max(0, Math.min(maxScroll(), slides[position].offsetLeft - slides[0].offsetLeft));
    }

    function nearestIndex() {
      let nearest = 0;
      let distance = Infinity;
      slides.forEach((slide, position) => {
        const difference = Math.abs(track.scrollLeft - offsetFor(position));
        if (difference < distance) {
          nearest = position;
          distance = difference;
        }
      });
      return nearest;
    }

    function update(position) {
      index = position;
      const focused = document.activeElement;
      if (slides.some((slide, item) => item !== index && slide.contains(focused)) ||
          (focused === previous && index === 0) ||
          (focused === next && index === slides.length - 1)) {
        track.focus({ preventScroll: true });
      }
      slides.forEach((slide, item) => {
        const inactive = item !== index;
        slide.inert = inactive;
        if (inactive) slide.setAttribute('aria-hidden', 'true');
        else slide.removeAttribute('aria-hidden');
      });
      if (previous) previous.disabled = index === 0 || !slides.length;
      if (next) next.disabled = index >= slides.length - 1;
      const label = slides.length ? `${index + 1} / ${slides.length}` : '0 / 0';
      if (status && status.textContent !== label) status.textContent = label;
    }

    function navigate(position, instant = false) {
      if (!slides.length) return;
      const destination = Math.max(0, Math.min(slides.length - 1, position));
      clearTimeout(scrollTimer);
      update(destination);
      track.scrollTo({
        left: offsetFor(destination),
        behavior: instant || reducedMotion.matches ? 'instant' : 'smooth'
      });
    }

    function synchronize() {
      clearTimeout(scrollTimer);
      if (!pointer?.dragging && slides.length) update(nearestIndex());
    }

    update(0);
    if (slides.length < 2) return;

    previous?.addEventListener('click', () => navigate(index - 1));
    next?.addEventListener('click', () => navigate(index + 1));
    gallery.addEventListener('keydown', event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
          event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      const destinations = {
        ArrowLeft: index - 1,
        ArrowRight: index + 1,
        Home: 0,
        End: slides.length - 1
      };
      if (!Object.prototype.hasOwnProperty.call(destinations, event.key)) return;
      event.preventDefault();
      navigate(destinations[event.key]);
    });

    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      if (!pointer?.dragging) scrollTimer = setTimeout(synchronize, 150);
    }, { passive: true });
    track.addEventListener('scrollend', synchronize);

    track.addEventListener('dragstart', event => event.preventDefault());
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !event.isPrimary) return;
      clearTimeout(clickTimer);
      suppressClick = false;
      pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        scroll: track.scrollLeft,
        startIndex: nearestIndex(),
        distance: 0,
        dragging: false
      };
    });

    function finishDrag(event) {
      if (!pointer || (event?.pointerId !== undefined && event.pointerId !== pointer.id)) return;
      const finished = pointer;
      pointer = null;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(finished.id)) track.releasePointerCapture(finished.id);
      if (!finished.dragging) return;
      suppressClick = true;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { suppressClick = false; }, 0);
      const destination = Math.abs(finished.distance) >= 60
        ? finished.startIndex + (finished.distance < 0 ? 1 : -1)
        : nearestIndex();
      navigate(destination);
    }

    window.addEventListener('pointermove', event => {
      if (!pointer || event.pointerId !== pointer.id) return;
      if (!(event.buttons & 1)) {
        finishDrag(event);
        return;
      }
      const horizontal = event.clientX - pointer.x;
      const vertical = event.clientY - pointer.y;
      if (!pointer.dragging) {
        if (Math.abs(vertical) > 8 && Math.abs(vertical) > Math.abs(horizontal)) {
          pointer = null;
          return;
        }
        if (Math.abs(horizontal) <= 8 || Math.abs(horizontal) <= Math.abs(vertical)) return;
        pointer.dragging = true;
        suppressClick = true;
        clearTimeout(scrollTimer);
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
      }
      pointer.distance = horizontal;
      event.preventDefault();
      track.scrollLeft = Math.max(0, Math.min(maxScroll(), pointer.scroll - horizontal));
    }, { passive: false });

    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    window.addEventListener('blur', () => finishDrag());
    track.addEventListener('lostpointercapture', finishDrag);
    track.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    function preservePosition() {
      const width = track.clientWidth;
      if (!width || Math.abs(width - lastWidth) < 0.5) return;
      lastWidth = width;
      if (pointer) finishDrag();
      navigate(index, true);
    }

    if ('ResizeObserver' in window) new ResizeObserver(preservePosition).observe(track);
    else window.addEventListener('resize', preservePosition);
  });
})();
