/* Native details and dialog keep the case study keyboard accessible. */
(() => {
  const dialog = document.querySelector('.screenshot-dialog');
  const image = dialog.querySelector('img');
  let trigger;
  let previousOverflow;
  document.querySelectorAll('.screenshot-open').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      const preview = button.querySelector('img');
      image.src = preview.src;
      image.alt = preview.alt;
      dialog.querySelector('p').textContent = preview.alt;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    image.removeAttribute('src');
    trigger?.focus();
  });
})();
