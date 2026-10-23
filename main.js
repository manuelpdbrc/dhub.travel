/**
 * Destination Hub (dhub.travel) — Minimal Vanilla JS, Subtle Motion & Marketing Engine
 * ====================================================================================
 * 1. CONFIGURACIÓN RÁPIDA DE CONTACTO Y CANALES COMERCIALES:
 * Editá los valores de abajo para actualizar automáticamente todos los botones
 * de WhatsApp, Agenda de Videollamada, Email y el Brief Rápido en la página.
 */
const CONTACT_CONFIG = {
    email: 'hola@dhub.travel',
    whatsappNumber: '5492944000000', // Reemplazar con número real (código país + área sin + ni espacios)
    whatsappMessage: 'Hola equipo de Destination Hub, me gustaría conversar sobre un proyecto en Patagonia.',
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
            window.gtag('event', eventName, payload);
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

    // Exponer API global para auditoría y consola
    window.DHUB_MARKETING = {
        config: MARKETING_CONFIG,
        contact: CONTACT_CONFIG,
        getAttribution: () => attribution,
        trackEvent
    };

    // Inyección automática opcional de scripts de terceros si están configurados en MARKETING_CONFIG
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
    trackEvent('dhub_page_ready', { referrer: document.referrer || 'direct' });

    // =========================================================================
    // 1. ENLACES CONFIGURABLES DE CONTACTO CON ENRIQUECIMIENTO UTM & CONTEXTO
    // =========================================================================
    let selectedPracticeTopic = '';

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

    function updateContactLinks(customTopic = '') {
        const baseMsg = customTopic
            ? `${CONTACT_CONFIG.whatsappMessage} Me interesa consultar sobre: ${customTopic}.`
            : CONTACT_CONFIG.whatsappMessage;
        const subject = customTopic
            ? `Consulta Estratégica (${customTopic}) — Destination Hub`
            : 'Consulta Estratégica — Destination Hub';

        const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(baseMsg)}`;
        const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}`;
        const calendarUrl = buildCalendarUrlWithUtm(CONTACT_CONFIG.calendarUrl);

        document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => el.setAttribute('href', whatsappUrl));
        document.querySelectorAll('[data-contact="calendar"]').forEach(el => el.setAttribute('href', calendarUrl));
        document.querySelectorAll('[data-contact="email"]').forEach(el => el.setAttribute('href', mailtoUrl));
    }

    updateContactLinks();

    // Tracking de clics en CTAs generales
    document.querySelectorAll('[data-track-cta]').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('cta_click', {
                cta_id: el.getAttribute('data-track-cta'),
                cta_text: el.textContent.trim()
            });
        });
    });

    // Tracking de clics en canales directos de conversión (WhatsApp, Calendly, Email)
    document.querySelectorAll('[data-track-channel]').forEach(el => {
        el.addEventListener('click', () => {
            const channel = el.getAttribute('data-track-channel');
            trackEvent('lead_channel_click', {
                channel,
                practice_topic: selectedPracticeTopic || 'General',
                destination_url: el.getAttribute('href')
            });
        });
    });

    // Selección contextual desde las 3 Áreas de Práctica
    const briefPracticeSelect = document.getElementById('brief-practice');
    const briefNameInput = document.getElementById('brief-name');

    document.querySelectorAll('[data-select-practice]').forEach(link => {
        link.addEventListener('click', () => {
            const practice = link.getAttribute('data-select-practice') || '';
            selectedPracticeTopic = practice;
            updateContactLinks(practice);

            if (briefPracticeSelect && practice) {
                briefPracticeSelect.value = practice;
            }

            trackEvent('select_practice', { practice_name: practice });

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
            const nameVal = (document.getElementById('brief-name')?.value || '').trim();
            const profileVal = document.getElementById('brief-profile')?.value || 'Organización en Patagonia';
            const practiceVal = document.getElementById('brief-practice')?.value || 'Proyecto Integral';
            const goalVal = (document.getElementById('brief-goal')?.value || '').trim();

            if (!nameVal) {
                document.getElementById('brief-name')?.focus();
                if (briefFeedback) {
                    briefFeedback.textContent = 'Por favor indicá tu nombre y organización para personalizar la consulta.';
                    briefFeedback.classList.add('is-visible');
                }
                return;
            }

            const lines = [
                'Hola equipo de Destination Hub, les comparto un brief rápido de proyecto:',
                `• Nombre / Organización: ${nameVal}`,
                `• Perfil: ${profileVal}`,
                `• Área de interés: ${practiceVal}`
            ];
            if (goalVal) {
                lines.push(`• Objetivo / Desafío: ${goalVal}`);
            }

            const composedText = lines.join('\n');

            // Registrar evento de conversión principal (Lead)
            trackEvent('generate_lead', {
                channel: activeSubmitChannel,
                lead_profile: profileVal,
                lead_practice: practiceVal,
                has_custom_goal: Boolean(goalVal)
            });

            // Envío opcional por Webhook si está configurado
            if (MARKETING_CONFIG.leadWebhookUrl) {
                try {
                    fetch(MARKETING_CONFIG.leadWebhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: nameVal,
                            profile: profileVal,
                            practice: practiceVal,
                            goal: goalVal,
                            channel: activeSubmitChannel,
                            attribution
                        }),
                        keepalive: true
                    }).catch(() => {});
                } catch (_) {}
            }

            if (briefFeedback) {
                briefFeedback.textContent = `Brief preparado para ${nameVal}. Abriendo canal directo (${activeSubmitChannel === 'email' ? 'Correo Electrónico' : 'WhatsApp Directo'})...`;
                briefFeedback.classList.add('is-visible');
            }

            if (activeSubmitChannel === 'email') {
                const subject = `Brief de Proyecto: ${nameVal} (${practiceVal})`;
                window.location.href = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composedText)}`;
            } else {
                const waUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(composedText)}`;
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }

    // Tracking de apertura de Preguntas Frecuentes (AEO / DEO Engagement)
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
    // 2. MENÚ MOBILE
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

        mobileDrawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
    }

    // =========================================================================
    // 3. ANIMACIONES DE REVELADO AL HACER SCROLL (SINCRONIZADAS CON EL TELÓN)
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

        // 4. Contador Animado Sutil (+100 años)
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
                        const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
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
    const scrubBlocks = [];
    const reachedScrollMilestones = new Set();

    document.querySelectorAll('[data-scrub-text]').forEach(block => {
        const rawText = block.textContent.trim().replace(/\s+/g, ' ');
        const words = rawText.split(' ');
        block.innerHTML = '';
        const wordSpans = [];
        // Las últimas 6 palabras llevan el acento itálico glaciar
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

    let ticking = false;

    function updateOnScroll() {
        const vh = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(document.documentElement.scrollHeight - vh, 1);
        const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

        // A. Barra superior de progreso (1.5px)
        if (scrollProgressEl) {
            scrollProgressEl.style.transform = `scaleX(${progress.toFixed(4)})`;
        }

        // B. Hitos de profundidad de lectura para analítica de engagement (25%, 50%, 75%, 90%)
        const pct = Math.round(progress * 100);
        [25, 50, 75, 90].forEach(milestone => {
            if (pct >= milestone && !reachedScrollMilestones.has(milestone)) {
                reachedScrollMilestones.add(milestone);
                trackEvent('scroll_depth', { percent_scrolled: milestone });
            }
        });

        // C. Parallax en fotografías (solo en pantallas amplias para evitar recortes en mobile)
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

        // D. Iluminación progresiva palabra por palabra (Text Scrubbing)
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

        // Mostrar selector solo si se solicita vía ?fonts=1 o ?preview=1 (o con atajo Alt+T)
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
