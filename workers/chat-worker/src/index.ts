/*
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SurfLatam Chat Worker — Cloudflare SASE/ZTNA Demo          ║
 * ║  Protegido por: AI Gateway · DLP · Guardrails · Rate Limit  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Ruta: POST /api/chat
 * Bindings requeridos:
 *   - AI          → Workers AI binding
 *   - RATE_LIMITER → Rate Limiting API
 *
 * Variables de entorno (wrangler secret):
 *   - AI_GATEWAY_URL   → URL del AI Gateway (opcional, para proxy)
 *   - ALLOWED_ORIGIN   → dominio del frontend (CORS)
 */

export interface Env {
  AI: Ai;
  RATE_LIMITER?: RateLimit;
  AI_GATEWAY_URL?: string;
  ALLOWED_ORIGIN?: string;
}

/* ── DLP patterns — información sensible que NO debe enviarse al AI ── */
const DLP_PATTERNS: RegExp[] = [
  // Tarjetas de crédito (Visa, MC, Amex, Discover)
  /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/,
  // Emails
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  // Teléfonos (formatos internacionales)
  /\b(?:\+?1[-.\s]?)?(?:\([0-9]{2,4}\)|[0-9]{2,4})[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}\b/,
  // SSN / CURP / RUT-like patterns
  /\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b/,
  // Passwords / tokens (common patterns)
  /(?:password|passwd|pwd|token|secret|api[_\s-]?key)\s*[:=]\s*\S+/i,
  // IBANs
  /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}(?:[A-Z0-9]{0,16})\b/,
];

/* ── Topics blocked — temas fuera del surf ── */
const OFF_TOPIC_KEYWORDS: string[] = [
  'política', 'politica', 'presidente', 'elecciones', 'gobierno',
  'violencia', 'armas', 'droga', 'drogas', 'narcotráfico', 'narco',
  'odio', 'racismo', 'racista',
  'hack', 'exploit', 'malware', 'phishing',
  'suicide', 'suicidio', 'autolesión',
  'pornografía', 'pornografia', 'sexual',
  'invertir dinero', 'cripto', 'bitcoin', 'estafa',
];

/* ── System prompt — define el comportamiento del bot ── */
const SYSTEM_PROMPT = `Eres SurfBot, el Surf Concierge experto de SurfLatam.
Tu misión exclusiva es ayudar con preguntas sobre surf en Latinoamérica.

PUEDES responder sobre:
- Spots de surf en LATAM: Chicama (Perú), Pavones (Costa Rica), Punta de Lobos (Chile), Pipa (Brasil), El Palmar (Ecuador) y más
- Temporadas, condiciones climáticas y oleaje por región
- Técnicas de surf: remar, ponerse de pie, duck dive, tubos, maniobras
- Equipamiento: tablas (shortboard, longboard, fish, gun), trajes, leashes, wax
- Seguridad en el agua, etiqueta en el lineup, corrientes
- Comunidad y cultura del surf en América Latina

NO DEBES responder sobre:
- Temas fuera del surf (política, finanzas, tecnología no relacionada con surf, etc.)
- Información personal o confidencial de usuarios
- Contenido inapropiado, violento o ilegal
- Cualquier cosa no relacionada con surf

Si te preguntan algo fuera del surf, responde SIEMPRE:
"Solo puedo ayudarte con temas de surf en LATAM. ¡Pregúntame sobre olas, spots o técnicas! 🌊"

Responde siempre en el mismo idioma que el usuario. Sé amigable, entusiasta del surf y conciso.
Usa emojis relacionados con el surf ocasionalmente: 🌊 🏄 🤙 🐬`;

/* ── Helpers ── */

/** Comprueba si el texto contiene datos sensibles (DLP) */
function containsSensitiveData(text: string): boolean {
  return DLP_PATTERNS.some((pattern) => pattern.test(text));
}

/** Comprueba si el mensaje parece fuera de tema */
function isOffTopic(text: string): boolean {
  const lower = text.toLowerCase();
  return OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

/** Comprueba si la RESPUESTA del AI habla de surf (output guardrail simple) */
function responseIsAboutSurf(text: string): boolean {
  const surfKeywords = [
    'surf', 'ola', 'tabla', 'playa', 'mar', 'océano', 'oceano',
    'spot', 'chicama', 'pavones', 'pipa', 'punta de lobos', 'palmar',
    'ola', 'tubo', 'maniobra', 'remar', 'lineup', 'break', 'wax',
    'shortboard', 'longboard', 'leash', 'traje', 'neopreno', 'duck dive',
    'temporada', 'swell', 'marea', 'corriente', 'viento',
    'lamentablemente', 'solo puedo', 'únicamente', 'solamente',
  ];
  const lower = text.toLowerCase();
  return surfKeywords.some((kw) => lower.includes(kw));
}

/** Genera headers CORS seguros */
function corsHeaders(origin: string, allowed: string): HeadersInit {
  const isAllowed = !allowed || origin === allowed || origin === `https://${allowed}`;
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

/* ── Main handler ── */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin  = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '';
    const cors    = corsHeaders(origin, allowed);

    /* Preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    /* Only POST /api/chat */
    const url = new URL(request.url);
    if (request.method !== 'POST' || !url.pathname.endsWith('/api/chat')) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    /* ── Rate Limiting ── */
    if (env.RATE_LIMITER) {
      const ip     = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait before sending more messages.' }),
          { status: 429, headers: { 'Content-Type': 'application/json', ...cors } }
        );
      }
    }

    /* ── Parse body ── */
    let body: { message?: string; history?: Array<{ role: string; content: string }> };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const userMessage = (body.message || '').trim().slice(0, 500);
    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Empty message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    /* ── INPUT GUARDRAILS ── */

    // 1. DLP: Bloquear datos sensibles en el input
    if (containsSensitiveData(userMessage)) {
      return new Response(
        JSON.stringify({
          blocked: true,
          reason: '🛡️ Tu mensaje contiene información sensible (datos personales, financieros). ' +
                  'Por políticas DLP de Cloudflare, no puedo procesar esta solicitud. ' +
                  'Pregúntame sobre surf en LATAM. 🌊',
          dlp_triggered: true,
        }),
        { status: 451, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }

    // 2. Topic filter: Detectar temas fuera del surf
    if (isOffTopic(userMessage)) {
      return new Response(
        JSON.stringify({
          blocked: true,
          reason: '🌊 Solo puedo ayudarte con temas de surf en Latinoamérica. ' +
                  '¡Pregúntame sobre spots, técnicas, equipamiento o temporadas!',
          topic_blocked: true,
        }),
        { status: 451, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }

    /* ── Build message history for AI ── */
    const history = Array.isArray(body.history) ? body.history : [];

    // Sanitize history: only keep user/assistant roles, max 10 entries
    const safeHistory = history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content).slice(0, 500),
      }));

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeHistory,
      { role: 'user', content: userMessage },
    ];

    /* ── Call Workers AI via AI Gateway ── */
    let aiResponse: string;
    try {
      // @ts-ignore — Workers AI types vary by runtime
      const result = await env.AI.run(
        '@cf/meta/llama-3.1-8b-instruct',
        {
          messages,
          max_tokens: 400,
          temperature: 0.7,
          stream: false,
        },
        {
          // AI Gateway endpoint (set in wrangler.toml)
          gateway: {
            id: 'surflatam-ai-gateway',
            skipCache: false,
            cacheTtl: 3600,
          },
        }
      );

      aiResponse = result?.response || result?.result?.response || '';
    } catch (err) {
      console.error('[SurfLatam Worker] AI error:', err);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable. Please try again.' }),
        { status: 503, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }

    if (!aiResponse || typeof aiResponse !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Empty AI response.' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }

    /* ── OUTPUT GUARDRAILS ── */

    // Verificar que la respuesta sea sobre surf
    // (el system prompt debería garantizarlo, pero esto es defensa en profundidad)
    const cleanResponse = aiResponse.trim().slice(0, 1200);

    if (!responseIsAboutSurf(cleanResponse)) {
      // La respuesta parece fuera de tema — reemplazar con mensaje seguro
      return new Response(
        JSON.stringify({
          reply: '🌊 Solo puedo ayudarte con temas de surf en Latinoamérica. ' +
                 '¿Tienes preguntas sobre spots, técnicas, equipamiento o temporadas?',
          guardrail_applied: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }

    /* ── Return clean response ── */
    return new Response(
      JSON.stringify({ reply: cleanResponse }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  },
};
