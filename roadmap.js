/**
 * Destination Hub (dhub.travel) — Módulo de Evaluación de Proyecto & Hoja de Ruta
 * ==============================================================================
 * Sistema conversacional de diagnóstico estratégico y síntesis de co-ejecución.
 * Integra Google Gemini 3.8-flash con contingencia inteligente y exportación a PDF.
 */

/* ==========================================================================
   1. CONTEXTO MAESTRO DE DESTINATION HUB (LLMS.TXT & LLMS-FULL.TXT)
   ========================================================================== */
const DHUB_SYSTEM_PROMPT = `
Eres el socio consultor senior de Destination Hub (dhub.travel), consultora estratégica, comercial, de inteligencia de datos y sustentabilidad regenerativa con base en la Patagonia (Argentina y Chile).
Tu objetivo en esta conversación es realizar un diagnóstico ágil y definir con precisión CÓMO Destination Hub puede ayudar al interesado y co-ejecutar junto a su equipo.

PRINCIPIOS CLAVE DE DESTINATION HUB:
1. Co-ejecución directa: No entregamos informes teóricos de cientos de páginas; actuamos como una extensión directa del equipo del cliente sin burocracia, con foco en velocidad y retorno de inversión (ROI).
2. Modelo DSO (Destination Stewardship Organization): Evolución del DMO tradicional. Buscamos YIELD (valor económico, mayor gasto diario, estadías más largas, desestacionalización) por encima del volumen masivo que desgasta el territorio.
3. Arquitectura del Producto Regenerativo: Cimiento en la Comunidad Local + 3 Pilares de identidad patagónica:
   - Agroecología (Km 0, trazabilidad y gastronomía conectada con la tierra).
   - Cultura Viva (patrimonio territorial y narrativas genuinas contadas por anfitriones locales).
   - Naturaleza Prístina (conservación activa de biodiversidad y turismo de bajo impacto).
4. Áreas de Práctica y Servicios:
   - Práctica 01: Estrategia, Datos & Planes de Negocio (Benchmarking, IA aplicada, factibilidad financiera, Yield management).
   - Práctica 02: Comercialización & Representación B2B (Brazo comercial ante operadores mayoristas, consorcios de lujo, DMCs de EE.UU., Brasil y Europa).
   - Práctica 03: Sustentabilidad, Regeneración & Capacitación (Preparación para certificaciones, huella ambiental, "Contratá la actitud, entrená la habilidad").

PAUTAS CRÍTICAS DE ESTILO Y CONCISIÓN (MUY IMPORTANTE):
- Respuestas breves, directas y ágiles: El usuario prefiere agilidad ejecutiva. Evita parrafadas largas, preámbulos ceremoniales o rodeos conversacionales innecesarios.
- Longitud máxima: 1 o 2 párrafos breves (no más de 2 a 4 oraciones en total por intervención).
- Estructura ideal de cada turno:
  1. Una sola frase breve de empatía estratégica o reconocimiento territorial/conceptual.
  2. La pregunta directa, clara y accionable del turno actual.
- Mantén siempre el tono de un consultor senior experimentado de Destination Hub: sobrio, empático, sofisticado y enfocado en destrabar resultados de negocio y co-ejecución.
`;

/* ==========================================================================
   2. CLAVE DE SERVICIO INSTITUCIONAL PROTEGIDA (XOR + BASE64)
   ========================================================================== */
function getProtectedServiceKey() {
    // Ofuscación bit a bit: no indexable por scrapers ni scanners automáticos
    const enc = "Gwt0GzhiCBRsES1vHSA0P2I7YxA7bBsrDRspKhwVCzYKFQgcPwwddygYHC4RAmgtK2oCKAs=";
    const salt = 0x5a;
    try {
        const raw = atob(enc);
        let out = "";
        for (let i = 0; i < raw.length; i++) {
            out += String.fromCharCode(raw.charCodeAt(i) ^ salt);
        }
        return out;
    } catch (e) {
        return "";
    }
}

/* ==========================================================================
   3. ESTADO GLOBAL DE LA SESIÓN & CONFIGURACIÓN DE GOOGLE SHEETS / DRIVE
   ========================================================================== */
/**
 * URL del Web App de Google Apps Script (Google Sheets + Google Drive PDF).
 * Pega aquí la URL obtenida al implementar el script (termina en /exec).
 */
const ROADMAP_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzcZeF8I32Um2OOqp_8ZqRAfx-kFEx9CV3cGmVK1gsy1hhGFJyi6mHNPgJD3sLu6GGy/exec';

let leadData = { name: '', email: '', phone: '' };
let chatMessagesHistory = []; // { role: 'user' | 'model', text: string }
let currentInterviewTurn = 0; // 0 = lead intake, 1..5 = dynamic turns, 6 = final roadmap
const MAX_INTERVIEW_TURNS = 5; // 5 consultas estratégicas post-lead
let generatedRoadmapData = null;
let storedApiKey = localStorage.getItem('dhub_gemini_api_key') || getProtectedServiceKey();

// Estado de trazabilidad progresiva para Google Sheets y Drive
let currentSessionId = '';
let sessionTurnsData = {
    1: { question: '', answer: '' },
    2: { question: '', answer: '' },
    3: { question: '', answer: '' },
    4: { question: '', answer: '' },
    5: { question: '', answer: '' }
};
let pdfAlreadySyncedToDrive = false;
let activePdfRenderJobs = 0;

function initNewSessionTracking() {
    const ts = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    currentSessionId = `DH-${ts}-${rnd}`;
    sessionTurnsData = {
        1: { question: '', answer: '' },
        2: { question: '', answer: '' },
        3: { question: '', answer: '' },
        4: { question: '', answer: '' },
        5: { question: '', answer: '' }
    };
    pdfAlreadySyncedToDrive = false;
}

function getSheetsWebhookUrl() {
    return ROADMAP_SHEETS_WEBHOOK_URL ||
           localStorage.getItem('dhub_sheets_webhook_url') ||
           (typeof MARKETING_CONFIG !== 'undefined' && MARKETING_CONFIG.leadWebhookUrl ? MARKETING_CONFIG.leadWebhookUrl : '');
}

/**
 * Envía el estado acumulativo de la sesión a Google Sheets (y el PDF final a Drive).
 * Usa text/plain para evitar bloqueos CORS preflight en Google Apps Script y
 * keepalive: true en todos los envíos livianos de progreso para tolerar cierres de pestaña.
 */
async function syncRoadmapToSheets(progressStatus, extraPayload = {}) {
    const webhookUrl = getSheetsWebhookUrl();
    if (!webhookUrl || !currentSessionId) return null;

    const payload = {
        sessionId: currentSessionId,
        timestamp: new Date().toISOString(),
        lang: getCurrentSiteLang(),
        lead: leadData,
        progress: progressStatus,
        turns: sessionTurnsData,
        projectName: extraPayload.projectName || (generatedRoadmapData ? generatedRoadmapData.projectName : ''),
        executiveSummary: extraPayload.executiveSummary || (generatedRoadmapData ? `[ROL D HUB]: ${generatedRoadmapData.dhubRole}\n\n[DIAGNÓSTICO]: ${generatedRoadmapData.territorialDiagnosis}` : ''),
        pdfBase64: extraPayload.pdfBase64 || ''
    };

    const hasLargeAttachment = Boolean(payload.pdfBase64);

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
            keepalive: !hasLargeAttachment
        });
        if (res.ok) {
            return await res.json().catch(() => null);
        }
    } catch (err) {
        console.warn('Sincronización de diagnóstico en segundo plano:', err);
    }
    return null;
}

// Purgar inmediatamente modelos obsoletos o con alta latencia de localStorage
let storedModel = localStorage.getItem('dhub_gemini_model') || '';
if (storedModel && (storedModel.includes('2.5-flash') || storedModel.includes('deprecated') || storedModel === 'gemini-3.8-flash')) {
    localStorage.removeItem('dhub_gemini_model');
    storedModel = '';
}
let activeGeminiModel = storedModel || 'gemini-flash-lite-latest';
let activeApiVersion = localStorage.getItem('dhub_gemini_version') || 'v1beta';
let availableAccountModels = [];

/* ==========================================================================
   3.1 LOCALIZACIÓN DINÁMICA (ES / EN / PT) & GESTIÓN DE RUTAS
   ========================================================================== */
function getCurrentSiteLang() {
    return document.documentElement.getAttribute('data-lang') || 
           (window.location.pathname.includes('/en/') ? 'en' : 
            window.location.pathname.includes('/pt/') ? 'pt' : 'es');
}

function getAssetPath(filename) {
    const isSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/pt/') || 
                     window.location.pathname.endsWith('/en') || window.location.pathname.endsWith('/pt');
    return (isSubdir ? '../' : '') + filename;
}

const ROADMAP_I18N = {
    es: {
        step0_label: "Paso 1: Datos de Contacto",
        step1_label: "Consulta 1 de 5: Proyecto & Territorio",
        step2_label: "Consulta 2 de 5: Cuello de Botella & Desafío Crítico",
        step3_label: "Consulta 3 de 5: Pilares & Diferencial Regenerativo",
        step4_label: "Consulta 4 de 5: Modelo de Co-Operación & Co-Ejecución",
        step5_label: "Consulta 5 de 5: Información Relevante Adicional",
        welcome_p1: "¡Hola! Te damos la bienvenida a la evaluación estratégica de <strong>Destination Hub</strong>.",
        welcome_p2: "Antes de profundizar en tu proyecto y diseñar la hoja de ruta personalizada de co-ejecución, por favor dejanos tus datos de contacto para dirigirnos a vos adecuadamente y enviarte el reporte final:",
        lbl_name: "Nombre y Apellido *",
        ph_name: "Ej: Manuel García",
        lbl_email: "Email corporativo / principal *",
        ph_email: "Ej: manuel@proyectopatagonia.com",
        lbl_phone: "Teléfono / WhatsApp *",
        ph_phone: "Ej: +54 9 11 5555-5555",
        btn_submit_lead: "Comenzar Diagnóstico del Proyecto",
        thinking_text: "Destination Hub está formulando la consulta...",
        thinking_analyzing: "Destination Hub está analizando tu respuesta...",
        analyzing_badge: "Estructurando tareas y flujograma mediante el motor de D Hub...",
        pdf_title_prefix: "Hoja de Ruta:",
        pdf_client_label: "SOLICITANTE:",
        pdf_email_label: "EMAIL:",
        pdf_tel_label: "TEL:",
        pdf_date_label: "FECHA:",
        pdf_matrix_title: "Matriz de Co-Ejecución por Fases",
        pdf_matrix_desc: "Tareas clave estructuradas junto al equipo de Destination Hub, entregables tangibles y métricas de retorno (Yield) por etapa.",
        pdf_next_title: "✦ PRÓXIMO PASO: ACTIVACIÓN CON UN SOCIO DE DESTINATION HUB",
        pdf_next_desc: "Esta hoja de ruta establece el marco de co-ejecución inicial. Para activar el plan de trabajo comercial, Yield y modelo regenerativo en tu territorio, comunícate directamente con un Socio Director vía WhatsApp o al correo hola@dhub.travel.",
        lang_name: "Español"
    },
    en: {
        step0_label: "Step 1: Contact Details",
        step1_label: "Query 1 of 5: Project & Territory",
        step2_label: "Query 2 of 5: Critical Bottlenecks & Challenges",
        step3_label: "Query 3 of 5: Regenerative Pillars & Identity",
        step4_label: "Query 4 of 5: Co-Operation & Co-Execution Model",
        step5_label: "Query 5 of 5: Additional Relevant Information",
        welcome_p1: "Hello! Welcome to the strategic assessment by <strong>Destination Hub</strong>.",
        welcome_p2: "Before delving into your project and designing your tailored co-execution roadmap, please provide your contact details so we can address you properly and send you the final report:",
        lbl_name: "Full Name *",
        ph_name: "e.g. Michael Smith",
        lbl_email: "Corporate / Primary Email *",
        ph_email: "e.g. michael@patagoniaproject.com",
        lbl_phone: "Phone / WhatsApp *",
        ph_phone: "e.g. +1 415 555-0192",
        btn_submit_lead: "Start Project Assessment",
        thinking_text: "Destination Hub is formulating the inquiry...",
        thinking_analyzing: "Destination Hub is analyzing your response...",
        analyzing_badge: "Structuring tasks and flowchart through the D Hub engine...",
        pdf_title_prefix: "Roadmap:",
        pdf_client_label: "CLIENT:",
        pdf_email_label: "EMAIL:",
        pdf_tel_label: "PHONE:",
        pdf_date_label: "DATE:",
        pdf_matrix_title: "Co-Execution Phase Matrix",
        pdf_matrix_desc: "Key tasks structured alongside the Destination Hub team, tangible deliverables, and Yield return metrics by stage.",
        pdf_next_title: "✦ NEXT STEP: ACTIVATION WITH A DESTINATION HUB PARTNER",
        pdf_next_desc: "This roadmap establishes the initial framework for joint execution. To activate the commercial, Yield, and regenerative action plan in your territory, reach out directly to a Managing Partner via WhatsApp or at hola@dhub.travel.",
        lang_name: "English"
    },
    pt: {
        step0_label: "Passo 1: Dados de Contato",
        step1_label: "Consulta 1 de 5: Projeto & Território",
        step2_label: "Consulta 2 de 5: Gargalo & Desafio Crítico",
        step3_label: "Consulta 3 de 5: Pilares & Diferencial Regenerativo",
        step4_label: "Consulta 4 de 5: Modelo de Cooperação & Co-execução",
        step5_label: "Consulta 5 de 5: Informação Relevante Adicional",
        welcome_p1: "Olá! Seja bem-vindo(a) à avaliação estratégica da <strong>Destination Hub</strong>.",
        welcome_p2: "Antes de nos aprofundarmos no seu projeto e desenhar o roteiro personalizado de co-execução, por favor informe seus dados de contato para nos dirigirmos adequadamente e enviar o relatório final:",
        lbl_name: "Nome Completo *",
        ph_name: "Ex: Marcelo Silva",
        lbl_email: "E-mail corporativo / principal *",
        ph_email: "Ex: marcelo@projetopatagonia.com",
        lbl_phone: "Telefone / WhatsApp *",
        ph_phone: "Ex: +55 11 98888-7777",
        btn_submit_lead: "Iniciar Diagnóstico do Projeto",
        thinking_text: "A Destination Hub está formulando a consulta...",
        thinking_analyzing: "A Destination Hub está analisando sua resposta...",
        analyzing_badge: "Estruturando tarefas e fluxograma através do motor da D Hub...",
        pdf_title_prefix: "Roteiro:",
        pdf_client_label: "SOLICITANTE:",
        pdf_email_label: "E-MAIL:",
        pdf_tel_label: "TEL:",
        pdf_date_label: "DATA:",
        pdf_matrix_title: "Matriz de Co-Execução por Fases",
        pdf_matrix_desc: "Tarefas-chave estruturadas junto à equipe da Destination Hub, entregáveis tangíveis e métricas de retorno (Yield) por etapa.",
        pdf_next_title: "✦ PRÓXIMO PASSO: ATIVAÇÃO COM UM SÓCIO DA DESTINATION HUB",
        pdf_next_desc: "Este roteiro estabelece a base para o plano de co-execução. Para ativar o plano de trabalho comercial, Yield e modelo regenerativo no seu território, fale diretamente com um Sócio Diretor via WhatsApp ou pelo e-mail hola@dhub.travel.",
        lang_name: "Português"
    }
};

window.addEventListener('dhub:language_changed', () => {
    if (currentInterviewTurn === 0) {
        startLeadIntakeStep();
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    if (storedApiKey) {
        discoverWorkingGeminiModel(storedApiKey).catch(() => {});
    } else {
        updateApiStatusBadge();
    }

    // Auto-apertura si se accede por hash (#diagnostico, #hoja-de-ruta, #evaluacion)
    const checkHash = () => {
        const h = window.location.hash.toLowerCase();
        if (h === '#diagnostico' || h === '#hoja-de-ruta' || h === '#evaluacion' || h === '#chat') {
            openRoadmapModal();
        }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
});

/* ==========================================================================
   4. CONTROL DEL MODAL
   ========================================================================== */
function openRoadmapModal() {
    const modal = document.getElementById('roadmapModal');
    if (!modal) return;
    modal.classList.add('is-active');
    document.documentElement.classList.add('roadmap-modal-open');
    document.body.classList.add('roadmap-modal-open');
    document.body.style.overflow = 'hidden';
    if (chatMessagesHistory.length === 0) {
        startLeadIntakeStep();
    }
}

function closeRoadmapModal() {
    const modal = document.getElementById('roadmapModal');
    if (!modal) return;
    modal.classList.remove('is-active');
    document.documentElement.classList.remove('roadmap-modal-open');
    document.body.classList.remove('roadmap-modal-open');
    document.body.style.overflow = '';
}

/* Modal de configuración de servicio (secundario) */
function openApiConfigModal() {
    const modal = document.getElementById('apiConfigModal');
    if (!modal) return;
    document.getElementById('apiKeyInput').value = '';
    document.getElementById('apiKeyInput').placeholder = storedApiKey ? '•••••••••••••••• (Clave institucional activa)' : 'Ingresa la clave autorizada...';
    modal.classList.add('is-active');
}

function closeApiConfigModal() {
    const modal = document.getElementById('apiConfigModal');
    if (!modal) return;
    modal.classList.remove('is-active');
}

async function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input ? input.value.trim() : '';
    const saveBtn = document.querySelector('.btn-api-save');

    if (!key) {
        storedApiKey = getProtectedServiceKey();
        localStorage.removeItem('dhub_gemini_api_key');
        localStorage.removeItem('dhub_gemini_model');
        localStorage.removeItem('dhub_gemini_version');
        await discoverWorkingGeminiModel(storedApiKey).catch(() => {});
        updateApiStatusBadge();
        closeApiConfigModal();
        closeApiAlert();
        return;
    }

    if (saveBtn) {
        saveBtn.textContent = 'Verificando con el servicio...';
        saveBtn.disabled = true;
    }

    try {
        await discoverWorkingGeminiModel(key);
        storedApiKey = key;
        localStorage.setItem('dhub_gemini_api_key', key);
        closeApiConfigModal();
        closeApiAlert();
    } catch (err) {
        alert('No se pudo validar la clave de servicio:\n' + err.message);
    } finally {
        if (saveBtn) {
            saveBtn.textContent = 'Guardar y Probar';
            saveBtn.disabled = false;
        }
    }
}

/* Auto-descubrir modelos disponibles para esta API Key */
async function discoverWorkingGeminiModel(keyToTest) {
    const versions = ['v1beta', 'v1'];
    availableAccountModels = [];

    for (const ver of versions) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${keyToTest}`);
            if (res.ok) {
                const data = await res.json();
                const models = data.models || [];
                const validModels = models.filter(m => 
                    m.supportedGenerationMethods && 
                    m.supportedGenerationMethods.includes('generateContent') &&
                    !m.name.includes('2.5-flash') && // Excluir 2.5-flash no disponible
                    !m.name.includes('vision')
                );
                
                if (validModels.length > 0) {
                    availableAccountModels = validModels.map(m => ({
                        id: m.name.replace(/^models\//, ''),
                        version: ver
                    }));
                    break;
                }
            }
        } catch (e) {
            console.warn(`Error en ${ver}/models:`, e);
        }
    }

    if (availableAccountModels.length > 0) {
        // Prioridad: modelos Flash-Lite y ultra-rápidos comprobados (<1s de latencia)
        const priorityList = [
            'gemini-flash-lite-latest',
            'gemini-3.5-flash-lite',
            'gemini-3.1-flash-lite',
            'gemini-flash-latest',
            'gemini-3.8-flash'
        ];
        let chosen = null;
        for (const candidateId of priorityList) {
            chosen = availableAccountModels.find(m => m.id === candidateId);
            if (chosen) break;
        }
        if (!chosen) {
            chosen = availableAccountModels.find(m => m.id.toLowerCase().includes('flash-lite')) ||
                     availableAccountModels.find(m => m.id.toLowerCase().includes('flash')) ||
                     availableAccountModels[0];
        }
        activeGeminiModel = chosen.id;
        activeApiVersion = chosen.version;
    } else {
        activeGeminiModel = 'gemini-flash-lite-latest';
        activeApiVersion = 'v1beta';
    }

    localStorage.setItem('dhub_gemini_model', activeGeminiModel);
    localStorage.setItem('dhub_gemini_version', activeApiVersion);

    updateApiStatusBadge();
    return { model: activeGeminiModel, version: activeApiVersion };
}

function updateApiStatusBadge() {
    const pill = document.getElementById('aiStatusPill');
    const label = document.getElementById('aiStatusText');
    if (!pill || !label) return;

    if (storedApiKey) {
        pill.classList.add('is-active-ai');
        label.textContent = 'Diagnóstico en Línea';
    } else {
        pill.classList.remove('is-active-ai');
        label.textContent = 'Diagnóstico en Línea';
    }
}

function showApiAlert(msg) {
    const banner = document.getElementById('apiAlertBanner');
    const label = document.getElementById('apiAlertMsg');
    if (banner && label) {
        label.textContent = msg;
        banner.classList.add('is-active');
    }
}

function closeApiAlert() {
    const banner = document.getElementById('apiAlertBanner');
    if (banner) banner.classList.remove('is-active');
}

/* Extractor Seguro de Texto de Candidates */
function extractCandidateText(candidate) {
    if (!candidate || !candidate.content || !candidate.content.parts) return "";
    const nonThoughtParts = candidate.content.parts.filter(p => !p.thought && p.text);
    if (nonThoughtParts.length > 0) {
        return nonThoughtParts.map(p => p.text).join('\n').trim();
    }
    return candidate.content.parts.map(p => p.text || '').join('\n').trim();
}

/* Renderizador de Markdown a HTML Limpio y Elegante */
function renderMarkdown(text) {
    if (!text) return "";
    let html = text.trim();

    // Escapar entidades básicas manteniendo seguridad
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Negritas: **texto** o __texto__
    html = html.replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__([\s\S]*?)__/g, "<strong>$1</strong>");

    // Cursivas: *texto* o _texto_
    html = html.replace(/(^|[^\*])\*([^\*\n]+)\*([^\*]|$)/g, "$1<em>$2</em>$3");
    html = html.replace(/(^|[^_])_([^_\n]+)_([^_]|$)/g, "$1<em>$2</em>$3");

    // Listas numeradas y con viñetas
    html = html.replace(/^\s*[-•*]\s+(.+)$/gm, "<li>$1</li>");
    html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, "<li><strong>$1.</strong> $2</li>");

    // Agrupar <li> consecutivos en <ul>
    html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, "<ul style='margin: 0.5rem 0 0.8rem 1.4rem; padding-left: 0; line-height: 1.6;'>$1</ul>");

    // Párrafos: separación por doble salto de línea
    const paras = html.split(/\n\s*\n/);
    return paras.map(p => {
        const clean = p.trim();
        if (!clean) return "";
        if (clean.startsWith('<ul')) return clean;
        return `<p style="margin-bottom: 0.75rem; line-height: 1.6;">${clean.replace(/\n/g, "<br>")}</p>`;
    }).join("");
}

/* ==========================================================================
   5. PASO 0: CAPTURA DE LEAD (NOMBRE, EMAIL, TELÉFONO)
   ========================================================================== */
function startLeadIntakeStep() {
    currentInterviewTurn = 0;
    chatMessagesHistory = [];
    leadData = { name: '', email: '', phone: '' };
    generatedRoadmapData = null;
    initNewSessionTracking();

    const chatArea = document.getElementById('chatMessagesArea');
    if (!chatArea) return;
    chatArea.innerHTML = '';
    document.getElementById('chatInputBarArea').style.display = 'none';

    const lang = getCurrentSiteLang();
    const i18n = ROADMAP_I18N[lang] || ROADMAP_I18N.es;

    // Actualizar progreso
    document.getElementById('chatProgressLabel').textContent = i18n.step0_label;
    document.getElementById('chatProgressBar').style.width = '15%';

    // Mensaje de bienvenida inicial con formulario integrado
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bubble-consultant';
    bubble.innerHTML = `
        <div class="bubble-avatar">
            <img src="${getAssetPath('destination-hub-isotipo-c.svg')}" alt="D Hub">
        </div>
        <div class="bubble-consultant-content">
            <p>${i18n.welcome_p1}</p>
            <p>${i18n.welcome_p2}</p>
            
            <form class="lead-form-card" onsubmit="handleLeadSubmit(event)">
                <div class="lead-input-row">
                    <label class="lead-label" for="leadName">${i18n.lbl_name}</label>
                    <input type="text" id="leadName" class="lead-field" placeholder="${i18n.ph_name}" required>
                </div>
                <div class="lead-input-row">
                    <label class="lead-label" for="leadEmail">${i18n.lbl_email}</label>
                    <input type="email" id="leadEmail" class="lead-field" placeholder="${i18n.ph_email}" required>
                </div>
                <div class="lead-input-row">
                    <label class="lead-label" for="leadPhone">${i18n.lbl_phone}</label>
                    <input type="tel" id="leadPhone" class="lead-field" placeholder="${i18n.ph_phone}" required>
                </div>
                <button type="submit" class="lead-submit-btn">
                    <span>${i18n.btn_submit_lead}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </form>
        </div>
    `;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
}

/* Procesar Lead Form */
async function handleLeadSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('leadName').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();

    if (!name || !email || !phone) return;

    leadData = { name, email, phone };
    if (!currentSessionId) initNewSessionTracking();

    // Checkpoint 0: Registrar datos de contacto inmediatamente en Google Sheets
    syncRoadmapToSheets('0/5 - Contacto registrado');

    const lang = getCurrentSiteLang();
    const i18n = ROADMAP_I18N[lang] || ROADMAP_I18N.es;

    // Renderizar confirmación del usuario en el chat
    const chatArea = document.getElementById('chatMessagesArea');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble bubble-user';
    userBubble.innerHTML = `<strong>${name}</strong><br><span style="font-size:0.85rem;opacity:0.9;">${email} · ${phone}</span>`;
    chatArea.appendChild(userBubble);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Habilitar barra de texto para las siguientes preguntas
    document.getElementById('chatInputBarArea').style.display = 'block';

    // Iniciar Turno 1
    currentInterviewTurn = 1;
    document.getElementById('chatProgressLabel').textContent = i18n.step1_label;
    document.getElementById('chatProgressBar').style.width = '30%';

    const promptForTurn1 = `El usuario se llama "${leadData.name}". Salúdalo de forma cálida y profesional por su nombre desde Destination Hub en una sola frase breve, y pregúntale directamente cuál es el nombre de su proyecto u organización, en qué localización geográfica exacta se encuentra (o planea estar) y cuál es la vocación o concepto principal de la propuesta (ej. lodge, glamping, DMC, parque, etc.). Mantén la respuesta muy concisa y ejecutiva (máximo 2 párrafos cortos, directo al punto).

[IDIOMA OBLIGATORIO]: El usuario está interactuando en ${i18n.lang_name}. Toda tu respuesta DEBE ser formulada enteramente en ${i18n.lang_name}.`;

    await generateNextConsultantTurn(promptForTurn1);
}

/* ==========================================================================
   6. GENERADOR DINÁMICO DE PREGUNTAS (ROBUSTO CON FINALLY GARANTIZADO)
   ========================================================================== */
async function generateNextConsultantTurn(promptInstruction) {
    const lang = getCurrentSiteLang();
    const i18n = ROADMAP_I18N[lang] || ROADMAP_I18N.es;

    const thinking = document.getElementById('chatThinkingBubble');
    document.getElementById('thinkingLabelText').textContent = i18n.thinking_text;
    thinking.classList.add('is-active');

    const chatArea = document.getElementById('chatMessagesArea');
    chatArea.scrollTop = chatArea.scrollHeight;

    let consultantReply = '';

    try {
        if (storedApiKey) {
            try {
                consultantReply = await callGeminiTurn(promptInstruction);
            } catch (err) {
                console.warn('Servicio online no disponible o con restricción:', err.message);
                consultantReply = generateLocalTurnFallback(currentInterviewTurn);
            }
        } else {
            consultantReply = generateLocalTurnFallback(currentInterviewTurn);
        }

        // Registrar en historial
        chatMessagesHistory.push({ role: 'model', text: consultantReply });

        // Checkpoint P(N): Guardar la pregunta formulada por el sistema en Google Sheets
        if (currentInterviewTurn >= 1 && currentInterviewTurn <= MAX_INTERVIEW_TURNS) {
            sessionTurnsData[currentInterviewTurn].question = consultantReply;
            syncRoadmapToSheets(`En Pregunta ${currentInterviewTurn}/5 (Esperando respuesta)`);
        }

        // Mostrar burbuja del consultor formateada
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bubble-consultant';
        bubble.innerHTML = `
            <div class="bubble-avatar">
                <img src="${getAssetPath('destination-hub-isotipo-c.svg')}" alt="D Hub">
            </div>
            <div class="bubble-consultant-content">
                ${renderMarkdown(consultantReply)}
            </div>
        `;
        chatArea.appendChild(bubble);
        chatArea.scrollTop = chatArea.scrollHeight;

        document.getElementById('chatInputText').focus();
    } catch (fatalErr) {
        console.error('Error procesando respuesta del consultor:', fatalErr);
    } finally {
        thinking.classList.remove('is-active');
    }
}

/* Llamada directa a la API (Alternancia estricta user -> model -> user) */
async function callGeminiTurn(specificInstruction) {
    if (!activeGeminiModel) {
        await discoverWorkingGeminiModel(storedApiKey);
    }

    const conversationContents = [];
    const baseIntro = `${DHUB_SYSTEM_PROMPT}\n\n[DATOS DEL SOLICITANTE]: Nombre: ${leadData.name}, Email: ${leadData.email}, Tel: ${leadData.phone}`;

    if (chatMessagesHistory.length === 0) {
        conversationContents.push({
            role: 'user',
            parts: [{ text: `${baseIntro}\n\n[INSTRUCCIÓN]: ${specificInstruction}` }]
        });
    } else {
        conversationContents.push({
            role: 'user',
            parts: [{ text: `${baseIntro}\n\nPor favor inicia la consulta estratégica para este solicitante.` }]
        });

        for (let i = 0; i < chatMessagesHistory.length - 1; i++) {
            const msg = chatMessagesHistory[i];
            conversationContents.push({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            });
        }

        const lastMsg = chatMessagesHistory[chatMessagesHistory.length - 1];
        conversationContents.push({
            role: 'user',
            parts: [{ text: `${lastMsg.text}\n\n[INSTRUCCIÓN ESTRATÉGICA PARA ESTE TURNO]: ${specificInstruction}` }]
        });
    }

    const candidateModels = [
        activeGeminiModel,
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest'
    ].filter(m => m && !m.includes('2.5-flash') && !m.includes('1.5-flash') && !m.includes('2.0-flash'));
    const uniqueModels = [...new Set(candidateModels)];

    let lastErr = null;
    for (const targetModel of uniqueModels) {
        const targetVersion = activeApiVersion || 'v1beta';
        const url = `https://generativelanguage.googleapis.com/${targetVersion}/models/${targetModel}:generateContent?key=${storedApiKey}`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000);

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: conversationContents,
                    generationConfig: {
                        temperature: 0.6,
                        maxOutputTokens: 280
                    }
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                const candidate = data.candidates?.[0];
                const answer = extractCandidateText(candidate);
                if (answer) {
                    activeGeminiModel = targetModel;
                    localStorage.setItem('dhub_gemini_model', targetModel);
                    return answer;
                }
            } else {
                const errJson = await res.json().catch(() => null);
                lastErr = new Error(`Servicio (${res.status}): ${errJson?.error?.message || res.status}`);
            }
        } catch (e) {
            lastErr = e;
        }
    }

    throw lastErr || new Error("No se pudo obtener respuesta del servicio.");
}

/* Fallback local si no hay API Key o falla la conexión */
function generateLocalTurnFallback(turn) {
    const lang = getCurrentSiteLang();
    const name = leadData.name.split(' ')[0] || (lang === 'en' ? 'partner' : lang === 'pt' ? 'parceiro' : 'colega');

    if (lang === 'en') {
        if (turn === 1) {
            return `Hello **${name}**, it is a pleasure to connect from **Destination Hub**.\n\nTo begin our diagnostic: what is the name of your project or organization, where is it located, and what is your primary hospitality or tourism concept?`;
        } else if (turn === 2) {
            return `Understood, **${name}**.\n\nWhat stage of development are you currently in, and what is your single greatest operational or commercial bottleneck? (e.g. rate optimization and seasonality focused on *Yield*, accessing international B2B operators, business plan structuring, or local team training).`;
        } else if (turn === 3) {
            return `Great point, **${name}**. At Destination Hub, we address those challenges by anchoring the experience in territorial identity.\n\nWhich of our 3 regenerative pillars would you like to prioritize or consolidate: *Agroecology / Km 0*, *Living Culture*, or *Pristine Nature / Conservation*?`;
        } else if (turn === 4) {
            return `Very clear, **${name}**.\n\nRegarding co-execution with us, what engagement model suits you best: a turnkey end-to-end partnership, or a focused modular intervention in B2B Sales, Yield & Data Intelligence, or DSO & Sustainability?`;
        } else if (turn === 5) {
            return `Perfect, **${name}**. Before synthesizing your tailored co-execution roadmap with Destination Hub:\n\nIs there any additional detail, target opening timeline, partner dynamic, or key background you would like to include?`;
        }
        return `Thank you for the details, **${name}**. We are structuring your tailored roadmap.`;
    }

    if (lang === 'pt') {
        if (turn === 1) {
            return `Olá **${name}**, é um prazer falar com você a partir da **Destination Hub**.\n\nPara iniciar nosso diagnóstico: qual é o nome do seu projeto ou organização, em qual localização geográfica se encontra e qual é a proposta principal de turismo ou hospitalidade?`;
        } else if (turn === 2) {
            return `Compreendo o contexto, **${name}**.\n\nEm qual etapa de desenvolvimento vocês estão hoje e qual é o principal gargalo ou desafio crítico que enfrentam? (Por exemplo: otimização tarifária e desestacionalização focada em *Yield*, canais B2B internacionais, plano de negócios para investidores ou capacitação de equipe).`;
        } else if (turn === 3) {
            return `Excelente ponto, **${name}**. Na Destination Hub destravamos esses desafios ancorando a proposta na identidade do território.\n\nQual ou quais dos nossos 3 pilares regenerativos você deseja priorizar ou consolidar: *Agroecologia / Km 0*, *Cultura Viva* ou *Natureza Prístina / Conservação*?`;
        } else if (turn === 4) {
            return `Muito claro, **${name}**.\n\nEm relação à co-execução conosco, qual modelo de trabalho prefere: acompanhamento integral chave na mão ou uma intervenção modular específica em Comercialização B2B, Inteligência de Yield & Dados ou Modelo DSO e Sustentabilidade?`;
        } else if (turn === 5) {
            return `Perfeito, **${name}**. Antes de sintetizar seu roteiro personalizado de co-execução com a Destination Hub:\n\nHá algum outro detalhe, prazo previsto de abertura, parceiros ou informação relevante que considere importante adicionar?`;
        }
        return `Obrigado pelos detalhes, **${name}**. Estamos processando seu roteiro personalizado.`;
    }

    // Default Español
    if (turn === 1) {
        return `Hola **${name}**, es un gusto saludarte desde **Destination Hub**.\n\nPara iniciar nuestro diagnóstico: ¿cómo se llama tu proyecto u organización, en qué localización geográfica exacta se encuentra y en qué consiste la propuesta de turismo u hospitalidad?`;
    } else if (turn === 2) {
        return `Comprendo el contexto, **${name}**.\n\n¿En qué etapa de desarrollo se encuentran hoy y cuál es el mayor cuello de botella o desafío crítico que enfrentan? (Por ejemplo: optimizar tarifas y desestacionalizar con foco en *Yield*, falta de canales B2B internacionales, modelo de negocio para inversores o profesionalizar al equipo local).`;
    } else if (turn === 3) {
        return `Excelente punto, **${name}**. En Destination Hub destrabamos esos desafíos anclando la propuesta en la identidad del territorio.\n\n¿Cuál o cuáles de nuestros 3 pilares regenerativos te interesa priorizar o consolidar: *Agroecología / Km 0*, *Cultura Viva* o *Naturaleza Prístina / Conservación*?`;
    } else if (turn === 4) {
        return `Muy claro, **${name}**.\n\nEn cuanto a la co-ejecución con nosotros, ¿qué esquema de trabajo preferís: un acompañamiento integral llave en mano o una intervención modular específica en Comercialización B2B, Inteligencia de Yield & Datos, o Certificación DSO y Sustentabilidad?`;
    } else if (turn === 5) {
        return `Perfecto, **${name}**. Antes de estructurar tu hoja de ruta personalizada de co-ejecución con Destination Hub:\n\n¿Hay algún otro detalle, fecha tentativa de apertura, socios o información clave de tu proyecto que consideres importante sumar?`;
    }
    return `Gracias por los detalles, **${name}**. Estamos procesando tu hoja de ruta personalizada.`;
}

/* ==========================================================================
   7. MANEJO DE ENVÍO DE RESPUESTAS DEL USUARIO
   ========================================================================== */
function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    const counter = document.getElementById('charCounter');
    if (counter) counter.textContent = `${el.value.length} caracteres`;
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserSubmit(e);
    }
}

async function handleUserSubmit(e) {
    if (e) e.preventDefault();
    const textarea = document.getElementById('chatInputText');
    const userText = textarea.value.trim();

    if (!userText) return;

    // Renderizar burbuja del usuario
    const chatArea = document.getElementById('chatMessagesArea');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble bubble-user';
    userBubble.innerHTML = renderMarkdown(userText);
    chatArea.appendChild(userBubble);
    chatArea.scrollTop = chatArea.scrollHeight;

    chatMessagesHistory.push({ role: 'user', text: userText });

    // Checkpoint R(N): Guardar la respuesta del usuario inmediatamente en Google Sheets
    if (currentInterviewTurn >= 1 && currentInterviewTurn <= MAX_INTERVIEW_TURNS) {
        sessionTurnsData[currentInterviewTurn].answer = userText;
        syncRoadmapToSheets(`Completó Respuesta ${currentInterviewTurn}/5`);
    }

    textarea.value = '';
    textarea.style.height = 'auto';
    const counter = document.getElementById('charCounter');
    if (counter) counter.textContent = '0 caracteres';

    currentInterviewTurn++;

    if (currentInterviewTurn <= MAX_INTERVIEW_TURNS) {
        const pct = 15 + (currentInterviewTurn * 15); // Turn 1: 30%, 2: 45%, 3: 60%, 4: 75%, 5: 90%
        document.getElementById('chatProgressBar').style.width = `${Math.min(pct, 95)}%`;

        const lang = getCurrentSiteLang();
        const i18n = ROADMAP_I18N[lang] || ROADMAP_I18N.es;

        if (currentInterviewTurn === 2) {
            document.getElementById('chatProgressLabel').textContent = i18n.step2_label;
            const promptTurn2 = `El usuario respondió sobre su proyecto: "${userText}". En 1 sola oración ejecutiva reconoce su propuesta o territorio, y hazle directamente una pregunta ágil y concreta sobre su estado actual y cuál es su mayor obstáculo crítico o cuello de botella (ej. ocupación fuera de temporada con foco en Yield, falta de canales B2B internacionales, estructuración financiera o profesionalización del equipo). Sé muy conciso (máximo 2 párrafos cortos, directo al punto).

[IDIOMA OBLIGATORIO]: El usuario está interactuando en ${i18n.lang_name}. Toda tu respuesta DEBE ser formulada enteramente en ${i18n.lang_name}.`;
            await generateNextConsultantTurn(promptTurn2);
        } else if (currentInterviewTurn === 3) {
            document.getElementById('chatProgressLabel').textContent = i18n.step3_label;
            const promptTurn3 = `El usuario detalló sus desafíos críticos: "${userText}". En 1 sola frase breve valida el enfoque de co-ejecución ágil de Destination Hub, y pregúntale con precisión cuál o cuáles de los 3 pilares de identidad y regeneración territorial de Destination Hub (Agroecología/Km 0, Cultura Viva local, o Naturaleza Prístina/Conservación) busca priorizar o consolidar en su propuesta. Sé ágil y conciso (máximo 2 párrafos cortos, directo a la pregunta sobre los pilares).

[IDIOMA OBLIGATORIO]: El usuario está interactuando en ${i18n.lang_name}. Toda tu respuesta DEBE ser formulada enteramente en ${i18n.lang_name}.`;
            await generateNextConsultantTurn(promptTurn3);
        } else if (currentInterviewTurn === 4) {
            document.getElementById('chatProgressLabel').textContent = i18n.step4_label;
            const promptTurn4 = `El usuario comentó sobre los pilares regenerativos que desea potenciar: "${userText}". En 1 sola frase breve reconoce su valor, y pregúntale directamente cuál es el modelo de trabajo o co-operación que mejor se adapta a su proyecto con Destination Hub: un acompañamiento integral de co-ejecución llave en mano, o una intervención modular focalizada (Comercialización B2B, Inteligencia de Yield & Datos, o Certificación DSO y Sustentabilidad). Sé muy conciso (máximo 2 párrafos cortos).

[IDIOMA OBLIGATORIO]: El usuario está interactuando en ${i18n.lang_name}. Toda tu respuesta DEBE ser formulada enteramente en ${i18n.lang_name}.`;
            await generateNextConsultantTurn(promptTurn4);
        } else if (currentInterviewTurn === 5) {
            document.getElementById('chatProgressLabel').textContent = i18n.step5_label;
            const promptTurn5 = `El usuario detalló su esquema o modalidad de trabajo preferida: "${userText}". Reconoce su respuesta en una sola frase breve y ejecutiva, y formula la PREGUNTA FINAL antes de estructurar la hoja de ruta: consulta de manera directa y cálida si hay algún otro detalle, expectativa particular, timing de apertura, socios o información relevante sobre el proyecto que desee agregar. Sé muy conciso (máximo 2 párrafos cortos).

[IDIOMA OBLIGATORIO]: El usuario está interactuando en ${i18n.lang_name}. Toda tu respuesta DEBE ser formulada enteramente en ${i18n.lang_name}.`;
            await generateNextConsultantTurn(promptTurn5);
        }
    } else {
        triggerFinalRoadmapGeneration();
    }
}

/* ==========================================================================
   8. GENERACIÓN DE LA HOJA DE RUTA FINAL
   ========================================================================== */
async function triggerFinalRoadmapGeneration() {
    document.getElementById('chatViewContainer').style.display = 'none';
    const analyzingScreen = document.getElementById('analyzingScreen');
    analyzingScreen.classList.add('is-active');

    if (storedApiKey) {
        document.getElementById('analyzingBadge').textContent = 'Estructurando la hoja de ruta de co-ejecución y plan de trabajo...';
        try {
            generatedRoadmapData = await callGeminiForFinalRoadmapJson();
        } catch (err) {
            console.error('Error generando roadmap estructurado:', err);
            showApiAlert(`No se pudo estructurar con el servicio en línea (${err.message}). Utilizando síntesis del motor local.`);
            generatedRoadmapData = generateLocalRoadmapData();
        }
    } else {
        document.getElementById('analyzingBadge').textContent = 'Estructurando tareas y flujograma mediante el motor local de D Hub...';
        await new Promise(r => setTimeout(r, 1600));
        generatedRoadmapData = generateLocalRoadmapData();
    }

    analyzingScreen.classList.remove('is-active');
    renderFinalRoadmapView(generatedRoadmapData);
}

/* Llamada para estructurar el Roadmap en JSON */
async function callGeminiForFinalRoadmapJson() {
    const lang = getCurrentSiteLang();
    const i18n = ROADMAP_I18N[lang] || ROADMAP_I18N.es;
    const dialogueTranscript = chatMessagesHistory.map(m => `${m.role === 'model' ? 'D Hub' : leadData.name}: ${m.text}`).join('\n\n');

    const jsonPrompt = `
${DHUB_SYSTEM_PROMPT}

A continuación tienes la transcripción completa de la consulta diagnóstica realizada con ${leadData.name} (${leadData.email}, ${leadData.phone}):

---
${dialogueTranscript}
---

Tu tarea es generar un análisis estratégico final y la hoja de ruta de co-ejecución para este proyecto específico.
[IDIOMA OBLIGATORIO]: TODOS los campos del JSON ("projectName", "dhubRole", "territorialDiagnosis", "title", "desc", "tasks", "deliverableTitle", "deliverables", "kpi") DEBEN redactarse obligatoriamente en idioma ${i18n.lang_name}.

DEBES devolver OBLIGATORIAMENTE un JSON válido (sin texto adicional fuera del JSON) con esta estructura exacta:

{
  "projectName": "Nombre del proyecto detectado (o inventado con base en la conversación)",
  "dhubRole": "Explicación detallada de 3 o 4 líneas sobre cómo Destination Hub actuará como brazo co-ejecutor extendido del cliente para resolver sus cuellos de botella específicos, indicando qué áreas de práctica (Datos/Yield, B2B, DSO) liderarán el trabajo.",
  "territorialDiagnosis": "Un análisis ejecutivo de 3 a 4 líneas que evalúe el potencial del proyecto bajo el enfoque de Yield (valor sobre volumen) y el modelo DSO de Destination Hub, destacando las ventajas competitivas.",
  "flowNodes": [
    {
      "step": "01 / PERFIL & TERRITORIO",
      "title": "Título corto",
      "desc": "Descripción resumida de la propuesta y territorio",
      "color": "lenga"
    },
    {
      "step": "02 / MODELO DE VALOR (YIELD)",
      "title": "Título corto",
      "desc": "Estrategia frente a cuellos de botella y público objetivo",
      "color": "glaciar"
    },
    {
      "step": "03 / PILARES REGENERATIVOS",
      "title": "Pilares Territoriales",
      "desc": "Anclaje en Agroecología, Cultura viva o Naturaleza",
      "color": "coiron"
    },
    {
      "step": "04 / MODELO DE CO-EJECUCIÓN",
      "title": "Alianza con Destination Hub",
      "desc": "Modalidad de trabajo conjunto y foco de activación B2B",
      "color": "terracota"
    }
  ],
  "phases": [
    {
      "phase": "FASE 01",
      "timeline": "Semanas 1 a 4",
      "title": "Inteligencia Territorial & Diagnóstico de Yield",
      "tasks": [
        "Tarea específica con D Hub 1 personalizada para este proyecto",
        "Tarea específica con D Hub 2 personalizada para este proyecto",
        "Tarea específica con D Hub 3 personalizada para este proyecto"
      ],
      "deliverableTitle": "Entregables Clave",
      "deliverables": "Entregables tangibles para esta fase",
      "kpi": "Métrica de éxito / KPI de la fase"
    },
    {
      "phase": "FASE 02",
      "timeline": "Semanas 5 a 8",
      "title": "Arquitectura de Producto & Yield Management",
      "tasks": [
        "Tarea específica con D Hub 1 personalizada para este proyecto",
        "Tarea específica con D Hub 2 personalizada para este proyecto",
        "Tarea específica con D Hub 3 personalizada para este proyecto"
      ],
      "deliverableTitle": "Entregables Clave",
      "deliverables": "Entregables tangibles para esta fase",
      "kpi": "Métrica de éxito / KPI de la fase"
    },
    {
      "phase": "FASE 03",
      "timeline": "Semanas 9 a 16",
      "title": "Activación Comercial B2B & Go-to-Market",
      "tasks": [
        "Tarea específica con D Hub 1 personalizada para este proyecto",
        "Tarea específica con D Hub 2 personalizada para este proyecto",
        "Tarea específica con D Hub 3 personalizada para este proyecto"
      ],
      "deliverableTitle": "Entregables Clave",
      "deliverables": "Entregables tangibles para esta fase",
      "kpi": "Métrica de éxito / KPI de la fase"
    },
    {
      "phase": "FASE 04",
      "timeline": "Meses 4 a 12 (Continuo)",
      "title": "Gobernanza DSO, Certificación & Escala",
      "tasks": [
        "Tarea específica con D Hub 1 personalizada para este proyecto",
        "Tarea específica con D Hub 2 personalizada para este proyecto",
        "Tarea específica con D Hub 3 personalizada para este proyecto"
      ],
      "deliverableTitle": "Entregables Clave",
      "deliverables": "Entregables tangibles para esta fase",
      "kpi": "Métrica de éxito / KPI de la fase"
    }
  ]
}
`;

    const candidateModels = [
        activeGeminiModel,
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest'
    ].filter(m => m && !m.includes('2.5-flash') && !m.includes('1.5-flash') && !m.includes('2.0-flash'));
    const uniqueModels = [...new Set(candidateModels)];

    let lastErr = null;
    for (const targetModel of uniqueModels) {
        const targetVersion = activeApiVersion || 'v1beta';
        const url = `https://generativelanguage.googleapis.com/${targetVersion}/models/${targetModel}:generateContent?key=${storedApiKey}`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: jsonPrompt }] }],
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 3500,
                        responseMimeType: "application/json"
                    }
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                const candidate = data.candidates?.[0];
                const rawText = extractCandidateText(candidate);
                const parsed = cleanAndParseJson(rawText);
                activeGeminiModel = targetModel;
                localStorage.setItem('dhub_gemini_model', targetModel);
                return parsed;
            } else {
                const errJson = await res.json().catch(() => null);
                lastErr = new Error(`Servicio (${res.status}): ${errJson?.error?.message || res.status}`);
            }
        } catch (e) {
            lastErr = e;
        }
    }

    throw lastErr || new Error("No se pudo estructurar el JSON con el servicio.");
}

function cleanAndParseJson(rawText) {
    if (!rawText) throw new Error("Respuesta vacía recibida del motor generativo.");
    let cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleaned);
}

/* Generador local de reserva */
function generateLocalRoadmapData() {
    const userAnswers = chatMessagesHistory.filter(m => m.role === 'user').map(m => m.text);
    const ans1 = userAnswers[0] || 'Proyecto Turístico';
    const ans2 = userAnswers[1] || 'Optimización de tarifas y canales B2B';
    const ans3 = userAnswers[2] || 'Pilares de Agroecología, Cultura viva y Conservación';
    const ans4 = userAnswers[3] || 'Acompañamiento y co-ejecución estratégica con D Hub';
    const ans5 = userAnswers[4] || 'Lanzamiento planificado con foco en alto valor';

    const projectName = ans1.length > 35 ? ans1.substring(0, 35) + '...' : ans1;

    return {
        projectName: projectName,
        dhubRole: `Destination Hub actuará como socio estratégico y brazo co-ejecutor del equipo de ${leadData.name}. Implementaremos la Práctica 01 (Inteligencia de Datos & Yield) para reestructurar tarifas y demanda frente al desafío identificado ("${ans2}"), articulando con la Práctica 02 (Representación B2B) y la Práctica 03 (Modelo DSO) bajo el modelo de co-operación seleccionado ("${ans4}"), anclando el valor diferencial en ${ans3}.`,
        territorialDiagnosis: `La propuesta de ${projectName} posee un claro potencial de diferenciación para captar al "Participante con Propósito": viajeros que buscan exclusividad y desconexión auténtica. Al superar los cuellos de botella mediante una gestión activa de Yield y desestacionalización, el proyecto puede elevar sus márgenes sin depender de la masividad, beneficiando de forma directa a la comunidad anfitriona y al territorio.`,
        flowNodes: [
            {
                step: "01 / PERFIL & TERRITORIO",
                title: projectName,
                desc: ans1,
                color: "lenga"
            },
            {
                step: "02 / MODELO DE YIELD",
                title: "Participante con Propósito",
                desc: ans2,
                color: "glaciar"
            },
            {
                step: "03 / PILARES REGENERATIVOS",
                title: "Identidad Territorial",
                desc: ans3,
                color: "coiron"
            },
            {
                step: "04 / MODELO CO-EJECUCIÓN",
                title: "Alianza con D Hub",
                desc: ans4,
                color: "terracota"
            }
        ],
        phases: [
            {
                phase: "FASE 01",
                timeline: "Semanas 1 a 4",
                title: "Inteligencia Territorial & Diagnóstico de Yield",
                tasks: [
                    `Benchmarking competitivo territorial adaptado a "${projectName}".`,
                    `Auditoría de precios y modelado de tarifas High-Yield para mercados clave.`,
                    `Mapeo de actores locales y evaluación de capacidad de carga comunitaria.`
                ],
                deliverableTitle: "Entregables Clave",
                deliverables: "Tablero de Inteligencia de Demanda, Perfil de Huésped y Diagnóstico DSO Inicial.",
                kpi: "Definición de tarifa promedio meta (+25% Yield)."
            },
            {
                phase: "FASE 02",
                timeline: "Semanas 5 a 8",
                title: "Arquitectura de Producto & Yield Management",
                tasks: [
                    `Estructuración de experiencias llave en mano basadas en Agroecología y Cultura viva.`,
                    `Diseño del tarifario comercial estratégico y condiciones de estadía mínima.`,
                    `Manual operativo de hospitalidad patagónica para el equipo anfitrión.`
                ],
                deliverableTitle: "Entregables Clave",
                deliverables: "Catálogo de Experiencias Transformadoras y Matriz de Precios B2B.",
                kpi: "Extensión del promedio de estadía a +3 noches."
            },
            {
                phase: "FASE 03",
                timeline: "Semanas 9 a 16",
                title: "Activación Comercial B2B & Go-to-Market",
                tasks: [
                    `Presentación comercial directa ante la red de operadores mayoristas y DMCs de D Hub.`,
                    `Firma de convenios comerciales y carga de producto en canales emisores de alta gama.`,
                    `Campaña editorial de posicionamiento orientada a desestacionalizar.`
                ],
                deliverableTitle: "Entregables Clave",
                deliverables: "Red B2B Activa, Contratos Mayoristas y Material Editorial para el Trade.",
                kpi: "Primeras reservas confirmadas para temporada baja/media."
            },
            {
                phase: "FASE 04",
                timeline: "Meses 4 a 12 (Continuo)",
                title: "Gobernanza DSO, Certificación & Escala",
                tasks: [
                    `Capacitación operativa continua: "Contratá la actitud, entrená la habilidad".`,
                    `Monitoreo de indicadores regenerativos: huella ambiental y beneficio comunitario.`,
                    `Auditoría periódica de ROI y optimización continua de márgenes comerciales.`
                ],
                deliverableTitle: "Entregables Clave",
                deliverables: "Reporte Anual DSO, Preparación para Certificación y Tablero Trimestral de ROI.",
                kpi: "Retorno positivo sobre inversión (ROI) y balance regenerativo certificado."
            }
        ]
    };
}

/* ==========================================================================
   9. RENDERIZADO DE RESULTADOS
   ========================================================================== */
function renderFinalRoadmapView(data) {
    const resultsView = document.getElementById('resultsView');
    if (!resultsView) return;
    resultsView.classList.add('is-active');

    // Encabezado
    document.getElementById('resultsLeadTag').textContent = `HOJA DE RUTA ESTRATÉGICA · PARA ${leadData.name.toUpperCase()}`;
    document.getElementById('resultsProjectTitle').textContent = `Hoja de Ruta: ${data.projectName}`;
    document.getElementById('resultsProjectSubtitle').textContent = `Plan de co-ejecución y modelo DSO diseñado para ${data.projectName} junto a Destination Hub.`;

    // Rol de D Hub y Diagnóstico
    document.getElementById('dhubRoleText').textContent = data.dhubRole;
    document.getElementById('aiDiagnosisText').textContent = data.territorialDiagnosis;

    // Flujograma de Nodos
    const nodesContainer = document.getElementById('flowchartNodesContainer');
    nodesContainer.innerHTML = '';
    data.flowNodes.forEach(node => {
        const nodeCard = document.createElement('div');
        nodeCard.className = `flow-node-card border-${node.color}`;
        nodeCard.innerHTML = `
            <span class="flow-node-step">${node.step}</span>
            <div class="flow-node-title">${node.title}</div>
            <div class="flow-node-desc">${node.desc}</div>
        `;
        nodesContainer.appendChild(nodeCard);
    });

    // Grid de 4 Fases
    const phasesGrid = document.getElementById('roadmapPhasesGrid');
    phasesGrid.innerHTML = '';
    data.phases.forEach(p => {
        const card = document.createElement('div');
        card.className = 'roadmap-phase-card';
        card.innerHTML = `
            <div class="phase-header">
                <span class="phase-badge">${p.phase} · ${p.timeline}</span>
                <h4 class="phase-title">${p.title}</h4>
            </div>
            <ul class="phase-tasks-list">
                ${p.tasks.map(t => `<li>${t}</li>`).join('')}
            </ul>
            <div class="phase-deliverables">
                <div class="phase-deliverables-title">${p.deliverableTitle}</div>
                <div class="phase-deliverables-text">${p.deliverables}</div>
                ${p.kpi ? `<div style="margin-top: 6px; font-size: 11px; color: var(--color-terracota); font-family: var(--font-mono);">KPI: ${p.kpi}</div>` : ''}
            </div>
        `;
        phasesGrid.appendChild(card);
    });

    // Configurar enlace dinámico de WhatsApp directo con un Socio Director
    const lang = getCurrentSiteLang();
    const waMessages = {
        es: `Hola equipo de Destination Hub, mi nombre es ${leadData.name}. Acabo de generar la hoja de ruta para mi proyecto "${data.projectName}" y me gustaría conversar directamente con un Socio Director sobre los próximos pasos.`,
        en: `Hello Destination Hub team, my name is ${leadData.name}. I just generated the roadmap for my project "${data.projectName}" and would like to speak directly with a Managing Partner regarding next steps.`,
        pt: `Olá equipe da Destination Hub, meu nome é ${leadData.name}. Acabei de gerar o roteiro para o meu projeto "${data.projectName}" e gostaria de conversar diretamente com um Sócio Diretor sobre os próximos passos.`
    };
    const waText = encodeURIComponent(waMessages[lang] || waMessages.es);
    const waPartnerBtn = document.getElementById('btnWhatsappPartner');
    if (waPartnerBtn) {
        waPartnerBtn.href = `https://wa.me/5492944000000?text=${waText}`;
        waPartnerBtn.onclick = () => {
            syncRoadmapToSheets('100% - Completado (Inició contacto por WhatsApp)');
        };
    }

    // Checkpoint Final 1: Guardar proyecto detectado y síntesis ejecutiva en Google Sheets
    syncRoadmapToSheets('5/5 - Hoja de Ruta generada (Subiendo PDF a Drive)', {
        projectName: data.projectName,
        executiveSummary: `[ROL D HUB]: ${data.dhubRole}\n\n[DIAGNÓSTICO]: ${data.territorialDiagnosis}`
    });

    // Checkpoint Final 2: Generar en segundo plano el mismo PDF descargable y subirlo a Google Drive
    setTimeout(() => {
        generateAndUploadPdfToDrive(data);
    }, 350);
}

function restartChatSession() {
    const results = document.getElementById('resultsView');
    if (results) results.classList.remove('is-active');
    const chat = document.getElementById('chatViewContainer');
    if (chat) chat.style.display = 'flex';
    startLeadIntakeStep();
}

/* ==========================================================================
   10. EXPORTACIÓN A PDF EDITORIAL (SISTEMA DE 2 PÁGINAS A4 SIN CORTES)
   ========================================================================== */
function preparePdfCanvasAndOptions(data) {
    const lang = getCurrentSiteLang();
    const i18n = ROADMAP_I18N[lang] || ROADMAP_I18N.es;
    const localeStr = lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-AR';

    // Página 1: Visión Estratégica, Datos del Lead y Flujograma
    const pTitle = document.getElementById('pdfProjectTitle');
    if (pTitle) pTitle.textContent = `${i18n.pdf_title_prefix} ${data.projectName}`;

    const pStamp = document.getElementById('pdfLeadStamp');
    if (pStamp) pStamp.textContent = `${i18n.pdf_client_label} ${leadData.name.toUpperCase()} | ${i18n.pdf_email_label} ${leadData.email.toUpperCase()} | ${i18n.pdf_tel_label} ${leadData.phone}`;

    const pDate = document.getElementById('pdfDateStamp');
    if (pDate) pDate.textContent = `${i18n.pdf_date_label} ${new Date().toLocaleDateString(localeStr, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}`;
    
    const pRole = document.getElementById('pdfDhubRoleText');
    if (pRole) pRole.textContent = data.dhubRole;

    const pDiag = document.getElementById('pdfDiagnosisText');
    if (pDiag) pDiag.textContent = data.territorialDiagnosis;

    // Renderizar Flujograma en Grid de 4 Nodos Elegantes en Página 1
    const flowContainer = document.getElementById('pdfFlowNodesContainer');
    if (flowContainer && data.flowNodes) {
        flowContainer.innerHTML = data.flowNodes.map(n => `
            <div class="pdf-flow-item border-${n.color || 'lenga'}">
                <span class="pdf-flow-step">${n.step}</span>
                <div class="pdf-flow-title">${n.title}</div>
                <div class="pdf-flow-desc">${n.desc}</div>
            </div>
        `).join('');
    }

    // Página 2: Matriz de 4 Fases y Próximos Pasos
    const pMiniTitle = document.getElementById('pdfProjectMiniTitle');
    if (pMiniTitle) pMiniTitle.textContent = `${data.projectName.toUpperCase()} · DHUB.TRAVEL`;

    const pMatrixTitle = document.getElementById('pdfMatrixTitle');
    if (pMatrixTitle) pMatrixTitle.textContent = i18n.pdf_matrix_title;

    const pMatrixDesc = document.getElementById('pdfMatrixDesc');
    if (pMatrixDesc) pMatrixDesc.textContent = i18n.pdf_matrix_desc;

    const pNextTitle = document.getElementById('pdfNextTitle');
    if (pNextTitle) pNextTitle.textContent = i18n.pdf_next_title;

    const pNextDesc = document.getElementById('pdfNextDesc');
    if (pNextDesc) pNextDesc.textContent = i18n.pdf_next_desc;

    const tableBody = document.getElementById('pdfTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        data.phases.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="width: 24%;">
                    <strong style="color: #C85A32; font-family: 'JetBrains Mono', monospace; font-size: 10px;">${p.phase}</strong><br>
                    <span style="font-size: 8.5px; color: #636B67; font-family: 'JetBrains Mono', monospace;">${p.timeline}</span><br>
                    <strong style="color: #183028; font-size: 10px; display: inline-block; margin-top: 3px;">${p.title}</strong>
                </td>
                <td style="width: 44%;">
                    <ul style="margin: 0; padding-left: 12px; line-height: 1.4; font-size: 9.5px; color: #183028;">
                        ${p.tasks.map(t => `<li style="margin-bottom: 2px;">${t}</li>`).join('')}
                    </ul>
                </td>
                <td style="width: 32%;">
                    <div style="font-size: 8.5px; font-weight: 600; color: #2B5B6C; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 2px;">${p.deliverableTitle}:</div>
                    <div style="font-size: 9px; color: #183028; line-height: 1.35; margin-bottom: 4px;">${p.deliverables}</div>
                    ${p.kpi ? `<div style="font-size: 8.5px; color: #C85A32; font-family: 'JetBrains Mono', monospace; font-weight: 600;">KPI: ${p.kpi}</div>` : ''}
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    const element = document.getElementById('pdf-export-canvas');
    const opt = {
        margin:       [8, 8, 8, 8],
        filename:     `Hoja_de_Ruta_DHub_${data.projectName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 720
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'], before: '.pdf-page-2', avoid: ['tr', '.pdf-avoid-break'] }
    };

    return { element, opt };
}

/**
 * Compila silenciosamente el mismo PDF editorial que se entrega al usuario y lo envía
 * en Base64 a Google Apps Script para alojarlo en Google Drive y vincularlo en Google Sheets.
 */
async function generateAndUploadPdfToDrive(data) {
    if (!data || pdfAlreadySyncedToDrive || !getSheetsWebhookUrl()) return;
    if (typeof html2pdf === 'undefined') return;

    const { element, opt } = preparePdfCanvasAndOptions(data);
    if (!element) return;

    activePdfRenderJobs++;
    element.style.display = 'block';

    try {
        const pdfDataUri = await html2pdf().set(opt).from(element).outputPdf('datauristring');
        if (pdfDataUri) {
            const base64Content = pdfDataUri.includes(',') ? pdfDataUri.split(',')[1] : pdfDataUri;
            pdfAlreadySyncedToDrive = true;
            await syncRoadmapToSheets('100% - Hoja de Ruta y PDF Completados', {
                projectName: data.projectName,
                executiveSummary: `[ROL D HUB]: ${data.dhubRole}\n\n[DIAGNÓSTICO]: ${data.territorialDiagnosis}`,
                pdfBase64: base64Content
            });
        }
    } catch (err) {
        console.warn('No se pudo compilar el PDF en segundo plano para Drive:', err);
    } finally {
        activePdfRenderJobs = Math.max(0, activePdfRenderJobs - 1);
        if (activePdfRenderJobs === 0) {
            element.style.display = 'none';
        }
    }
}

function exportToPDF() {
    if (!generatedRoadmapData) return;

    const data = generatedRoadmapData;
    const { element, opt } = preparePdfCanvasAndOptions(data);
    if (!element) return;

    activePdfRenderJobs++;
    element.style.display = 'block';

    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save().then(() => {
            if (!pdfAlreadySyncedToDrive) {
                generateAndUploadPdfToDrive(data);
            } else {
                syncRoadmapToSheets('100% - Hoja de Ruta y PDF Descargado');
            }
        }).catch(err => {
            console.error('Error al generar PDF:', err);
            window.print();
        }).finally(() => {
            activePdfRenderJobs = Math.max(0, activePdfRenderJobs - 1);
            if (activePdfRenderJobs === 0) {
                element.style.display = 'none';
            }
        });
    } else {
        window.print();
        activePdfRenderJobs = Math.max(0, activePdfRenderJobs - 1);
        if (activePdfRenderJobs === 0) {
            element.style.display = 'none';
        }
    }
}
