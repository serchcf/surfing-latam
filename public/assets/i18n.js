/* ============================================================
   SurfLatam — i18n Internationalization Engine (ES / PT-BR)
   Detects Cloudflare edge geolocation (Brazil -> PT-BR)
   Provides manual language toggle with localStorage persistence
   ============================================================ */

(function () {
  'use strict';

  const translations = {
    es: {
      langCode: 'es',
      metaTitle: 'SurfLatam — Los Mejores Spots de Surf en América Latina',
      metaDesc: 'Descubre los mejores spots de surf en Latinoamérica: Puerto Escondido, Chicama, Pavones, Punta de Lobos, Pipa y más. Tu guía definitiva del surf en LATAM.',
      
      // Banner
      banner1: 'SurfLatam — Cloudflare Zero Trust Demo Environment',
      banner2: '· SASE · ZTNA · AI Gateway · DLP · Zero Trust Access ·',
      
      // Nav
      navSpots: 'Los Spots',
      navCultura: 'La Cultura',
      navHistorias: 'Historias',
      navExplora: 'Explorar',
      navLogin: 'Employee Login',
      navDiscover: 'Descubrir',
      
      // Hero
      heroEyebrow: 'América Latina · Surf Culture',
      heroH1: 'Encuentra tu <span class="highlight">ola.</span>',
      heroLead: 'De las olas más largas del mundo en Chicama hasta el poderío de Punta de Lobos. Latinoamérica tiene los mejores spots de surf del planeta — y nosotros te los mostramos todos.',
      heroCta1: 'Ver los Spots',
      heroCta2: 'La Cultura del Surf',
      heroReassure: '6 países · 15+ spots · Temporada todo el año · Comunidad local',
      
      // Misión
      misionEyebrow: 'Nuestra misión',
      misionH2: 'El océano no tiene fronteras.',
      misionLead: 'Desde México hasta la Patagonia, el Pacífico y el Atlántico bañan costas que guardan algunas de las olas más perfectas del planeta. Esta es la guía que necesitabas.',
      
      // Spots section
      spotsEyebrow: 'Los mejores spots',
      spotsH2: 'Seis países. Olas para toda la vida.',
      spotsLead: 'Seleccionados por la comunidad local, verificados por surfistas profesionales. Cada spot tiene su personalidad — encuentra la tuya.',
      
      // Spot Cards
      spotChicamaTitle: 'Chicama',
      spotChicamaDesc: 'La izquierda más larga del mundo: más de 4 km de ola continua. Un point break épico que todo surfista debe surfear al menos una vez en la vida.',
      spotPavonesTitle: 'Pavones',
      spotPavonesDesc: 'Una de las izquierdas más largas del mundo rodeada de selva tropical. Rincón remoto donde la naturaleza y las olas conviven en perfecta armonía.',
      spotLobosTitle: 'Punta de Lobos',
      spotLobosDesc: 'Aguas frías del Pacífico Sur, olas poderosas y un paisaje salvaje. Sede de competencias WCT, este spot es para los que buscan el verdadero desafío.',
      spotPipaTitle: 'Praia de Pipa',
      spotPipaDesc: 'Beach break variado con olas para todos los niveles. Agua cálida todo el año, delfines en el lineup y una vibrante cultura de surf y vida nocturna.',
      spotPalmarTitle: 'El Palmar',
      spotPalmarDesc: 'Beach break consistente en la Costa del Pacífico ecuatoriano. Aguas cálidas, oleaje regular y una comunidad local amigable. Perfecto para progresar.',
      spotPuertoTitle: 'Puerto Escondido',
      spotPuertoDesc: 'El "Pipeline Mexicano" de Oaxaca: un shore break explosivo de fama mundial. Olas huecas y poderosas que rompen en arena, escenario del Mexican Open y destino de los mejores big wave surfers del planeta.',
      
      // Spot tags & badges
      tagLeft: 'Izquierda',
      tagPoint: 'Point break',
      tagBeach: 'Beach break',
      tagBoth: 'Ambas manos',
      tagAllYear: 'Todo el año',
      tagAdvanced: 'Avanzado',
      tagIntermediate: 'Intermedio',
      tagBeginner: 'Principiante',
      
      // Cultura
      culturaEyebrow: 'La cultura del surf',
      culturaH2: 'Más que una tabla.<br>Una forma de vida.',
      culturaLead: 'El surf en Latinoamérica es mucho más que un deporte. Es la filosofía del amanecer en el agua, del respeto por el océano, de la comunidad que se forma en el lineup. Cada país tiene su propia identidad, su propio ritmo, su propia ola.',
      culturaMuted: 'Desde los pescadores de Chicama que convirtieron sus botes en tablas, hasta los profesionales chilenos y brasileños que dominan el circuito mundial. El surf latinoamericano tiene historia, alma y futuro.',
      culturaFieldnote: '"El lineup en Pavones es como un idioma sin palabras. Todos saben cuándo es tu turno, todos se cuidan. Es la mejor clase de comunicación que existe."',
      culturaAuthor: '— Rodrigo M., surfista · Jacó, Costa Rica',
      
      // Stats
      stat1Lbl: 'Destinos',
      stat2Lbl: 'Cubiertos',
      stat3Lbl: 'Temporada',
      stat4Lbl: 'Ola más larga',
      stat5Lbl: 'Memorias',
      stat1Sub: ' países',
      stat2Sub: '+ spots',
      stat3Sub: ' meses',
      stat4Sub: ' km',
      
      // Historias
      historiasEyebrow: 'Historias de surfistas',
      historiasH2: 'El océano cambia personas.',
      historiasLead: 'Historias reales de surfistas que encontraron su ola en LATAM.',
      story1: '"Llegué a Chicama sin saber que existía. Me quedé tres semanas. La ola te atrapa, la comunidad te retiene. Volví cinco veces desde entonces."',
      story1Role: 'Surfista · Ciudad de México, México',
      story2: '"Punta de Lobos me enseñó el respeto. El agua fría, las rocas, la potencia. Salí de ahí siendo un surfista diferente. Más humilde, más fuerte."',
      story2Role: 'Surfista profesional · Santiago, Chile',
      story3: '"Empecé en Pipa porque el agua era cálida y no daba tanto miedo. Hoy soy instructor. Ese primer día en Pipa lo cambió todo para mí."',
      story3Role: 'Instructor de surf · Natal, Brasil',
      
      // Cloudflare Band
      cfEyebrow: 'Powered by Cloudflare',
      cfH2: 'Seguridad sin compromisos.',
      cfLead: 'SurfLatam corre 100% en infraestructura Cloudflare. Desde el hosting hasta el chatbot de IA, cada capa de la plataforma implementa Zero Trust y SASE por diseño.',
      cfPt1T: 'Cloudflare Pages',
      cfPt1D: 'Hosting global con CDN automático. Latencia mínima desde cualquier punto de LATAM.',
      cfPt2T: 'AI Gateway + DLP',
      cfPt2D: 'El chatbot está protegido por guardrails, filtrado de contenido y prevención de fuga de datos.',
      cfPt3T: 'Zero Trust Access',
      cfPt3D: 'Acceso de empleados protegido por identidad, sin VPN. Verificación continua.',
      
      // CTA
      ctaEyebrow: 'Empieza tu aventura',
      ctaH2: 'Tu próxima ola te espera.',
      ctaLead: 'Pregunta a nuestro Surf Concierge por el mejor spot según tu nivel, la temporada que prefieras y el tipo de ola que buscas.',
      ctaBtn: 'Hablar con el Surf Bot 🌊',
      
      // Footer
      footerDesc: 'Tu guía definitiva del surf en América Latina. Powered by Cloudflare SASE & Zero Trust.',
      footerCol1: 'Destinos',
      footerCol2: 'Comunidad',
      footerCol3: 'Soporte',
      footerLegal1: '© 2026 SurfLatam. Un entorno demo de Cloudflare Zero Trust — empresa ficticia, no un producto real.',
      footerLegal2: 'Encuentra tu ola. 🌊',
      footerDisclaimer: 'SurfLatam es un entorno demo ficticio creado para demostrar soluciones Cloudflare SASE/ZTNA. El chatbot usa Cloudflare Workers AI con guardrails de AI Gateway. Las imágenes son referenciales. Siempre consulta con expertos locales antes de practicar surf.',
      
      // Chatbot
      chatTitle: 'Surf Concierge',
      chatSub: 'SurfLatam AI · Powered by Cloudflare',
      chatPlaceholder: 'Pregunta sobre surf en LATAM…',
      chatTyping: 'El concierge está escribiendo…',
      chatWelcome: '¡Hola! 🤙 Soy el Surf Concierge de SurfLatam. Puedo ayudarte con todo sobre surf en Latinoamérica: spots, condiciones, técnicas, equipamiento y temporadas. ¿Qué quieres saber?',
      chatBlockedDlp: '🛡️ Mensaje bloqueado por DLP de Cloudflare: contiene datos sensibles (tarjetas, credenciales o PII).',
      chatBlockedTopic: '🌊 Solo puedo responder preguntas sobre surf en Latinoamérica. ¡Pregúntame sobre spots, olas o técnicas!',
      chatFooter: 'Protegido por <strong>Cloudflare AI Gateway</strong> · DLP · Guardrails activos'
    },
    
    pt: {
      langCode: 'pt',
      metaTitle: 'SurfLatam — Os Melhores Picos de Surf na América Latina',
      metaDesc: 'Descubra os melhores picos de surf na América Latina: Puerto Escondido, Chicama, Pavones, Punta de Lobos, Praia de Pipa e mais. Seu guia definitivo de surf na LATAM.',
      
      // Banner
      banner1: 'SurfLatam — Ambiente de Demonstração Cloudflare Zero Trust',
      banner2: '· SASE · ZTNA · AI Gateway · DLP · Zero Trust Access ·',
      
      // Nav
      navSpots: 'Os Picos',
      navCultura: 'A Cultura',
      navHistorias: 'Histórias',
      navExplora: 'Explorar',
      navLogin: 'Login de Equipe',
      navDiscover: 'Descobrir',
      
      // Hero
      heroEyebrow: 'América Latina · Cultura do Surf',
      heroH1: 'Encontre a sua <span class="highlight">onda.</span>',
      heroLead: 'Das ondas mais longas do mundo em Chicama até o poder de Punta de Lobos. A América Latina tem os melhores picos de surf do planeta — e nós mostramos todos para você.',
      heroCta1: 'Ver os Picos',
      heroCta2: 'A Cultura do Surf',
      heroReassure: '6 países · 15+ picos · Temporada o ano inteiro · Comunidade local',
      
      // Misión
      misionEyebrow: 'Nossa missão',
      misionH2: 'O oceano não tem fronteiras.',
      misionLead: 'Do México até a Patagônia, o Pacífico e o Atlântico banham litorais que guardam algumas das ondas mais perfeitas do planeta. Este é o guia que você precisava.',
      
      // Spots section
      spotsEyebrow: 'Os melhores picos',
      spotsH2: 'Seis países. Ondas para toda a vida.',
      spotsLead: 'Selecionados pela comunidade local, verificados por surfistas profissionais. Cada pico tem a sua identidade — encontre a sua.',
      
      // Spot Cards
      spotChicamaTitle: 'Chicama',
      spotChicamaDesc: 'A esquerda mais longa do mundo: mais de 4 km de onda contínua. Um point break épico que todo surfista precisa pegar pelo menos uma vez na vida.',
      spotPavonesTitle: 'Pavones',
      spotPavonesDesc: 'Uma das esquerdas mais longas do mundo cercada por floresta tropical. Refúgio remoto onde a natureza e as ondas convivem em perfeita harmonia.',
      spotLobosTitle: 'Punta de Lobos',
      spotLobosDesc: 'Águas geladas do Pacífico Sul, ondas pesadas e uma paisagem selvagem. Palco do mundial, este pico é para quem busca o verdadeiro desafio.',
      spotPipaTitle: 'Praia de Pipa',
      spotPipaDesc: 'Beach break variado com ondas para todos os níveis. Água quente o ano todo, golfinhos no outside e uma cultura vibrante de surf e vida noturna.',
      spotPalmarTitle: 'El Palmar',
      spotPalmarDesc: 'Beach break consistente no litoral do Pacífico equatoriano. Águas mornas, ondulação constante e uma comunidade local muito receptiva. Perfeito para evoluir.',
      spotPuertoTitle: 'Puerto Escondido',
      spotPuertoDesc: 'O "Pipeline Mexicano" de Oaxaca: um shore break explosivo de renome mundial. Ondas tubulares e cavadas que quebram na areia, palco do Mexican Open e destino dos maiores big riders do planeta.',
      
      // Spot tags & badges
      tagLeft: 'Esquerda',
      tagPoint: 'Point break',
      tagBeach: 'Beach break',
      tagBoth: 'Ambos os lados',
      tagAllYear: 'O ano todo',
      tagAdvanced: 'Avançado',
      tagIntermediate: 'Intermediário',
      tagBeginner: 'Iniciante',
      
      // Cultura
      culturaEyebrow: 'A cultura do surf',
      culturaH2: 'Mais que uma prancha.<br>Um estilo de vida.',
      culturaLead: 'O surf na América Latina é muito mais que um esporte. É a filosofia do amanhecer na água, do respeito pelo oceano, da amizade que nasce no lineup. Cada país tem a sua própria identidade, o seu ritmo, a sua onda.',
      culturaMuted: 'Dos pescadores de Chicama que transformaram seus botes em pranchas, até os profissionais brasileiros e chilenos que dominam os circuitos mundiais. O surf latino-americano tem história, alma e futuro.',
      culturaFieldnote: '"O lineup em Pavones é como um idioma sem palavras. Todos sabem quando é a sua vez, todos se cuidam. É a forma mais pura de comunicação."',
      culturaAuthor: '— Rodrigo M., surfista · Jacó, Costa Rica',
      
      // Stats
      stat1Lbl: 'Destinos',
      stat2Lbl: 'Cobertos',
      stat3Lbl: 'Temporada',
      stat4Lbl: 'Onda mais longa',
      stat5Lbl: 'Memórias',
      stat1Sub: ' países',
      stat2Sub: '+ picos',
      stat3Sub: ' meses',
      stat4Sub: ' km',
      
      // Historias
      historiasEyebrow: 'Histórias de surfistas',
      historiasH2: 'O oceano transforma pessoas.',
      historiasLead: 'Histórias reais de surfistas que encontraram a sua onda na América Latina.',
      story1: '"Cheguei a Chicama sem saber direito o que esperar. Fiquei três semanas. A onda te abraça, a comunidade te acolhe. Já voltei cinco vezes."',
      story1Role: 'Surfista · Cidade do México, México',
      story2: '"Punta de Lobos me ensinou respeito. A água fria, as pedras, o tamanho. Saí de lá um surfista completamente diferente. Mais humilde, mais forte."',
      story2Role: 'Surfista profissional · Santiago, Chile',
      story3: '"Comecei em Pipa porque a água era quentinha e dava menos medo. Hoje sou instrutor de surf. Aquele primeiro dia em Pipa mudou a minha vida."',
      story3Role: 'Instrutor de surf · Natal, Brasil',
      
      // Cloudflare Band
      cfEyebrow: 'Powered by Cloudflare',
      cfH2: 'Segurança sem concessões.',
      cfLead: 'A SurfLatam roda 100% na infraestrutura da Cloudflare. Do site estático ao chatbot de IA, cada camada da plataforma foi desenhada com Zero Trust e SASE nativos.',
      cfPt1T: 'Cloudflare Pages',
      cfPt1D: 'Hospedagem global com CDN automatizada. Latência ultrabaixa em qualquer lugar da América Latina.',
      cfPt2T: 'AI Gateway + DLP',
      cfPt2D: 'O chatbot é protegido por guardrails inteligentes, moderação de conteúdo e prevenção contra vazamento de dados.',
      cfPt3T: 'Zero Trust Access',
      cfPt3D: 'Acesso corporativo seguro baseado em identidade, sem VPN. Verificação contínua.',
      
      // CTA
      ctaEyebrow: 'Comece sua aventura',
      ctaH2: 'A sua próxima onda te espera.',
      ctaLead: 'Pergunte ao nosso Surf Concierge sobre o melhor pico para o seu nível, a melhor época do ano e o tipo de onda que você procura.',
      ctaBtn: 'Falar com o Surf Bot 🌊',
      
      // Footer
      footerDesc: 'Seu guia definitivo de surf na América Latina. Powered by Cloudflare SASE & Zero Trust.',
      footerCol1: 'Destinos',
      footerCol2: 'Comunidade',
      footerCol3: 'Suporte',
      footerLegal1: '© 2026 SurfLatam. Ambiente demo da Cloudflare Zero Trust — empresa fictícia para demonstração.',
      footerLegal2: 'Encontre a sua onda. 🌊',
      footerDisclaimer: 'SurfLatam é um ambiente de demonstração fictício criado para apresentar soluções Cloudflare SASE/ZTNA. O chatbot utiliza Cloudflare Workers AI com guardrails de AI Gateway. Fotos e vídeos são referenciais.',
      
      // Chatbot
      chatTitle: 'Surf Concierge',
      chatSub: 'SurfLatam AI · Powered by Cloudflare',
      chatPlaceholder: 'Pergunte sobre surf na América Latina…',
      chatTyping: 'O concierge está digitando…',
      chatWelcome: 'Olá! 🤙 Sou o Surf Concierge da SurfLatam. Posso te ajudar com tudo sobre surf na América Latina: picos, condições, técnicas, pranchas e temporadas. O que você quer saber?',
      chatBlockedDlp: '🛡️ Mensagem bloqueada pelo DLP da Cloudflare: contém dados confidenciais (cartões, credenciais ou PII).',
      chatBlockedTopic: '🌊 Só posso responder a perguntas sobre surf na América Latina. Pergunte-me sobre picos, ondas ou equipamentos!',
      chatFooter: 'Protegido por <strong>Cloudflare AI Gateway</strong> · DLP · Guardrails ativos'
    }
  };

  let currentLang = 'es';

  function applyTranslations(lang) {
    if (!translations[lang]) lang = 'es';
    currentLang = lang;
    const t = translations[lang];

    // Document language & meta
    document.documentElement.lang = t.langCode;
    if (t.metaTitle) document.title = t.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t.metaDesc) metaDesc.setAttribute('content', t.metaDesc);

    // Text content elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        if (t[key].includes('<')) {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Save preference
    localStorage.setItem('surflatam_lang', lang);

    // Dispatch event so other scripts (like chat.js) can react
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang, t } }));
  }

  async function detectInitialLanguage() {
    // 1. Explicit user choice in localStorage takes priority
    const saved = localStorage.getItem('surflatam_lang');
    if (saved === 'es' || saved === 'pt') {
      applyTranslations(saved);
      return;
    }

    // 2. Check browser locale (e.g. pt-BR, pt)
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('pt')) {
      applyTranslations('pt');
      return;
    }

    // 3. Query Cloudflare edge geolocation (/api/geo)
    try {
      const res = await fetch('/api/geo');
      if (res.ok) {
        const data = await res.json();
        if (data.country === 'BR' || data.isBrazil) {
          applyTranslations('pt');
          return;
        }
      }
    } catch {
      // Ignore network errors and fallback to Spanish default
    }

    // Default to Spanish
    applyTranslations('es');
  }

  // Global helper to switch language programmatically
  window.setLanguage = function (lang) {
    applyTranslations(lang);
  };

  window.getCurrentLanguage = function () {
    return currentLang;
  };

  window.getTranslation = function (key) {
    return translations[currentLang]?.[key] || translations.es[key] || '';
  };

  // Wire up button click events once DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chosen = btn.getAttribute('data-lang');
        if (chosen) setLanguage(chosen);
      });
    });

    detectInitialLanguage();
  });

})();
