/**
 * Destination Hub (dhub.travel) — Minimal Vanilla JS & Subtle Motion Engine
 * ============================================================================
 * CONFIGURACIÓN RÁPIDA DE CONTACTO:
 * Editá los valores de abajo para actualizar automáticamente todos los botones
 * de WhatsApp, Agenda de Videollamada y Email en la página.
 */
const CONTACT_CONFIG = {
    email: 'hola@dhub.travel',
    whatsappNumber: '5492944000000', // Reemplazar con número real (código país + área sin + ni espacios)
    whatsappMessage: 'Hola equipo de Destination Hub, me gustaría conversar sobre un proyecto en Patagonia.',
    calendarUrl: 'https://calendly.com/dhub-travel' // Reemplazar con enlace real de Calendly / Google Calendar
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inyectar enlaces configurables de contacto
    const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(CONTACT_CONFIG.whatsappMessage)}`;
    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent('Consulta Estratégica — Destination Hub')}`;

    document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => el.setAttribute('href', whatsappUrl));
    document.querySelectorAll('[data-contact="calendar"]').forEach(el => el.setAttribute('href', CONTACT_CONFIG.calendarUrl));
    document.querySelectorAll('[data-contact="email"]').forEach(el => el.setAttribute('href', mailtoUrl));

    // 2. Menú Mobile
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

    // 3. Animaciones Sutiles de Revelado al Hacer Scroll (Texto, Imágenes y Líneas)
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

    // 5. Motor Unificado de Scroll: Parallax + Barra de Progreso + Text Scrubbing
    const parallaxImages = document.querySelectorAll('[data-parallax]');
    const scrollProgressEl = document.getElementById('scroll-progress');
    const scrubBlocks = [];

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

        // A. Barra superior de progreso (1.5px)
        if (scrollProgressEl) {
            const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
            scrollProgressEl.style.transform = `scaleX(${progress.toFixed(4)})`;
        }

        // B. Parallax en fotografías
        parallaxImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < vh) {
                const speed = parseFloat(img.getAttribute('data-parallax')) || 14;
                const ratio = ((rect.top + rect.height / 2) - vh / 2) / (vh / 2);
                const yOffset = (ratio * speed).toFixed(1);
                img.style.transform = `scale(1.06) translate3d(0, ${yOffset}px, 0)`;
            }
        });

        // C. Iluminación progresiva palabra por palabra (Text Scrubbing)
        scrubBlocks.forEach(({ el, words }) => {
            const rect = el.getBoundingClientRect();
            const startY = vh * 0.85;
            const endY = vh * 0.35;
            const progress = Math.min(Math.max((startY - rect.top) / (startY - endY), 0), 1);
            const litCount = Math.round(progress * words.length);
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

    // 6. Botones Magnéticos (Tactile Magnetic Pull)
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

    // 7. Cursor Contextual sobre Fotografías (Editorial Viewfinder)
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

    // 6. Indicador de sección activa en navegación
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

    if ('IntersectionObserver' in window && sections.length && navLinks.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: 0
        });

        sections.forEach(sec => navObserver.observe(sec));
    }

    // 7. Probador Interactivo de Tipografías en Vivo
    const fontButtons = document.querySelectorAll('.font-opt[data-font]');
    const fontSwitcher = document.getElementById('font-switcher');
    const minimizeBtn = document.getElementById('font-switcher-minimize');

    function applyFontPreset(preset) {
        document.documentElement.setAttribute('data-font', preset);
        fontButtons.forEach(btn => {
            btn.classList.toggle('is-active', btn.getAttribute('data-font') === preset);
        });
        try { localStorage.setItem('dhub_font_preset', preset); } catch (_) {}
    }

    if (fontButtons.length) {
        let savedFont = 'cormorant';
        try { savedFont = localStorage.getItem('dhub_font_preset') || 'cormorant'; } catch (_) {}
        applyFontPreset(savedFont);

        fontButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                applyFontPreset(btn.getAttribute('data-font'));
            });
        });

        // Atajos de teclado 1 a 5 para cambiar rápido mientras se navega
        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            const map = { '1': 'cormorant', '2': 'instrument', '3': 'outfit', '4': 'playfair', '5': 'lora' };
            if (map[e.key]) applyFontPreset(map[e.key]);
        });
    }

    if (minimizeBtn && fontSwitcher) {
        minimizeBtn.addEventListener('click', () => {
            const min = fontSwitcher.classList.toggle('is-minimized');
            minimizeBtn.textContent = min ? '+' : '—';
        });
    }

    // 8. Física Continua de Aguja Magnética (Sin saltos al frenar por inercia)
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
            // Mientras el scroll tiene velocidad activa, el flujo empuja la aguja hacia dragTarget
            const pull = (dragTarget - needleAngle) * 0.24;
            needleVel = (needleVel + pull) * 0.68;
            needleAngle += needleVel;
        } else {
            // Al comenzar a frenar la inercia, se suelta desde su ángulo real actual (sin saltos)
            // y oscila libremente como un péndulo magnético hasta clavarse en 0°
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

            // Ignoramos la "cola lenta" de inercia (< 2.4px por frame) para que la aguja
            // empiece su oscilación natural apenas el scroll comienza a desacelerar,
            // evitando que se quede quieta y pegue un salto artificial al final.
            if (Math.abs(delta) >= 2.4) {
                const dir = delta > 0 ? 1 : -1;
                isDragging = true;
                // Mantiene la aguja desviada a ~44° con una leve vibración magnética viva
                dragTarget = dir * 44 + Math.sin(currentY * 0.05) * 6;
                ensurePhysicsLoop();

                clearTimeout(dragReleaseTimer);
                dragReleaseTimer = setTimeout(() => {
                    isDragging = false;
                    // Al soltar el empuje del scroll, le damos velocidad de retorno desde su posición actual
                    needleVel -= Math.sign(needleAngle || dir) * 3.2;
                    ensurePhysicsLoop();
                }, 65);
            }
        }, { passive: true });

        // Al pasar el mouse sobre el logo principal, recibe un impulso magnético suave sin teletransportarse
        document.querySelector('.brand-lockup')?.addEventListener('mouseenter', () => {
            impulseNeedle(10.5);
        });
    }

    // 9. Animación de Apertura: Brújula Grande Girando → Se Achica hacia el Logo Principal
    const introLoader = document.getElementById('intro-loader');
    const introCompassWrap = document.getElementById('intro-compass-wrap');

    if (introLoader && introCompassWrap && headerIsotipo) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            headerIsotipo.classList.remove('is-waiting-intro');
            introLoader.classList.add('is-done');
        } else {
            // Fase 1 (0 a 820ms): La brújula aparece grande en el centro y gira rápidamente
            // Fase 2 (820ms a 1540ms): Se achica volando hacia la posición exacta del logo en el header y revela la página
            setTimeout(() => {
                const startRect = introCompassWrap.getBoundingClientRect();
                const targetRect = headerIsotipo.getBoundingClientRect();

                const dx = (targetRect.left + targetRect.width / 2) - (startRect.left + startRect.width / 2);
                const dy = (targetRect.top + targetRect.height / 2) - (startRect.top + startRect.height / 2);
                const scale = targetRect.width / startRect.width;

                introLoader.classList.add('is-docking');
                introCompassWrap.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
            }, 820);

            // Fase 3 (1540ms): Encastre perfecto en el header + oscilación final de bienvenida
            setTimeout(() => {
                headerIsotipo.classList.remove('is-waiting-intro');
                introLoader.classList.add('is-done');
                impulseNeedle(11);
            }, 1540);
        }
    }
});
