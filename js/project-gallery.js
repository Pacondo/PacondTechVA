/* Small, progressively enhanced galleries: real screenshots plus labeled diagrams. */
document.querySelectorAll('.port-gallery').forEach(gallery => {
  const tabs = [...gallery.querySelectorAll('.port-gallery-thumb')];
  const screenshots = tabs.filter(tab => tab.dataset.full);
  const images = screenshots.map(tab => ({ src: tab.dataset.full, alt: tab.querySelector('img').alt }));
  const viewport = gallery.querySelector('.preview-viewport');
  const image = viewport.querySelector('img');
  const overview = gallery.querySelector('.preview-overview');
  const prev = gallery.querySelector('.gallery-prev');
  const next = gallery.querySelector('.gallery-next');
  const label = gallery.querySelector('.preview-label');
  const open = gallery.querySelector('.preview-open');
  let index = 0;

  function select(i, keyboard = false) {
    if (i < 0 || i >= tabs.length) return;
    index = i;
    const tab = tabs[i];
    const isOverview = !tab.dataset.full;
    if (overview) overview.hidden = !isOverview;
    viewport.hidden = isOverview;
    if (!isOverview) {
      const nextImage = tab.querySelector('img');
      image.src = tab.dataset.full;
      image.alt = nextImage.alt;
      const width = Number(nextImage.getAttribute('width'));
      const height = Number(nextImage.getAttribute('height'));
      image.width = width;
      image.height = height;
      viewport.classList.toggle('is-tall', width / height < 1.2);
      viewport.scrollTop = 0;
      label.textContent = `${screenshots.indexOf(tab) + 1} / ${screenshots.length} · ${nextImage.alt}`;
    } else label.textContent = 'Workflow overview · explanatory diagram';
    tabs.forEach((button, n) => {
      button.classList.toggle('active', i === n);
      button.setAttribute('aria-pressed', String(i === n));
      button.tabIndex = i === n ? 0 : -1;
    });
    prev.disabled = i === 0;
    next.disabled = i === tabs.length - 1;
    if (keyboard) tab.focus({ preventScroll: true });
    if (gallery.getBoundingClientRect().width) {
      const rail = tab.parentElement;
      rail.scrollLeft = Math.max(0, tab.offsetLeft - rail.offsetLeft - rail.clientWidth / 2 + tab.offsetWidth / 2);
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowLeft') target = Math.max(0, i - 1);
      if (event.key === 'ArrowRight') target = Math.min(tabs.length - 1, i + 1);
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); select(target, true); }
    });
  });
  prev.addEventListener('click', () => select(index - 1));
  next.addEventListener('click', () => select(index + 1));
  open.addEventListener('click', () => {
    const selected = Math.max(0, screenshots.indexOf(tabs[index]));
    window.PortfolioImages.open(images, selected, open);
  });
  select(0);
});
