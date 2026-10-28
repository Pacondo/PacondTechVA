/* Project-specific, browser-only demonstrations. All records and responses are samples. */
(() => {
  const demos = {
    'real-estate': {
      intro: 'Follow a sample property inquiry from qualification to the GoHighLevel pipeline.',
      fields: [['name', 'Lead name', 'Alex Rivera'], ['intent', 'Buying timeline', ['Ready this month', 'Researching for next year']]],
      steps: ['Inquiry received', 'n8n qualifies lead', 'GoHighLevel contact updated', 'Assigned to broker', 'Pipeline updated', 'Nurture selected', 'Booking follow-up'],
      run: ({ name, intent }) => [
        ['Incoming inquiry', `${name} is interested in a property. Timeline: ${intent.toLowerCase()}.`],
        ['Sample qualification', intent === 'Ready this month' ? 'Priority: high. Ready for agent follow-up.' : 'Priority: nurture. Keep in touch until ready.'],
        ['Contact preview', `${name}: sample GoHighLevel contact updated with the inquiry and qualification.`],
        ['Broker assignment', `${name} is assigned to the sample broker for ownership and follow-up.`],
        ['Pipeline preview', `${name} → ${intent === 'Ready this month' ? 'New qualified lead' : 'Long-term nurture'}. Owner: sample broker.`],
        ['Next action', intent === 'Ready this month' ? `Hi ${name}, let’s find your next home. Choose a time for a discovery call.` : `Hi ${name}, here is a sample market update to help you plan your next move.`],
        ['Calendar follow-up', intent === 'Ready this month' ? 'Sample booking invitation prepared. When a call is booked, the booked-call workflow updates the pipeline.' : 'Long-term nurture selected. A booking invitation can follow when the lead is ready.']
      ]
    },
    'lead-intake': {
      intro: 'Try two inquiry types and see how a sample qualification changes the CRM handoff.',
      fields: [['name', 'Lead name', 'Jamie Cruz'], ['intent', 'Inquiry', ['Ready to buy a home', 'Just browsing properties']]],
      steps: ['Inquiry captured', 'Details extracted', 'Lead qualified', 'CRM handoff prepared'],
      run: ({ name, intent }) => [
        ['Source message', `${name}: “${intent}.”`],
        ['Extracted fields', `Name: ${name}\nInterest: property purchase\nIntent: ${intent}`],
        ['Sample classification', intent === 'Ready to buy a home' ? 'High intent → agent follow-up.' : 'Early research → nurture.'],
        ['GoHighLevel payload preview', JSON.stringify({ name, interest: 'property', qualification: intent === 'Ready to buy a home' ? 'high' : 'nurture', source: 'n8n demo' }, null, 2)]
      ]
    },
    instagram: {
      intro: 'Turn a sample Instagram comment into a booking flow. Try both appointment outcomes.',
      fields: [['name', 'Instagram name', 'Taylor'], ['intent', 'Appointment outcome', ['Consult booked', 'No booking yet']]],
      steps: ['Comment received', 'ManyChat reply prepared', 'Booking invitation shared', 'Booking status checked', 'GoHighLevel updated'],
      run: ({ name, intent }) => [
        ['Instagram trigger', `@${name} commented “INFO” on the sample post.`],
        ['Sample direct message', `Hey ${name}! Thanks for your interest. Want to book a quick consult?`],
        ['Calendar invitation', 'A sample consultation link is shared with the contact.'],
        ['Appointment check', intent === 'Consult booked' ? 'Sample consultation booking detected.' : 'No sample appointment found yet. Continue the booking reminder branch.'],
        ['Workflow outcome', intent === 'Consult booked' ? `${name} → Consult booked. Confirmation prepared; booking nudges stopped.` : `${name} → Awaiting booking. A reminder is queued in this sample flow.`]
      ]
    },
    invoices: {
      intro: 'Preview an invoice reminder and see how a paid invoice stops the follow-up.',
      fields: [['name', 'Client name', 'Morgan'], ['intent', 'Invoice status', ['14 days overdue', '30 days overdue', 'Already paid']]],
      steps: ['Xero invoice checked', 'Payment status reviewed', 'Reminder drafted', 'Activity logged'],
      run: ({ name, intent }) => {
        const paid = intent === 'Already paid';
        return [
          ['Sample invoice', `INV-DEMO-104 · Client: ${name} · Amount: $450.00`],
          ['Balance check', paid ? 'Balance: $0.00. Invoice marked paid.' : `Balance: $450.00. Status: ${intent}.`],
          ['Sample email preview', paid ? 'No reminder needed. Follow-up skipped.' : `Hi ${name}, ${intent === '30 days overdue' ? 'following up again on' : 'a friendly reminder about'} invoice INV-DEMO-104 for $450.00. Please let us know if you need a copy or have any questions.`],
          ['Sample activity log', paid ? 'Paid → reminder skipped → outcome logged.' : 'Overdue → reminder prepared → sample Gmail send step → outcome logged. No email was sent.']
        ];
      }
    },
    export: {
      intro: 'Convert sample Xero records into an Asana-ready CSV preview.',
      fields: [['name', 'Asana project name', 'Finance follow-up'], ['intent', 'Export filter', ['Overdue invoices', 'All invoices']]],
      steps: ['Export triggered', 'Records selected', 'CSV formatted', 'Asana import preview'],
      run: ({ name, intent }) => {
        const rows = [['INV-104', 'Morgan', '450.00', 'Overdue'], ['INV-105', 'Jamie', '280.00', 'Paid']];
        const selected = intent === 'Overdue invoices' ? rows.slice(0, 1) : rows;
        return [
          ['Scheduled export', 'Sample Xero invoice export started.'],
          ['Selected records', `${selected.length} invoice record(s) selected with filter: ${intent}.`],
          ['CSV preview', 'Invoice,Client,Amount,Status\n' + selected.map(row => row.join(',')).join('\n')],
          ['Asana preview', `${name}: ${selected.length} sample task(s) ready for import. No project was changed.`]
        ];
      }
    },
    nurture: {
      intro: 'Choose a reply outcome and see which branch the lead nurture workflow takes.',
      fields: [['name', 'Lead name', 'Casey'], ['intent', 'Contact response', ['Interested', 'No reply']]],
      steps: ['Form submitted', 'Lead tagged', 'SMS prepared', 'Call follow-up', 'Reply or timeout checked', 'Follow-up branch selected'],
      run: ({ name, intent }) => [
        ['Form trigger', `${name} submitted the sample inquiry form.`],
        ['Contact updated', 'Tag: new-lead. Sample contact added to the nurture workflow.'],
        ['Sample SMS', `Hi ${name}, thanks for reaching out! Would you like us to send more details?`],
        ['Call follow-up preview', `A sample follow-up call is queued for ${name}. No call is placed.`],
        ['Response check', intent === 'Interested' ? 'Interested reply detected in the sample conversation.' : 'Sample waiting period ended without a reply.'],
        ['Branch outcome', intent === 'Interested' ? 'Reply detected → send documents → continue interested-lead follow-up.' : 'Reply timeout → move to the re-engagement workflow.']
      ]
    },
    webinar: {
      intro: 'Walk through the three-page registration funnel using a sample attendee.',
      fields: [['name', 'Attendee name', 'Jordan'], ['intent', 'Agency role', ['Agency owner', 'Marketing specialist', 'Operations manager']]],
      steps: ['Landing page', 'Registration form', 'Registration preview', 'Thank-you page'],
      run: ({ name, intent }) => [
        ['Webinar offer', 'Explore how an agency can streamline its lead follow-up. Next step: reserve a sample seat.'],
        ['Form preview', `Attendee: ${name}\nRole: ${intent}\nEvent: Agency workflow webinar`],
        ['Sample registration', `${name} → Webinar registration. Sample attendee record prepared.`],
        ['Thank-you preview', `You’re on the sample list, ${name}! In the live funnel, this page would confirm the event details and explain what happens next.`]
      ]
    },
    enrichment: {
      intro: 'See how complete and incomplete sample leads take different enrichment paths.',
      fields: [['name', 'Lead name', 'Avery'], ['intent', 'Incoming details', ['Company domain provided', 'Company domain missing']]],
      steps: ['New lead captured', 'Details checked', 'Enrichment preview', 'CRM handoff'],
      run: ({ name, intent }) => {
        const complete = intent === 'Company domain provided';
        return [
          ['Incoming lead', `Name: ${name}\nCompany domain: ${complete ? 'example.com' : 'Not provided'}`],
          ['Validation', complete ? 'Company domain present. Continue sample enrichment.' : 'Company domain missing. Flag for review.'],
          ['Sample enrichment', complete ? 'Company: Example Studio\nIndustry: Creative services\nContact role: Operations (illustrative data)' : 'Company and role remain unknown. No details invented for this sample lead.'],
          ['CRM preview', `${name} → ${complete ? 'Enriched lead, ready for follow-up' : 'Needs review, request company details'}.`]
        ];
      }
    },
    farm: {
      intro: 'Try common farm-page inquiries and preview a sample assistant response.',
      fields: [['name', 'Customer name', 'Riley'], ['intent', 'Message topic', ['Product availability', 'Delivery options', 'Speak to a person']]],
      steps: ['Message received', 'Intent identified', 'Reply prepared', 'Conversation updated'],
      run: ({ name, intent }) => {
        const replies = {
          'Product availability': `Hi ${name}! Which product and quantity are you looking for? The farm team can confirm current stock.`,
          'Delivery options': `Hi ${name}! Please share your delivery area so the farm team can confirm available options and fees.`,
          'Speak to a person': `Hi ${name}! I’ll flag your inquiry for the farm team to follow up.`
        };
        return [
          ['Facebook message', `${name} asked about: ${intent.toLowerCase()}.`],
          ['Sample intent', intent === 'Speak to a person' ? 'Human handoff requested.' : `Topic identified: ${intent}.`],
          ['Scripted reply preview', replies[intent]],
          ['Conversation state', intent === 'Speak to a person' ? 'Needs team follow-up. Sample handoff flag added.' : 'Awaiting customer details. Sample conversation context retained for this session.']
        ];
      }
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
        <div class="workflow-options" role="group" aria-label="Choose a sample scenario"></div>
        <ol class="workflow-steps"></ol>
        <div class="project-demo-meter" role="progressbar" aria-label="Workflow progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
        <div class="project-demo-result" hidden></div>
        <div class="console-bottom"><p class="project-demo-status" role="status" aria-live="polite"></p><button type="button" class="run-workflow">▶ Run demo</button></div>
      </div>
    </div>`;
  document.body.append(dialog);

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
    progress.textContent = step === outputs.length - 1 ? 'Sample complete — change the details to try another outcome.' : `Step ${step + 1} of ${outputs.length}`;
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
    status.textContent = 'Demo complete. Replay or choose another scenario.';
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
    button.textContent = 'Try demo ↗';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `Try demo: ${card.querySelector('h3').textContent}`);
    card.querySelector('.port-body').append(button);
    button.addEventListener('click', () => {
      current = config;
      trigger = button;
      title.textContent = card.querySelector('h3').textContent;
      intro.textContent = 'Choose a scenario and watch the workflow run.';
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
    document.body.style.overflow = previousOverflow;
    reset();
    trigger?.focus();
  });
})();
