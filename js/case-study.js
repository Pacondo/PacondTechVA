/* Highlight the section currently being read. Image interactions use image-viewer.js. */
(() => {
  const links = [...document.querySelectorAll('.case-toc a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
  links.forEach(link => observer.observe(document.querySelector(link.hash)));
})();
