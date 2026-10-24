/**
 * ============================================================================
 * DESTINATION HUB (dhub.travel) — BACKEND SERVERLESS EN GOOGLE APPS SCRIPT
 * ============================================================================
 * Registra en tiempo real todas las interacciones del sistema de Diagnóstico y
 * Hoja de Ruta en Google Sheets (incluyendo abandonos parciales turno a turno)
 * y aloja automáticamente el PDF editorial descargable en Google Drive.
 *
 * INSTRUCCIONES DE INSTALACIÓN (2 MINUTOS):
 * 1. Abre una planilla nueva en Google Sheets (ej. "DHub - Diagnósticos y Leads").
 * 2. En el menú superior ve a: Extensiones > Apps Script.
 * 3. Borra el código que venga por defecto y pega TODO este archivo.
 * 4. En la barra superior, selecciona la función "setupSheet" y haz clic en "Ejecutar"
 *    (otorga los permisos a tu cuenta de Google para Sheets y Drive).
 * 5. Haz clic en el botón azul "Implementar" > "Nueva implementación".
 * 6. En "Selecciona el tipo" elige "Aplicación web":
 *    - Ejecutar como: "Yo" (tu cuenta de administrador)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone)
 * 7. Haz clic en "Implementar", copia la "URL de la aplicación web" (termina en /exec)
 *    y pégala en la constante ROADMAP_SHEETS_WEBHOOK_URL al inicio de roadmap.js.
 */

const DRIVE_FOLDER_NAME = "Destination Hub - Hojas de Ruta PDF";

/**
 * Inicializa los 21 encabezados de la tabla en Google Sheets con formato corporativo.
 */
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = [
    "ID Sesión",                  // Col 1  (A)
    "Fecha y Hora Inicio",        // Col 2  (B)
    "Última Actividad",           // Col 3  (C)
    "Nombre",                     // Col 4  (D)
    "Email",                      // Col 5  (E)
    "Teléfono / WhatsApp",        // Col 6  (F)
    "Idioma",                     // Col 7  (G)
    "Estado / Progreso",          // Col 8  (H)
    "P1 (Sistema) - Perfil",      // Col 9  (I)
    "R1 (Usuario) - Perfil",      // Col 10 (J)
    "P2 (Sistema) - Desafíos",    // Col 11 (K)
    "R2 (Usuario) - Desafíos",    // Col 12 (L)
    "P3 (Sistema) - Pilares",     // Col 13 (M)
    "R3 (Usuario) - Pilares",     // Col 14 (N)
    "P4 (Sistema) - Modelo",      // Col 15 (O)
    "R4 (Usuario) - Modelo",      // Col 16 (P)
    "P5 (Sistema) - Cierre",      // Col 17 (Q)
    "R5 (Usuario) - Cierre",      // Col 18 (R)
    "Proyecto Detectado",         // Col 19 (S)
    "Diagnóstico Ejecutivo",      // Col 20 (T)
    "Link PDF Hoja de Ruta"       // Col 21 (U)
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold").setBackground("#183028").setFontColor("#FFFFFF");
  sheet.setFrozenRows(1);
}

/**
 * Obtiene o crea la carpeta en Google Drive donde se guardan los PDFs.
 */
function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

/**
 * Endpoint HTTP POST que recibe las actualizaciones en tiempo real desde roadmap.js
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000); // Garantiza escritura secuencial sin condiciones de carrera

  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      setupSheet();
    }

    const sessionId = data.sessionId || ("DH-" + new Date().getTime());
    const now = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

    // 1. Buscar si la sesión ya tiene una fila creada en la planilla
    const lastRow = sheet.getLastRow();
    let rowIndex = -1;

    if (lastRow > 1) {
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (ids[i][0] === sessionId) {
          rowIndex = i + 2; // Índice base 1 (compensando encabezado)
          break;
        }
      }
    }

    // 2. Obtener valores actuales de la fila o inicializar una nueva de 21 columnas
    let rowValues;
    if (rowIndex === -1) {
      rowValues = new Array(21).fill("");
      rowValues[0] = sessionId;
      rowValues[1] = now; // Fecha y Hora Inicio
    } else {
      rowValues = sheet.getRange(rowIndex, 1, 1, 21).getValues()[0];
    }

    // 3. Actualizar metadatos y datos de contacto (Bloque A)
    rowValues[2] = now; // Última Actividad
    if (data.lead) {
      if (data.lead.name) rowValues[3] = data.lead.name;
      if (data.lead.email) rowValues[4] = data.lead.email;
      if (data.lead.phone) rowValues[5] = data.lead.phone;
    }
    if (data.lang) {
      rowValues[6] = String(data.lang).toUpperCase();
    }
    if (data.progress) {
      rowValues[7] = data.progress;
    }

    // 4. Actualizar las 5 Preguntas del Sistema y 5 Respuestas del Usuario (Bloque B: Cols I a R)
    if (data.turns) {
      for (let t = 1; t <= 5; t++) {
        const turnObj = data.turns[t] || data.turns[String(t)];
        if (turnObj) {
          const qIdx = 8 + (t - 1) * 2; // Índices 8, 10, 12, 14, 16 (Cols 9, 11, 13, 15, 17)
          const aIdx = qIdx + 1;        // Índices 9, 11, 13, 15, 17 (Cols 10, 12, 14, 16, 18)
          if (turnObj.question) rowValues[qIdx] = turnObj.question;
          if (turnObj.answer) rowValues[aIdx] = turnObj.answer;
        }
      }
    }

    // Soporte adicional para envío individual por turno
    if (data.turn && data.turn >= 1 && data.turn <= 5) {
      const qIdx = 8 + (data.turn - 1) * 2;
      const aIdx = qIdx + 1;
      if (data.questionText) rowValues[qIdx] = data.questionText;
      if (data.answerText) rowValues[aIdx] = data.answerText;
    }

    // 5. Actualizar Proyecto, Diagnóstico Ejecutivo y Archivo PDF en Drive (Bloque C: Cols S a U)
    if (data.projectName) {
      rowValues[18] = data.projectName;
    }
    if (data.executiveSummary) {
      rowValues[19] = data.executiveSummary;
    }

    let pdfUrl = rowValues[20] || "";
    if (data.pdfBase64) {
      const folder = getOrCreateFolder();
      const safeProject = (data.projectName || "Proyecto").replace(/[^a-zA-Z0-9_-]/g, "_");
      const safeLead = (data.lead && data.lead.name ? data.lead.name : "Solicitante").replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `Hoja_de_Ruta_DHub_${safeProject}_${safeLead}.pdf`;

      const pdfBytes = Utilities.base64Decode(data.pdfBase64);
      const pdfBlob = Utilities.newBlob(pdfBytes, MimeType.PDF, fileName);
      const pdfFile = folder.createFile(pdfBlob);
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      pdfUrl = pdfFile.getUrl();

      rowValues[20] = pdfUrl;
    }

    // 6. Guardar toda la fila en una sola operación atómica
    if (rowIndex === -1) {
      sheet.appendRow(rowValues);
      rowIndex = sheet.getLastRow();
    } else {
      sheet.getRange(rowIndex, 1, 1, 21).setValues([rowValues]);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      sessionId: sessionId,
      rowIndex: rowIndex,
      pdfUrl: pdfUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
