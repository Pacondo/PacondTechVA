/* Local simulations only. These demos do not contact services or send messages. */
(() => {
  const playground = document.getElementById('automationLab');
  if (!playground) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const workflows = {
    leads: {
      steps: [['Lead arrives', 'Website form'], ['AI qualifies', 'Find the right fit'], ['CRM updated', 'Everything in sync'], ['Follow-up sent', 'A personal welcome']],
      result: 'Demo complete. A new lead, qualified and welcomed.'
    },
    invoices: {
      steps: [['Invoice is due', 'Xero trigger'], ['Balance checked', 'Confirm what is owed'], ['Reminder drafted', 'AI-assisted message'], ['Follow-up queued', 'Ready for review']],
      result: 'Demo complete. A timely reminder, ready for review.'
    },
    booking: {
      steps: [['Comment arrives', 'Instagram trigger'], ['Message sent', 'ManyChat reply'], ['Booking shared', 'GoHighLevel calendar'], ['CRM updated', 'Keep the team in sync']],
      result: 'Demo complete. From a comment to a booking invitation.'
    }
  };
  const options = [...playground.querySelectorAll('.workflow-option')];
  const steps = [...playground.querySelectorAll('.workflow-step')];
  const runButton = playground.querySelector('#runWorkflow');
  const status = playground.querySelector('#workflowStatus');
  let selected = 'leads', timer = 0, running = false;
  function resetWorkflow() {
    clearTimeout(timer);
    running = false;
    runButton.disabled = false;
    runButton.innerHTML = '<span aria-hidden="true">▶</span> Run demo';
    steps.forEach((step, i) => {
      step.classList.remove('is-active', 'is-complete');
      step.querySelector('.step-icon').textContent = String(i + 1).padStart(2, '0');
      step.querySelector('strong').textContent = workflows[selected].steps[i][0];
      step.querySelector('span:last-child').textContent = workflows[selected].steps[i][1];
    });
    status.textContent = 'Your workflow is ready to run.';
  }
  function finishWorkflow() {
    clearTimeout(timer);
    running = false;
    steps.forEach(step => {
      step.classList.remove('is-active');
      step.classList.add('is-complete');
      step.querySelector('.step-icon').textContent = '✓';
    });
    status.textContent = workflows[selected].result;
    runButton.disabled = false;
    runButton.innerHTML = '<span aria-hidden="true">↻</span> Replay demo';
  }
  options.forEach(option => option.addEventListener('click', () => {
    selected = option.dataset.workflow;
    options.forEach(button => {
      const active = button === option;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    resetWorkflow();
  }));
  runButton.addEventListener('click', () => {
    resetWorkflow();
    running = true;
    runButton.disabled = true;
    runButton.textContent = 'Running…';
    if (reducedMotion.matches) { finishWorkflow(); return; }
    function advance(index) {
      if (index > 0) {
        steps[index - 1].classList.remove('is-active');
        steps[index - 1].classList.add('is-complete');
        steps[index - 1].querySelector('.step-icon').textContent = '✓';
      }
      if (index === steps.length) { finishWorkflow(); return; }
      steps[index].classList.add('is-active');
      status.textContent = `Step ${index + 1} of 4 · ${workflows[selected].steps[index][0]}…`;
      timer = setTimeout(() => advance(index + 1), 800);
    }
    advance(0);
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && running) finishWorkflow(); });
})();
