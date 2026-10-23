/**
 * Destination Hub (dhub.travel) — Minimal Vanilla JS, Multilingual (ES/EN/PT) & Marketing Engine
 * ==============================================================================================
 * 1. CONFIGURACIÓN RÁPIDA DE CONTACTO Y CANALES COMERCIALES:
 * Editá los valores de abajo para actualizar automáticamente todos los botones
 * de WhatsApp, Agenda de Videollamada, Email y el Brief Rápido en los 3 idiomas.
 */
const CONTACT_CONFIG = {
    email: 'hola@dhub.travel',
    whatsappNumber: '5492944000000', // Reemplazar con número real (código país + área sin + ni espacios)
    whatsappMessages: {
        es: 'Hola equipo de Destination Hub, me gustaría conversar sobre un proyecto en Patagonia.',
        en: 'Hello Destination Hub team, I would like to discuss a project in Patagonia.',
        pt: 'Olá equipe da Destination Hub, gostaria de conversar sobre um projeto na Patagônia.'
    },
    calendarUrl: 'https://calendly.com/dhub-travel' // Reemplazar con enlace real de Calendly / Google Calendar
};

/**
 * 2. CONFIGURACIÓN DE HERRAMIENTAS DE MARKETING, ANALÍTICA Y CONVERSIÓN:
 * Completá cualquiera de los IDs cuando quieras activar el script correspondiente
 * automáticamente. Aun sin IDs externos, el motor registra toda la atribución UTM
 * y empuja eventos estándar a `window.dataLayer` (compatible con GTM y GA4).
 */
const MARKETING_CONFIG = {
    gtmId: '',               // Ej: 'GTM-XXXXXXX' (Google Tag Manager)
    ga4Id: '',               // Ej: 'G-XXXXXXXXXX' (Google Analytics 4 directo)
    metaPixelId: '',         // Ej: '123456789012345' (Meta / Instagram Pixel)
    linkedinPartnerId: '',   // Ej: '1234567' (LinkedIn Insight Tag B2B)
    clarityId: '',           // Ej: 'abcdefghij' (Microsoft Clarity Mapas de Calor)
    leadWebhookUrl: ''       // Opcional: Endpoint Formspree / Make / Webhook para copia de leads
};

/**
 * 3. DICCIONARIO MULTILINGÜE COMPLETO (ES · EN · PT) PARA CAMBIO INSTANTÁNEO + SEO
 */
const I18N_DICTIONARY = {
    es: {
        html_lang: 'es-AR',
        meta_title: 'Destination Hub (dhub.travel) — Consultoría Estratégica, Comercial y Regenerativa en Patagonia',
        meta_desc: 'Consultora de negocios turísticos, representación comercial B2B, inteligencia de datos y sustentabilidad desde la Patagonia. Acompañamos a hoteles, lodges, operadores, inversores y destinos.',
        skip_link: 'Saltar al contenido principal',
        brand_sub: 'dhub.travel · Patagonia',
        nav_enfoque: 'Enfoque',
        nav_servicios: 'Prácticas',
        nav_arquitectura: 'Arquitectura',
        nav_preguntas: 'Preguntas',
        nav_contacto: 'Contacto',
        header_cta: 'Conversar',
        mobile_lang_label: 'Idioma / Language',
        mobile_nav_1: '01 · Nuestro Enfoque',
        mobile_nav_2: '02 · Áreas de Práctica',
        mobile_nav_3: '03 · Arquitectura Regenerativa',
        mobile_nav_4: '04 · Preguntas Frecuentes',
        mobile_nav_5: '05 · Contacto Directo',
        mobile_cta: 'Iniciar Conversación',
        hero_kicker: 'Consultora Estratégica & Comercial · Patagonia',
        hero_h1: 'Transformamos el potencial del territorio en negocios y destinos <em>regenerativos.</em>',
        hero_lead: 'Actuamos como una <strong>extensión directa de tu equipo</strong> para diseñar y ejecutar planes de negocio, comercialización, inteligencia de datos y sustentabilidad. A la carta o llave en mano.',
        hero_btn_primary: 'Impulsemos tu proyecto',
        hero_btn_secondary: 'Áreas de práctica',
        caption_hero_main: "PATAGONIA · 41°08'S 71°18'W",
        alt_hero_main: 'Lago glaciar y cordillera en Patagonia enmarcados por bosque nativo',
        caption_hero_inset: 'LAGO MASCARDI · AGUAS GLACIARES',
        alt_hero_inset: 'Aguas cristalinas de deshielo en Lago Mascardi, Patagonia',
        clients_label: 'Acompañamos a',
        client_1: 'Hoteles & Lodges',
        client_2: 'Operadores & DMCs',
        client_3: 'Inversores & Nuevos Proyectos',
        client_4: 'Experiencias & Conservación',
        client_5: 'Destinos & Territorios',
        metric_1_unit: 'años',
        metric_1_label: 'Experiencia combinada en la industria',
        metric_1_sub: 'Visión ejecutiva senior liderando negocios y destinos desde adentro.',
        metric_2_val: 'Ágil <em>&amp; Real</em>',
        metric_2_label: 'Velocidad de implementación',
        metric_2_sub: 'De la estrategia a la acción comercial sin burocracia y con foco en ROI.',
        metric_3_val: 'Red <em>Patagonia</em>',
        metric_3_label: 'Capital relacional en el territorio',
        metric_3_sub: 'Articulación público-privada que acelera alianzas, ventas y desembarcos.',
        enfoque_eyebrow: 'Nuestro Enfoque',
        caption_paradigm: 'PROPÓSITO · VALOR SOBRE VOLUMEN',
        alt_paradigm: 'Viajera contemplando el lago y la montaña desde un deck de madera en Patagonia',
        paradigm_cap_left: 'El Participante con Propósito',
        paradigm_cap_right: 'Valor sobre volumen (Yield)',
        enfoque_h2: 'Del diagnóstico teórico a la <em>gestión con retorno real.</em>',
        enfoque_lead: 'El viajero actual busca autenticidad, naturaleza prístina y propósito. Ayudamos a empresas y destinos a captar este mercado de alto valor, priorizando la rentabilidad (<em>Yield</em>) por encima del volumen masivo.',
        contrast_old_title: 'Consultoría Tradicional',
        contrast_old_1: 'Informes extensos sin ejecución real',
        contrast_old_2: 'Promoción aislada de volumen masivo',
        contrast_old_3: 'Competencia por precio y desgaste local',
        contrast_old_4: 'Métricas basadas solo en arribos',
        contrast_new_title: 'Enfoque Destination Hub (DSO)',
        contrast_new_1: 'Co-ejecución junto a tu equipo',
        contrast_new_2: 'Estrategia comercial enfocada en Yield',
        contrast_new_3: 'Decisiones guiadas por datos de mercado',
        contrast_new_4: 'ROI comercial e impacto regenerativo',
        servicios_eyebrow: 'Qué Hacemos · Áreas de Práctica',
        servicios_h2: 'Soluciones integrales o <em>módulos a la carta.</em>',
        servicios_lead: 'Activá un proyecto llave en mano o sumá capacidades específicas donde tu organización necesite acelerar.',
        caption_p1: 'PRÁCTICA 01 · DATOS & ROI',
        alt_p1: 'Lodge de montaña integrado en el bosque y lago patagónico',
        p1_idx: 'Práctica 01',
        p1_badge: 'Datos & ROI',
        p1_title: 'Estrategia, Datos & Planes de Negocio',
        p1_desc: 'Convertimos datos de mercado en modelos financieros rentables, desde la conceptualización de un proyecto hasta su factibilidad y retorno.',
        p1_tag_1: 'Inteligencia de mercado',
        p1_tag_2: 'Planes de negocio',
        p1_tag_3: 'Factibilidad & Yield',
        caption_p2: 'PRÁCTICA 02 · MERCADOS B2B',
        alt_p2: 'Experiencia de kayak al atardecer en aguas patagónicas',
        p2_idx: 'Práctica 02',
        p2_badge: 'B2B & Marca',
        p2_title: 'Marketing & Representación Comercial',
        p2_desc: 'Somos tu brazo comercial y de posicionamiento. Conectamos tu producto o destino con operadores, agencias y mercados emisores clave.',
        p2_tag_1: 'Representación B2B',
        p2_tag_2: 'Campañas & Conversión',
        p2_tag_3: 'Desestacionalización',
        caption_p3: 'PRÁCTICA 03 · GESTIÓN & EQUIPOS',
        alt_p3: 'Terraza de madera con hospitalidad frente al lago en Patagonia',
        p3_idx: 'Práctica 03',
        p3_badge: 'Cultura & Gestión',
        p3_title: 'Sustentabilidad & Capacitación',
        p3_desc: 'Llevamos la sustentabilidad a la operación diaria y entrenamos equipos de alto rendimiento bajo una premisa: <em>contratá la actitud, entrená la habilidad.</em>',
        p3_tag_1: 'Políticas regenerativas',
        p3_tag_2: 'Entrenamiento de equipos',
        p3_tag_3: 'Gobernanza local',
        practice_cta_label: 'Consultar por esta práctica',
        arch_eyebrow: 'Diseño de Producto',
        arch_h2: 'La arquitectura de una propuesta <em>de alto valor.</em>',
        arch_lead: 'Estructuramos cada experiencia sobre tres pilares de identidad patagónica, sostenidos por la comunidad local como cimiento de autenticidad.',
        arch_roof_eyebrow: 'Techo de Valor',
        arch_roof_title: 'Experiencias Transformadoras de Alto Valor (Yield)',
        caption_arch_1: 'PILAR 01 · AGROECOLOGÍA',
        alt_arch_1: 'Gastronomía patagónica con hongos morillas e ingredientes de la tierra',
        arch_1_title: 'Agroecología',
        arch_1_text: 'Producción local, trazabilidad e identidad gastronómica conectada con la tierra.',
        caption_arch_2: 'PILAR 02 · CULTURA VIVA',
        alt_arch_2: 'Anfitriones y caminantes recorriendo senderos del bosque patagónico',
        arch_2_title: 'Cultura Viva',
        arch_2_text: 'Patrimonio territorial, saber local y narrativas genuinas contadas por sus protagonistas.',
        caption_arch_3: 'PILAR 03 · NATURALEZA',
        alt_arch_3: 'Arroyo cristalino en medio del bosque nativo patagónico',
        arch_3_title: 'Naturaleza',
        arch_3_text: 'Conservación activa de la biodiversidad e inmersión contemplativa de bajo impacto.',
        arch_base_eyebrow: 'Cimiento Estructural',
        arch_base_title: 'Comunidad Local — El ancla del producto y la hospitalidad',
        faq_eyebrow: 'Claridad Estratégica · FAQ',
        faq_h2: 'Respuestas claras para <em>decisiones ágiles.</em>',
        faq_lead: 'Cómo nos integramos con hoteles, operadores, inversores y destinos en Patagonia para acelerar su posicionamiento y retorno.',
        faq_q1: '¿A qué tipo de empresas, proyectos y destinos acompañamos en Patagonia?',
        faq_a1: 'Trabajamos junto a cinco perfiles principales en toda la región patagónica y Sudamérica: <strong>hoteles, lodges, estancias y glampings</strong>; <strong>operadores receptivos (DMCs) y prestadores de experiencias</strong>; <strong>inversores y desarrolladores</strong> de nuevos proyectos turísticos; <strong>iniciativas de conservación y parques</strong>; y <strong>destinos, municipios o cámaras empresariales</strong> que buscan profesionalizar su gestión.',
        faq_q2: '¿Podemos contratar un servicio puntual a la carta o un proyecto llave en mano?',
        faq_a2: 'Ambas opciones están disponibles. Podemos liderar un desarrollo integral <strong>llave en mano</strong> —desde el estudio de mercado, plan de negocio y factibilidad hasta la puesta en marcha comercial y el entrenamiento del personal— o sumarnos mediante <strong>módulos a la carta</strong> donde tu equipo necesite capacidad ejecutiva inmediata.',
        faq_q3: '¿Qué diferencia al enfoque DSO (Destination Stewardship) de la consultoría tradicional?',
        faq_a3: 'La consultoría convencional suele entregar diagnósticos extensos sin ejecución y promover volumen masivo. En <strong>Destination Hub</strong> co-ejecutamos junto a tu equipo priorizando el <strong>Yield (valor neto por visitante sobre volumen)</strong>, decisiones respaldadas por inteligencia de datos y una propuesta regenerativa anclada en la agroecología, la cultura viva, la naturaleza y la comunidad local.',
        faq_q4: '¿En qué consiste el servicio de Representación Comercial B2B y Marketing?',
        faq_a4: 'Actuamos como tu <strong>brazo comercial externo</strong>. Conectamos tu hotel, lodge, experiencia o destino con operadores mayoristas, DMCs, consorcios de viajes y mercados emisores clave, articulando acuerdos comerciales B2B con campañas digitales orientadas a conversión directa y desestacionalización de la demanda.',
        contacto_eyebrow: 'Contacto Directo',
        caption_manifesto: 'VISIÓN COMPARTIDA · PATAGONIA',
        alt_manifesto: 'Reflejo especular de la cordillera nevada y kayak en lago patagónico',
        manifesto_quote: '“Tu negocio y el territorio necesitan líderes, no solo gestores. Gestionar hoy es diseñar el futuro de la Patagonia.”',
        contacto_h2: 'Iniciemos una conversación.',
        contacto_lead: 'Respondemos con la misma agilidad con la que implementamos. Escribinos directo o agendá una llamada exploratoria.',
        ch_wa_label: 'WhatsApp Directo',
        ch_wa_val: 'Escribir a un Socio Director',
        ch_wa_act: 'Iniciar chat',
        ch_cal_label: 'Reunión Online · 30 min',
        ch_cal_val: 'Agendar Videollamada de Diagnóstico',
        ch_cal_act: 'Ver agenda',
        ch_mail_label: 'Correo Electrónico',
        ch_mail_act: 'Enviar email',
        brief_title: 'Brief rápido de proyecto',
        brief_sub: 'Diagnóstico personalizado · Respuesta en < 24 hs',
        brief_lbl_name: 'Nombre y Organización *',
        brief_ph_name: 'Ej. Martín Gómez · Lodge Patagonia',
        brief_lbl_profile: 'Perfil de Organización',
        brief_opt_prof_1: 'Hotel / Lodge / Estancia',
        brief_opt_prof_2: 'Operador / DMC / Experiencias',
        brief_opt_prof_3: 'Inversor / Nuevo Proyecto',
        brief_opt_prof_4: 'Conservación / Área Natural',
        brief_opt_prof_5: 'Destino / Municipio / Cámara',
        brief_lbl_practice: 'Área de Interés Principal',
        brief_opt_prac_all: 'Proyecto Integral (Llave en Mano)',
        brief_opt_prac_1: 'Estrategia, Datos & Planes de Negocio',
        brief_opt_prac_2: 'Marketing & Representación Comercial B2B',
        brief_opt_prac_3: 'Sustentabilidad, Regeneración & Capacitación',
        brief_lbl_goal: 'Desafío u Objetivo en Patagonia (Opcional)',
        brief_ph_goal: 'Contanos en una línea qué buscás destrabar, posicionar o desarrollar...',
        brief_note: 'Enviá tu consulta estructurada directo por WhatsApp o Correo Corporativo.',
        brief_btn_wa: 'Enviar Brief por WhatsApp',
        brief_btn_mail: 'Enviar por Email',
        brief_err_name: 'Por favor indicá tu nombre y organización para personalizar la consulta.',
        brief_ok_prefix: 'Brief preparado para',
        brief_intro_msg: 'Hola equipo de Destination Hub, les comparto un brief rápido de proyecto:',
        footer_loc: ' · dhub.travel — Patagonia, Argentina',
        footer_values: 'Innovación · Comunidad · Regeneración',

        // Evaluación & Hoja de Ruta
        nav_hoja_ruta: 'Hoja de Ruta',
        mobile_nav_eval: '✦ Evaluación & Hoja de Ruta',
        hero_btn_eval: 'Evaluar Proyecto &amp; Hoja de Ruta',
        hero_eval_pill: 'Definí cómo podemos co-ejecutar en tu proyecto (diagnóstico interactivo en 3 min) →',
        eval_sec_badge: 'Evaluación Estratégica en Línea · Destination Hub',
        eval_sec_title: '¿Cómo podemos <em>trabajar juntos</em> en tu proyecto?',
        eval_sec_desc: 'Realizá una evaluación inicial y definí en minutos una <strong>hoja de ruta de co-ejecución personalizada</strong>. A partir de tus respuestas sobre territorio, desafíos de Yield y visión regenerativa, estructuraremos las tareas clave, entregables y KPIs junto a Destination Hub, con un informe descargable en PDF.',
        eval_sec_btn: 'Evaluar mi Proyecto &amp; Diseñar Hoja de Ruta',
        eval_meta_1: 'Diagnóstico en 4 consultas',
        eval_meta_2: 'Matriz de 4 fases',
        eval_meta_3: 'Descarga en PDF editorial',
        eval_meta_4: 'Sin costo',
        modal_header_title: 'Diagnóstico &amp; Hoja de Ruta D Hub',
        modal_header_sub: 'Definición de Co-Ejecución &amp; Ecosistema de Proyecto',
        modal_status_badge: 'Diagnóstico en Línea',
        modal_input_placeholder: 'Escribe tu respuesta con tus propias palabras...',
        modal_input_help: 'Presiona <strong>Enter</strong> para enviar, <strong>Shift + Enter</strong> para salto de línea.',
        modal_analyzing_title: 'Estructurando Hoja de Ruta &amp; Modelo D Hub...',
        modal_analyzing_desc: 'El motor estratégico está cruzando tus respuestas con nuestros modelos de <strong>Yield comercial, articulación B2B y turismo regenerativo (DSO)</strong> para definir cómo co-ejecutaremos contigo.',
        modal_analyzing_badge: 'Generando flujograma de ecosistema y plan de 4 fases...',
        modal_results_tag: 'HOJA DE RUTA ESTRATÉGICA · DESTINATION HUB',
        modal_results_title: 'Plan de Co-Ejecución del Proyecto',
        modal_results_desc: 'Hoja de ruta inicial estructurada de acuerdo a las metodologías, criterios y valores de Destination Hub.',
        modal_btn_pdf: 'Descargar PDF',
        modal_btn_restart: 'Nueva Evaluación',
        modal_btn_whatsapp_partner: 'Contacta con un Socio de Destination Hub',
        modal_role_tag: 'PROPUESTA DE VALOR &amp; ALIANZA ESTRATÉGICA',
        modal_role_title: '¿Cómo Destination Hub co-ejecuta en tu proyecto?',
        modal_diag_tag: 'DIAGNÓSTICO ESTRATÉGICO &amp; POTENCIAL TERRITORIAL',
        modal_flow_title: 'Flujograma del Ecosistema de Proyecto',
        modal_phases_title: 'Matriz de Co-Ejecución por Fases (Tareas, Entregables &amp; KPIs)'
    },

    en: {
        html_lang: 'en',
        meta_title: 'Destination Hub (dhub.travel) — Strategic, Commercial & Regenerative Consulting in Patagonia',
        meta_desc: 'Hospitality business consulting, B2B commercial representation, market intelligence, and regenerative sustainability from Patagonia. Partnering with hotels, lodges, DMCs, investors, and destinations.',
        skip_link: 'Skip to main content',
        brand_sub: 'dhub.travel · Patagonia',
        nav_enfoque: 'Approach',
        nav_servicios: 'Practices',
        nav_arquitectura: 'Architecture',
        nav_preguntas: 'FAQ',
        nav_contacto: 'Contact',
        header_cta: 'Let’s Talk',
        mobile_lang_label: 'Language / Idioma',
        mobile_nav_1: '01 · Our Approach',
        mobile_nav_2: '02 · Practice Areas',
        mobile_nav_3: '03 · Regenerative Architecture',
        mobile_nav_4: '04 · Frequently Asked Questions',
        mobile_nav_5: '05 · Direct Contact',
        mobile_cta: 'Start a Conversation',
        hero_kicker: 'Strategic & Commercial Consulting · Patagonia',
        hero_h1: 'Transforming territorial potential into <em>regenerative</em> businesses and destinations.',
        hero_lead: 'We act as a <strong>direct extension of your team</strong> to design and execute business plans, B2B commercialization, data intelligence, and sustainability. Bespoke modules or turnkey solutions.',
        hero_btn_primary: 'Let’s boost your project',
        hero_btn_secondary: 'Practice areas',
        caption_hero_main: "PATAGONIA · 41°08'S 71°18'W",
        alt_hero_main: 'Glacial lake and mountain range in Patagonia framed by native forest',
        caption_hero_inset: 'LAKE MASCARDI · GLACIAL WATERS',
        alt_hero_inset: 'Crystal-clear glacial meltwaters in Lake Mascardi, Patagonia',
        clients_label: 'We partner with',
        client_1: 'Hotels & Lodges',
        client_2: 'Tour Operators & DMCs',
        client_3: 'Investors & New Projects',
        client_4: 'Experiences & Conservation',
        client_5: 'Destinations & Territories',
        metric_1_unit: 'years',
        metric_1_label: 'Combined industry experience',
        metric_1_sub: 'Senior executive vision leading hospitality businesses and destinations from within.',
        metric_2_val: 'Agile <em>&amp; Real</em>',
        metric_2_label: 'Implementation speed',
        metric_2_sub: 'From strategy to commercial execution without bureaucracy and focused on ROI.',
        metric_3_val: 'Patagonia <em>Network</em>',
        metric_3_label: 'Relational capital across the territory',
        metric_3_sub: 'Public-private articulation that accelerates alliances, sales, and market entry.',
        enfoque_eyebrow: 'Our Approach',
        caption_paradigm: 'PURPOSE · VALUE OVER VOLUME',
        alt_paradigm: 'Traveler contemplating the lake and mountains from a wooden deck in Patagonia',
        paradigm_cap_left: 'The Purposeful Participant',
        paradigm_cap_right: 'Value over volume (Yield)',
        enfoque_h2: 'From theoretical diagnosis to <em>management with real return.</em>',
        enfoque_lead: 'Today’s traveler seeks authenticity, pristine nature, and purpose. We help businesses and destinations capture this high-value market, prioritizing profitability (<em>Yield</em>) over mass volume.',
        contrast_old_title: 'Traditional Consulting',
        contrast_old_1: 'Lengthy reports without real execution',
        contrast_old_2: 'Isolated promotion of mass volume',
        contrast_old_3: 'Price competition and local saturation',
        contrast_old_4: 'Metrics based solely on headcount arrivals',
        contrast_new_title: 'Destination Hub Approach (DSO)',
        contrast_new_1: 'Hands-on co-execution alongside your team',
        contrast_new_2: 'Commercial strategy focused on Yield',
        contrast_new_3: 'Decisions guided by market intelligence',
        contrast_new_4: 'Commercial ROI and regenerative impact',
        servicios_eyebrow: 'What We Do · Practice Areas',
        servicios_h2: 'Turnkey solutions or <em>bespoke modules.</em>',
        servicios_lead: 'Activate an end-to-end turnkey project or add specific capabilities where your organization needs to accelerate.',
        caption_p1: 'PRACTICE 01 · DATA & ROI',
        alt_p1: 'Mountain lodge integrated into the Patagonian forest and lake',
        p1_idx: 'Practice 01',
        p1_badge: 'Data & ROI',
        p1_title: 'Strategy, Data & Business Plans',
        p1_desc: 'We turn market data into profitable financial models, from initial project conceptualization to feasibility and investment return.',
        p1_tag_1: 'Market intelligence',
        p1_tag_2: 'Business plans',
        p1_tag_3: 'Feasibility & Yield',
        caption_p2: 'PRACTICE 02 · B2B MARKETS',
        alt_p2: 'Sunset kayaking experience on Patagonian waters',
        p2_idx: 'Practice 02',
        p2_badge: 'B2B & Brand',
        p2_title: 'Marketing & Commercial Representation',
        p2_desc: 'We act as your commercial and positioning arm, connecting your product or destination with tour operators, agencies, and key source markets.',
        p2_tag_1: 'B2B representation',
        p2_tag_2: 'Campaigns & Conversion',
        p2_tag_3: 'Deseasonalization',
        caption_p3: 'PRACTICE 03 · TEAMS & CULTURE',
        alt_p3: 'Wooden terrace with lakefront hospitality in Patagonia',
        p3_idx: 'Practice 03',
        p3_badge: 'Culture & Stewardship',
        p3_title: 'Sustainability & Team Training',
        p3_desc: 'We bring sustainability into daily operations and train high-performing teams under one premise: <em>hire the attitude, train the skill.</em>',
        p3_tag_1: 'Regenerative policies',
        p3_tag_2: 'Team training',
        p3_tag_3: 'Local governance',
        practice_cta_label: 'Inquire about this practice',
        arch_eyebrow: 'Product Design',
        arch_h2: 'The architecture of a <em>high-value</em> proposition.',
        arch_lead: 'We structure every experience upon three pillars of Patagonian identity, upheld by the local community as the foundation of authenticity.',
        arch_roof_eyebrow: 'Value Roof',
        arch_roof_title: 'High-Value Transformative Experiences (Yield)',
        caption_arch_1: 'PILLAR 01 · AGROECOLOGY',
        alt_arch_1: 'Patagonian gastronomy with morel mushrooms and local earth ingredients',
        arch_1_title: 'Agroecology',
        arch_1_text: 'Local production, traceability, and culinary identity rooted in the land.',
        caption_arch_2: 'PILLAR 02 · LIVING CULTURE',
        alt_arch_2: 'Local hosts and hikers walking through Patagonian forest trails',
        arch_2_title: 'Living Culture',
        arch_2_text: 'Territorial heritage, local wisdom, and genuine narratives told by their protagonists.',
        caption_arch_3: 'PILLAR 03 · NATURE',
        alt_arch_3: 'Crystal-clear stream in the heart of the native Patagonian forest',
        arch_3_title: 'Nature',
        arch_3_text: 'Active biodiversity conservation and low-impact contemplative immersion.',
        arch_base_eyebrow: 'Structural Foundation',
        arch_base_title: 'Local Community — The anchor of product and hospitality',
        faq_eyebrow: 'Strategic Clarity · FAQ',
        faq_h2: 'Clear answers for <em>agile decisions.</em>',
        faq_lead: 'How we integrate with hotels, operators, investors, and destinations in Patagonia to accelerate positioning and return.',
        faq_q1: 'What types of companies, projects, and destinations do we partner with in Patagonia?',
        faq_a1: 'We partner with five core profiles across Patagonia and South America: <strong>hotels, lodges, estancias, and glampings</strong>; <strong>inbound tour operators (DMCs) and experience providers</strong>; <strong>investors and developers</strong> of new tourism projects; <strong>conservation initiatives and parks</strong>; and <strong>destinations, municipalities, or tourism boards</strong> seeking to professionalize their stewardship.',
        faq_q2: 'Can we hire a specific bespoke service or a full turnkey project?',
        faq_a2: 'Both options are available. We can lead an end-to-end <strong>turnkey development</strong>—from market research, business plan, and feasibility to commercial launch and staff training—or join through <strong>bespoke modules</strong> where your team needs immediate executive capacity.',
        faq_q3: 'What sets the DSO (Destination Stewardship) approach apart from traditional consulting?',
        faq_a3: 'Conventional consulting often delivers lengthy reports without execution while promoting mass volume. At <strong>Destination Hub</strong>, we co-execute alongside your team prioritizing <strong>Yield (net economic value per visitor over volume)</strong>, data-backed decisions, and a regenerative proposition anchored in agroecology, living culture, nature, and the local community.',
        faq_q4: 'How does your B2B Commercial Representation and Marketing service work?',
        faq_a4: 'We act as your <strong>external commercial arm</strong>. We connect your hotel, lodge, experience, or destination with wholesale tour operators, DMCs, travel consortia, and key source markets, aligning B2B commercial agreements with digital campaigns focused on direct conversion and deseasonalization.',
        contacto_eyebrow: 'Direct Contact',
        caption_manifesto: 'SHARED VISION · PATAGONIA',
        alt_manifesto: 'Mirror reflection of snow-capped mountains and kayak on a Patagonian lake',
        manifesto_quote: '“Your business and the territory need leaders, not just managers. Managing today means designing the future of Patagonia.”',
        contacto_h2: 'Let’s start a conversation.',
        contacto_lead: 'We respond with the same agility with which we implement. Message us directly or schedule an exploratory call.',
        ch_wa_label: 'Direct WhatsApp',
        ch_wa_val: 'Message a Managing Partner',
        ch_wa_act: 'Start chat',
        ch_cal_label: 'Online Meeting · 30 min',
        ch_cal_val: 'Book a Diagnostic Video Call',
        ch_cal_act: 'View calendar',
        ch_mail_label: 'Corporate Email',
        ch_mail_act: 'Send email',
        brief_title: 'Quick project brief',
        brief_sub: 'Tailored diagnostic · Response in < 24h',
        brief_lbl_name: 'Name & Organization *',
        brief_ph_name: 'E.g. Martin Gomez · Patagonia Lodge',
        brief_lbl_profile: 'Organization Profile',
        brief_opt_prof_1: 'Hotel / Lodge / Estancia',
        brief_opt_prof_2: 'Tour Operator / DMC / Experiences',
        brief_opt_prof_3: 'Investor / New Project',
        brief_opt_prof_4: 'Conservation / Natural Area',
        brief_opt_prof_5: 'Destination / Municipality / Board',
        brief_lbl_practice: 'Primary Area of Interest',
        brief_opt_prac_all: 'Full Turnkey Project',
        brief_opt_prac_1: 'Strategy, Data & Business Plans',
        brief_opt_prac_2: 'Marketing & B2B Representation',
        brief_opt_prac_3: 'Sustainability, Regeneration & Training',
        brief_lbl_goal: 'Challenge or Goal in Patagonia (Optional)',
        brief_ph_goal: 'Tell us in one line what you are looking to unlock, position, or develop...',
        brief_note: 'Send your structured inquiry directly via WhatsApp or Corporate Email.',
        brief_btn_wa: 'Send Brief via WhatsApp',
        brief_btn_mail: 'Send via Email',
        brief_err_name: 'Please enter your name and organization to personalize your inquiry.',
        brief_ok_prefix: 'Brief prepared for',
        brief_intro_msg: 'Hello Destination Hub team, here is a quick project brief:',
        footer_loc: ' · dhub.travel — Patagonia, Argentina',
        footer_values: 'Innovation · Community · Regeneration',

        // Project Assessment & Roadmap
        nav_hoja_ruta: 'Roadmap',
        mobile_nav_eval: '✦ Project Assessment & Roadmap',
        hero_btn_eval: 'Evaluate Project &amp; Roadmap',
        hero_eval_pill: 'Explore how we can co-execute your project (interactive 3-min assessment) →',
        eval_sec_badge: 'Online Strategic Assessment · Destination Hub',
        eval_sec_title: 'How can we <em>work together</em> on your project?',
        eval_sec_desc: 'Complete an initial assessment and establish a <strong>tailored co-execution roadmap</strong> in minutes. Based on your insights regarding territory, Yield challenges, and regenerative vision, we structure key tasks, deliverables, and KPIs alongside Destination Hub, complete with an editorial PDF report.',
        eval_sec_btn: 'Evaluate My Project &amp; Design Roadmap',
        eval_meta_1: '4-step strategic inquiry',
        eval_meta_2: '4-phase matrix',
        eval_meta_3: 'Editorial PDF export',
        eval_meta_4: 'Complimentary',
        modal_header_title: 'D Hub Assessment &amp; Roadmap',
        modal_header_sub: 'Co-Execution Framework &amp; Project Ecosystem',
        modal_status_badge: 'Online Assessment',
        modal_input_placeholder: 'Type your answer in your own words...',
        modal_input_help: 'Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for line break.',
        modal_analyzing_title: 'Structuring Roadmap &amp; D Hub Model...',
        modal_analyzing_desc: 'Our strategic engine is cross-referencing your insights with our frameworks of <strong>commercial Yield, B2B development, and regenerative tourism (DSO)</strong> to define our joint roadmap.',
        modal_analyzing_badge: 'Generating ecosystem flowchart and 4-phase plan...',
        modal_results_tag: 'STRATEGIC ROADMAP · DESTINATION HUB',
        modal_results_title: 'Project Co-Execution Plan',
        modal_results_desc: 'Initial roadmap structured in accordance with Destination Hub methodologies, standards, and values.',
        modal_btn_pdf: 'Download PDF',
        modal_btn_restart: 'New Assessment',
        modal_btn_whatsapp_partner: 'Contact a Destination Hub Partner',
        modal_role_tag: 'VALUE PROPOSITION &amp; STRATEGIC PARTNERSHIP',
        modal_role_title: 'How does Destination Hub co-execute in your project?',
        modal_diag_tag: 'STRATEGIC DIAGNOSIS &amp; TERRITORIAL POTENTIAL',
        modal_flow_title: 'Project Ecosystem Flowchart',
        modal_phases_title: 'Co-Execution Phase Matrix (Tasks, Deliverables &amp; KPIs)'
    },

    pt: {
        html_lang: 'pt-BR',
        meta_title: 'Destination Hub (dhub.travel) — Consultoria Estratégica, Comercial e Regenerativa na Patagônia',
        meta_desc: 'Consultoria de negócios em hospitalidade, representação comercial B2B, inteligência de dados e sustentabilidade na Patagônia. Acompanhamos hotéis, lodges, operadores, investidores e destinos.',
        skip_link: 'Pular para o conteúdo principal',
        brand_sub: 'dhub.travel · Patagônia',
        nav_enfoque: 'Abordagem',
        nav_servicios: 'Práticas',
        nav_arquitectura: 'Arquitetura',
        nav_preguntas: 'Perguntas',
        nav_contacto: 'Contato',
        header_cta: 'Conversar',
        mobile_lang_label: 'Idioma / Language',
        mobile_nav_1: '01 · Nossa Abordagem',
        mobile_nav_2: '02 · Áreas de Prática',
        mobile_nav_3: '03 · Arquitetura Regenerativa',
        mobile_nav_4: '04 · Perguntas Frequentes',
        mobile_nav_5: '05 · Contato Direto',
        mobile_cta: 'Iniciar Conversa',
        hero_kicker: 'Consultoria Estratégica & Comercial · Patagônia',
        hero_h1: 'Transformamos o potencial do território em negócios e destinos <em>regenerativos.</em>',
        hero_lead: 'Atuamos como uma <strong>extensão direta da sua equipe</strong> para desenhar e executar planos de negócios, comercialização, inteligência de dados e sustentabilidade. Sob medida ou chave na mão.',
        hero_btn_primary: 'Impulsione seu projeto',
        hero_btn_secondary: 'Áreas de prática',
        caption_hero_main: "PATAGÔNIA · 41°08'S 71°18'W",
        alt_hero_main: 'Lago glacial e cordilheira na Patagônia emoldurados por floresta nativa',
        caption_hero_inset: 'LAGO MASCARDI · ÁGUAS GLACIAIS',
        alt_hero_inset: 'Águas cristalinas de degelo no Lago Mascardi, Patagônia',
        clients_label: 'Acompanhamos',
        client_1: 'Hotéis & Lodges',
        client_2: 'Operadores & DMCs',
        client_3: 'Investidores & Novos Projetos',
        client_4: 'Experiências & Conservação',
        client_5: 'Destinos & Territórios',
        metric_1_unit: 'anos',
        metric_1_label: 'Experiência combinada no setor',
        metric_1_sub: 'Visão executiva sênior liderando negócios e destinos por dentro.',
        metric_2_val: 'Ágil <em>&amp; Real</em>',
        metric_2_label: 'Velocidade de implementação',
        metric_2_sub: 'Da estratégia à ação comercial sem burocracia e com foco em ROI.',
        metric_3_val: 'Rede <em>Patagônia</em>',
        metric_3_label: 'Capital relacional no território',
        metric_3_sub: 'Articulação público-privada que acelera alianças, vendas e implantação.',
        enfoque_eyebrow: 'Nossa Abordagem',
        caption_paradigm: 'PROPÓSITO · VALOR SOBRE VOLUME',
        alt_paradigm: 'Viajante contemplando o lago e a montanha a partir de um deck de madeira na Patagônia',
        paradigm_cap_left: 'O Participante com Propósito',
        paradigm_cap_right: 'Valor sobre volume (Yield)',
        enfoque_h2: 'Do diagnóstico teórico à <em>gestão com retorno real.</em>',
        enfoque_lead: 'O viajante atual busca autenticidade, natureza intocada e propósito. Ajudamos empresas e destinos a captar esse mercado de alto valor, priorizando a rentabilidade (<em>Yield</em>) acima do volume massivo.',
        contrast_old_title: 'Consultoria Tradicional',
        contrast_old_1: 'Relatórios extensos sem execução real',
        contrast_old_2: 'Promoção isolada de volume massivo',
        contrast_old_3: 'Competição por preço e desgaste local',
        contrast_old_4: 'Métricas baseadas apenas em chegadas',
        contrast_new_title: 'Abordagem Destination Hub (DSO)',
        contrast_new_1: 'Co-execução junto à sua equipe',
        contrast_new_2: 'Estratégia comercial focada em Yield',
        contrast_new_3: 'Decisões guiadas por dados de mercado',
        contrast_new_4: 'ROI comercial e impacto regenerativo',
        servicios_eyebrow: 'O Que Fazemos · Áreas de Prática',
        servicios_h2: 'Soluções integrais ou <em>módulos sob medida.</em>',
        servicios_lead: 'Ative um projeto completo chave na mão ou adicione capacidades específicas onde sua organização precise acelerar.',
        caption_p1: 'PRÁTICA 01 · DADOS & ROI',
        alt_p1: 'Lodge de montanha integrado à floresta e ao lago patagônico',
        p1_idx: 'Prática 01',
        p1_badge: 'Dados & ROI',
        p1_title: 'Estratégia, Dados & Planos de Negócios',
        p1_desc: 'Convertemos dados de mercado em modelos financeiros rentáveis, desde a conceituação de um projeto até sua viabilidade e retorno.',
        p1_tag_1: 'Inteligência de mercado',
        p1_tag_2: 'Planos de negócios',
        p1_tag_3: 'Viabilidade & Yield',
        caption_p2: 'PRÁTICA 02 · MERCADOS B2B',
        alt_p2: 'Experiência de caiaque ao pôr do sol em águas patagônicas',
        p2_idx: 'Prática 02',
        p2_badge: 'B2B & Marca',
        p2_title: 'Marketing & Representação Comercial',
        p2_desc: 'Somos o seu braço comercial e de posicionamento. Conectamos seu produto ou destino a operadoras, agências e mercados emissores-chave.',
        p2_tag_1: 'Representação B2B',
        p2_tag_2: 'Campanhas & Conversão',
        p2_tag_3: 'Desestacionalização',
        caption_p3: 'PRÁTICA 03 · GESTÃO & EQUIPES',
        alt_p3: 'Terraço de madeira com hospitalidade em frente ao lago na Patagônia',
        p3_idx: 'Prática 03',
        p3_badge: 'Cultura & Gestão',
        p3_title: 'Sustentabilidade & Capacitação',
        p3_desc: 'Levamos a sustentabilidade para a operação diária e treinamos equipes de alta performance sob uma premissa: <em>contrate a atitude, treine a habilidade.</em>',
        p3_tag_1: 'Políticas regenerativas',
        p3_tag_2: 'Treinamento de equipes',
        p3_tag_3: 'Governança local',
        practice_cta_label: 'Consultar sobre esta prática',
        arch_eyebrow: 'Design de Produto',
        arch_h2: 'A arquitetura de uma proposta <em>de alto valor.</em>',
        arch_lead: 'Estruturamos cada experiência sobre três pilares de identidade patagônica, sustentados pela comunidade local como alicerce de autenticidade.',
        arch_roof_eyebrow: 'Teto de Valor',
        arch_roof_title: 'Experiências Transformadoras de Alto Valor (Yield)',
        caption_arch_1: 'PILAR 01 · AGROECOLOGIA',
        alt_arch_1: 'Gastronomia patagônica com cogumelos morillas e ingredientes da terra',
        arch_1_title: 'Agroecologia',
        arch_1_text: 'Produção local, rastreabilidade e identidade gastronômica conectada com a terra.',
        caption_arch_2: 'PILAR 02 · CULTURA VIVA',
        alt_arch_2: 'Anfitriões e caminhantes percorrendo trilhas da floresta patagônica',
        arch_2_title: 'Cultura Viva',
        arch_2_text: 'Patrimônio territorial, saber local e narrativas genuínas contadas por seus protagonistas.',
        caption_arch_3: 'PILAR 03 · NATUREZA',
        alt_arch_3: 'Riacho cristalino em meio à floresta nativa patagônica',
        arch_3_title: 'Natureza',
        arch_3_text: 'Conservação ativa da biodiversidade e imersão contemplativa de baixo impacto.',
        arch_base_eyebrow: 'Alicerce Estrutural',
        arch_base_title: 'Comunidade Local — A âncora do produto e da hospitalidade',
        faq_eyebrow: 'Clareza Estratégica · FAQ',
        faq_h2: 'Respostas claras para <em>decisões ágeis.</em>',
        faq_lead: 'Como nos integramos com hotéis, operadoras, investidores e destinos na Patagônia para acelerar posicionamento e retorno.',
        faq_q1: 'Que tipos de empresas, projetos e destinos acompanhamos na Patagônia?',
        faq_a1: 'Trabalhamos junto a cinco perfis principais em toda a região patagônica e América do Sul: <strong>hotéis, lodges, estâncias e glampings</strong>; <strong>operadores receptivos (DMCs) e prestadores de experiências</strong>; <strong>investidores e desenvolvedores</strong> de novos projetos turísticos; <strong>iniciativas de conservação e parques</strong>; e <strong>destinos, municípios ou entidades empresariais</strong> que buscam profissionalizar sua gestão.',
        faq_q2: 'Podemos contratar um serviço pontual sob medida ou um projeto chave na mão?',
        faq_a2: 'Ambas as opções estão disponíveis. Podemos liderar um desenvolvimento integral <strong>chave na mão</strong> — desde o estudo de mercado, plano de negócios e viabilidade até a operação comercial e o treinamento da equipe — ou nos somar por meio de <strong>módulos sob medida</strong> onde sua equipe precise de capacidade executiva imediata.',
        faq_q3: 'O que diferencia a abordagem DSO (Destination Stewardship) da consultoria tradicional?',
        faq_a3: 'A consultoria convencional costuma entregar diagnósticos extensos sem execução e promover volume massivo. Na <strong>Destination Hub</strong> co-executamos junto à sua equipe priorizando o <strong>Yield (valor líquido por visitante sobre o volume)</strong>, decisões respaldadas por inteligência de dados e uma proposta regenerativa ancorada na agroecologia, cultura viva, natureza e comunidade local.',
        faq_q4: 'Em que consiste o serviço de Representação Comercial B2B e Marketing?',
        faq_a4: 'Atuamos como seu <strong>braço comercial externo</strong>. Conectamos seu hotel, lodge, experiência ou destino a operadoras, DMCs, consórcios de viagens e mercados emissores estratégicos, articulando acordos comerciais B2B com campanhas digitais orientadas à conversão direta e redução da sazonalidade.',
        contacto_eyebrow: 'Contato Direto',
        caption_manifesto: 'VISÃO COMPARTILHADA · PATAGÔNIA',
        alt_manifesto: 'Reflexo espelhado da cordilheira nevada e caiaque em lago patagônico',
        manifesto_quote: '“O seu negócio e o território precisam de líderes, não apenas de gestores. Gerir hoje é desenhar o futuro da Patagônia.”',
        contacto_h2: 'Vamos iniciar uma conversa.',
        contacto_lead: 'Respondemos com a mesma agilidade com que implementamos. Escreva diretamente ou agende uma chamada exploratória.',
        ch_wa_label: 'WhatsApp Direto',
        ch_wa_val: 'Falar com um Sócio Diretor',
        ch_wa_act: 'Iniciar chat',
        ch_cal_label: 'Reunião Online · 30 min',
        ch_cal_val: 'Agendar Videochamada de Diagnóstico',
        ch_cal_act: 'Ver agenda',
        ch_mail_label: 'E-mail Corporativo',
        ch_mail_act: 'Enviar e-mail',
        brief_title: 'Briefing rápido de projeto',
        brief_sub: 'Diagnóstico personalizado · Resposta em < 24h',
        brief_lbl_name: 'Nome e Organização *',
        brief_ph_name: 'Ex. Martín Gómez · Lodge Patagônia',
        brief_lbl_profile: 'Perfil da Organização',
        brief_opt_prof_1: 'Hotel / Lodge / Estância',
        brief_opt_prof_2: 'Operadora / DMC / Experiências',
        brief_opt_prof_3: 'Investidor / Novo Projeto',
        brief_opt_prof_4: 'Conservação / Área Natural',
        brief_opt_prof_5: 'Destino / Município / Entidade',
        brief_lbl_practice: 'Área de Interesse Principal',
        brief_opt_prac_all: 'Projeto Integral (Chave na Mão)',
        brief_opt_prac_1: 'Estratégia, Dados & Planos de Negócios',
        brief_opt_prac_2: 'Marketing & Representação Comercial B2B',
        brief_opt_prac_3: 'Sustentabilidade, Regeneração & Capacitação',
        brief_lbl_goal: 'Desafio ou Objetivo na Patagônia (Opcional)',
        brief_ph_goal: 'Conte em uma linha o que você busca destravar, posicionar ou desenvolver...',
        brief_note: 'Envie sua consulta estruturada diretamente por WhatsApp ou E-mail Corporativo.',
        brief_btn_wa: 'Enviar Briefing por WhatsApp',
        brief_btn_mail: 'Enviar por E-mail',
        brief_err_name: 'Por favor informe seu nome e organização para personalizar a consulta.',
        brief_ok_prefix: 'Briefing preparado para',
        brief_intro_msg: 'Olá equipe da Destination Hub, compartilho um briefing rápido de projeto:',
        footer_loc: ' · dhub.travel — Patagônia, Argentina',
        footer_values: 'Inovação · Comunidade · Regeneração',

        // Avaliação & Roteiro
        nav_hoja_ruta: 'Roteiro',
        mobile_nav_eval: '✦ Avaliação & Roteiro',
        hero_btn_eval: 'Avaliar Projeto &amp; Roteiro',
        hero_eval_pill: 'Defina como podemos co-executar no seu projeto (diagnóstico interativo em 3 min) →',
        eval_sec_badge: 'Avaliação Estratégica Online · Destination Hub',
        eval_sec_title: 'Como podemos <em>trabalhar juntos</em> no seu projeto?',
        eval_sec_desc: 'Faça uma avaliação inicial e defina em minutos um <strong>roteiro personalizado de co-execução</strong>. A partir das suas respostas sobre território, desafios de Yield e visão regenerativa, estruturamos tarefas-chave, entregáveis e KPIs junto à Destination Hub, com relatório para download em PDF.',
        eval_sec_btn: 'Avaliar Meu Projeto &amp; Desenhar Roteiro',
        eval_meta_1: 'Diagnóstico em 4 consultas',
        eval_meta_2: 'Matriz de 4 fases',
        eval_meta_3: 'Download em PDF editorial',
        eval_meta_4: 'Sem custo',
        modal_header_title: 'Diagnóstico &amp; Roteiro D Hub',
        modal_header_sub: 'Definição de Co-Execução &amp; Ecossistema de Projeto',
        modal_status_badge: 'Diagnóstico Online',
        modal_input_placeholder: 'Escreva sua resposta com suas próprias palavras...',
        modal_input_help: 'Pressione <strong>Enter</strong> para enviar, <strong>Shift + Enter</strong> para quebra de linha.',
        modal_analyzing_title: 'Estruturando Roteiro &amp; Modelo D Hub...',
        modal_analyzing_desc: 'O motor estratégico está cruzando suas respostas com nossos modelos de <strong>Yield comercial, articulação B2B e turismo regenerativo (DSO)</strong> para definir como co-executaremos com você.',
        modal_analyzing_badge: 'Gerando fluxograma de ecossistema e plano de 4 fases...',
        modal_results_tag: 'ROTEIRO ESTRATÉGICO · DESTINATION HUB',
        modal_results_title: 'Plano de Co-Execução do Projeto',
        modal_results_desc: 'Roteiro inicial estruturado de acordo com as metodologias, critérios e valores da Destination Hub.',
        modal_btn_pdf: 'Baixar PDF',
        modal_btn_restart: 'Nova Avaliação',
        modal_btn_whatsapp_partner: 'Fale com um Sócio da Destination Hub',
        modal_role_tag: 'PROPOSTA DE VALOR &amp; PARCERIA ESTRATÉGICA',
        modal_role_title: 'Como a Destination Hub co-executa no seu projeto?',
        modal_diag_tag: 'DIAGNÓSTICO ESTRATÉGICO &amp; POTENCIAL TERRITORIAL',
        modal_flow_title: 'Fluxograma do Ecossistema de Projeto',
        modal_phases_title: 'Matriz de Co-Execução por Fases (Tarefas, Entregáveis &amp; KPIs)'
    }
};

window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // A. MOTOR DE ATRIBUCIÓN UTM, ANALÍTICA Y EVENTOS DE MARKETING (DEO / CRO)
    // =========================================================================
    const ATTR_STORAGE_KEY = 'dhub_attribution_v1';
    const TRACKED_PARAMS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'gclid', 'fbclid', 'li_fat_id', 'msclkid'
    ];

    let currentLang = document.documentElement.getAttribute('data-lang') || 'es';
    let selectedPracticeCode = '';

    function captureAttribution() {
        const params = new URLSearchParams(window.location.search);
        const currentTouch = {};
        let hasNewParams = false;

        TRACKED_PARAMS.forEach(key => {
            const val = params.get(key);
            if (val) {
                currentTouch[key] = val;
                hasNewParams = true;
            }
        });

        let stored = {};
        try {
            stored = JSON.parse(localStorage.getItem(ATTR_STORAGE_KEY) || '{}');
        } catch (_) {
            stored = {};
        }

        const nowIso = new Date().toISOString();
        if (!stored.firstTouch) {
            stored.firstTouch = {
                ...currentTouch,
                referrer: document.referrer || 'direct',
                landingPage: window.location.href,
                timestamp: nowIso
            };
        }

        if (hasNewParams || !stored.lastTouch) {
            stored.lastTouch = {
                ...currentTouch,
                referrer: document.referrer || stored.lastTouch?.referrer || 'direct',
                landingPage: window.location.href,
                timestamp: nowIso
            };
        }

        try {
            localStorage.setItem(ATTR_STORAGE_KEY, JSON.stringify(stored));
        } catch (_) {}

        return stored;
    }

    const attribution = captureAttribution();

    function trackEvent(eventName, payload = {}) {
        const last = attribution.lastTouch || {};
        const eventData = {
            event: eventName,
            language: currentLang,
            timestamp: new Date().toISOString(),
            page_location: window.location.href,
            page_title: document.title,
            utm_source: last.utm_source || undefined,
            utm_medium: last.utm_medium || undefined,
            utm_campaign: last.utm_campaign || undefined,
            ...payload
        };

        window.dataLayer.push(eventData);

        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, { language: currentLang, ...payload });
        }
        if (typeof window.fbq === 'function') {
            if (eventName === 'generate_lead') {
                window.fbq('track', 'Lead', payload);
            } else if (eventName === 'lead_channel_click') {
                window.fbq('track', 'Contact', payload);
            } else {
                window.fbq('trackCustom', eventName, payload);
            }
        }
        if (typeof window.lintrk === 'function' && (eventName === 'generate_lead' || eventName === 'lead_channel_click')) {
            window.lintrk('track', { conversion_id: payload.channel || eventName });
        }
    }

    function initThirdPartyPixels() {
        if (MARKETING_CONFIG.gtmId) {
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                const f = d.getElementsByTagName(s)[0];
                const j = d.createElement(s);
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', MARKETING_CONFIG.gtmId);
        }

        if (MARKETING_CONFIG.ga4Id) {
            const s = document.createElement('script');
            s.async = true;
            s.src = `https://www.googletagmanager.com/gtag/js?id=${MARKETING_CONFIG.ga4Id}`;
            document.head.appendChild(s);
            window.gtag = function() { window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', MARKETING_CONFIG.ga4Id, { anonymize_ip: true });
        }

        if (MARKETING_CONFIG.clarityId) {
            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
                t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
                y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
            })(window, document, 'clarity', 'script', MARKETING_CONFIG.clarityId);
        }
    }

    initThirdPartyPixels();

    // =========================================================================
    // 1. ENLACES CONFIGURABLES DE CONTACTO CON ENRIQUECIMIENTO UTM & IDIOMA
    // =========================================================================
    function buildCalendarUrlWithUtm(baseUrl) {
        try {
            const url = new URL(baseUrl);
            const last = attribution.lastTouch || {};
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
                if (last[k] && !url.searchParams.has(k)) {
                    url.searchParams.set(k, last[k]);
                }
            });
            return url.toString();
        } catch (_) {
            return baseUrl;
        }
    }

    function getPracticeLabel(code, lang) {
        const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.es;
        const map = {
            p1: dict.brief_opt_prac_1,
            p2: dict.brief_opt_prac_2,
            p3: dict.brief_opt_prac_3,
            all: dict.brief_opt_prac_all
        };
        return map[code] || '';
    }

    function updateContactLinks() {
        const baseWa = CONTACT_CONFIG.whatsappMessages[currentLang] || CONTACT_CONFIG.whatsappMessages.es;
        const topicLabel = getPracticeLabel(selectedPracticeCode, currentLang);

        const suffixByLang = {
            es: topicLabel ? ` Me interesa consultar sobre: ${topicLabel}.` : '',
            en: topicLabel ? ` I would like to inquire about: ${topicLabel}.` : '',
            pt: topicLabel ? ` Gostaria de consultar sobre: ${topicLabel}.` : ''
        };

        const subjectByLang = {
            es: topicLabel ? `Consulta Estratégica (${topicLabel}) — Destination Hub` : 'Consulta Estratégica — Destination Hub',
            en: topicLabel ? `Strategic Inquiry (${topicLabel}) — Destination Hub` : 'Strategic Inquiry — Destination Hub',
            pt: topicLabel ? `Consulta Estratégica (${topicLabel}) — Destination Hub` : 'Consulta Estratégica — Destination Hub'
        };

        const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(baseWa + (suffixByLang[currentLang] || ''))}`;
        const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subjectByLang[currentLang] || subjectByLang.es)}`;
        const calendarUrl = buildCalendarUrlWithUtm(CONTACT_CONFIG.calendarUrl);

        document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => el.setAttribute('href', whatsappUrl));
        document.querySelectorAll('[data-contact="calendar"]').forEach(el => el.setAttribute('href', calendarUrl));
        document.querySelectorAll('[data-contact="email"]').forEach(el => el.setAttribute('href', mailtoUrl));
    }

    // =========================================================================
    // 2. MOTOR MULTILINGÜE INSTANTÁNEO (ES · EN · PT) SIN RECARGA DE PÁGINA
    // =========================================================================
    const scrubBlocks = [];

    function rebuildScrubBlocks(customQuoteText) {
        scrubBlocks.length = 0;
        document.querySelectorAll('[data-scrub-text]').forEach(block => {
            const rawText = (customQuoteText || block.textContent).trim().replace(/\s+/g, ' ');
            block.setAttribute('aria-label', rawText.replace(/[“”]/g, ''));
            const words = rawText.split(' ');
            block.innerHTML = '';
            const wordSpans = [];
            const accentStart = Math.max(0, words.length - 6);

            words.forEach((word, idx) => {
                const span = document.createElement('span');
                span.className = idx >= accentStart ? 'scrub-word is-accent' : 'scrub-word';
                span.textContent = word;
                span.setAttribute('aria-hidden', 'true');
                block.appendChild(span);
                if (idx < words.length - 1) {
                    block.appendChild(document.createTextNode(' '));
                }
                wordSpans.push(span);
            });

            scrubBlocks.push({ el: block, words: wordSpans });
        });
    }

    function applyLanguage(lang, options = { save: true, track: true }) {
        if (!I18N_DICTIONARY[lang]) return;
        currentLang = lang;
        const dict = I18N_DICTIONARY[lang];

        document.documentElement.setAttribute('lang', dict.html_lang);
        document.documentElement.setAttribute('data-lang', lang);
        document.title = dict.meta_title;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', dict.meta_desc);

        // 1) Elementos de texto plano
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                el.textContent = dict[key];
            }
        });

        // 2) Elementos con formato editorial (<em> / <strong>)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        // 3) Placeholders de formulario
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key] !== undefined) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        // 4) Captions de fotografías para el Viewfinder Cursor
        document.querySelectorAll('[data-i18n-caption]').forEach(el => {
            const key = el.getAttribute('data-i18n-caption');
            if (dict[key] !== undefined) {
                el.setAttribute('data-caption', dict[key]);
            }
        });

        // 5) Textos alternativos (alt) de fotografías
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            if (dict[key] !== undefined) {
                el.setAttribute('alt', dict[key]);
            }
        });

        // 6) Reconstruir cita del Manifiesto con iluminación palabra por palabra
        rebuildScrubBlocks(dict.manifesto_quote);
        updateOnScroll();

        // 7) Actualizar estado visual de los botones ES / EN / PT
        document.querySelectorAll('[data-lang-switch]').forEach(btn => {
            const isMatch = btn.getAttribute('data-lang-switch') === lang;
            btn.classList.toggle('is-active', isMatch);
            if (isMatch) {
                btn.setAttribute('aria-current', 'true');
            } else {
                btn.removeAttribute('aria-current');
            }
        });

        // 8) Actualizar enlaces de WhatsApp y Email con el idioma activo
        updateContactLinks();

        if (options.save) {
            try { localStorage.setItem('dhub_lang', lang); } catch (_) {}
        }
        if (options.track) {
            trackEvent('language_switch', { selected_language: lang });
        }

        // Notificar a módulos externos (como el motor de roadmap) sobre el cambio de idioma
        window.dispatchEvent(new CustomEvent('dhub:language_changed', { detail: { lang } }));
    }

    // Bind de los selectores de idioma (ES / EN / PT) para cambio en vivo sin recargar
    document.querySelectorAll('[data-lang-switch]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            const targetLang = btn.getAttribute('data-lang-switch');
            if (targetLang) {
                applyLanguage(targetLang, { save: true, track: true });
                closeMobileMenu();
            }
        });
    });

    // Exponer API global para auditoría, idiomas y consola
    window.DHUB_MARKETING = {
        config: MARKETING_CONFIG,
        contact: CONTACT_CONFIG,
        getAttribution: () => attribution,
        getLanguage: () => currentLang,
        setLanguage: (lang) => applyLanguage(lang, { save: true, track: true }),
        trackEvent
    };

    // Tracking de clics en CTAs generales
    document.querySelectorAll('[data-track-cta]').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('cta_click', {
                cta_id: el.getAttribute('data-track-cta'),
                cta_text: el.textContent.trim()
            });
        });
    });

    // Tracking de clics en canales directos de conversión
    document.querySelectorAll('[data-track-channel]').forEach(el => {
        el.addEventListener('click', () => {
            const channel = el.getAttribute('data-track-channel');
            trackEvent('lead_channel_click', {
                channel,
                practice_topic: getPracticeLabel(selectedPracticeCode, currentLang) || 'General',
                destination_url: el.getAttribute('href')
            });
        });
    });

    // Selección contextual desde las 3 Áreas de Práctica
    const briefPracticeSelect = document.getElementById('brief-practice');
    const briefNameInput = document.getElementById('brief-name');

    document.querySelectorAll('[data-select-practice]').forEach(link => {
        link.addEventListener('click', () => {
            const code = link.getAttribute('data-select-practice') || '';
            selectedPracticeCode = code;
            updateContactLinks();

            if (briefPracticeSelect && code) {
                briefPracticeSelect.value = code;
            }

            trackEvent('select_practice', {
                practice_code: code,
                practice_name: getPracticeLabel(code, currentLang)
            });

            setTimeout(() => {
                briefNameInput?.focus({ preventScroll: true });
            }, 650);
        });
    });

    // Formulario de Brief Rápido de Proyecto (#lead-brief-form)
    const briefForm = document.getElementById('lead-brief-form');
    const briefFeedback = document.getElementById('brief-feedback');
    let activeSubmitChannel = 'whatsapp';

    if (briefForm) {
        briefForm.querySelectorAll('button[type="submit"][data-submit-channel]').forEach(btn => {
            btn.addEventListener('click', () => {
                activeSubmitChannel = btn.getAttribute('data-submit-channel') || 'whatsapp';
            });
        });

        briefForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dict = I18N_DICTIONARY[currentLang] || I18N_DICTIONARY.es;
            const nameVal = (document.getElementById('brief-name')?.value || '').trim();
            const profileSelect = document.getElementById('brief-profile');
            const practiceSelect = document.getElementById('brief-practice');
            const profileText = profileSelect?.options[profileSelect.selectedIndex]?.text || '';
            const practiceText = practiceSelect?.options[practiceSelect.selectedIndex]?.text || '';
            const goalVal = (document.getElementById('brief-goal')?.value || '').trim();

            if (!nameVal) {
                document.getElementById('brief-name')?.focus();
                if (briefFeedback) {
                    briefFeedback.textContent = dict.brief_err_name;
                    briefFeedback.classList.add('is-visible');
                }
                return;
            }

            const lines = [
                dict.brief_intro_msg,
                `• ${dict.brief_lbl_name.replace(' *', '')}: ${nameVal}`,
                `• ${dict.brief_lbl_profile}: ${profileText}`,
                `• ${dict.brief_lbl_practice}: ${practiceText}`
            ];
            if (goalVal) {
                lines.push(`• ${dict.brief_lbl_goal}: ${goalVal}`);
            }

            const composedText = lines.join('\n');

            trackEvent('generate_lead', {
                channel: activeSubmitChannel,
                lead_profile: profileText,
                lead_practice: practiceText,
                has_custom_goal: Boolean(goalVal)
            });

            if (MARKETING_CONFIG.leadWebhookUrl) {
                try {
                    fetch(MARKETING_CONFIG.leadWebhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            language: currentLang,
                            name: nameVal,
                            profile: profileText,
                            practice: practiceText,
                            goal: goalVal,
                            channel: activeSubmitChannel,
                            attribution
                        }),
                        keepalive: true
                    }).catch(() => {});
                } catch (_) {}
            }

            if (briefFeedback) {
                briefFeedback.textContent = `${dict.brief_ok_prefix} ${nameVal} (${activeSubmitChannel === 'email' ? 'Email' : 'WhatsApp'})...`;
                briefFeedback.classList.add('is-visible');
            }

            if (activeSubmitChannel === 'email') {
                const subject = `Project Brief: ${nameVal} (${practiceText})`;
                window.location.href = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composedText)}`;
            } else {
                const waUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(composedText)}`;
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }

    // Tracking de apertura de Preguntas Frecuentes
    document.querySelectorAll('details.faq-item').forEach(faq => {
        faq.addEventListener('toggle', () => {
            if (faq.open) {
                trackEvent('faq_open', {
                    faq_id: faq.getAttribute('data-faq') || 'faq',
                    question: faq.querySelector('.faq-question span')?.textContent?.trim()
                });
            }
        });
    });

    // =========================================================================
    // 3. MENÚ MOBILE
    // =========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const iconOpen = document.getElementById('icon-menu-open');
    const iconClose = document.getElementById('icon-menu-close');

    function closeMobileMenu() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('is-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
        if (iconOpen && iconClose) {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
        }
    }

    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            if (iconOpen && iconClose) {
                iconOpen.style.display = isOpen ? 'none' : 'block';
                iconClose.style.display = isOpen ? 'block' : 'none';
            }
        });

        mobileDrawer.querySelectorAll('.mobile-nav-link, .btn').forEach(link => link.addEventListener('click', closeMobileMenu));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
    }

    // =========================================================================
    // 4. ANIMACIONES DE REVELADO AL HACER SCROLL (SINCRONIZADAS CON EL TELÓN)
    // =========================================================================
    let revealsInitialized = false;
    function initScrollReveals() {
        if (revealsInitialized) return;
        revealsInitialized = true;

        const revealElements = document.querySelectorAll('[data-reveal], .hairline-divider');
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.08
            });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('is-visible'));
        }

        // Contador Animado Sutil (+100)
        const counterEl = document.querySelector('[data-counter]');
        if (counterEl && 'IntersectionObserver' in window) {
            const targetVal = parseInt(counterEl.getAttribute('data-counter'), 10) || 100;
            const counterObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const duration = 1400;
                    const startTime = performance.now();
                    function tick(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counterEl.textContent = `+${Math.round(targetVal * eased)}`;
                        if (progress < 1) requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                    obs.unobserve(counterEl);
                });
            }, { threshold: 0.4 });

            counterObserver.observe(counterEl);
        }
    }

    // =========================================================================
    // 5. MOTOR UNIFICADO DE SCROLL: PARALLAX + PROGRESO + TEXT SCRUBBING + HITOS
    // =========================================================================
    const parallaxImages = document.querySelectorAll('[data-parallax]');
    const scrollProgressEl = document.getElementById('scroll-progress');
    const reachedScrollMilestones = new Set();

    rebuildScrubBlocks();

    let ticking = false;

    function updateOnScroll() {
        const vh = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(document.documentElement.scrollHeight - vh, 1);
        const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

        if (scrollProgressEl) {
            scrollProgressEl.style.transform = `scaleX(${progress.toFixed(4)})`;
        }

        const pct = Math.round(progress * 100);
        [25, 50, 75, 90].forEach(milestone => {
            if (pct >= milestone && !reachedScrollMilestones.has(milestone)) {
                reachedScrollMilestones.add(milestone);
                trackEvent('scroll_depth', { percent_scrolled: milestone });
            }
        });

        if (window.innerWidth >= 768) {
            parallaxImages.forEach(img => {
                const rect = img.parentElement.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < vh) {
                    const speed = parseFloat(img.getAttribute('data-parallax')) || 14;
                    const ratio = ((rect.top + rect.height / 2) - vh / 2) / (vh / 2);
                    const yOffset = (ratio * speed).toFixed(1);
                    img.style.transform = `scale(1.06) translate3d(0, ${yOffset}px, 0)`;
                }
            });
        } else {
            parallaxImages.forEach(img => {
                img.style.transform = '';
            });
        }

        scrubBlocks.forEach(({ el, words }) => {
            const rect = el.getBoundingClientRect();
            const startY = vh * 0.85;
            const endY = vh * 0.35;
            const scrubProgress = Math.min(Math.max((startY - rect.top) / (startY - endY), 0), 1);
            const litCount = Math.round(scrubProgress * words.length);
            words.forEach((w, i) => {
                w.classList.toggle('is-lit', i < litCount);
            });
        });

        ticking = false;
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }, { passive: true });
        updateOnScroll();
    } else {
        scrubBlocks.forEach(({ words }) => words.forEach(w => w.classList.add('is-lit')));
    }

    // Detectar parámetro ?lang=es|en|pt o preferencia guardada si estamos en la raíz
    const urlParams = new URLSearchParams(window.location.search);
    const queryLang = urlParams.get('lang')?.toLowerCase();
    const htmlDefaultLang = document.documentElement.getAttribute('data-lang') || 'es';

    if (queryLang && I18N_DICTIONARY[queryLang]) {
        applyLanguage(queryLang, { save: true, track: false });
    } else if (htmlDefaultLang === 'es') {
        let savedLang = '';
        try { savedLang = localStorage.getItem('dhub_lang') || ''; } catch (_) {}
        if (savedLang && I18N_DICTIONARY[savedLang] && savedLang !== 'es') {
            applyLanguage(savedLang, { save: false, track: false });
        } else {
            updateContactLinks();
        }
    } else {
        updateContactLinks();
    }

    trackEvent('dhub_page_ready', { referrer: document.referrer || 'direct' });

    // =========================================================================
    // 6. BOTONES MAGNÉTICOS (TACTILE MAGNETIC PULL)
    // =========================================================================
    const magneticItems = document.querySelectorAll('[data-magnetic]');
    if (magneticItems.length && window.matchMedia('(hover: hover)').matches) {
        magneticItems.forEach(item => {
            const strength = parseFloat(item.getAttribute('data-magnetic')) || 0.2;
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
                const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
                item.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate3d(0, 0, 0)';
            });
        });
    }

    // =========================================================================
    // 7. CURSOR CONTEXTUAL SOBRE FOTOGRAFÍAS (EDITORIAL VIEWFINDER)
    // =========================================================================
    const photoCursor = document.getElementById('photo-cursor');
    const photoCursorText = document.getElementById('photo-cursor-text');
    const captionFrames = document.querySelectorAll('.media-frame[data-caption]');

    if (photoCursor && photoCursorText && captionFrames.length && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let curX = 0, curY = 0;
        let cursorActive = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function animateCursor() {
            if (cursorActive) {
                curX += (mouseX - curX) * 0.18;
                curY += (mouseY - curY) * 0.18;
                photoCursor.style.left = `${curX.toFixed(1)}px`;
                photoCursor.style.top = `${curY.toFixed(1)}px`;
            }
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);

        captionFrames.forEach(frame => {
            frame.addEventListener('mouseenter', (e) => {
                curX = e.clientX;
                curY = e.clientY;
                photoCursorText.textContent = frame.getAttribute('data-caption') || 'PATAGONIA';
                cursorActive = true;
                photoCursor.classList.add('is-active');
            });
            frame.addEventListener('mouseleave', () => {
                cursorActive = false;
                photoCursor.classList.remove('is-active');
            });
        });
    }

    // =========================================================================
    // 8. INDICADOR DE SECCIÓN ACTIVA EN NAVEGACIÓN & TRACKING DE SECCIONES
    // =========================================================================
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
    const viewedSections = new Set();

    if ('IntersectionObserver' in window && sections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                    if (id && !viewedSections.has(id)) {
                        viewedSections.add(id);
                        trackEvent('section_view', { section_id: id });
                    }
                }
            });
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: 0
        });

        sections.forEach(sec => navObserver.observe(sec));
    }

    // =========================================================================
    // 9. PROBADOR DE TIPOGRAFÍAS EN VIVO (CARGA BAJO DEMANDA PARA CORE WEB VITALS)
    // =========================================================================
    const fontButtons = document.querySelectorAll('.font-opt[data-font]');
    const fontSwitcher = document.getElementById('font-switcher');
    const minimizeBtn = document.getElementById('font-switcher-minimize');
    let extraFontsLoaded = false;

    function loadExtraPreviewFonts() {
        if (extraFontsLoaded) return;
        extraFontsLoaded = true;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,400;1,400&family=Outfit:wght@200;300;400&family=Playfair+Display:ital,wght@0,400;1,400&display=swap';
        document.head.appendChild(link);
    }

    function applyFontPreset(preset) {
        if (preset && preset !== 'cormorant') {
            loadExtraPreviewFonts();
        }
        document.documentElement.setAttribute('data-font', preset);
        fontButtons.forEach(btn => {
            btn.classList.toggle('is-active', btn.getAttribute('data-font') === preset);
        });
        try { localStorage.setItem('dhub_font_preset', preset); } catch (_) {}
    }

    if (fontButtons.length && fontSwitcher) {
        let savedFont = 'cormorant';
        try { savedFont = localStorage.getItem('dhub_font_preset') || 'cormorant'; } catch (_) {}
        applyFontPreset(savedFont);

        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('fonts') || searchParams.has('preview')) {
            loadExtraPreviewFonts();
            fontSwitcher.removeAttribute('hidden');
        }

        fontButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                applyFontPreset(btn.getAttribute('data-font'));
            });
        });

        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
            if (e.altKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                loadExtraPreviewFonts();
                fontSwitcher.toggleAttribute('hidden');
                return;
            }
            if (!fontSwitcher.hasAttribute('hidden')) {
                const map = { '1': 'cormorant', '2': 'instrument', '3': 'outfit', '4': 'playfair', '5': 'lora' };
                if (map[e.key]) applyFontPreset(map[e.key]);
            }
        });
    }

    if (minimizeBtn && fontSwitcher) {
        if (window.innerWidth < 768) {
            fontSwitcher.classList.add('is-minimized');
            minimizeBtn.textContent = '+';
        }
        minimizeBtn.addEventListener('click', () => {
            const min = fontSwitcher.classList.toggle('is-minimized');
            minimizeBtn.textContent = min ? '+' : '—';
        });
    }

    // =========================================================================
    // 10. FÍSICA CONTINUA DE AGUJA MAGNÉTICA (SIN SALTOS AL FRENAR POR INERCIA)
    // =========================================================================
    const headerIsotipo = document.getElementById('header-isotipo');
    const headerNeedle = document.getElementById('header-compass-needle');
    let needleAngle = 0;
    let needleVel = 0;
    let dragTarget = 0;
    let isDragging = false;
    let physicsRaf = null;
    let dragReleaseTimer = null;
    let lastScrollY = window.scrollY || 0;

    function runNeedlePhysics() {
        if (isDragging) {
            const pull = (dragTarget - needleAngle) * 0.24;
            needleVel = (needleVel + pull) * 0.68;
            needleAngle += needleVel;
        } else {
            const stiffness = 0.145;
            const damping = 0.865;
            const force = -stiffness * needleAngle;
            needleVel = (needleVel + force) * damping;
            needleAngle += needleVel;
        }

        if (headerNeedle) {
            headerNeedle.style.transform = `rotate(${needleAngle.toFixed(2)}deg)`;
        }

        if (isDragging || Math.abs(needleAngle) > 0.08 || Math.abs(needleVel) > 0.08) {
            physicsRaf = requestAnimationFrame(runNeedlePhysics);
        } else {
            needleAngle = 0;
            needleVel = 0;
            if (headerNeedle) headerNeedle.style.transform = 'rotate(0deg)';
            physicsRaf = null;
        }
    }

    function ensurePhysicsLoop() {
        if (!physicsRaf && headerNeedle) {
            physicsRaf = requestAnimationFrame(runNeedlePhysics);
        }
    }

    function impulseNeedle(velocityKick = 11) {
        if (!headerNeedle) return;
        isDragging = false;
        needleVel += velocityKick;
        ensurePhysicsLoop();
    }

    if (headerNeedle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY || 0;
            const delta = currentY - lastScrollY;
            lastScrollY = currentY;

            if (Math.abs(delta) >= 2.4) {
                const dir = delta > 0 ? 1 : -1;
                isDragging = true;
                dragTarget = dir * 44 + Math.sin(currentY * 0.05) * 6;
                ensurePhysicsLoop();

                clearTimeout(dragReleaseTimer);
                dragReleaseTimer = setTimeout(() => {
                    isDragging = false;
                    needleVel -= Math.sign(needleAngle || dir) * 3.2;
                    ensurePhysicsLoop();
                }, 65);
            }
        }, { passive: true });

        document.querySelector('.brand-lockup')?.addEventListener('mouseenter', () => {
            impulseNeedle(10.5);
        });
    }

    // =========================================================================
    // 11. SECUENCIA ORDENADA DE APERTURA: GIRO → VUELO AL HEADER → REVELADO HERO
    // =========================================================================
    const introLoader = document.getElementById('intro-loader');
    const introCompassWrap = document.getElementById('intro-compass-wrap');

    function finishIntroImmediately() {
        document.documentElement.classList.remove('is-intro-locked');
        headerIsotipo?.classList.remove('is-waiting-intro');
        introLoader?.classList.add('is-done');
        initScrollReveals();
    }

    if (introLoader && introCompassWrap && headerIsotipo) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            finishIntroImmediately();
        } else {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);

            let handoffDone = false;
            function completeHandoff() {
                if (handoffDone) return;
                handoffDone = true;

                headerIsotipo.classList.remove('is-waiting-intro');

                requestAnimationFrame(() => {
                    introLoader.classList.add('is-done');
                    impulseNeedle(11);
                });
            }

            introCompassWrap.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'transform') {
                    completeHandoff();
                }
            });

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    introLoader.classList.add('is-spinning');

                    setTimeout(() => {
                        document.documentElement.classList.remove('is-intro-locked');

                        const startRect = introCompassWrap.getBoundingClientRect();
                        const targetRect = headerIsotipo.getBoundingClientRect();

                        const dx = (targetRect.left + targetRect.width / 2) - (startRect.left + startRect.width / 2);
                        const dy = (targetRect.top + targetRect.height / 2) - (startRect.top + startRect.height / 2);
                        const scale = targetRect.width / startRect.width;

                        introLoader.classList.add('is-docking');
                        introCompassWrap.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

                        initScrollReveals();
                    }, 850);

                    setTimeout(completeHandoff, 1590);
                });
            });

            setTimeout(finishIntroImmediately, 2600);
        }
    } else {
        finishIntroImmediately();
    }
});
