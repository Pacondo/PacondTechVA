/* Center-focus landing page carousel. The active design sits in the middle while
   the previous and next designs peek in from both sides. Every card is placed from
   one continuous reel position, so dragging, flicking, dots, keys, trackpad
   swipes and clicking a neighbor all move the same strip. Preview links keep the
   shared full-size image viewer. */
(() => {
  const SCALES = [1, 0.82, 0.68, 0.56]; // card scale at 0, 1, 2 and 3 slots from center
  const MAX_AHEAD = 3; // how far rapid clicks or key repeats may queue ahead
  const mod = (value, size) => ((value % size) + size) % size;
  const easeOut = t => 1 - Math.pow(1 - t, 4);

  // Linear interpolation through values[0], values[1], ... at a fractional distance.
  function along(values, distance) {
    const step = Math.min(Math.floor(distance), values.length - 2);
    const t = Math.min(distance - step, 1);
    return values[step] + (values[step + 1] - values[step]) * t;
  }

  document.querySelectorAll('.landing-carousel').forEach(gallery => {
    const stage = gallery.querySelector('.landing-stage');
    const reel = stage?.querySelector('.landing-reel');
    if (!reel || gallery.dataset.carouselReady) return;
    gallery.dataset.carouselReady = 'true';

    const section = gallery.closest('section') || gallery;
    const cards = [...reel.children].filter(card => card.classList.contains('landing-design-card'));
    const count = cards.length;
    if (!count) {
      gallery.hidden = true;
      return;
    }

    const controls = gallery.querySelector('.landing-carousel-controls');
    const nav = gallery.querySelector('.landing-carousel-nav');
    const dotsHost = gallery.querySelector('.landing-carousel-dots');
    const counter = gallery.querySelector('.landing-carousel-counter');
    const status = gallery.querySelector('.landing-carousel-status');
    const allGrid = gallery.querySelector('.landing-all-grid');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const loop = count > 2;
    // With few designs the wrapping card must vanish before it jumps to the other side.
    const fadeEnd = loop ? Math.min(count / 2, 2.5) : 2.5;
    const projects = cards.map(card => ({
      src: card.querySelector('.landing-preview-link').getAttribute('href'),
      alt: card.querySelector('.landing-card-image img').alt,
      title: card.querySelector('h3').textContent.trim()
    }));

    let index = 0; // active design, 0..count-1
    let target = 0; // unwrapped slot the reel is heading to
    let position = 0; // unwrapped slot currently shown; fractional while moving
    let anchors = SCALES.map(() => 0); // px from center at 0, 1, 2 and 3 slots away
    let animation = null;
    let frame = 0;
    let pointer = null;
    let suppressClick = false;
    let clickTimer;
    let wheelTotal = 0;
    let wheelLocked = false;
    let wheelTimer;
    let expanded = false;
    let changingView = false;
    let finishView = null;
    let viewToggle = null;

    const dots = cards.map((card, item) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'landing-carousel-dot';
      dot.setAttribute('aria-label', 'Show design ' + (item + 1) + ': ' + projects[item].title);
      dot.setAttribute('aria-controls', stage.id);
      dot.addEventListener('click', () => goToIndex(item));
      dotsHost.append(dot);
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', (item + 1) + ' of ' + count + ': ' + projects[item].title);
      card.querySelector('.landing-card-label').textContent =
        String(item + 1).padStart(2, '0') + ' · ' + projects[item].title.toUpperCase();
      card.querySelectorAll('img').forEach(image => { image.draggable = false; });
      bindPreview(card.querySelector('.landing-preview-link'), item);
      return dot;
    });

    function bindPreview(link, item) {
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.button || event.ctrlKey || event.metaKey ||
            event.shiftKey || event.altKey || !window.PortfolioImages?.open) return;
        event.preventDefault();
        window.PortfolioImages.open(projects, item, event.currentTarget);
      });
    }

    function measure() {
      const width = cards[0].offsetWidth;
      const gap = Math.max(12, Math.round(width * 0.05));
      anchors = SCALES.map(() => 0);
      for (let step = 1; step < SCALES.length; step++) {
        anchors[step] = anchors[step - 1] + width * (SCALES[step - 1] + SCALES[step]) / 2 + gap;
      }
    }

    // Signed distance of a card from the center, wrapped so the loop takes the short way.
    function offsetOf(item, at = position) {
      let offset = item - at;
      if (loop) {
        offset = mod(offset, count);
        if (offset >= count / 2) offset -= count;
      }
      return offset;
    }

    function paint() {
      cards.forEach((card, item) => {
        const offset = offsetOf(item);
        const distance = Math.abs(offset);
        const shift = Math.sign(offset) * along(anchors, distance);
        const scale = along(SCALES, distance);
        const fade = distance <= 1 ? 1 : Math.max(0, 1 - (distance - 1) / (fadeEnd - 1));
        const focus = Math.max(0, 1 - distance);
        card.style.transform = 'translateX(' + shift.toFixed(1) + 'px) scale(' + scale.toFixed(4) + ')';
        card.style.opacity = fade.toFixed(3);
        card.style.visibility = fade > 0.01 ? '' : 'hidden';
        card.style.zIndex = String(Math.round(40 - distance * 10));
        card.style.setProperty('--focus', focus.toFixed(3));
      });
    }

    // Logical state: which design is active, announced, and reachable by keyboard.
    function sync(announce) {
      const focused = document.activeElement;
      if (cards.some((card, item) => item !== index && card.contains(focused))) {
        stage.focus({ preventScroll: true });
      }
      cards.forEach((card, item) => {
        const active = item === index;
        const link = card.querySelector('.landing-preview-link');
        card.classList.toggle('is-active', active);
        if (active) {
          card.removeAttribute('aria-hidden');
          link.removeAttribute('tabindex');
        } else {
          card.setAttribute('aria-hidden', 'true');
          link.tabIndex = -1;
        }
        dots[item].setAttribute('aria-current', String(active));
      });
      counter.textContent = (index + 1) + ' / ' + count;
      if (announce) status.textContent = projects[index].title + ', ' + (index + 1) + ' of ' + count;
      if (focused?.disabled) stage.focus({ preventScroll: true });
    }

    function settle() {
      if (loop) position = target = mod(target, count);
      stage.classList.remove('is-moving');
      paint();
    }

    function tick(now) {
      frame = 0;
      if (!animation) return;
      const progress = Math.min(1, Math.max(0, (now - animation.start) / animation.duration));
      position = animation.from + (animation.to - animation.from) * easeOut(progress);
      if (progress < 1) {
        paint();
        frame = requestAnimationFrame(tick);
      } else {
        position = animation.to;
        animation = null;
        settle();
      }
    }

    function stopAnimation() {
      animation = null;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function moveTo(slot, instant = false) {
      if (!loop) slot = Math.max(0, Math.min(count - 1, slot));
      const changed = mod(slot, count) !== index;
      target = slot;
      index = mod(slot, count);
      sync(changed);
      stopAnimation();
      const distance = Math.abs(slot - position);
      if (instant || reducedMotion.matches || distance < 0.001) {
        position = slot;
        settle();
        return;
      }
      stage.classList.add('is-moving');
      animation = {
        from: position,
        to: slot,
        start: performance.now(),
        duration: Math.min(760, 360 + 170 * distance)
      };
      frame = requestAnimationFrame(tick);
    }

    function canNavigate() {
      return !expanded && !changingView && count > 1 && !pointer?.dragging;
    }

    function go(direction) {
      if (!canNavigate() || Math.abs(target + direction - position) > MAX_AHEAD) return;
      moveTo(target + direction);
    }

    function goToIndex(item) {
      if (!canNavigate()) return;
      let delta = item - index;
      if (loop) {
        delta = mod(delta, count);
        if (delta > count / 2) delta -= count;
      }
      if (delta) moveTo(target + delta);
    }

    function setupShowAll() {
      if (count < 3 || !allGrid) return;
      allGrid.replaceChildren(...cards.map((card, item) => {
        const clone = card.cloneNode(true);
        clone.removeAttribute('style');
        clone.classList.remove('is-active');
        clone.removeAttribute('aria-hidden');
        clone.removeAttribute('aria-roledescription');
        clone.removeAttribute('aria-label');
        clone.setAttribute('role', 'listitem');
        clone.querySelectorAll('[tabindex]').forEach(node => node.removeAttribute('tabindex'));
        const imageArea = clone.querySelector('.landing-card-image');
        const preview = document.createElement('button');
        preview.type = 'button';
        preview.className = 'landing-grid-preview';
        preview.setAttribute('aria-label', 'Preview design: ' + projects[item].title);
        preview.setAttribute('aria-haspopup', 'dialog');
        preview.append(imageArea.querySelector('img'));
        bindPreview(preview, item);
        imageArea.replaceChildren(preview);
        bindPreview(clone.querySelector('.landing-preview-link'), item);
        return clone;
      }));
      viewToggle = document.createElement('button');
      viewToggle.type = 'button';
      viewToggle.className = 'landing-view-toggle';
      viewToggle.textContent = 'Show all (' + count + ')';
      viewToggle.setAttribute('aria-expanded', 'false');
      viewToggle.setAttribute('aria-controls', allGrid.id);
      viewToggle.addEventListener('click', () => switchView(!expanded));
      controls.append(viewToggle);
    }

    function scrollToHeading() {
      const heading = section.querySelector('.section-head') || section.querySelector('h2');
      if (!heading) return;
      const navbar = document.getElementById('navbar');
      const top = heading.getBoundingClientRect().top + window.scrollY -
        (navbar?.getBoundingClientRect().height || 0) - 20;
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }

    function switchView(showAll) {
      if (!viewToggle || changingView || expanded === showAll) return;
      releasePointer(null, true);
      if (animation) moveTo(target, true);

      const outgoing = showAll ? stage : allGrid;
      const incoming = showAll ? allGrid : stage;
      if (outgoing.contains(document.activeElement)) viewToggle.focus({ preventScroll: true });
      expanded = showAll;
      changingView = true;
      viewToggle.textContent = showAll ? 'Collapse' : 'Show all (' + count + ')';
      viewToggle.setAttribute('aria-expanded', String(showAll));
      gallery.setAttribute('aria-roledescription', showAll ? 'design gallery' : 'carousel');
      controls.classList.toggle('is-expanded', showAll);
      incoming.hidden = false;
      if (!showAll) {
        measure();
        paint();
      }
      outgoing.inert = true;
      incoming.inert = true;
      let viewFrame;
      let viewTimer;
      finishView = () => {
        clearTimeout(viewTimer);
        cancelAnimationFrame(viewFrame);
        outgoing.hidden = true;
        outgoing.classList.remove('is-view-leaving');
        incoming.classList.remove('is-view-entering');
        outgoing.inert = false;
        incoming.inert = false;
        changingView = false;
        finishView = null;
        if (!showAll) {
          scrollToHeading();
        }
      };
      if (reducedMotion.matches) {
        finishView();
        return;
      }
      incoming.classList.add('is-view-entering');
      outgoing.classList.add('is-view-leaving');
      incoming.getBoundingClientRect();
      viewFrame = requestAnimationFrame(() => {
        incoming.classList.remove('is-view-entering');
        viewTimer = setTimeout(() => finishView?.(), 300);
      });
    }

    measure();
    moveTo(0, true);
    setupShowAll();
    if (count < 2) {
      nav.hidden = true;
      return;
    }

    new ResizeObserver(() => {
      measure();
      paint();
    }).observe(stage);

    gallery.addEventListener('keydown', event => {
      if (expanded || changingView || event.defaultPrevented || event.altKey || event.ctrlKey ||
          event.metaKey || event.shiftKey ||
          event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        go(event.key === 'ArrowRight' ? 1 : -1);
      } else if ((event.key === 'Home' || event.key === 'End') && event.target === stage) {
        event.preventDefault();
        goToIndex(event.key === 'Home' ? 0 : count - 1);
      }
    });

    // Clicking the centered image opens the preview; clicking a peeking card brings it to the center.
    reel.addEventListener('click', event => {
      const card = event.target.closest('.landing-design-card');
      if (!card || event.target.closest('.landing-preview-link')) return;
      const item = cards.indexOf(card);
      if (item === index) {
        if (event.target.closest('.landing-card-image') && window.PortfolioImages?.open) {
          window.PortfolioImages.open(projects, item, card.querySelector('.landing-preview-link'));
        }
        return;
      }
      if (canNavigate()) moveTo(Math.round(position + offsetOf(item)));
    });

    // Horizontal two-finger trackpad swipes (and Shift + wheel) step one design per gesture.
    stage.addEventListener('wheel', event => {
      if (expanded || changingView || event.ctrlKey ||
          Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelTotal = 0;
        wheelLocked = false;
      }, 180);
      if (wheelLocked) return;
      wheelTotal += event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1);
      if (Math.abs(wheelTotal) < 40) return;
      wheelLocked = true;
      go(wheelTotal > 0 ? 1 : -1);
      wheelTotal = 0;
    }, { passive: false });

    stage.addEventListener('dragstart', event => event.preventDefault());
    stage.addEventListener('pointerdown', event => {
      clearTimeout(clickTimer);
      suppressClick = false;
      if (expanded || changingView || !event.isPrimary || event.button !== 0 ||
          event.target.closest('.landing-preview-link')) return;
      pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        origin: position,
        lastX: event.clientX,
        lastTime: event.timeStamp,
        velocity: 0,
        dragging: false
      };
    });

    window.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.dragging) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
          pointer = null;
          return;
        }
        if (Math.abs(dx) <= 8 || Math.abs(dx) <= Math.abs(dy)) return;
        // Catch the reel wherever it is, even mid-animation.
        stopAnimation();
        pointer.dragging = true;
        pointer.origin = position;
        suppressClick = true;
        stage.classList.add('is-dragging', 'is-moving');
        stage.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      const elapsed = event.timeStamp - pointer.lastTime;
      if (elapsed > 0) {
        pointer.velocity = pointer.velocity * 0.5 + ((event.clientX - pointer.lastX) / elapsed) * 0.5;
        pointer.lastX = event.clientX;
        pointer.lastTime = event.timeStamp;
      }
      let slot = pointer.origin - dx / (anchors[1] || 1);
      if (!loop) {
        const last = count - 1;
        if (slot < 0) slot *= 0.35;
        else if (slot > last) slot = last + (slot - last) * 0.35;
      }
      position = slot;
      paint();
    }, { passive: false });

    function releasePointer(event, cancelled = false) {
      if (!pointer || (event && event.pointerId !== pointer.id)) return;
      const released = pointer;
      pointer = null;
      stage.classList.remove('is-dragging');
      if (stage.hasPointerCapture(released.id)) stage.releasePointerCapture(released.id);
      if (!released.dragging) return;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { suppressClick = false; }, 120);
      if (cancelled) {
        moveTo(Math.round(position));
        return;
      }
      // Project the release speed forward; a quick flick or a deliberate short drag
      // always moves at least one design in that direction.
      const recent = event && event.timeStamp - released.lastTime < 120;
      const velocity = recent ? released.velocity : 0; // px per ms; negative = toward next
      const start = Math.round(released.origin);
      const travelled = position - released.origin;
      const direction = Math.abs(velocity) > 0.35 ? -Math.sign(velocity) :
        Math.abs(travelled) > 0.12 ? Math.sign(travelled) : 0;
      let slot = Math.round(position - (velocity * 180) / (anchors[1] || 1));
      if (slot === start && direction) slot = start + direction;
      slot = Math.max(start - MAX_AHEAD, Math.min(start + MAX_AHEAD, slot));
      moveTo(slot);
    }

    window.addEventListener('pointerup', event => releasePointer(event));
    window.addEventListener('pointercancel', event => releasePointer(event, true));
    window.addEventListener('blur', () => releasePointer(null, true));
    stage.addEventListener('lostpointercapture', event => {
      // Touch starts with implicit capture on the touched element; that transfer
      // bubbles through here. Only losing the stage's own capture cancels.
      if (event.target === stage) releasePointer(event, true);
    });
    stage.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    reducedMotion.addEventListener('change', () => {
      if (!reducedMotion.matches) return;
      if (animation) moveTo(target, true);
      finishView?.();
    });
  });
})();
