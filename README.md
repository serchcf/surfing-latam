# 🌊 SurfLatam — Cloudflare SASE/ZTNA Demo

> **Entorno demo ficticio** creado para demostrar soluciones Cloudflare SASE y Zero Trust (ZTNA).
> No es una empresa ni producto real.

Un sitio web de surf enfocado en los mejores spots de Latinoamérica, con un chatbot de IA protegido por múltiples capas de seguridad Cloudflare.

---

## 🏄 ¿Qué demuestra este proyecto?

| Solución Cloudflare | Uso en este demo |
|---|---|
| **Cloudflare Pages** | Hosting del sitio estático con CDN global |
| **Pages Functions** | API del chatbot (`/api/chat`) serverless |
| **Workers AI** | Modelo Llama 3.1 8B para el chatbot de surf |
| **AI Gateway** | Logging centralizado, caching, rate limiting del AI |
| **AI Gateway Guardrails** | DLP, topic filtering, output validation |
| **Cloudflare Access (ZTNA)** | "Employee Login" protegido por Zero Trust |
| **Security Headers** | CSP, HSTS, X-Frame-Options via `_headers` |
| **GitHub Actions CI/CD** | Deploy automático a Pages en cada push a `main` |

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

### 4. Configurar Cloudflare AI Gateway

1. Dashboard → **AI** → **AI Gateway**
2. Clic en **Create Gateway**
3. Nombre: `surflatam-ai-gateway`
4. Configurar:
   - ✅ **Rate limiting**: 20 requests/min
   - ✅ **Caching**: Enable (TTL: 3600s)
   - ✅ **Logging**: Enable (para auditoría SASE)
5. Copiar el Gateway ID y asegurarte de que coincide con el código en `functions/api/chat.js`

---

### 5. Configurar GitHub Actions (CI/CD)

Añadir estos **Secrets** en tu repositorio GitHub:
(`Settings` → `Secrets and variables` → `Actions` → `New repository secret`)

| Secret | Dónde obtenerlo |
|--------|-----------------|
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard → lado izquierdo, Account ID |
| `CLOUDFLARE_API_TOKEN` | Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template |

Una vez configurados, cada push a `main` desplegará automáticamente.

---

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

## 🛡️ Guardrails de Seguridad — SASE/ZTNA Demo

El chatbot implementa **defensa en profundidad**:

```
Usuario → [DLP Input] → [Topic Filter] → [AI Gateway] → [Workers AI] → [Output Guard] → Respuesta
```

### Capa 1: DLP (Data Loss Prevention)
Bloquea mensajes que contengan:
- Números de tarjeta de crédito
- Correos electrónicos
- Contraseñas / API keys
- Números de seguridad social

### Capa 2: Topic Guardrail (Input)
Rechaza preguntas sobre temas fuera del surf:
política, violencia, hacking, contenido inapropiado, etc.

### Capa 3: AI Gateway
- **Rate limiting**: 20 req/min
- **Caching**: Respuestas similares se cachean (ahorro de costo)
- **Logging**: Auditoría completa de todas las interacciones
- **Observability**: Métricas en tiempo real

### Capa 4: Output Guardrail
Valida que la respuesta del AI sea sobre surf antes de enviarla al usuario.

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
# 1. Verificar que el sitio responde
curl -I https://surflatam.pages.dev

# 2. Verificar headers de seguridad
curl -I https://surflatam.pages.dev | grep -E "X-Frame|Content-Security|Strict-Transport"

# 3. Probar el chatbot (pregunta válida)
curl -X POST https://surflatam.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuáles son los mejores spots de surf en Perú?"}'

# 4. Verificar DLP (debe ser bloqueado)
curl -X POST https://surflatam.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Mi tarjeta es 4111111111111111"}'

# 5. Verificar topic guardrail (debe ser bloqueado)
curl -X POST https://surflatam.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Háblame de política"}'
```

---

## 📊 Arquitectura Completa

```
GitHub (source of truth)
    │
    │ push to main
    ▼
GitHub Actions (CI/CD)
    │
    │ wrangler pages deploy
    ▼
Cloudflare Pages (CDN global)
    ├── public/          → HTML, CSS, JS estático
    └── functions/api/   → Pages Functions (serverless)
            │
            │ POST /api/chat
            ▼
        Guardrails (DLP + Topic Filter)
            │
            ▼
        Cloudflare AI Gateway
        (Rate limit · Cache · Logging)
            │
            ▼
        Workers AI
        (Llama 3.1 8B Instruct)
            │
            ▼
        Output Guardrail
            │
            ▼
        Respuesta al usuario
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
