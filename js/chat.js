/* ═══════════════════════════════════
   AI CHAT — talks to an n8n webhook
═══════════════════════════════════ */

/* Paste your n8n Production webhook URL here. */
const CHAT_WEBHOOK_URL = 'https://n8n-aqlw.srv1641523.hstgr.cloud/webhook/pacondotechva-chat';

/* Turns sent back for context. Caps cost and keeps the request small. */
const MAX_HISTORY = 10;

const chatBubble   = document.getElementById('chatBubble');
const chatWindow   = document.getElementById('chatWindow');
const chatClose    = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');

const CONTACT_FALLBACK =
  "Sorry — I couldn't reach the server just now. You can still reach Pacondo through the " +
  "<a href='#contact'>Contact</a> section.";

let history = [];
let awaitingReply = false;

chatBubble.addEventListener('click', () => {
  const open = chatWindow.classList.toggle('open');
  chatBubble.classList.toggle('hide', open);
  if (open) chatInput.focus();
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.remove('open');
  chatBubble.classList.remove('hide');
});

document.querySelectorAll('.chat-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const text = chip.textContent;
    document.getElementById('chatSuggestions')?.remove();
    send(text);
  });
});

chatSend.addEventListener('click', submit);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

function submit() {
  const text = chatInput.value.trim();
  if (!text || awaitingReply) return;
  chatInput.value = '';
  document.getElementById('chatSuggestions')?.remove();
  send(text);
}

async function send(text) {
  appendMsg(escapeHtml(text), 'user');
  history.push({ role: 'user', content: text });

  if (!CHAT_WEBHOOK_URL) {
    appendMsg(
      "Thanks for reaching out! Pacondo will reply to you personally — " +
      "leave him a message in the <a href='#contact'>Contact</a> section and he'll get back to you.",
      'bot'
    );
    return;
  }

  awaitingReply = true;
  const typing = showTyping();

  try {
    const res = await fetch(CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const reply = (await res.json()).reply;
    if (!reply) throw new Error('empty reply');

    typing.remove();
    appendMsg(escapeHtml(reply), 'bot');
    history.push({ role: 'assistant', content: reply });
  } catch (err) {
    typing.remove();
    appendMsg(CONTACT_FALLBACK, 'bot');
    history.pop();
    console.error('[chat]', err);
  } finally {
    awaitingReply = false;
  }
}

function appendMsg(html, who) {
  const div = document.createElement('div');
  div.className = `chat-msg ${who}`;
  div.innerHTML = `<span>${html}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function showTyping() {
  const div = appendMsg('<i class="chat-dot"></i><i class="chat-dot"></i><i class="chat-dot"></i>', 'bot typing');
  return div;
}

/* The reply crosses a network boundary, so render it as text, never as markup. */
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML.replace(/\n/g, '<br>');
}
