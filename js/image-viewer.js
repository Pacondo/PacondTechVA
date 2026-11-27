/* Shared full-resolution image viewer. No image copies or external dependencies. */
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', 'Project image viewer');
  dialog.innerHTML = `
    <div class="viewer-panel">
      <div class="viewer-toolbar">
        <span class="viewer-count" aria-live="polite"></span>
        <div class="viewer-tools">
          <button type="button" class="viewer-zoom" aria-pressed="false">View at 100%</button>
          <button type="button" class="viewer-close" aria-label="Close image viewer">&times;</button>
        </div>
      </div>
      <div class="viewer-stage" tabindex="0" aria-label="Image. At 100% size, scroll to inspect details."><img alt=""></div>
      <div class="viewer-footer">
        <button type="button" class="viewer-prev" aria-label="Previous image">&#8592;</button>
        <p class="viewer-caption"></p>
        <button type="button" class="viewer-next" aria-label="Next image">&#8594;</button>
      </div>
    </div>`;
  document.body.append(dialog);
  const panel = dialog.querySelector('.viewer-panel');
  const stage = dialog.querySelector('.viewer-stage');
  const image = dialog.querySelector('img');
  const zoom = dialog.querySelector('.viewer-zoom');
  const prev = dialog.querySelector('.viewer-prev');
  const next = dialog.querySelector('.viewer-next');
  const cursor = document.getElementById('customCursor');
  const cursorHome = cursor?.parentElement;
  let items = [], index = 0, trigger, previousOverflow;

  function render() {
    image.src = items[index].src;
    image.alt = items[index].alt;
    dialog.querySelector('.viewer-caption').textContent = items[index].alt;
    dialog.querySelector('.viewer-count').textContent = `${index + 1} / ${items.length}`;
    prev.disabled = index === 0;
    next.disabled = index === items.length - 1;
    stage.scrollTop = stage.scrollLeft = 0;
  }
  // Toggles 100% view. When triggered by a click, the clicked spot stays under the pointer.
  function setZoom(active, event) {
    const before = image.getBoundingClientRect();
    const fx = event && before.width ? (event.clientX - before.left) / before.width : 0;
    const fy = event && before.height ? (event.clientY - before.top) / before.height : 0;
    stage.classList.toggle('is-zoomed', active);
    zoom.setAttribute('aria-pressed', String(active));
    zoom.textContent = active ? 'Fit image' : 'View at 100%';
    stage.scrollTop = stage.scrollLeft = 0;
    if (active && event) {
      const after = image.getBoundingClientRect();
      stage.scrollLeft = after.left + fx * after.width - event.clientX;
      stage.scrollTop = after.top + fy * after.height - event.clientY;
    }
  }
  function move(delta) {
    if (index + delta < 0 || index + delta >= items.length) return;
    index += delta;
    render();
  }
  window.PortfolioImages = {
    open(images, selected = 0, source = document.activeElement) {
      if (!images.length || dialog.open) return;
      items = images;
      index = Math.max(0, Math.min(selected, items.length - 1));
      trigger = source;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setZoom(false);
      render();
      dialog.showModal();
      if (cursor) dialog.append(cursor);
      dialog.querySelector('.viewer-close').focus();
    }
  };
  zoom.addEventListener('click', () => setZoom(!stage.classList.contains('is-zoomed')));
  image.addEventListener('click', event => setZoom(!stage.classList.contains('is-zoomed'), event));
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (stage.classList.contains('is-zoomed')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('click', event => {
    const box = panel.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    image.removeAttribute('src');
    if (cursor && cursorHome) cursorHome.append(cursor);
    trigger?.focus({ preventScroll: true });
  });

  // Certificates and case-study screenshots use the same viewer as project galleries.
  ['.cert-card .cert-clickable', '.screenshot-open'].forEach(selector => {
    const buttons = [...document.querySelectorAll(selector)];
    const images = buttons.map(button => ({ src: button.dataset.src || button.querySelector('img').getAttribute('src'), alt: button.querySelector('img').alt }));
    buttons.forEach((button, i) => {
      if (button.tagName !== 'BUTTON') {
        button.setAttribute('role', 'button');
        button.tabIndex = 0;
        button.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); button.click(); }
        });
      }
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-label', `Enlarge ${images[i].alt}`);
      button.addEventListener('click', () => window.PortfolioImages.open(images, i, button));
    });
  });
})();
