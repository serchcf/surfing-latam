/*
 * Cloudflare Pages Function: /api/geo
 * Returns client country using Cloudflare edge headers
 */

export async function onRequestGet({ request }) {
  const country = request.cf?.country || request.headers.get('cf-ipcountry') || 'XX';
  return new Response(JSON.stringify({ country, isBrazil: country === 'BR' }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}
