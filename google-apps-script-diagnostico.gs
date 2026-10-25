/**
 * ============================================================================
 * DESTINATION HUB (dhub.travel) — BACKEND SERVERLESS EN GOOGLE APPS SCRIPT
 * ============================================================================
 * Registra en tiempo real todas las interacciones del sistema de Diagnóstico y
 * Hoja de Ruta en Google Sheets (incluyendo IP y Ciudad, y abandonos parciales
 * turno a turno) y aloja automáticamente el PDF editorial en Google Drive.
 *
 * INSTRUCCIONES DE ACTUALIZACIÓN EN GOOGLE APPS SCRIPT:
 * 1. Abre tu planilla en Google Sheets > Extensiones > Apps Script.
 * 2. Reemplaza todo el código con esta versión actualizada y guarda (Ctrl+S).
 * 3. Haz clic en "Implementar" > "Gestionar implementaciones" > ícono del lápiz (Editar)
 *    > en "Versión" elige "Nueva versión" > "Implementar"
 *    (o "Implementar" > "Nueva implementación").
 */

const DRIVE_FOLDER_NAME = "Destination Hub - Hojas de Ruta PDF";
const TOTAL_COLUMNS = 22;

/**
 * Inicializa o migra automáticamente los 22 encabezados de la tabla en Google Sheets.
 */
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = [
    "ID Sesión",                  // Col 1  (A) - idx 0
    "Fecha y Hora Inicio",        // Col 2  (B) - idx 1
    "Última Actividad",           // Col 3  (C) - idx 2
    "Nombre",                     // Col 4  (D) - idx 3
    "Email",                      // Col 5  (E) - idx 4
    "Teléfono / WhatsApp",        // Col 6  (F) - idx 5
    "Idioma",                     // Col 7  (G) - idx 6
    "IP y Ciudad",                // Col 8  (H) - idx 7
    "Estado / Progreso",          // Col 9  (I) - idx 8
    "P1 (Sistema) - Perfil",      // Col 10 (J) - idx 9
    "R1 (Usuario) - Perfil",      // Col 11 (K) - idx 10
    "P2 (Sistema) - Desafíos",    // Col 12 (L) - idx 11
    "R2 (Usuario) - Desafíos",    // Col 13 (M) - idx 12
    "P3 (Sistema) - Pilares",     // Col 14 (N) - idx 13
    "R3 (Usuario) - Pilares",     // Col 15 (O) - idx 14
    "P4 (Sistema) - Modelo",      // Col 16 (P) - idx 15
    "R4 (Usuario) - Modelo",      // Col 17 (Q) - idx 16
    "P5 (Sistema) - Cierre",      // Col 18 (R) - idx 17
    "R5 (Usuario) - Cierre",      // Col 19 (S) - idx 18
    "Proyecto Detectado",         // Col 20 (T) - idx 19
    "Diagnóstico Ejecutivo",      // Col 21 (U) - idx 20
    "Link PDF Hoja de Ruta"       // Col 22 (V) - idx 21
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    // Si la hoja tenía el esquema anterior de 21 columnas (donde Col 8 era "Estado / Progreso"),
    // insertar automáticamente la nueva columna 8 para no desalinear las filas ya registradas.
    const currentCol8 = String(sheet.getRange(1, 8).getValue()).trim();
    if (currentCol8 === "Estado / Progreso") {
      sheet.insertColumnBefore(8);
    }
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

    // Inicializar o migrar columna "IP y Ciudad" automáticamente si hace falta
    if (sheet.getLastRow() === 0 || String(sheet.getRange(1, 8).getValue()).trim() === "Estado / Progreso") {
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

    // 2. Obtener valores actuales de la fila o inicializar una nueva de 22 columnas
    let rowValues;
    if (rowIndex === -1) {
      rowValues = new Array(TOTAL_COLUMNS).fill("");
      rowValues[0] = sessionId;
      rowValues[1] = now; // Fecha y Hora Inicio
    } else {
      rowValues = sheet.getRange(rowIndex, 1, 1, TOTAL_COLUMNS).getValues()[0];
    }

    // 3. Actualizar metadatos, contacto e IP/Ciudad (Bloque A: Cols A a I)
    rowValues[2] = now; // Última Actividad
    if (data.lead) {
      if (data.lead.name) rowValues[3] = data.lead.name;
      if (data.lead.email) rowValues[4] = data.lead.email;
      if (data.lead.phone) rowValues[5] = data.lead.phone;
    }
    if (data.lang) {
      rowValues[6] = String(data.lang).toUpperCase();
    }
    if (data.ipLocation) {
      rowValues[7] = data.ipLocation;
    }
    if (data.progress) {
      rowValues[8] = data.progress;
    }

    // 4. Actualizar las 5 Preguntas del Sistema y 5 Respuestas del Usuario (Bloque B: Cols J a S)
    if (data.turns) {
      for (let t = 1; t <= 5; t++) {
        const turnObj = data.turns[t] || data.turns[String(t)];
        if (turnObj) {
          const qIdx = 9 + (t - 1) * 2; // Índices 9, 11, 13, 15, 17 (Cols 10, 12, 14, 16, 18)
          const aIdx = qIdx + 1;        // Índices 10, 12, 14, 16, 18 (Cols 11, 13, 15, 17, 19)
          if (turnObj.question) rowValues[qIdx] = turnObj.question;
          if (turnObj.answer) rowValues[aIdx] = turnObj.answer;
        }
      }
    }

    // Soporte adicional para envío individual por turno
    if (data.turn && data.turn >= 1 && data.turn <= 5) {
      const qIdx = 9 + (data.turn - 1) * 2;
      const aIdx = qIdx + 1;
      if (data.questionText) rowValues[qIdx] = data.questionText;
      if (data.answerText) rowValues[aIdx] = data.answerText;
    }

    // 5. Actualizar Proyecto, Diagnóstico Ejecutivo y Archivo PDF en Drive (Bloque C: Cols T a V)
    if (data.projectName) {
      rowValues[19] = data.projectName;
    }
    if (data.executiveSummary) {
      rowValues[20] = data.executiveSummary;
    }

    let pdfUrl = rowValues[21] || "";
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

      rowValues[21] = pdfUrl;
    }

    // 6. Guardar toda la fila en una sola operación atómica
    if (rowIndex === -1) {
      sheet.appendRow(rowValues);
      rowIndex = sheet.getLastRow();
    } else {
      sheet.getRange(rowIndex, 1, 1, TOTAL_COLUMNS).setValues([rowValues]);
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
