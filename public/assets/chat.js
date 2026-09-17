/* ============================================================
   SurfLatam Chat — Frontend Logic (Bilingual ES / PT-BR)
   Calls /api/chat (Cloudflare Worker) with guardrail awareness
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ── */
  const API_ENDPOINT = '/api/chat';
  const MAX_HISTORY  = 10;   // Keep last N messages in context

  function getWelcomeMsg() {
    if (window.getTranslation) {
      return window.getTranslation('chatWelcome');
    }
    return '¡Hola! 🤙 Soy el Surf Concierge de SurfLatam. ' +
      'Puedo ayudarte con todo sobre surf en Latinoamérica: ' +
      'spots, condiciones, técnicas, equipamiento y temporadas. ¿Qué quieres saber?';
  }

  /* ── State ── */
  let isOpen    = false;
  let isLoading = false;
  let history   = [];   // [{role: 'user'|'assistant', content: string}]
  let welcomeNode = null;

  /* ── DOM refs ── */
  const toggle  = document.getElementById('sl-chat-toggle');
  const panel   = document.getElementById('sl-chat-panel');
  const closeBtn = document.getElementById('sl-chat-close');
  const msgs    = document.getElementById('sl-msgs');
  const typing  = document.getElementById('sl-typing');
  const input   = document.getElementById('sl-input');
  const sendBtn = document.getElementById('sl-send');
  const openChatLink = document.getElementById('openChat');

  if (!toggle || !panel) return; // Guard: elements must exist

  /* ── Helpers ── */
  function appendMsg(text, role) {
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function setTyping(visible) {
    typing.style.display = visible ? 'block' : 'none';
    if (visible) msgs.scrollTop = msgs.scrollHeight;
  }

  function setLoading(state) {
    isLoading = state;
    sendBtn.disabled  = state;
    input.disabled    = state;
    sendBtn.style.opacity = state ? '0.5' : '1';
  }

  function sanitizeInput(text) {
    return text.trim().slice(0, 500);
  }

  /* ── Open / close ── */
  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();

    // Show welcome message on first open
    if (msgs.children.length === 0) {
      welcomeNode = appendMsg(getWelcomeMsg(), 'bot');
    }
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // CTA button in page body
  if (openChatLink) {
    openChatLink.addEventListener('click', (e) => {
      e.preventDefault();
      openChat();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  // React to language change
  window.addEventListener('languagechange', () => {
    // If only welcome message is present, update it to the new language
    if (welcomeNode && msgs.children.length === 1) {
      welcomeNode.textContent = getWelcomeMsg();
    }
  });

  /* ── Send message ── */
  async function sendMessage() {
    if (isLoading) return;
    const raw = sanitizeInput(input.value);
    if (!raw) return;

    input.value = '';
    appendMsg(raw, 'user');
    history.push({ role: 'user', content: raw });

    // Keep history bounded
    if (history.length > MAX_HISTORY * 2) {
      history = history.slice(-MAX_HISTORY * 2);
    }

    setLoading(true);
    setTyping(true);

    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'es';

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: raw,
          history: history.slice(-MAX_HISTORY * 2),
          lang: currentLang,
        }),
      });

      setTyping(false);

      if (response.status === 429) {
        const rateLimitMsg = currentLang === 'pt'
          ? '⏳ Você enviou muitas mensagens. Por favor, aguarde um momento antes de continuar.'
          : '⏳ Has enviado muchos mensajes. Por favor espera un momento antes de continuar.';
        appendMsg(rateLimitMsg, 'error');
        setLoading(false);
        return;
      }

      if (response.status === 451) {
        // Content blocked by guardrails (DLP / topic filter)
        const dlpMsg = window.getTranslation
          ? window.getTranslation('chatBlockedDlp')
          : '🛡️ Tu mensaje fue bloqueado por las políticas de seguridad de Cloudflare.';
        appendMsg(dlpMsg, 'blocked');
        history.pop(); // Remove from history since it was blocked
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.blocked) {
        const blockedReason = data.reason || (window.getTranslation ? window.getTranslation('chatBlockedTopic') : 'Bloqueado.');
        appendMsg('🛡️ ' + blockedReason, 'blocked');
        history.pop();
      } else if (data.reply) {
        appendMsg(data.reply, 'bot');
        history.push({ role: 'assistant', content: data.reply });
      } else {
        throw new Error('Empty response');
      }

    } catch (err) {
      setTyping(false);
      console.error('[SurfLatam Chat]', err);
      const connErrMsg = currentLang === 'pt'
        ? '🌊 Ocorreu um problema ao conectar com o servidor. Tente novamente.'
        : '🌊 Hubo un problema al conectar con el servidor. Intenta de nuevo.';
      appendMsg(connErrMsg, 'error');
    } finally {
      setLoading(false);
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  /* ── Navbar mobile toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navlinks  = document.getElementById('navlinks');
  if (navToggle && navlinks) {
    navToggle.addEventListener('click', () => {
      const open = navlinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close when clicking a nav link (except lang buttons)
    navlinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navlinks.classList.remove('open'));
    });
  }

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handler = () => {
      navbar.style.background = window.scrollY > 40
        ? 'rgba(10,22,40,.95)'
        : 'rgba(10,22,40,.75)';
    };
    window.addEventListener('scroll', handler, { passive: true });
  }

})();
