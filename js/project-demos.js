/* Project-specific, browser-only demonstrations. All records and responses are samples. */
(() => {
  const demos = {
    'real-estate': {
      intro: 'Follow a sample property inquiry from qualification to the GoHighLevel pipeline.',
      fields: [['name', 'Lead name', 'Alex Rivera'], ['intent', 'Buying timeline', ['Ready this month']]],
      steps: ['Inquiry received', 'n8n qualifies lead', 'GoHighLevel contact updated', 'Assigned to broker', 'Pipeline updated', 'Nurture selected', 'Booking follow-up'],
      run: ({ name, intent }) => [
        ['Incoming inquiry', `${name} is interested in a property. Timeline: ${intent.toLowerCase()}.`],
        ['Sample qualification', 'Priority: high. Ready for agent follow-up.'],
        ['Contact preview', `${name}: sample GoHighLevel contact updated with the inquiry and qualification.`],
        ['Broker assignment', `${name} is assigned to the sample broker for ownership and follow-up.`],
        ['Pipeline preview', `${name} → New qualified lead. Owner: sample broker.`],
        ['Next action', `Hi ${name}, let’s find your next home. Choose a time for a discovery call.`],
        ['Calendar follow-up', 'Sample booking invitation prepared. When a call is booked, the booked-call workflow updates the pipeline.']
      ]
    },
    'lead-intake': {
      intro: 'Follow a sample property inquiry through qualification and the CRM handoff.',
      fields: [['name', 'Lead name', 'Jamie Cruz'], ['intent', 'Inquiry', ['Ready to buy a home']]],
      steps: ['Inquiry captured', 'Details extracted', 'Lead qualified', 'CRM handoff prepared'],
      run: ({ name, intent }) => [
        ['Source message', `${name}: “${intent}.”`],
        ['Extracted fields', `Name: ${name}\nInterest: property purchase\nIntent: ${intent}`],
        ['Sample classification', 'High intent → agent follow-up.'],
        ['GoHighLevel payload preview', JSON.stringify({ name, interest: 'property', qualification: 'high', source: 'n8n demo' }, null, 2)]
      ]
    },
    instagram: {
      intro: 'Follow a sample Instagram comment through to a booked consultation.',
      fields: [['name', 'Instagram name', 'Taylor'], ['intent', 'Appointment outcome', ['Consult booked']]],
      steps: ['Comment received', 'ManyChat reply prepared', 'Booking invitation shared', 'Booking status checked', 'GoHighLevel updated'],
      run: ({ name }) => [
        ['Instagram trigger', `@${name} commented “INFO” on the sample post.`],
        ['Sample direct message', `Hey ${name}! Thanks for your interest. Want to book a quick consult?`],
        ['Calendar invitation', 'A sample consultation link is shared with the contact.'],
        ['Appointment check', 'Sample consultation booking detected.'],
        ['Workflow outcome', `${name} → Consult booked. Confirmation prepared; booking nudges stopped.`]
      ]
    },
    invoices: {
      intro: 'Follow an overdue invoice from the balance check to a prepared reminder.',
      fields: [['name', 'Client name', 'Morgan'], ['intent', 'Invoice status', ['14 days overdue']]],
      steps: ['Xero invoice checked', 'Payment status reviewed', 'Reminder drafted', 'Activity logged'],
      run: ({ name, intent }) => [
        ['Sample invoice', `INV-DEMO-104 · Client: ${name} · Amount: $450.00`],
        ['Balance check', `Balance: $450.00. Status: ${intent}.`],
        ['Sample email preview', `Hi ${name}, a friendly reminder about invoice INV-DEMO-104 for $450.00. Please let us know if you need a copy or have any questions.`],
        ['Sample activity log', 'Overdue → reminder prepared → sample Gmail send step → outcome logged. No email was sent.']
      ]
    },
    export: {
      intro: 'Convert sample Xero records into an Asana-ready CSV preview.',
      fields: [['name', 'Asana project name', 'Finance follow-up'], ['intent', 'Export filter', ['Overdue invoices']]],
      steps: ['Export triggered', 'Records selected', 'CSV formatted', 'Asana import preview'],
      run: ({ name, intent }) => {
        const rows = [['INV-104', 'Morgan', '450.00', 'Overdue']];
        return [
          ['Scheduled export', 'Sample Xero invoice export started.'],
          ['Selected records', `${rows.length} invoice record(s) selected with filter: ${intent}.`],
          ['CSV preview', 'Invoice,Client,Amount,Status\n' + rows.map(row => row.join(',')).join('\n')],
          ['Asana preview', `${name}: ${rows.length} sample task(s) ready for import. No project was changed.`]
        ];
      }
    },
    nurture: {
      intro: 'Follow an interested lead through the nurture workflow and follow-up.',
      fields: [['name', 'Lead name', 'Casey'], ['intent', 'Contact response', ['Interested']]],
      steps: ['Form submitted', 'Lead tagged', 'SMS prepared', 'Call follow-up', 'Reply or timeout checked', 'Follow-up branch selected'],
      run: ({ name }) => [
        ['Form trigger', `${name} submitted the sample inquiry form.`],
        ['Contact updated', 'Tag: new-lead. Sample contact added to the nurture workflow.'],
        ['Sample SMS', `Hi ${name}, thanks for reaching out! Would you like us to send more details?`],
        ['Call follow-up preview', `A sample follow-up call is queued for ${name}. No call is placed.`],
        ['Response check', 'Interested reply detected in the sample conversation.'],
        ['Branch outcome', 'Reply detected → send documents → continue interested-lead follow-up.']
      ]
    },
    webinar: {
      intro: 'Walk through the three-page registration funnel using a sample attendee.',
      fields: [['name', 'Attendee name', 'Jordan'], ['intent', 'Agency role', ['Agency owner']]],
      steps: ['Landing page', 'Registration form', 'Registration preview', 'Thank-you page'],
      run: ({ name, intent }) => [
        ['Webinar offer', 'Explore how an agency can streamline its lead follow-up. Next step: reserve a sample seat.'],
        ['Form preview', `Attendee: ${name}\nRole: ${intent}\nEvent: Agency workflow webinar`],
        ['Sample registration', `${name} → Webinar registration. Sample attendee record prepared.`],
        ['Thank-you preview', `You’re on the sample list, ${name}! In the live funnel, this page would confirm the event details and explain what happens next.`]
      ]
    },
    enrichment: {
      intro: 'Follow a sample lead from company-domain validation to an enriched CRM record.',
      fields: [['name', 'Lead name', 'Avery'], ['intent', 'Incoming details', ['Company domain provided']]],
      steps: ['New lead captured', 'Details checked', 'Enrichment preview', 'CRM handoff'],
      run: ({ name }) => [
        ['Incoming lead', `Name: ${name}\nCompany domain: example.com`],
        ['Validation', 'Company domain present. Continue sample enrichment.'],
        ['Sample enrichment', 'Company: Example Studio\nIndustry: Creative services\nContact role: Operations (illustrative data)'],
        ['CRM preview', `${name} → Enriched lead, ready for follow-up.`]
      ]
    },
    farm: {
      intro: 'Preview a sample assistant response to a product-availability inquiry.',
      fields: [['name', 'Customer name', 'Riley'], ['intent', 'Message topic', ['Product availability']]],
      steps: ['Message received', 'Intent identified', 'Reply prepared', 'Conversation updated'],
      run: ({ name, intent }) => [
        ['Facebook message', `${name} asked about: ${intent.toLowerCase()}.`],
        ['Sample intent', `Topic identified: ${intent}.`],
        ['Scripted reply preview', `Hi ${name}! Which product and quantity are you looking for? The farm team can confirm current stock.`],
        ['Conversation state', 'Awaiting customer details. Sample conversation context retained for this session.']
      ]
    }
  };

  const dialog = document.createElement('dialog');
  dialog.className = 'project-demo';
  dialog.setAttribute('aria-labelledby', 'projectDemoTitle');
  dialog.setAttribute('aria-describedby', 'projectDemoNote');
  dialog.innerHTML = `
    <div class="project-demo-header"><span class="project-demo-eyebrow">PROJECT PLAYGROUND</span><button type="button" class="project-demo-close" aria-label="Close project demo">&times;</button></div>
    <h2 id="projectDemoTitle"></h2>
    <p class="project-demo-intro"></p>
    <p id="projectDemoNote" class="project-demo-note">Interactive simulation · Sample data only. No messages, bookings, or external updates are sent. AI responses are scripted examples.</p>
    <div class="automation-playground">
      <div class="workflow-console">
        <div class="console-top"><span><span class="playground-status-dot" aria-hidden="true"></span> AUTOMATION PLAYGROUND</span><span class="demo-label">INTERACTIVE DEMO</span></div>
        <div class="workflow-options" role="group" aria-label="Sample scenario"></div>
        <ol class="workflow-steps"></ol>
        <div class="project-demo-meter" role="progressbar" aria-label="Workflow progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
        <div class="project-demo-result" hidden></div>
        <div class="console-bottom"><p class="project-demo-status" role="status" aria-live="polite"></p><button type="button" class="run-workflow">▶ Run demo</button></div>
      </div>
    </div>`;
  document.body.append(dialog);

  const customCursor = document.getElementById('customCursor');
  const cursorHome = customCursor?.parentElement;

  const title = dialog.querySelector('h2');
  const intro = dialog.querySelector('.project-demo-intro');
  const options = dialog.querySelector('.workflow-options');
  const steps = dialog.querySelector('ol');
  const result = dialog.querySelector('.project-demo-result');
  const status = dialog.querySelector('.project-demo-status');
  const run = dialog.querySelector('.run-workflow');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const meter = dialog.querySelector('.project-demo-meter');
  function updateProgress(value) {
    meter.setAttribute('aria-valuenow', String(Math.round(value)));
    meter.firstElementChild.style.width = `${value}%`;
  }
  let current, selected, outputs, step = -1, trigger, previousOverflow, timer, running = false;

  const connectors = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  connectors.classList.add('project-demo-connectors');
  connectors.setAttribute('aria-hidden', 'true');
  steps.before(connectors);

  function drawConnectors() {
    if (!dialog.open) return;
    const box = steps.getBoundingClientRect();
    connectors.style.left = `${steps.offsetLeft}px`;
    connectors.style.top = `${steps.offsetTop}px`;
    connectors.setAttribute('width', box.width);
    connectors.setAttribute('height', box.height);
    const items = [...steps.children];
    // Use layout coordinates: the active icon's visual transform must not
    // change row detection or connector endpoints.
    const iconBox = item => {
      const icon = item.querySelector('.step-icon');
      const row = item.getBoundingClientRect();
      const left = row.left + icon.offsetLeft;
      const top = row.top + icon.offsetTop;
      return { left, top, right: left + icon.offsetWidth, width: icon.offsetWidth, height: icon.offsetHeight };
    };
    connectors.replaceChildren();
    items.slice(0, -1).forEach((item, index) => {
      const from = iconBox(item);
      const to = iconBox(items[index + 1]);
      const path = document.createElementNS(connectors.namespaceURI, 'path');
      const x1 = from.right - box.left;
      const y1 = from.top + from.height / 2 - box.top;
      const x2 = to.left - box.left;
      const y2 = to.top + to.height / 2 - box.top;
      if (Math.abs(y1 - y2) < 2) {
        path.setAttribute('d', `M ${x1} ${y1} H ${x2}`);
      } else {
        const rowBottom = Math.max(...items.filter(other => Math.abs(other.getBoundingClientRect().top - item.getBoundingClientRect().top) < 2).map(other => other.getBoundingClientRect().bottom)) - box.top;
        const middle = (rowBottom + to.top - box.top) / 2;
        const targetX = to.left + to.width / 2 - box.left;
        path.setAttribute('d', `M ${x1} ${y1} H ${box.width - 12} V ${middle} H ${targetX} V ${to.top - box.top}`);
      }
      path.classList.toggle('is-complete', item.classList.contains('is-complete'));
      path.classList.toggle('is-flowing', running && index === step);
      path.setAttribute('pathLength', '100');
      connectors.append(path);
    });
  }
  new ResizeObserver(drawConnectors).observe(steps);
  new MutationObserver(drawConnectors).observe(steps, { subtree: true, attributes: true, attributeFilter: ['class'] });

  function reset() {
    clearTimeout(timer);
    running = false;
    run.disabled = false;
    step = -1;
    outputs = null;
    updateProgress(0);
    result.hidden = true;
    run.textContent = '▶ Run demo';
    status.textContent = 'Your workflow is ready to run.';
    [...steps.children].forEach((item, index) => {
      item.className = 'workflow-step';
      item.removeAttribute('aria-current');
      item.querySelector('.step-icon').textContent = String(index + 1).padStart(2, '0');
    });
  }

  function advance() {
    if (!running) return;
    step++;
    if (step === outputs.length) { finish(); return; }
    updateProgress((step / outputs.length) * 100);
    [...steps.children].forEach((item, index) => {
      item.className = 'workflow-step' + (index < step ? ' is-complete' : index === step ? ' is-active' : '');
      item.querySelector('.step-icon').textContent = index < step ? '✓' : String(index + 1).padStart(2, '0');
      if (index === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    const heading = document.createElement('h4');
    heading.textContent = outputs[step][0];
    const text = document.createElement('p');
    text.textContent = outputs[step][1];
    const progress = document.createElement('span');
    progress.className = 'project-demo-progress';
    progress.textContent = step === outputs.length - 1 ? 'Sample complete.' : `Step ${step + 1} of ${outputs.length}`;
    result.replaceChildren(heading, text, progress);
    result.hidden = false;
    status.textContent = `Step ${step + 1} of ${outputs.length} · ${current.steps[step]}`;
    timer = setTimeout(advance, 1400);
  }

  function finish() {
    clearTimeout(timer);
    running = false;
    run.disabled = false;
    updateProgress(100);
    [...steps.children].forEach(item => {
      item.className = 'workflow-step is-complete';
      item.removeAttribute('aria-current');
      item.querySelector('.step-icon').textContent = '✓';
    });
    result.hidden = false;
    const heading = document.createElement('h4');
    heading.textContent = outputs[outputs.length - 1][0];
    const text = document.createElement('p');
    text.textContent = outputs[outputs.length - 1][1];
    result.replaceChildren(heading, text);
    status.textContent = 'Demo complete. Replay to watch the workflow again.';
    run.textContent = '↻ Replay demo';
  }
  run.addEventListener('click', () => {
    reset();
    outputs = current.run({ name: current.fields[0][2], intent: selected });
    running = true;
    run.disabled = true;
    run.textContent = 'Running…';
    if (motion.matches) finish();
    else advance();
  });
  motion.addEventListener('change', () => { if (motion.matches && running) finish(); });

  document.querySelectorAll('.port-card[data-demo]').forEach(card => {
    const config = demos[card.dataset.demo];
    if (!config) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-demo-launch';
    button.textContent = 'Run sample simulation ↗';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `Try demo: ${card.querySelector('h3').textContent}`);
    card.querySelector('.port-body').append(button);
    button.addEventListener('click', () => {
      current = config;
      trigger = button;
      title.textContent = card.querySelector('h3').textContent;
      intro.textContent = config.intro;
      selected = config.fields[1][2][0];
      options.replaceChildren(...config.fields[1][2].map((value, index) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'workflow-option' + (index === 0 ? ' active' : '');
        option.textContent = value;
        option.setAttribute('aria-pressed', String(index === 0));
        option.addEventListener('click', () => {
          selected = value;
          [...options.children].forEach(item => {
            item.classList.toggle('active', item === option);
            item.setAttribute('aria-pressed', String(item === option));
          });
          reset();
        });
        return option;
      }));
      steps.replaceChildren(...config.steps.map((text, index) => {
        const item = document.createElement('li');
        item.className = 'workflow-step';
        item.innerHTML = '<span class="step-icon" aria-hidden="true"></span><strong></strong><span></span>';
        item.querySelector('strong').textContent = text;
        item.querySelector('span:last-child').textContent = config.run({ name: config.fields[0][2], intent: selected })[index][0];
        return item;
      }));
      reset();
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      // A modal dialog's top layer sits above every page z-index.
      // Keep the fixed cursor inside that layer while the demo is open.
      if (customCursor) dialog.append(customCursor);
      drawConnectors();
      dialog.querySelector('.project-demo-close').focus();
    });
  });
  dialog.querySelector('.project-demo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (customCursor && cursorHome) cursorHome.append(customCursor);
    document.body.style.overflow = previousOverflow;
    reset();
    trigger?.focus();
  });
})();
