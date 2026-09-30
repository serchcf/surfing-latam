# 🌊 SurfLatam — Cloudflare SASE/ZTNA Demo

> **Entorno demo ficticio** creado para demostrar soluciones Cloudflare SASE y Zero Trust (ZTNA).
> No es una empresa ni producto real.

Un sitio web de surf enfocado en los mejores spots de Latinoamérica, con un chatbot de IA protegido por múltiples capas de seguridad Cloudflare.

---

## 🏄 ¿Qué demuestra este proyecto?

| Solución Cloudflare | Uso en este demo |
|---|---|
| **Cloudflare Workers** | Worker `surfing-latam` sirve el sitio y sus rutas API |
| **Workers Static Assets** | Publica HTML, CSS, JS e imágenes desde `public/` |
| **Pages Functions** | Implementación alternativa del endpoint del chat si se despliega como Pages |
| **Workers AI** | Modelo Llama 3.1 8B Fast para el asistente de servicios |
| **AI Gateway** | Integración opcional para enrutar llamadas a Workers AI, con logging/caching si se configura |
| **Guardrails del chatbot** | DLP en el chat y filtro de alcance a servicios Cloudflare |
| **Workers Rate Limiting** | Límite de 5 solicitudes/minuto por IP en el Worker de chat |
| **Cloudflare Access (ZTNA)** | Requiere crear una aplicación y políticas de acceso en el dashboard |
| **Cloudflare Gateway (SWG)** | Requiere políticas Gateway y enrutar tráfico de prueba con WARP u otro método compatible |
| **Security Headers** | CSP, HSTS, X-Frame-Options via `_headers` |
| **GitHub Actions CI/CD** | `wrangler deploy` automático en cada push a `main` |

---

## 📁 Estructura del Proyecto

```
surfing-latam/
├── public/                       # Sitio estático → Cloudflare Pages
│   ├── index.html                # Página principal
│   ├── _headers                  # Security headers (CSP, HSTS, etc.)
│   ├── _redirects                # Redirects de Cloudflare Pages
│   └── assets/
│       ├── style.css             # Dark ocean theme + glassmorphism
│       ├── chat.js               # Lógica del chatbot (frontend)
│       ├── favicon.svg           # Ícono del sitio
│       └── img/                  # Imágenes de spots (agregar tus propias)
├── functions/
│   └── api/
│       └── chat.js               # Pages Function: API del chatbot con guardrails
├── workers/
│   └── chat-worker/              # Worker standalone (alternativa a Pages Function)
│       ├── src/index.ts          # Worker TypeScript con guardrails completos
│       ├── wrangler.toml
│       ├── package.json
│       └── tsconfig.json
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: GitHub Actions → Cloudflare Pages
├── wrangler.toml                 # Config raíz de Pages
└── README.md
```

---

## 🚀 Setup — Paso a Paso

### Prerrequisitos

- Cuenta de [Cloudflare](https://dash.cloudflare.com) (plan Free es suficiente)
- Cuenta de [GitHub](https://github.com)
- [Node.js](https://nodejs.org) >= 18 y npm (para desarrollo local)

---

### 1. Clonar y preparar el repositorio

```bash
# Clonar tu fork/repositorio
git clone https://github.com/TU_USUARIO/surfing-latam.git
cd surfing-latam
```

---

### 2. Configurar Cloudflare Pages

**Opción A — Via Dashboard (recomendado para empezar):**

1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Clic en **Create a project** → **Connect to Git**
3. Seleccionar tu repositorio `surfing-latam`
4. Configurar build:
   - **Build command**: *(dejar vacío — sitio estático)*
   - **Build output directory**: `public`
5. Clic en **Save and Deploy**

**Opción B — Via Wrangler CLI:**

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy public --project-name=surflatam
```

---

### 3. Habilitar Workers AI en Pages

En tu proyecto de Pages:
1. Ir a **Settings** → **Functions**
2. En **AI bindings** → **Add binding**
3. Variable name: `AI`
4. Guardar

> ⚡ Workers AI en el plan Free incluye 10,000 neurona-segundos/día.
> Para demos intensivos, considera el plan Workers Paid ($5/mes).

---

### 2. Configurar Cloudflare Workers
### 5. Configurar GitHub Actions (CI/CD)

npx wrangler login
npx wrangler deploy
| Secret | Dónde obtenerlo |
|--------|-----------------|
El archivo `wrangler.toml` configura los assets estáticos, el binding `AI` y el rate limit del chat.

### 3. Configurar GitHub Actions
| `CLOUDFLARE_API_TOKEN` | Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template |
Configura `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_API_TOKEN` como Actions secrets. El token debe tener permiso para desplegar Workers y acceder a Workers AI.
### 6. Configurar Cloudflare Zero Trust (ZTNA) — Employee Login

Para proteger rutas internas con Zero Trust Access:

1. Dashboard → **Zero Trust** → **Access** → **Applications**
2. Clic **Add an application** → **Self-hosted**
3. Configurar:
   - **Application name**: SurfLatam Employee Portal
   - **Application domain**: `surflatam.pages.dev/admin/*`
4. Crear una **Policy**:
   - Policy name: Employees Only
   - Action: Allow
   - Include: Emails ending in `@tuempresa.com`
5. El botón "Employee Login" en el navbar apunta a tu Access URL

---

### 7. Imágenes de los Spots

Agregar imágenes en `public/assets/img/` con estos nombres:

| Archivo | Spot |
|---------|------|
| `hero-poster.jpg` | Imagen hero (1920×1080) |
| `ocean-latam.jpg` | Océano LATAM (band section) |
| `surf-cultura.jpg` | Cultura del surf |
| `surfer-walk.jpg` | Surfer caminando |
| `cta-poster.jpg` | CTA section poster |
| `spot-chicama.jpg` | Chicama, Perú |
| `spot-pavones.jpg` | Pavones, Costa Rica |
| `spot-punta-lobos.jpg` | Punta de Lobos, Chile |
| `spot-pipa.jpg` | Pipa, Brasil |
| `spot-palmar.jpg` | El Palmar, Ecuador |

**Fuentes gratuitas recomendadas:**
- [Unsplash](https://unsplash.com/s/photos/surfing-latin-america)
- [Pexels](https://pexels.com/search/surfing/)
- [Mixkit](https://mixkit.co/free-stock-video/surf/)

**Videos opcionales** (para hero y CTA):
- `public/assets/video/surf-hero.mp4`
- `public/assets/video/surf-cta.mp4`

---

## 🛡️ Guardrails del Chatbot

El Worker de producción aplica controles al contenido enviado al chat. No son políticas SWG de red:

```
Usuario → [Rate limit: 5/min/IP] → [DLP del chat] → [Filtro de alcance] → [AI Gateway opcional] → [Workers AI] → [Filtro de respuesta] → Respuesta
```

### Capa 1: DLP (Data Loss Prevention)
Bloquea mensajes que contengan:
- Números de tarjeta de crédito
- Correos electrónicos
- Contraseñas / API keys
- Números de seguridad social

### Filtro de alcance
El chat responde sobre los servicios Cloudflare presentados en este demo: Pages, Workers AI, AI Gateway, DLP, Zero Trust Access y Gateway/SWG.

### AI Gateway
El Worker intenta enrutar las solicitudes por el gateway `surflatam-ai-gateway`; si falla, usa Workers AI directamente. Logging y caché dependen de la configuración del gateway. El rate limit del chat es un binding independiente.

### Filtro de respuesta
Rechaza respuestas que no mencionen los servicios permitidos. Es un filtro simple por palabras clave, no una garantía semántica.

## 🔐 Requisitos para demostrar Access y SWG

- **DLP del chat** está implementado en el Worker y puede probarse con datos de prueba ficticios; el filtro solo cubre mensajes del chat.
- **Zero Trust Access (ZTNA)** no protege actualmente una ruta de este repositorio. Para demostrarlo, crea una aplicación self-hosted en Cloudflare Access, asigna el dominio/ruta que quieras proteger y configura una política de acceso con usuarios de prueba.
- **Gateway/SWG** no inspecciona el tráfico de navegación de este sitio. Configura políticas DNS/HTTP en Cloudflare Gateway y conecta un dispositivo de prueba mediante WARP o un método de enrutamiento compatible.
- **AI Gateway no es SWG**: protege y observa llamadas a modelos de IA; no sustituye el filtrado web de Gateway.

---

## 🔧 Desarrollo Local

```bash
# Instalar wrangler globalmente
npm install -g wrangler

# Login en Cloudflare
wrangler login

# Servir el sitio localmente con Pages Functions
wrangler pages dev public --compatibility-date=2024-09-23

# El sitio correrá en: http://localhost:8788
# La API del chatbot en: http://localhost:8788/api/chat
```

> **Nota**: Workers AI no está disponible en modo local sin conexión a Cloudflare.
> Para testing local del chatbot, puedes mockear la respuesta en `functions/api/chat.js`.

---

## 🧪 Verificación Post-Deploy

```bash
# 1. Verificar que el Worker responde
curl -I https://surfing-latam.smunoz-91f.workers.dev

# 2. Verificar headers de seguridad
curl -I https://surfing-latam.smunoz-91f.workers.dev | grep -E "X-Frame|Content-Security|Strict-Transport"

# 3. Probar el chatbot (pregunta válida)
curl -X POST https://surfing-latam.smunoz-91f.workers.dev/api/chat \
  -H "Content-Type: application/json" \
    -d '{"message": "¿Ya funciona esto?"}'

# 4. Verificar DLP (debe ser bloqueado)
curl -X POST https://surfing-latam.smunoz-91f.workers.dev/api/chat \
  -H "Content-Type: application/json" \
    -d '{"message": "DLP test: test@example.invalid"}'

# 5. Verificar topic guardrail (debe ser bloqueado)
curl -X POST https://surfing-latam.smunoz-91f.workers.dev/api/chat \
  -H "Content-Type: application/json" \
    -d '{"message": "What is the capital of Chile?"}'

# 6. El rate limit responde HTTP 429 después de superar 5 requests/minuto/IP
```

---

## 📊 Arquitectura Completa

```
GitHub main → GitHub Actions → wrangler deploy
                                  │
                                  ▼
                     Cloudflare Worker surfing-latam
                     ├── Workers Static Assets (public/)
                     └── POST /api/chat
                           ├── Rate limit (5/min/IP)
                           ├── DLP del chat
                           ├── Filtro de alcance
                           ├── AI Gateway (opcional)
                           ├── Workers AI (Llama 3.1 8B Fast)
                           └── Filtro de respuesta
```

---

## 📝 Notas del Demo SASE/ZTNA

Este sitio demuestra los siguientes pilares de **SASE (Secure Access Service Edge)**:

- **SD-WAN / CDN**: Cloudflare Pages con CDN global en 300+ ciudades
- **ZTNA**: Zero Trust Access protegiendo rutas de empleados
- **SWG (Secure Web Gateway)**: AI Gateway filtrando y monitoreando el tráfico de AI
- **DLP**: Prevención de fuga de datos en el chatbot
- **CASB conceptual**: Control de acceso a la aplicación AI

---

## ⚖️ Disclaimer

SurfLatam es un entorno demo ficticio creado exclusivamente para demostrar soluciones Cloudflare SASE/ZTNA. No es una empresa ni producto real. Los spots de surf mencionados son reales, pero el sitio no provee servicios comerciales. Imágenes y videos son referenciales.

---

*Powered by Cloudflare 🌊*
