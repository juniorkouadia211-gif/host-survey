/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ISurveyRepository, SurveyResponse } from '../../types';
import { LocalStorageSurveyRepository } from '../LocalStorageSurveyRepository';
import { findStudyById } from '../../data';

/**
 * ============================================================================
 * GOOGLE APPS SCRIPT WEB APP - CODE SOURCE RECOMMANDÉ (V5 - DYNAMIC COLS & TABS)
 * ============================================================================
 * 
 * Copiez le code ci-dessous dans l'éditeur de scripts Google (Apps Script) lié 
 * à votre feuille de calcul, puis déployez-le en tant qu'application Web
 * accessible par "Tout le monde" (Anyone).
 * 
 * ```javascript
 * var MAX_ROWS_PER_SHEET = 500000;
 * 
 * // Route de test GET immédiate
 * function doGet() {
 *   return ContentService
 *     .createTextOutput("HOST Survey API OK - doGet est actif")
 *     .setMimeType(ContentService.MimeType.TEXT);
 * }
 * 
 * // Support CORS complet pour pré-vols et requêtes
 * function doOptions(e) {
 *   return ContentService
 *     .createTextOutput("")
 *     .setMimeType(ContentService.MimeType.TEXT);
 * }
 * 
 * // Réception et traitement sécurisé des soumissions
 * function doPost(e) {
 *   try {
 *     var rawData = e.postData.contents;
 *     if (!rawData) {
 *       return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Payload vide" }))
 *                            .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     
 *     var payload = JSON.parse(rawData);
 *     var responsesPayload = payload.responsesPayload;
 *     var analyticsPayload = payload.analyticsPayload;
 *     var studyId = payload.studyId || "";
 *     
 *     if (!responsesPayload || !analyticsPayload) {
 *       return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Structure de payload invalide" }))
 *                            .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     
 *     // Extraction du suffixe d'étude (ex: "001" depuis "understudents-ci-001")
 *     var suffix = "001";
 *     if (studyId) {
 *       var parts = studyId.split("-");
 *       if (parts.length > 0) {
 *         suffix = parts[parts.length - 1];
 *       }
 *     }
 *     
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     
 *     // 1. Enregistrement des réponses (RESPONSES)
 *     var baseHeaders = ["submissionId", "studyId", "studyVersion", "startedAt", "completedAt", "tempsTotal"];
 *     var questionKeys = Object.keys(responsesPayload.answersByQuestion || {});
 *     var responsesHeaders = baseHeaders.concat(questionKeys);
 *     
 *     var responsesRow = [];
 *     baseHeaders.forEach(function(h) {
 *       responsesRow.push(responsesPayload[h] !== undefined ? responsesPayload[h] : "");
 *     });
 *     questionKeys.forEach(function(key) {
 *       responsesRow.push(responsesPayload.answersByQuestion[key] !== undefined ? responsesPayload.answersByQuestion[key] : "");
 *     });
 *     
 *     var responsesSheetName = "HOST_RESPONSES_" + suffix;
 *     var responsesSheet = getOrCreateTargetSheet(ss, responsesSheetName, responsesHeaders);
 *     appendOrUpdateDynamicRow(responsesSheet, responsesHeaders, responsesRow);
 *     
 *     // 2. Enregistrement des données comportementales (ANALYTICS)
 *     var analyticsHeaders = [
 *       "submissionId", 
 *       "studyId", 
 *       "studyVersion", 
 *       "tempsPasseParQuestion (JSON)", 
 *       "questionLaPlusLongue", 
 *       "questionsVisitees (JSON)", 
 *       "progressionFinale (%)", 
 *       "moduleAbandon", 
 *       "questionAbandon", 
 *       "statutCompletion", 
 *       "environment", 
 *       "createdAt"
 *     ];
 *     
 *     var analyticsRow = [
 *       analyticsPayload.submissionId || "",
 *       analyticsPayload.studyId || "",
 *       analyticsPayload.studyVersion || "",
 *       analyticsPayload["tempsPasseParQuestion (JSON)"] || "",
 *       analyticsPayload.questionLaPlusLongue || "",
 *       analyticsPayload["questionsVisitees (JSON)"] || "",
 *       analyticsPayload["progressionFinale (%)"] || "",
 *       analyticsPayload.moduleAbandon || "",
 *       analyticsPayload.questionAbandon || "",
 *       analyticsPayload.statutCompletion || "",
 *       analyticsPayload.environment || "",
 *       analyticsPayload.createdAt || ""
 *     ];
 *     
 *     var analyticsSheetName = "HOST_ANALYTICS_" + suffix;
 *     var analyticsSheet = getOrCreateTargetSheet(ss, analyticsSheetName, analyticsHeaders);
 *     appendOrUpdateDynamicRow(analyticsSheet, analyticsHeaders, analyticsRow);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({ 
 *       status: "success", 
 *       submissionId: payload.submissionId,
 *       responsesSheet: responsesSheet.getName(),
 *       analyticsSheet: analyticsSheet.getName()
 *     })).setMimeType(ContentService.MimeType.JSON);
 *     
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
 *                          .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * 
 * function getOrCreateTargetSheet(ss, sheetName, headers) {
 *   var sheet = ss.getSheetByName(sheetName);
 *   
 *   if (!sheet) {
 *     sheet = ss.insertSheet(sheetName);
 *     sheet.appendRow(headers);
 *     sheet.getRange(1, 1, 1, headers.length)
 *          .setBackground("#059669")
 *          .setFontColor("#ffffff")
 *          .setFontWeight("bold");
 *     sheet.setFrozenRows(1);
 *   }
 *   
 *   return sheet;
 * }
 * 
 * function appendOrUpdateDynamicRow(sheet, incomingHeaders, incomingRow) {
 *   var lastRow = sheet.getLastRow();
 *   var lastCol = sheet.getLastColumn();
 *   
 *   var existingHeaders = [];
 *   if (lastRow > 0 && lastCol > 0) {
 *     existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
 *     for (var i = 0; i < existingHeaders.length; i++) {
 *       existingHeaders[i] = existingHeaders[i] ? existingHeaders[i].toString().trim() : "";
 *     }
 *   }
 *   
 *   if (existingHeaders.length === 0) {
 *     existingHeaders = incomingHeaders.slice();
 *     sheet.appendRow(existingHeaders);
 *     sheet.getRange(1, 1, 1, existingHeaders.length)
 *          .setBackground("#059669")
 *          .setFontColor("#ffffff")
 *          .setFontWeight("bold");
 *     sheet.setFrozenRows(1);
 *     lastRow = 1;
 *     lastCol = existingHeaders.length;
 *   }
 *   
 *   var updated = false;
 *   for (var j = 0; j < incomingHeaders.length; j++) {
 *     var incomingHeader = incomingHeaders[j].toString().trim();
 *     if (existingHeaders.indexOf(incomingHeader) === -1) {
 *       var newColIndex = lastCol + 1;
 *       sheet.getRange(1, newColIndex).setValue(incomingHeader);
 *       sheet.getRange(1, newColIndex)
 *            .setBackground("#059669")
 *            .setFontColor("#ffffff")
 *            .setFontWeight("bold");
 *       existingHeaders.push(incomingHeader);
 *       lastCol = newColIndex;
 *       updated = true;
 *     }
 *   }
 *   
 *   var finalRow = [];
 *   for (var k = 0; k < existingHeaders.length; k++) {
 *     var header = existingHeaders[k];
 *     var incomingIndex = incomingHeaders.indexOf(header);
 *     if (incomingIndex !== -1) {
 *       finalRow.push(incomingRow[incomingIndex] !== undefined ? incomingRow[incomingIndex] : "");
 *     } else {
 *       finalRow.push("");
 *     }
 *   }
 *   
 *   var submissionIdIndex = existingHeaders.indexOf("submissionId");
 *   var submissionIdValue = "";
 *   var incomingSubIdIndex = incomingHeaders.indexOf("submissionId");
 *   if (incomingSubIdIndex !== -1) {
 *     submissionIdValue = incomingRow[incomingSubIdIndex];
 *   }
 *   
 *   var foundRowIndex = -1;
 *   if (submissionIdIndex !== -1 && lastRow > 1 && submissionIdValue) {
 *     var rangeValues = sheet.getRange(2, submissionIdIndex + 1, lastRow - 1, 1).getValues();
 *     for (var r = 0; r < rangeValues.length; r++) {
 *       if (rangeValues[r][0] == submissionIdValue) {
 *         foundRowIndex = r + 2;
 *         break;
 *       }
 *     }
 *   }
 *   
 *   if (foundRowIndex !== -1) {
 *     sheet.getRange(foundRowIndex, 1, 1, existingHeaders.length).setValues([finalRow]);
 *   } else {
 *     sheet.appendRow(finalRow);
 *   }
 * }
 * ```
 */

const QUESTION_ALIASES: Record<string, string> = {
  q1_institution: 'Université',
  q2_transport: 'Moyen de transport',
  q3_budget: 'Budget mensuel',
  q4_challenges: 'Difficultés au quotidien',
  q5_internet: 'Accès Internet principal',
  q6_income_source: 'Activité rémunérée parallèle',
  q7_app_idea: 'Idée de l\'application de rêve',
};

export class GoogleSheetsRepository implements ISurveyRepository {
  private localBackup: LocalStorageSurveyRepository;

  private get webappUrl(): string {
    const customUrl = typeof window !== 'undefined' ? localStorage.getItem('host_survey_custom_sheets_url') : null;
    if (customUrl) return customUrl.trim().replace(/^['"]|['"]$/g, '');
    const url = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL || '';
    return url.trim().replace(/^['"]|['"]$/g, '');
  }

  constructor() {
    this.localBackup = new LocalStorageSurveyRepository();
  }

  /**
   * Generates a robust, unique ID for research referencing via local backup generator
   */
  public generateSubmissionId(): string {
    return this.localBackup.generateSubmissionId();
  }

  /**
   * Resolves a fully cleaned, readable question label.
   * Prioritizes QUESTION_ALIASES, then falls back to study question text,
   * and finally "Question [questionId]" if nothing else is available.
   */
  private getQuestionLabel(questionId: string, studyQuestions?: any[]): string {
    if (QUESTION_ALIASES[questionId]) {
      return QUESTION_ALIASES[questionId];
    }
    if (studyQuestions) {
      const q = studyQuestions.find(qi => qi.id === questionId);
      if (q?.text) {
        return q.text;
      }
    }
    return `Question ${questionId}`;
  }

  /**
   * Formats the survey response into dual structured payloads:
   * 1. RESPONSES (Recherche)
   * 2. ANALYTICS (Données comportementales)
   * 
   * Both payloads are completely flattened without any JSON strings in cells,
   * making them immediately ready for Excel, Google Sheets, or Power BI.
   */
  private formatRowPayload(response: SurveyResponse) {
    const environment = window.location.hostname === 'localhost' || window.location.hostname.includes('ais-dev') ? 'test' : 'production';
    const studyVersion = '1.0.0';
    const createdAt = new Date().toISOString();

    // Format duration
    let tempsTotal = 'N/A';
    if (response.startedAt && response.completedAt) {
      const diffMs = new Date(response.completedAt).getTime() - new Date(response.startedAt).getTime();
      const diffSecs = Math.round(diffMs / 1000);
      if (diffSecs < 60) {
        tempsTotal = `${diffSecs}s`;
      } else {
        const mins = Math.floor(diffSecs / 60);
        const secs = diffSecs % 60;
        tempsTotal = `${mins}m ${secs}s`;
      }
    }

    // Determine interview agreement text
    let interviewAgreement = 'Non répondu';
    if (response.wantsInterview === true) interviewAgreement = 'Oui';
    if (response.wantsInterview === false) interviewAgreement = 'Non';

    // Prénom et contact ne sont enregistrés qu'en cas de consentement explicite
    const prenom = response.wantsInterview ? (response.contactInfo?.firstName || '') : '';
    const contact = response.wantsInterview ? (response.contactInfo?.contact || '') : '';

    const study = findStudyById(response.studyId);
    const studyQuestions = study?.questions || [];

    // A) Structure des réponses de recherche (RESPONSES)
    // First fixed columns
    const responsesPayload: Record<string, any> = {
      submissionId: response.submissionId,
      studyId: response.studyId,
      studyVersion,
      startedAt: response.startedAt || response.submittedAt || '',
      completedAt: response.completedAt || response.submittedAt || '',
      tempsTotal,
      answersByQuestion: {}
    };

    const answersByQuestion: Record<string, any> = {};

    // Fill in metadata first as columns in the dynamic questions space
    answersByQuestion['Consentement entretien'] = interviewAgreement;
    answersByQuestion['Prénom'] = prenom;
    answersByQuestion['Contact'] = contact;
    answersByQuestion['Environnement'] = environment;
    answersByQuestion['Créé le'] = createdAt;

    // Pre-populate all known study questions as columns with empty values
    // This allows the Apps Script to discover all headers immediately upon first submit
    for (const q of studyQuestions) {
      const label = this.getQuestionLabel(q.id, studyQuestions);
      answersByQuestion[label] = '';
    }

    // Fill in real answer values
    for (const [questionId, answerValue] of Object.entries(response.answers || {})) {
      const label = this.getQuestionLabel(questionId, studyQuestions);
      const formattedAnswer = Array.isArray(answerValue) 
        ? answerValue.join(', ') 
        : (answerValue !== null && answerValue !== undefined ? String(answerValue) : '');
      answersByQuestion[label] = formattedAnswer;
    }

    responsesPayload.answersByQuestion = answersByQuestion;

    // B) Structure des données analytiques (ANALYTICS)
    const metrics = response.questionMetrics || [];
    const totalMetricSeconds = metrics.reduce((sum, m) => sum + (m.durationSeconds || 0), 0);
    const tempsMoyenParQuestion = metrics.length > 0 
      ? Math.round((totalMetricSeconds / metrics.length) * 10) / 10 
      : 0;

    let longestQId = 'N/A';
    let longestQDuration = 0;
    if (response.questionMetrics) {
      for (const m of response.questionMetrics) {
        if (m.durationSeconds > longestQDuration) {
          longestQDuration = m.durationSeconds;
          longestQId = m.questionId;
        }
      }
    }

    const questionLaPlusLongueLabel = longestQId !== 'N/A' 
      ? this.getQuestionLabel(longestQId, studyQuestions) 
      : 'N/A';
    
    // Exact format for Column E in Analytics: "q3_Sport (25s)"
    const questionLaPlusLongue = longestQId !== 'N/A'
      ? `${questionLaPlusLongueLabel} (${longestQDuration}s)`
      : 'N/A';

    let questionAbandon = 'N/A';
    if (response.abandoned && response.lastQuestionId) {
      questionAbandon = this.getQuestionLabel(response.lastQuestionId, studyQuestions);
    }

    // Build question times map for the JSON field
    const tempsPasseParQuestionObj: Record<string, number> = {};
    if (response.questionMetrics) {
      for (const m of response.questionMetrics) {
        const label = this.getQuestionLabel(m.questionId, studyQuestions);
        tempsPasseParQuestionObj[label] = m.durationSeconds !== undefined ? m.durationSeconds : 0;
      }
    }

    // Visited questions list
    const questionsVisiteesLabels = (response.journeyData?.questionsVisited || []).map(qId => 
      this.getQuestionLabel(qId, studyQuestions)
    );

    const analyticsPayload: Record<string, any> = {
      submissionId: response.submissionId,
      studyId: response.studyId,
      studyVersion,
      "tempsPasseParQuestion (JSON)": JSON.stringify(tempsPasseParQuestionObj),
      questionLaPlusLongue,
      "questionsVisitees (JSON)": JSON.stringify(questionsVisiteesLabels),
      "progressionFinale (%)": response.progressPercent !== undefined ? `${response.progressPercent}%` : '100%',
      moduleAbandon: response.abandoned ? (response.lastModuleTitle || response.lastModuleId || 'Inconnu') : 'N/A',
      questionAbandon,
      statutCompletion: response.abandoned ? 'abandoned' : 'completed',
      environment,
      createdAt
    };

    // Pre-populate response time columns for each question
    for (const q of studyQuestions) {
      const label = this.getQuestionLabel(q.id, studyQuestions);
      analyticsPayload[`Temps - ${label}`] = '';
    }

    // Fill in actual time spent on each question (in pure numeric seconds)
    if (response.questionMetrics) {
      for (const m of response.questionMetrics) {
        const label = this.getQuestionLabel(m.questionId, studyQuestions);
        analyticsPayload[`Temps - ${label}`] = m.durationSeconds !== undefined ? m.durationSeconds : '';
      }
    }

    return {
      submissionId: response.submissionId,
      studyId: response.studyId,
      studyVersion,
      environment,
      createdAt,
      responsesPayload,
      analyticsPayload
    };
  }

  /**
   * Saves response locally first, then attempts to push to Google Sheets.
   * If offline or fails, updates status to pending/failed but preserves local record.
   */
  public async saveResponse(response: SurveyResponse): Promise<boolean> {
    // Ensure syncStatus is initialized
    if (!response.syncStatus) {
      response.syncStatus = 'pending';
    }

    // 1. Enregistrement local systématique (Backup et Mode Offline)
    const localSaved = await this.localBackup.saveResponse(response);
    if (!localSaved) {
      console.error('[GoogleSheetsRepository] Échec de l\'enregistrement local.');
    }

    // 2. Tentative de synchronisation réseau immédiate
    try {
      const payload = this.formatRowPayload(response);
      
      console.log('=========================================');
      console.log('[GoogleSheetsRepository] PRE-FETCH PAYLOAD CHECK');
      console.log('Submission ID:', payload.submissionId);
      console.log('Study ID:', payload.studyId);
      console.log('Environment:', payload.environment);
      console.log('--- responsesPayload ---');
      console.log(JSON.stringify(payload.responsesPayload, null, 2));
      console.log('--- analyticsPayload ---');
      console.log(JSON.stringify(payload.analyticsPayload, null, 2));
      console.log('=========================================');

      let syncedSuccessfully = false;

      // Essai 1 : Proxy serveur local (Élimine 100% des blocages CORS, iframe sandbox, et adblockers)
      try {
        const proxyRes = await fetch('/api/sync-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webappUrl: this.webappUrl,
            payload
          }),
        });

        if (proxyRes.ok) {
          const result = await proxyRes.json();
          if (result && result.status === 'success') {
            response.syncStatus = 'synced';
            await this.updateLocalSyncStatus(response.submissionId, 'synced');
            console.log(`[GoogleSheetsRepository] Synchro réussie par proxy pour la soumission ${response.submissionId}.`);
            syncedSuccessfully = true;
            return true;
          } else {
            console.warn('[GoogleSheetsRepository] Le proxy a retourné un statut d\'échec, essai de fetch direct...', result);
            if (result && result.status === 'error') {
              throw new Error(result.message || 'Erreur proxy inconnue');
            }
          }
        } else {
          // Si le proxy renvoie un statut HTTP invalide (comme 422 ou 500)
          try {
            const errData = await proxyRes.json();
            if (errData && errData.message) {
              throw new Error(errData.message);
            }
          } catch (e: any) {
            if (e.message) throw e;
          }
          console.warn(`[GoogleSheetsRepository] Statut HTTP de proxy invalide (${proxyRes.status}), essai de fetch direct...`);
        }
      } catch (proxyErr: any) {
        console.warn('[GoogleSheetsRepository] Échec synchro proxy:', proxyErr.message || proxyErr);
        // Si c'est une erreur de configuration ou de code Apps Script (ex: doPost manquant), inutile de fallback en direct car cela échouera
        if (proxyErr.message && (proxyErr.message.includes('Apps Script') || proxyErr.message.includes('doPost') || proxyErr.message.includes('Autorisation requise') || proxyErr.message.includes('Aucune URL'))) {
          throw proxyErr;
        }
      }

      // Essai 2 : Fetch navigateur direct (Fallback classique)
      if (!syncedSuccessfully && this.webappUrl) {
        const res = await fetch(this.webappUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const result = await res.json();
          if (result && result.status === 'success') {
            response.syncStatus = 'synced';
            await this.updateLocalSyncStatus(response.submissionId, 'synced');
            console.log(`[GoogleSheetsRepository] Synchro réussie en direct pour la soumission ${response.submissionId}.`);
            return true;
          } else {
            throw new Error(`Le script a retourné un statut d'erreur: ${result?.message || 'Raison inconnue'}`);
          }
        } else {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
      }
    } catch (error: any) {
      console.error(`[GoogleSheetsRepository] Erreur de synchro pour ${response.submissionId} (conserve local):`, error.message || error);
      response.syncStatus = 'failed';
      await this.updateLocalSyncStatus(response.submissionId, 'failed');
      // On retourne true pour ne jamais bloquer le répondant sur le terrain
      return true; 
    }
  }

  /**
   * Reads all responses from local backup
   */
  public async getResponses(studyId?: string): Promise<SurveyResponse[]> {
    return this.localBackup.getResponses(studyId);
  }

  /**
   * Reads response count from local backup
   */
  public async getResponsesCount(studyId: string): Promise<number> {
    return this.localBackup.getResponsesCount(studyId);
  }

  /**
   * Updates sync status inside LocalStorage
   */
  private async updateLocalSyncStatus(submissionId: string, status: 'synced' | 'pending' | 'failed'): Promise<void> {
    try {
      const all = await this.localBackup.getResponses();
      const found = all.find(r => r.submissionId === submissionId);
      if (found) {
        found.syncStatus = status;
        localStorage.setItem('host_survey_all_submissions', JSON.stringify(all));
      }
    } catch (e) {
      console.error('[GoogleSheetsRepository] Erreur d\'écriture locale du statut de synchro:', e);
    }
  }

  /**
   * Triggers background synchronization of all non-synced (pending or failed) responses.
   * Returns a summary of synced vs failed items.
   */
  public async syncPendingResponses(): Promise<{ synced: number; failed: number }> {
    const results = { synced: 0, failed: 0 };

    try {
      const all = await this.getResponses();
      const unsynced = all.filter(r => r.syncStatus !== 'synced');

      if (unsynced.length === 0) {
        return results;
      }

      for (const response of unsynced) {
        try {
          const payload = this.formatRowPayload(response);

          console.log('=========================================');
          console.log('[GoogleSheetsRepository - BACKGROUND SYNC] PRE-FETCH PAYLOAD CHECK');
          console.log('Submission ID:', payload.submissionId);
          console.log('Study ID:', payload.studyId);
          console.log('Environment:', payload.environment);
          console.log('--- responsesPayload ---');
          console.log(JSON.stringify(payload.responsesPayload, null, 2));
          console.log('--- analyticsPayload ---');
          console.log(JSON.stringify(payload.analyticsPayload, null, 2));
          console.log('=========================================');

          let syncedSuccessfully = false;

          // Essai 1 : Proxy serveur local (Bypass 100% CORS/Adblocker/Sandbox limitations)
          try {
            const proxyRes = await fetch('/api/sync-sheets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                webappUrl: this.webappUrl,
                payload
              }),
            });

            if (proxyRes.ok) {
              const result = await proxyRes.json();
              if (result && result.status === 'success') {
                response.syncStatus = 'synced';
                results.synced++;
                syncedSuccessfully = true;
                console.log(`[GoogleSheetsRepository] Synchro d'arrière-plan réussie par proxy pour ${response.submissionId}`);
              } else {
                console.warn(`[GoogleSheetsRepository] Échec proxy d'arrière-plan pour ${response.submissionId}, essai direct...`, result);
                if (result && result.status === 'error') {
                  throw new Error(result.message || 'Erreur proxy inconnue');
                }
              }
            } else {
              // Si le proxy renvoie un statut HTTP invalide (comme 422 ou 500)
              try {
                const errData = await proxyRes.json();
                if (errData && errData.message) {
                  throw new Error(errData.message);
                }
              } catch (e: any) {
                if (e.message) throw e;
              }
              console.warn(`[GoogleSheetsRepository] Code HTTP proxy d'arrière-plan invalide (${proxyRes.status}), essai direct...`);
            }
          } catch (proxyErr: any) {
            console.warn(`[GoogleSheetsRepository] Échec de contact du proxy d'arrière-plan pour ${response.submissionId}, essai direct...`, proxyErr.message || proxyErr);
            // Si c'est une erreur de configuration ou de code Apps Script (ex: doPost manquant), inutile de fallback en direct car cela échouera
            if (proxyErr.message && (proxyErr.message.includes('Apps Script') || proxyErr.message.includes('doPost') || proxyErr.message.includes('Autorisation requise') || proxyErr.message.includes('Aucune URL'))) {
              throw proxyErr;
            }
          }

          // Essai 2 : Fetch direct classique en secours
          if (!syncedSuccessfully && this.webappUrl) {
            const res = await fetch(this.webappUrl, {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'text/plain;charset=utf-8',
              },
              body: JSON.stringify(payload),
            });

            if (res.ok) {
              try {
                const result = await res.json();
                if (result && result.status === 'success') {
                  response.syncStatus = 'synced';
                  results.synced++;
                } else {
                  console.error(`[GoogleSheetsRepository] Le script Google Sheets a retourné un statut d'échec pour la soumission ${response.submissionId}:`, result?.message || 'Inconnu');
                  response.syncStatus = 'failed';
                  results.failed++;
                }
              } catch (jsonErr) {
                console.error(`[GoogleSheetsRepository] Impossible de lire le JSON de réponse pour ${response.submissionId}:`, jsonErr);
                response.syncStatus = 'failed';
                results.failed++;
              }
            } else {
              console.error(`[GoogleSheetsRepository] Code de statut HTTP d'échec (${res.status}) pour la soumission ${response.submissionId}`);
              response.syncStatus = 'failed';
              results.failed++;
            }
          }
        } catch (err) {
          response.syncStatus = 'failed';
          results.failed++;
          console.error(`[GoogleSheetsRepository] Échec de synchro réseau pour la soumission ${response.submissionId}:`, err);
        }
      }

      // Enregistrement de l'état consolidé dans LocalStorage
      localStorage.setItem('host_survey_all_submissions', JSON.stringify(all));
    } catch (e) {
      console.error('[GoogleSheetsRepository] Erreur lors de la synchronisation de groupe:', e);
    }

    return results;
  }
}
