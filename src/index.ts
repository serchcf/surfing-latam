/*
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SurfLatam — Cloudflare SASE/ZTNA Demo                       ║
 * ║  Worker + Assets: Static Site + AI Chatbot con Guardrails    ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export interface Env {
  AI: any;
  ASSETS?: any;
  RATE_LIMITER?: any;
  ALLOWED_ORIGIN?: string;
}

/* ── DLP patterns: Información sensible a bloquear ── */
const DLP_PATTERNS: RegExp[] = [
  /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/, // Tarjetas
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
  /(?:password|passwd|pwd|token|secret|api[_\s-]?key)\s*[:=]\s*\S+/i, // Passwords/Tokens
  /\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b/, // SSN/Tax ID
];

/* ── Topics blocked: Fuera de contexto surf ── */
const OFF_TOPIC_KEYWORDS: string[] = [
  'política', 'politica', 'presidente', 'elecciones', 'gobierno',
  'violencia', 'armas', 'droga', 'drogas', 'narcotráfico', 'narco',
  'hack', 'exploit', 'malware', 'phishing',
  'suicidio', 'autolesión',
  'pornografía', 'pornografia',
];

/* ── Surf keywords: Validación de respuesta ── */
const SURF_KEYWORDS: string[] = [
  'surf', 'ola', 'tabla', 'playa', 'mar', 'océano', 'oceano',
  'spot', 'chicama', 'pavones', 'pipa', 'lobos', 'palmar', 'escondido', 'oaxaca',
  'tubo', 'maniobra', 'remar', 'lineup', 'break', 'wax',
  'shortboard', 'longboard', 'leash', 'neopreno', 'duck dive',
  'temporada', 'swell', 'marea', 'corriente', 'viento', 'costa',
  'pacífico', 'pacifico', 'atlántico', 'atlantico', 'latam', 'méxico', 'mexico',
  'solamente', 'únicamente', 'solo puedo', 'lamentablemente',
];

const SYSTEM_PROMPT = `Eres SurfBot, el Surf Concierge experto de SurfLatam.
Tu misión exclusiva es ayudar con preguntas sobre surf en Latinoamérica.

PUEDES responder sobre:
- Spots de surf en LATAM: Puerto Escondido (México), Chicama (Perú), Pavones (Costa Rica), Punta de Lobos (Chile), Praia de Pipa (Brasil), El Palmar (Ecuador) y más
- Temporadas, condiciones de swell, viento y oleaje por región
- Técnicas de surf: remar, take-off, duck dive, tubos, maniobras
- Equipamiento: tipos de tablas (shortboard, longboard, fish, gun), trajes de neopreno, leashes, wax
- Seguridad en el agua, corrientes de resaca, etiqueta en el lineup
- Cultura y comunidad del surf latinoamericano

NO DEBES responder sobre temas ajenos al surf (política, economía, tecnología no relacionada, etc.).
Si te preguntan algo fuera del surf, responde:
"Solo puedo ayudarte con temas de surf en LATAM. ¡Pregúntame sobre olas, spots, técnicas o equipamiento! 🌊"

Responde en el mismo idioma que el usuario con tono entusiasta, amigable y conciso. Usa emojis de surf: 🌊 🏄 🤙`;

function containsSensitiveData(text: string): boolean {
  return DLP_PATTERNS.some((p) => p.test(text));
}

function isOffTopic(text: string): boolean {
  const lower = text.toLowerCase();
  return OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

function responseIsAboutSurf(text: string): boolean {
  const lower = text.toLowerCase();
  return SURF_KEYWORDS.some((kw) => lower.includes(kw));
}

function jsonResponse(data: any, status = 200, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    const cors: Record<string, string> = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Handle Chat API route
    if (url.pathname === '/api/chat') {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405, cors);
      }

      // Rate Limiting (si está configurado)
      if (env.RATE_LIMITER) {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const { success } = await env.RATE_LIMITER.limit({ key: ip });
        if (!success) {
          return jsonResponse({ error: 'Rate limit exceeded. Please wait a moment.' }, 429, cors);
        }
      }

      let body: any;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
      }

      const userMessage = (body?.message || '').trim().slice(0, 500);
      if (!userMessage) {
        return jsonResponse({ error: 'Empty message' }, 400, cors);
      }

      /* ── CAPA 1: Guardrail DLP ── */
      if (containsSensitiveData(userMessage)) {
        return jsonResponse(
          {
            blocked: true,
            reason: '🛡️ Mensaje bloqueado por DLP de Cloudflare: contiene datos sensibles (tarjetas, credenciales o PII).',
            dlp_triggered: true,
          },
          451,
          cors
        );
      }

      /* ── CAPA 2: Guardrail de Tema (Surf Only) ── */
      if (isOffTopic(userMessage)) {
        return jsonResponse(
          {
            blocked: true,
            reason: '🌊 Solo puedo responder preguntas sobre surf en Latinoamérica. ¡Pregúntame sobre spots, olas o técnicas!',
            topic_blocked: true,
          },
          451,
          cors
        );
      }

      // Construir historial de mensajes
      const history = Array.isArray(body.history) ? body.history : [];
      const safeHistory = history
        .filter((m: any) => m.role === 'user' || m.role === 'assistant')
        .slice(-8)
        .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 500) }));

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...safeHistory,
        { role: 'user', content: userMessage },
      ];

      /* ── CAPA 3: Llamada a Workers AI (con fallback a directo si no hay Gateway) ── */
      let aiResponse = '';
      if (!env.AI) {
        return jsonResponse({
          reply: '🌊 ¡Hola! Soy SurfBot. Por favor habilita el binding "AI" en el dashboard de Cloudflare para activar mis respuestas de IA completas.',
        }, 200, cors);
      }

      try {
        // Intento con AI Gateway
        const res: any = await env.AI.run(
          '@cf/meta/llama-3.1-8b-instruct',
          { messages, max_tokens: 400, temperature: 0.7 },
          { gateway: { id: 'surflatam-ai-gateway', skipCache: false, cacheTtl: 3600 } }
        );
        aiResponse = res?.response || res?.result?.response || '';
      } catch {
        try {
          // Fallback directo a Workers AI sin Gateway
          const res: any = await env.AI.run(
            '@cf/meta/llama-3.1-8b-instruct',
            { messages, max_tokens: 400, temperature: 0.7 }
          );
          aiResponse = res?.response || res?.result?.response || '';
        } catch (err: any) {
          console.error('[AI Error]', err);
          return jsonResponse({ error: 'AI service temporarily unavailable.' }, 503, cors);
        }
      }

      /* ── CAPA 4: Guardrail de Salida ── */
      const cleanResponse = String(aiResponse).trim().slice(0, 1200);
      if (!responseIsAboutSurf(cleanResponse)) {
        return jsonResponse(
          {
            reply: '🌊 Solo puedo ayudarte con temas de surf en Latinoamérica. ¿Tienes preguntas sobre spots, técnicas o temporadas?',
            guardrail_applied: true,
          },
          200,
          cors
        );
      }

      return jsonResponse({ reply: cleanResponse }, 200, cors);
    }

    // Static Assets Fallback (si ASSETS binding está presente)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
