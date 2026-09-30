/* ============================================================
  SurfLatam — i18n Internationalization Engine (ES / PT-BR / EN-US)
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
      oceanImageAlt: 'Océano Pacífico visto desde la costa latinoamericana',
      spotChicamaAlt: 'Chicama, Perú — la izquierda más larga del mundo',
      spotPavonesAlt: 'Pavones, Costa Rica — surf en la jungla',
      spotLobosAlt: 'Punta de Lobos, Chile — olas poderosas del Pacífico Sur',
      spotPipaAlt: 'Praia de Pipa, Brasil — beach break tropical',
      spotPalmarAlt: 'El Palmar, Ecuador — beach break consistente',
      spotPuertoAlt: 'Puerto Escondido, Oaxaca, México — el Pipeline Mexicano',
      cultureImageAlt: 'Surfista caminando hacia el mar al amanecer en LATAM',
      securityImageAlt: 'Surfista caminando al amanecer',
      
      // Banner
      banner1: 'SurfLatam — Entorno de demostración Cloudflare Zero Trust',
      banner2: '· SASE · ZTNA · AI Gateway · DLP · Zero Trust Access ·',
      
      // Nav
      navSpots: 'Los Spots',
      navCultura: 'La Cultura',
      navHistorias: 'Historias',
      navExplora: 'Explorar',
      navLogin: 'Employee Login',
      navDiscover: 'Descubrir',
      navToggleLabel: 'Abrir menú',
      languageSelectorLabel: 'Seleccionar idioma',
      chatToggleLabel: 'Abrir el asistente SurfLatam',
      chatDialogLabel: 'Asistente SurfLatam',
      chatCloseLabel: 'Cerrar chat',
      chatSendLabel: 'Enviar mensaje',
      demoRunbookLabel: 'Guía de demostración Cloudflare SASE',
      
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
      countryPeru: 'Perú',
      countryCostaRica: 'Costa Rica',
      countryChile: 'Chile',
      countryBrazil: 'Brasil',
      countryEcuador: 'Ecuador',
      countryMexico: 'México',
      badgeLegendary: 'Legendario',
      badgeJungle: 'Jungla',
      badgePower: 'Potencia',
      badgeTropical: 'Tropical',
      badgeConsistent: 'Consistente',
      badgePipeline: 'Pipeline MX',
      
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
      cfLead: 'SurfLatam muestra servicios Cloudflare como Pages, Workers AI, Access y Gateway. Los controles de red e identidad requieren políticas activas en tu cuenta.',
      cfPt1T: 'Cloudflare Pages',
      cfPt1D: 'Hosting global con CDN automático. Latencia mínima desde cualquier punto de LATAM.',
      cfPt2T: 'Cloudflare Gateway (SWG) + DLP',
      cfPt2D: 'Filtrado DNS y HTTP y controles DLP sujetos a políticas y rutas configuradas en Cloudflare.',
      cfPt3T: 'Zero Trust Access',
      cfPt3D: 'Puede proteger aplicaciones por identidad y políticas. Requiere configurar una aplicación y reglas en Cloudflare Access.',
      
      // CTA
      ctaEyebrow: 'Tu guía de surf en LATAM',
      ctaH2: 'Encuentra tu próximo spot.',
      ctaLead: 'Pregunta al asistente por destinos, niveles, temporadas y cultura del surf en Latinoamérica.',
      ctaBtn: 'Preguntar al asistente',
      
      // Footer
      footerDesc: 'Tu guía definitiva del surf en América Latina. Powered by Cloudflare SASE & Zero Trust.',
      footerCol1: 'Destinos',
      footerCol2: 'Comunidad',
      footerCol3: 'Soporte',
      footerSpotChicama: 'Chicama, Perú',
      footerSpotPavones: 'Pavones, Costa Rica',
      footerSpotLobos: 'Punta de Lobos, Chile',
      footerSpotPipa: 'Pipa, Brasil',
      footerSpotPalmar: 'El Palmar, Ecuador',
      footerSpotPuerto: 'Puerto Escondido, México',
      securityGuide: 'Guía de seguridad',
      privacyPolicy: 'Política de privacidad',
      footerLegal1: '© 2026 SurfLatam. Un entorno demo de Cloudflare Zero Trust — empresa ficticia, no un producto real.',
      footerLegal2: 'Encuentra tu ola. 🌊',
      footerDisclaimer: 'SurfLatam es un entorno demo ficticio. El chat usa Workers AI, un filtro DLP implementado en la aplicación y una integración opcional con AI Gateway. Access y Gateway (SWG) requieren políticas configuradas por separado en Cloudflare.',
      
      // Chatbot
      chatTitle: 'Asistente SurfLatam',
      chatSub: 'Spots, temporadas y cultura · Workers AI',
      chatPlaceholder: 'Pregunta por spots, niveles o temporadas…',
      chatTyping: 'El asistente está respondiendo…',
      chatWelcome: '¡Hola! Puedo ayudarte con los spots de SurfLatam, sus niveles y temporadas, y la cultura del surf latinoamericano. También respondo sobre los servicios Cloudflare que muestra el sitio. ¿Qué destino tienes en mente?',
      chatBlockedDlp: '🛡️ Bloqueado por el control DLP de este chat de demostración: contiene datos sensibles (tarjetas, credenciales o PII).',
      chatBlockedTopic: 'Puedo ayudarte con los spots, niveles, temporadas y cultura del surf en SurfLatam, además de los servicios Cloudflare que explica el sitio.',
      chatRateLimit: '⏳ Límite del chat alcanzado. Espera un minuto e inténtalo de nuevo.',
      chatConnectionError: '🌊 No se pudo conectar con el asistente. Inténtalo de nuevo.',
      chatFooter: 'SurfLatam · DLP · 5 solicitudes/min'
    },
    
    pt: {
      langCode: 'pt',
      metaTitle: 'SurfLatam — Os Melhores Picos de Surf na América Latina',
      metaDesc: 'Descubra os melhores picos de surf na América Latina: Puerto Escondido, Chicama, Pavones, Punta de Lobos, Praia de Pipa e mais. Seu guia definitivo de surf na LATAM.',
      oceanImageAlt: 'Oceano Pacífico visto do litoral latino-americano',
      spotChicamaAlt: 'Chicama, Peru — a esquerda mais longa do mundo',
      spotPavonesAlt: 'Pavones, Costa Rica — surf na selva',
      spotLobosAlt: 'Punta de Lobos, Chile — ondas poderosas do Pacífico Sul',
      spotPipaAlt: 'Praia de Pipa, Brasil — beach break tropical',
      spotPalmarAlt: 'El Palmar, Equador — beach break consistente',
      spotPuertoAlt: 'Puerto Escondido, Oaxaca, México — o Pipeline Mexicano',
      cultureImageAlt: 'Surfista caminhando em direção ao mar ao amanhecer na América Latina',
      securityImageAlt: 'Surfista caminhando ao amanhecer',
      
      // Banner
      banner1: 'SurfLatam — Ambiente de demonstração Cloudflare Zero Trust',
      banner2: '· SASE · ZTNA · AI Gateway · DLP · Zero Trust Access ·',
      
      // Nav
      navSpots: 'Os Picos',
      navCultura: 'A Cultura',
      navHistorias: 'Histórias',
      navExplora: 'Explorar',
      navLogin: 'Login de Equipe',
      navDiscover: 'Descobrir',
      navToggleLabel: 'Abrir menu',
      languageSelectorLabel: 'Selecionar idioma',
      chatToggleLabel: 'Abrir o assistente SurfLatam',
      chatDialogLabel: 'Assistente SurfLatam',
      chatCloseLabel: 'Fechar chat',
      chatSendLabel: 'Enviar mensagem',
      demoRunbookLabel: 'Guia de demonstração Cloudflare SASE',
      
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
      countryPeru: 'Peru',
      countryCostaRica: 'Costa Rica',
      countryChile: 'Chile',
      countryBrazil: 'Brasil',
      countryEcuador: 'Equador',
      countryMexico: 'México',
      badgeLegendary: 'Lendário',
      badgeJungle: 'Selva',
      badgePower: 'Potência',
      badgeTropical: 'Tropical',
      badgeConsistent: 'Consistente',
      badgePipeline: 'Pipeline MX',
      
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
      cfLead: 'A SurfLatam apresenta serviços Cloudflare como Pages, Workers AI, Access e Gateway. Os controles de rede e identidade exigem políticas ativas na sua conta.',
      cfPt1T: 'Cloudflare Pages',
      cfPt1D: 'Hospedagem global com CDN automatizada. Latência ultrabaixa em qualquer lugar da América Latina.',
      cfPt2T: 'Cloudflare Gateway (SWG) + DLP',
      cfPt2D: 'Filtragem DNS e HTTP e controles DLP dependem de políticas e rotas configuradas na Cloudflare.',
      cfPt3T: 'Zero Trust Access',
      cfPt3D: 'Pode proteger aplicações por identidade e políticas. Requer configurar uma aplicação e regras no Cloudflare Access.',
      
      // CTA
      ctaEyebrow: 'Seu guia de surf na América Latina',
      ctaH2: 'Encontre seu próximo pico.',
      ctaLead: 'Pergunte ao assistente sobre destinos, níveis, temporadas e cultura do surf na América Latina.',
      ctaBtn: 'Perguntar ao assistente',
      
      // Footer
      footerDesc: 'Seu guia definitivo de surf na América Latina. Powered by Cloudflare SASE & Zero Trust.',
      footerCol1: 'Destinos',
      footerCol2: 'Comunidade',
      footerCol3: 'Suporte',
      footerSpotChicama: 'Chicama, Peru',
      footerSpotPavones: 'Pavones, Costa Rica',
      footerSpotLobos: 'Punta de Lobos, Chile',
      footerSpotPipa: 'Pipa, Brasil',
      footerSpotPalmar: 'El Palmar, Equador',
      footerSpotPuerto: 'Puerto Escondido, México',
      securityGuide: 'Guia de segurança',
      privacyPolicy: 'Política de privacidade',
      footerLegal1: '© 2026 SurfLatam. Ambiente demo da Cloudflare Zero Trust — empresa fictícia para demonstração.',
      footerLegal2: 'Encontre a sua onda. 🌊',
      footerDisclaimer: 'SurfLatam é uma demonstração fictícia. O chat usa Workers AI, um filtro DLP implementado na aplicação e integração opcional com AI Gateway. Access e Gateway (SWG) exigem políticas configuradas separadamente na Cloudflare.',
      
      // Chatbot
      chatTitle: 'Assistente SurfLatam',
      chatSub: 'Picos, temporadas e cultura · Workers AI',
      chatPlaceholder: 'Pergunte sobre picos, níveis ou temporadas…',
      chatTyping: 'O assistente está respondendo…',
      chatWelcome: 'Olá! Posso ajudar com os picos da SurfLatam, seus níveis e temporadas, e a cultura do surf latino-americano. Também respondo sobre os serviços Cloudflare apresentados no site. Qual destino você procura?',
      chatBlockedDlp: '🛡️ Bloqueada pelo controle DLP deste chat de demonstração: contém dados confidenciais (cartões, credenciais ou PII).',
      chatBlockedTopic: 'Posso ajudar com os picos, níveis, temporadas e cultura do surf na SurfLatam, além dos serviços Cloudflare explicados no site.',
      chatRateLimit: '⏳ Limite do chat atingido. Aguarde um minuto e tente novamente.',
      chatConnectionError: '🌊 Não foi possível conectar ao assistente. Tente novamente.',
      chatFooter: 'SurfLatam · DLP · 5 solicitações/min'
    },

    en: {
      langCode: 'en-US',
      metaTitle: 'SurfLatam — Latin America Surf Spots',
      metaDesc: 'Explore surf spots across Latin America, from Chicama and Pavones to Punta de Lobos, Pipa, El Palmar, and Puerto Escondido.',
      banner1: 'SurfLatam — Cloudflare Zero Trust Demo Environment',
      banner2: '· SASE · ZTNA · AI Gateway · DLP · Zero Trust Access ·',
      navSpots: 'Surf Spots',
      navCultura: 'Culture',
      navHistorias: 'Stories',
      navExplora: 'Explore',
      navLogin: 'Employee Login',
      navDiscover: 'Discover',
      navToggleLabel: 'Open menu',
      languageSelectorLabel: 'Select language',
      chatToggleLabel: 'Open the SurfLatam assistant',
      chatDialogLabel: 'SurfLatam assistant',
      chatCloseLabel: 'Close chat',
      chatSendLabel: 'Send message',
      demoRunbookLabel: 'Cloudflare SASE demo runbook',
      heroEyebrow: 'Latin America · Surf Culture',
      heroH1: 'Find your <span class="highlight">wave.</span>',
      heroLead: 'From the world’s longest waves in Chicama to the power of Punta de Lobos, Latin America is home to some of the best surf spots on the planet. We’ll help you find yours.',
      heroCta1: 'Explore the Spots',
      heroCta2: 'Surf Culture',
      heroReassure: '6 countries · 15+ spots · Surf all year · Local community',
      misionEyebrow: 'Our mission',
      misionH2: 'The ocean has no borders.',
      misionLead: 'From Mexico to Patagonia, the Pacific and Atlantic coastlines hold some of the most perfect waves on the planet. This is the guide you’ve been looking for.',
      spotsEyebrow: 'Top surf spots',
      spotsH2: 'Six countries. A lifetime of waves.',
      spotsLead: 'Selected by local communities and checked by professional surfers. Every spot has its own character—find the one that fits you.',
      spotChicamaTitle: 'Chicama',
      spotChicamaDesc: 'The world’s longest left: more than 4 km (2.5 miles) of continuous wave. An epic point break every surfer should experience at least once.',
      spotPavonesTitle: 'Pavones',
      spotPavonesDesc: 'One of the world’s longest lefts, surrounded by tropical rainforest. A remote corner where nature and waves come together.',
      spotLobosTitle: 'Punta de Lobos',
      spotLobosDesc: 'Cold South Pacific water, powerful waves, and a rugged landscape. A WCT competition venue for surfers looking for a real challenge.',
      spotPipaTitle: 'Praia de Pipa',
      spotPipaDesc: 'A varied beach break with waves for every level. Warm water year-round, dolphins in the lineup, and a lively surf and nightlife scene.',
      spotPalmarTitle: 'El Palmar',
      spotPalmarDesc: 'A consistent beach break on Ecuador’s Pacific coast. Warm water, regular swell, and a welcoming local community make it a great place to progress.',
      spotPuertoTitle: 'Puerto Escondido',
      spotPuertoDesc: 'Oaxaca’s “Mexican Pipeline”: a world-famous, powerful shore break with hollow waves breaking over sand. It hosts the Mexican Open and draws top big-wave surfers.',
      countryPeru: 'Peru',
      countryCostaRica: 'Costa Rica',
      countryChile: 'Chile',
      countryBrazil: 'Brazil',
      countryEcuador: 'Ecuador',
      countryMexico: 'Mexico',
      badgeLegendary: 'Legendary',
      badgeJungle: 'Rainforest',
      badgePower: 'Power',
      badgeTropical: 'Tropical',
      badgeConsistent: 'Consistent',
      badgePipeline: 'Mexican Pipeline',
      tagLeft: 'Left',
      tagPoint: 'Point break',
      tagBeach: 'Beach break',
      tagBoth: 'Both directions',
      tagAllYear: 'Year-round',
      tagAdvanced: 'Advanced',
      tagIntermediate: 'Intermediate',
      tagBeginner: 'Beginner',
      culturaEyebrow: 'Surf culture',
      culturaH2: 'More than a board.<br>A way of life.',
      culturaLead: 'Surfing in Latin America is more than a sport. It’s the sunrise paddle, respect for the ocean, and the community that forms in the lineup. Every country has its own identity, rhythm, and wave.',
      culturaMuted: 'From the Chicama fishermen who turned their boats into boards to Chilean and Brazilian pros on the world tour, Latin American surfing has history, soul, and a future.',
      culturaFieldnote: '“The lineup at Pavones is like a language without words. Everyone knows when it’s your turn, and everyone looks out for one another. It’s the best kind of communication.”',
      culturaAuthor: '— Rodrigo M., surfer · Jacó, Costa Rica',
      stat1Lbl: 'Destinations',
      stat2Lbl: 'Covered',
      stat3Lbl: 'Surf season',
      stat4Lbl: 'Longest wave',
      stat5Lbl: 'Memories',
      stat1Sub: ' countries',
      stat2Sub: '+ spots',
      stat3Sub: ' months',
      stat4Sub: ' km',
      historiasEyebrow: 'Surfer stories',
      historiasH2: 'The ocean changes people.',
      historiasLead: 'Stories from surfers who found their wave in Latin America.',
      story1: '“I arrived in Chicama without knowing what to expect. I stayed three weeks. The wave pulls you in, the community makes you stay. I’ve been back five times.”',
      story1Role: 'Surfer · Mexico City, Mexico',
      story2: '“Punta de Lobos taught me respect. The cold water, the rocks, the power. I left a different surfer—more humble, stronger.”',
      story2Role: 'Pro surfer · Santiago, Chile',
      story3: '“I started in Pipa because the water was warm and it felt less intimidating. Now I’m a surf instructor. That first day changed everything.”',
      story3Role: 'Surf instructor · Natal, Brazil',
      cfEyebrow: 'Powered by Cloudflare',
      cfH2: 'Security without compromise.',
      cfLead: 'SurfLatam showcases Cloudflare services including Pages, Workers AI, Access, and Gateway. Network and identity controls require active policies in your account.',
      cfPt1T: 'Cloudflare Pages',
      cfPt1D: 'Global hosting with an automatic CDN and low latency across Latin America.',
      cfPt2T: 'Cloudflare Gateway (SWG) + DLP',
      cfPt2D: 'DNS and HTTP filtering and DLP controls depend on configured Cloudflare policies and traffic routes.',
      cfPt3T: 'Zero Trust Access',
      cfPt3D: 'Can protect applications with identity-based policies. Requires an application and rules configured in Cloudflare Access.',
      ctaEyebrow: 'Your Latin America surf guide',
      ctaH2: 'Find your next spot.',
      ctaLead: 'Ask the assistant about destinations, skill levels, seasons, and surf culture across Latin America.',
      ctaBtn: 'Ask the assistant',
      footerDesc: 'Your guide to surfing in Latin America. Powered by Cloudflare SASE & Zero Trust.',
      footerCol1: 'Destinations',
      footerCol2: 'Community',
      footerCol3: 'Support',
      footerSpotChicama: 'Chicama, Peru',
      footerSpotPavones: 'Pavones, Costa Rica',
      footerSpotLobos: 'Punta de Lobos, Chile',
      footerSpotPipa: 'Pipa, Brazil',
      footerSpotPalmar: 'El Palmar, Ecuador',
      footerSpotPuerto: 'Puerto Escondido, Mexico',
      securityGuide: 'Security guide',
      privacyPolicy: 'Privacy policy',
      footerLegal1: '© 2026 SurfLatam. A fictional Cloudflare Zero Trust demo environment, not a real product or business.',
      footerLegal2: 'Find your wave. 🌊',
      footerDisclaimer: 'SurfLatam is a fictional demo. The chat uses Workers AI, an application-level DLP filter, and optional AI Gateway integration. Access and Gateway (SWG) require separate Cloudflare policies.',
      chatTitle: 'SurfLatam Assistant',
      chatSub: 'Spots, seasons & culture · Workers AI',
      chatPlaceholder: 'Ask about spots, skill levels, or seasons…',
      chatTyping: 'The assistant is responding…',
      chatWelcome: 'Hey! I can help you explore SurfLatam’s spots, skill levels, seasons, and Latin American surf culture. I can also explain the Cloudflare services featured on the site. Where are you thinking of surfing?',
      chatBlockedDlp: '🛡️ Blocked by this demo chat’s DLP control: the message contains sensitive data such as card numbers, credentials, or personal information.',
      chatBlockedTopic: 'I can help with SurfLatam spots, skill levels, seasons, surf culture, and the Cloudflare services described on the site.',
      chatRateLimit: '⏳ Chat limit reached. Wait a minute, then try again.',
      chatConnectionError: '🌊 Could not connect to the assistant. Please try again.',
      chatFooter: 'SurfLatam · DLP · 5 requests/min',
      oceanImageAlt: 'Pacific Ocean along the coast of Latin America',
      spotChicamaAlt: 'Chicama, Peru, home to the world’s longest left-hand wave',
      spotPavonesAlt: 'Pavones, Costa Rica, surf break surrounded by rainforest',
      spotLobosAlt: 'Punta de Lobos, Chile, with powerful South Pacific waves',
      spotPipaAlt: 'Praia de Pipa, Brazil, tropical beach break',
      spotPalmarAlt: 'El Palmar, Ecuador, a consistent beach break',
      spotPuertoAlt: 'Puerto Escondido, Oaxaca, Mexico, known as the Mexican Pipeline',
      cultureImageAlt: 'Surfer walking toward the ocean at sunrise in Latin America',
      securityImageAlt: 'Surfer walking toward the ocean at sunrise'
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

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      if (t[key] !== undefined) el.setAttribute('alt', t[key]);
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
    if (saved === 'es' || saved === 'pt' || saved === 'en') {
      applyTranslations(saved);
      return;
    }

    // 2. Check browser locale (e.g. pt-BR, pt)
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('pt')) {
      applyTranslations('pt');
      return;
    }
    if (browserLang.startsWith('en')) {
      applyTranslations('en');
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
