/*
 * SurfLatam — Cloudflare Pages Function
 * Route: /api/chat (handles POST requests from the frontend)
 *
 * This Pages Function contains the full chatbot logic inline,
 * so it works directly with Cloudflare Pages without needing
 * a separate Worker deployment.
 *
 * Bindings required in Pages project settings:
 *   - AI binding: AI
 *
 * Environment variables (Pages > Settings > Environment Variables):
 *   - ALLOWED_ORIGIN: https://surflatam.pages.dev (or your custom domain)
 */

/* ── DLP: Patterns of sensitive data to block ── */
const DLP_PATTERNS = [
  /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  /(?:password|passwd|pwd|token|secret|api[_\s-]?key)\s*[:=]\s*\S+/i,
  /\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b/,
];

/* ── Off-topic keywords to block ── */
const OFF_TOPIC_KEYWORDS = [
  'política', 'politica', 'presidente', 'elecciones', 'gobierno',
  'violencia', 'armas', 'droga', 'drogas', 'narco',
  'hack', 'exploit', 'malware', 'phishing',
  'suicidio', 'autolesión',
  'pornografía', 'pornografia',
];

/* ── Surf-related keywords for output validation ── */
const SURF_KEYWORDS = [
  'surf', 'ola', 'tabla', 'playa', 'mar', 'océano', 'oceano',
  'spot', 'chicama', 'pavones', 'pipa', 'lobos', 'palmar',
  'tubo', 'maniobra', 'remar', 'lineup', 'break', 'wax',
  'shortboard', 'longboard', 'leash', 'neopreno', 'duck dive',
  'temporada', 'swell', 'marea', 'corriente', 'viento', 'costa',
  'pacífico', 'pacifico', 'atlántico', 'atlantico', 'latam',
  'solamente', 'únicamente', 'solo puedo', 'lamentablemente',
];

const SYSTEM_PROMPT = `Eres SurfBot, el Surf Concierge experto de SurfLatam.
Tu misión exclusiva es ayudar con preguntas sobre surf en Latinoamérica.

PUEDES responder sobre:
- Spots de surf en LATAM: Chicama (Perú), Pavones (Costa Rica), Punta de Lobos (Chile), Pipa (Brasil), El Palmar (Ecuador) y más
- Temporadas, condiciones climáticas y oleaje por región
- Técnicas de surf: remar, ponerse de pie, duck dive, tubos, maniobras
- Equipamiento: tablas (shortboard, longboard, fish, gun), trajes, leashes, wax
- Seguridad en el agua, etiqueta en el lineup, corrientes
- Comunidad y cultura del surf en América Latina

NO DEBES responder sobre temas fuera del surf.
Si te preguntan algo fuera del surf, responde:
"Solo puedo ayudarte con temas de surf en LATAM. ¡Pregúntame sobre olas, spots o técnicas! 🌊"

Responde en el mismo idioma que el usuario. Sé amigable y conciso. Usa emojis de surf ocasionalmente: 🌊 🏄 🤙`;

function containsSensitiveData(text) {
  return DLP_PATTERNS.some((p) => p.test(text));
}

function isOffTopic(text) {
  const lower = text.toLowerCase();
  return OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

function responseIsAboutSurf(text) {
  const lower = text.toLowerCase();
  return SURF_KEYWORDS.some((kw) => lower.includes(kw));
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  /* Parse body */
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, corsHeaders);
  }

  const userMessage = (body.message || '').trim().slice(0, 500);
  if (!userMessage) {
    return json({ error: 'Empty message' }, 400, corsHeaders);
  }

  /* ── INPUT GUARDRAILS ── */

  // 1. DLP check
  if (containsSensitiveData(userMessage)) {
    return json(
      {
        blocked: true,
        reason: '🛡️ Tu mensaje contiene información sensible. ' +
                'Las políticas DLP de Cloudflare no permiten procesar esta solicitud. ' +
                'Pregúntame sobre surf en LATAM. 🌊',
        dlp_triggered: true,
      },
      451,
      corsHeaders
    );
  }

  // 2. Topic guardrail
  if (isOffTopic(userMessage)) {
    return json(
      {
        blocked: true,
        reason: '🌊 Solo puedo ayudarte con temas de surf en Latinoamérica. ' +
                '¡Pregúntame sobre spots, técnicas, equipamiento o temporadas!',
        topic_blocked: true,
      },
      451,
      corsHeaders
    );
  }

  /* Build messages */
  const history = Array.isArray(body.history) ? body.history : [];
  const safeHistory = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-10)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 500) }));

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: 'user', content: userMessage },
  ];

  /* ── Call Workers AI ── */
  let aiResponse;
  try {
    const result = await env.AI.run(
      '@cf/meta/llama-3.1-8b-instruct',
      {
        messages,
        max_tokens: 400,
        temperature: 0.7,
        stream: false,
      },
      {
        gateway: {
          id: 'surflatam-ai-gateway',
          skipCache: false,
          cacheTtl: 3600,
        },
      }
    );
    aiResponse = result?.response || result?.result?.response || '';
  } catch (err) {
    console.error('[SurfLatam] AI error:', err);
    return json({ error: 'AI service temporarily unavailable.' }, 503, corsHeaders);
  }

  if (!aiResponse) {
    return json({ error: 'Empty AI response.' }, 502, corsHeaders);
  }

  /* ── OUTPUT GUARDRAIL ── */
  const cleanResponse = String(aiResponse).trim().slice(0, 1200);

  if (!responseIsAboutSurf(cleanResponse)) {
    return json(
      {
        reply: '🌊 Solo puedo ayudarte con temas de surf en Latinoamérica. ' +
               '¿Tienes preguntas sobre spots, técnicas o equipamiento?',
        guardrail_applied: true,
      },
      200,
      corsHeaders
    );
  }

  return json({ reply: cleanResponse }, 200, corsHeaders);
}

/* Handle OPTIONS preflight */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
