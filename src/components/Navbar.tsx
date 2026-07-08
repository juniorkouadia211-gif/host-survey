/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Menu, X, Award, CloudLightning, Check,
  Settings, Save, AlertCircle, Trash2, Database, Copy, ChevronDown, ChevronUp, LogIn
} from 'lucide-react';
import { surveyRepository } from '../repositories';
import BrandEmblem from './BrandEmblem';

interface NavbarProps {
  onStartClick: () => void;
  onScrollTo: (elementId: string) => void;
}

export default function Navbar({ onStartClick, onScrollTo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Authentication for configuration access
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const checkUnsynced = () => {
      try {
        const raw = localStorage.getItem('host_survey_all_submissions');
        if (raw) {
          const parsed = JSON.parse(raw);
          const unsynced = parsed.filter((r: any) => r.syncStatus !== 'synced');
          setUnsyncedCount(unsynced.length);
        } else {
          setUnsyncedCount(0);
        }
      } catch (e) {
        console.error('Error checking unsynced responses:', e);
      }
    };

    checkUnsynced();

    // Re-check whenever a survey is submitted or local storage updates
    window.addEventListener('storage', checkUnsynced);
    window.addEventListener('survey_submitted', checkUnsynced);

    return () => {
      window.removeEventListener('storage', checkUnsynced);
      window.removeEventListener('survey_submitted', checkUnsynced);
    };
  }, []);

  // Load customUrl on open
  useEffect(() => {
    if (isSettingsOpen) {
      const saved = localStorage.getItem('host_survey_custom_sheets_url') || '';
      setCustomUrl(saved);
      setTestStatus('idle');
      setTestMessage('');
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
      setAuthError('');
    }
  }, [isSettingsOpen]);

  const handleSync = async () => {
    if (isSyncing) return;
    if (surveyRepository.syncPendingResponses) {
      setIsSyncing(true);
      try {
        const result = await surveyRepository.syncPendingResponses();
        if (result.synced > 0) {
          setSyncSuccess(true);
          setTimeout(() => setSyncSuccess(false), 4000);
        }
      } catch (err) {
        console.error('[Navbar] Synchronisation failed:', err);
      } finally {
        setIsSyncing(false);
        // Refresh counts
        window.dispatchEvent(new Event('survey_submitted'));
      }
    }
  };

  const handleSaveSettings = () => {
    const url = customUrl.trim();
    if (url && !url.startsWith('https://script.google.com/')) {
      setTestStatus('error');
      setTestMessage("L'URL doit commencer par https://script.google.com/");
      return;
    }

    try {
      if (url) {
        localStorage.setItem('host_survey_custom_sheets_url', url);
      } else {
        localStorage.removeItem('host_survey_custom_sheets_url');
      }
      setIsSettingsOpen(false);
      // Fire event to notify app of potential URL changes
      window.dispatchEvent(new Event('survey_submitted'));
    } catch (e) {
      console.error('Error saving sheets URL:', e);
    }
  };

  const handleClearSettings = () => {
    setCustomUrl('');
    localStorage.removeItem('host_survey_custom_sheets_url');
    setTestStatus('idle');
    setTestMessage('Configuration réinitialisée. Utilisation de la configuration par défaut.');
    setTimeout(() => {
      setIsSettingsOpen(false);
      window.dispatchEvent(new Event('survey_submitted'));
    }, 1500);
  };

  const handleTestConnection = async () => {
    const url = customUrl.trim();
    if (!url) {
      setTestStatus('error');
      setTestMessage('Veuillez entrer une URL de script valide avant de lancer le test.');
      return;
    }
    if (!url.startsWith('https://script.google.com/')) {
      setTestStatus('error');
      setTestMessage('Format invalide. L\'URL doit commencer par "https://script.google.com/"');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Envoi d\'une requête de test à votre application web...');

    try {
      const testId = "TEST_" + Math.floor(Math.random() * 1000000);
      const testPayload = {
        submissionId: testId,
        studyId: "TEST_STUDY",
        studyVersion: "1.0.0",
        environment: "test",
        createdAt: new Date().toISOString(),
        responsesPayload: {
          submissionId: testId,
          studyId: "TEST_STUDY",
          studyVersion: "1.0.0",
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          tempsTotal: "3s",
          answersByQuestion: {
            "Consentement entretien": "Oui",
            "Prénom": "Testeur",
            "Contact": "test@example.com",
            "Environnement": "test",
            "Créé le": new Date().toISOString(),
            "Université": "UFHB (Université de test)",
            "Moyen de transport": "Bus",
            "Difficultés au quotidien": "Transport, Connexion internet"
          }
        },
        analyticsPayload: {
          submissionId: testId,
          studyId: "TEST_STUDY",
          studyVersion: "1.0.0",
          "tempsPasseParQuestion (JSON)": JSON.stringify({ "Université": 1.5, "Moyen de transport": 1.5 }),
          questionLaPlusLongue: "Université (1.5s)",
          "questionsVisitees (JSON)": JSON.stringify(["Université", "Moyen de transport"]),
          "progressionFinale (%)": "100%",
          moduleAbandon: "N/A",
          questionAbandon: "N/A",
          statutCompletion: "completed",
          environment: "test",
          createdAt: new Date().toISOString(),
          "Temps - Université": 1.5,
          "Temps - Moyen de transport": 1.5
        }
      };

      let res;
      try {
        // Try local server proxy first to bypass CORS, adblockers, and iframe restrictions
        res = await fetch('/api/sync-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            webappUrl: url,
            payload: testPayload
          })
        });
      } catch (proxyErr) {
        console.warn('Proxy test connection failed, falling back to direct fetch:', proxyErr);
        // Fallback to direct call
        res = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(testPayload)
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setTestStatus('success');
          setTestMessage(`Connexion établie avec succès ! Une nouvelle ligne de test (${testId}) a été ajoutée. Les onglets "${data.responsesSheet || 'RESPONSES'}" et "${data.analyticsSheet || 'ANALYTICS'}" ont répondu positivement.`);
        } else {
          setTestStatus('error');
          setTestMessage(data.message || 'Le script a renvoyé une erreur : Détails manquants');
        }
      } else {
        setTestStatus('error');
        try {
          const errData = await res.json();
          setTestMessage(errData.message || `Le serveur a renvoyé un statut HTTP ${res.status}.`);
        } catch {
          setTestMessage(`Le serveur a renvoyé un statut HTTP ${res.status}. Assurez-vous d'avoir déployé le script en tant qu'application Web accessible à "Tout le monde" (Anyone).`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setTestStatus('error');
      setTestMessage(`Impossible de joindre le script. Erreur : ${err.message || 'CORS ou Réseau'}. Veuillez vérifier l'URL et vous assurer que votre script est bien déployé en tant qu'application web.`);
    }
  };

  const handleCopyCode = () => {
    const code = `var MAX_ROWS_PER_SHEET = 500000;

// Route de test GET immédiate
function doGet() {
  return ContentService
    .createTextOutput("HOST Survey API OK - doGet est actif")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Support CORS complet pour pré-vols et requêtes
function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Réception et traitement sécurisé des soumissions
function doPost(e) {
  try {
    var rawData = e.postData.contents;
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Payload vide" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    var payload = JSON.parse(rawData);
    var responsesPayload = payload.responsesPayload;
    var analyticsPayload = payload.analyticsPayload;
    var studyId = payload.studyId || "";
    
    if (!responsesPayload || !analyticsPayload) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Structure de payload invalide" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Extraction du suffixe d'étude (ex: "001" depuis "understudents-ci-001")
    var suffix = "001";
    if (studyId) {
      var parts = studyId.split("-");
      if (parts.length > 0) {
        suffix = parts[parts.length - 1];
      }
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Enregistrement des réponses (RESPONSES)
    var baseHeaders = ["submissionId", "studyId", "studyVersion", "startedAt", "completedAt", "tempsTotal"];
    var questionKeys = Object.keys(responsesPayload.answersByQuestion || {});
    var responsesHeaders = baseHeaders.concat(questionKeys);
    
    var responsesRow = [];
    baseHeaders.forEach(function(h) {
      responsesRow.push(responsesPayload[h] !== undefined ? responsesPayload[h] : "");
    });
    questionKeys.forEach(function(key) {
      responsesRow.push(responsesPayload.answersByQuestion[key] !== undefined ? responsesPayload.answersByQuestion[key] : "");
    });
    
    var responsesSheetName = "HOST_RESPONSES_" + suffix;
    var responsesSheet = getOrCreateTargetSheet(ss, responsesSheetName, responsesHeaders);
    appendOrUpdateDynamicRow(responsesSheet, responsesHeaders, responsesRow);
    
    // 2. Enregistrement des données comportementales (ANALYTICS)
    var analyticsHeaders = [
      "submissionId", 
      "studyId", 
      "studyVersion", 
      "tempsPasseParQuestion (JSON)", 
      "questionLaPlusLongue", 
      "questionsVisitees (JSON)", 
      "progressionFinale (%)", 
      "moduleAbandon", 
      "questionAbandon", 
      "statutCompletion", 
      "environment", 
      "createdAt"
    ];
    
    var analyticsRow = [
      analyticsPayload.submissionId || "",
      analyticsPayload.studyId || "",
      analyticsPayload.studyVersion || "",
      analyticsPayload["tempsPasseParQuestion (JSON)"] || "",
      analyticsPayload.questionLaPlusLongue || "",
      analyticsPayload["questionsVisitees (JSON)"] || "",
      analyticsPayload["progressionFinale (%)"] || "",
      analyticsPayload.moduleAbandon || "",
      analyticsPayload.questionAbandon || "",
      analyticsPayload.statutCompletion || "",
      analyticsPayload.environment || "",
      analyticsPayload.createdAt || ""
    ];
    
    var analyticsSheetName = "HOST_ANALYTICS_" + suffix;
    var analyticsSheet = getOrCreateTargetSheet(ss, analyticsSheetName, analyticsHeaders);
    appendOrUpdateDynamicRow(analyticsSheet, analyticsHeaders, analyticsRow);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      submissionId: payload.submissionId,
      responsesSheet: responsesSheet.getName(),
      analyticsSheet: analyticsSheet.getName()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateTargetSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
         .setBackground("#059669")
         .setFontColor("#ffffff")
         .setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function appendOrUpdateDynamicRow(sheet, incomingHeaders, incomingRow) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  var existingHeaders = [];
  if (lastRow > 0 && lastCol > 0) {
    existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    for (var i = 0; i < existingHeaders.length; i++) {
      existingHeaders[i] = existingHeaders[i] ? existingHeaders[i].toString().trim() : "";
    }
  }
  
  if (existingHeaders.length === 0) {
    existingHeaders = incomingHeaders.slice();
    sheet.appendRow(existingHeaders);
    sheet.getRange(1, 1, 1, existingHeaders.length)
         .setBackground("#059669")
         .setFontColor("#ffffff")
         .setFontWeight("bold");
    sheet.setFrozenRows(1);
    lastRow = 1;
    lastCol = existingHeaders.length;
  }
  
  var updated = false;
  for (var j = 0; j < incomingHeaders.length; j++) {
    var incomingHeader = incomingHeaders[j].toString().trim();
    if (existingHeaders.indexOf(incomingHeader) === -1) {
      var newColIndex = lastCol + 1;
      sheet.getRange(1, newColIndex).setValue(incomingHeader);
      sheet.getRange(1, newColIndex)
           .setBackground("#059669")
           .setFontColor("#ffffff")
           .setFontWeight("bold");
      existingHeaders.push(incomingHeader);
      lastCol = newColIndex;
      updated = true;
    }
  }
  
  var finalRow = [];
  for (var k = 0; k < existingHeaders.length; k++) {
    var header = existingHeaders[k];
    var incomingIndex = incomingHeaders.indexOf(header);
    if (incomingIndex !== -1) {
      finalRow.push(incomingRow[incomingIndex] !== undefined ? incomingRow[incomingIndex] : "");
    } else {
      finalRow.push("");
    }
  }
  
  var submissionIdIndex = existingHeaders.indexOf("submissionId");
  var submissionIdValue = "";
  var incomingSubIdIndex = incomingHeaders.indexOf("submissionId");
  if (incomingSubIdIndex !== -1) {
    submissionIdValue = incomingRow[incomingSubIdIndex];
  }
  
  var foundRowIndex = -1;
  if (submissionIdIndex !== -1 && lastRow > 1 && submissionIdValue) {
    var rangeValues = sheet.getRange(2, submissionIdIndex + 1, lastRow - 1, 1).getValues();
    for (var r = 0; r < rangeValues.length; r++) {
      if (rangeValues[r][0] == submissionIdValue) {
        foundRowIndex = r + 2;
        break;
      }
    }
  }
  
  if (foundRowIndex !== -1) {
    sheet.getRange(foundRowIndex, 1, 1, existingHeaders.length).setValues([finalRow]);
  } else {
    sheet.appendRow(finalRow);
  }
}`;

    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center" id="navbar-container">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <BrandEmblem className="h-9 w-9 text-brand-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-display font-semibold text-lg tracking-tight text-brand-text">
                  HOST <span className="text-brand-primary font-normal">Survey</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-mono text-brand-accent font-semibold">
                  Méthode OCC — Afrique
                </span>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Sync trigger button if unsynced surveys exist */}
              <AnimatePresence>
                {unsyncedCount > 0 && (
                  <motion.button
                    key="sync-trigger"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-brand-surface text-brand-accent border border-brand-border hover:bg-brand-border/40 transition-all cursor-pointer disabled:opacity-75"
                    title="Synchroniser les réponses enregistrées hors-ligne"
                  >
                    <CloudLightning className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''} text-brand-accent`} />
                    <span>{isSyncing ? 'Synchronisation...' : `${unsyncedCount} en attente — Synchroniser`}</span>
                  </motion.button>
                )}

                {syncSuccess && (
                  <motion.span
                    key="sync-success"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-brand-surface text-brand-success border border-brand-border"
                  >
                    <Check className="h-3.5 w-3.5 text-brand-success" />
                    <span>Synchronisé !</span>
                  </motion.span>
                )}
              </AnimatePresence>

              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium bg-brand-surface text-brand-primary border border-brand-border/60">
                <Globe className="h-3.5 w-3.5" />
                <span>Phase Initiale — V1</span>
              </span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-brand-surface hover:bg-brand-border/40 text-brand-text transition-all cursor-pointer border border-brand-border/80"
                title="Connexion Google Sheets"
                id="btn-settings-sheets"
              >
                <Settings className="h-3.5 w-3.5 text-brand-text/80" />
                <span>Connexion</span>
              </button>
              <button
                onClick={onStartClick}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-all border border-brand-primary cursor-pointer font-semibold"
              >
                Commencer l'étude
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-brand-text/80 hover:text-brand-primary hover:bg-brand-surface focus:outline-none transition-colors"
                aria-expanded="false"
                id="mobile-menu-toggle"
              >
                <span className="sr-only">Ouvrir le menu</span>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-brand-border bg-brand-bg"
              id="mobile-menu"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                <div className="pt-2 px-3 flex flex-col space-y-3">
                  {/* Mobile Sync Badge */}
                  {unsyncedCount > 0 && (
                    <button
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-xs font-mono font-semibold bg-brand-surface text-brand-accent border border-brand-border hover:bg-brand-border/40 transition-all cursor-pointer disabled:opacity-75"
                    >
                      <CloudLightning className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''} text-brand-accent`} />
                      <span>{isSyncing ? 'Synchronisation en cours...' : `${unsyncedCount} Réponses locales — Synchroniser`}</span>
                    </button>
                  )}

                  {syncSuccess && (
                    <div className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-xs font-mono font-semibold bg-brand-surface text-brand-success border border-brand-border">
                      <Check className="h-4 w-4 text-brand-success" />
                      <span>Synchronisation réussie !</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-xs font-semibold bg-brand-surface hover:bg-brand-border/40 text-brand-text border border-brand-border/85 transition-all cursor-pointer"
                  >
                    <LogIn className="h-4 w-4 text-brand-text/80" />
                    <span>Connexion</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onStartClick();
                    }}
                    className="w-full text-center px-4 py-3 text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 border border-brand-primary rounded-md transition-all cursor-pointer"
                  >
                    Commencer l'étude
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Settings Modal (Overlay) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="settings-modal-overlay">
            <div className="min-h-screen px-4 text-center flex items-center justify-center">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSettingsOpen(false)}
                className="fixed inset-0 bg-brand-text/45 transition-opacity"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="inline-block w-full max-w-2xl bg-brand-bg rounded-lg text-left overflow-hidden shadow-md transform my-8 align-middle transition-all relative z-10 border border-brand-border"
              >
                {/* Header */}
                <div className="px-6 py-4 bg-brand-surface border-b border-brand-border/60 flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-md bg-brand-primary/10 text-brand-primary">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-semibold text-brand-text">
                        Connexion
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="text-brand-text/40 hover:text-brand-text hover:bg-brand-surface p-1.5 rounded-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {!isAuthenticated ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (username.trim() === 'Host survey' && password === 'Eric2004') {
                        setIsAuthenticated(true);
                        setAuthError('');
                      } else {
                        setAuthError('Identifiants incorrects. Veuillez réessayer.');
                      }
                    }}
                    className="p-6 space-y-4 font-sans"
                  >
                    <p className="text-xs text-brand-text/70 leading-relaxed">
                      Veuillez vous identifier
                    </p>
                    
                    {authError && (
                      <div className="p-3 text-xs bg-red-50 border border-red-200/60 text-red-900 rounded-md">
                        {authError}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-brand-text/60 uppercase tracking-widest font-mono">
                        Nom d'utilisateur
                      </label>
                      <input 
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ex: Host survey"
                        className="w-full px-4 py-2.5 rounded-md border border-brand-border/80 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-text bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-brand-text/60 uppercase tracking-widest font-mono">
                        Mot de passe
                      </label>
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-md border border-brand-border/80 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-text bg-white"
                      />
                    </div>

                    <div className="pt-4 flex justify-end space-x-2.5 border-t border-brand-border/60">
                      <button 
                        type="button"
                        onClick={() => setIsSettingsOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-brand-text bg-white hover:bg-brand-surface border border-brand-border/80 rounded-md transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-all cursor-pointer font-bold border border-brand-primary"
                      >
                        Se connecter
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Body */}
                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto font-sans">
                  
                  {/* Notice */}
                  <div className="p-4 rounded-md bg-brand-surface border border-brand-border text-brand-text/90 text-xs leading-relaxed space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold mb-1 text-brand-primary">
                      <AlertCircle className="h-4 w-4 text-brand-accent shrink-0" />
                      <span>Confidentialité et sécurité des flux de données</span>
                    </div>
                    <p>
                      Les paramètres de scripts de destination sont archivés <strong>uniquement au sein de ce navigateur</strong> (via localStorage). Les données d'étude récoltées ne transitent par aucun serveur intermédiaire tiers.
                    </p>
                  </div>

                  {/* Input field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold font-mono text-brand-text/70 uppercase tracking-widest">
                      URL de l'application Web Google Apps Script
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/XXXXXX/exec"
                        className="w-full px-4 py-2.5 bg-white rounded-md border border-brand-border text-sm focus:outline-none focus:border-brand-primary transition-all font-mono text-brand-text"
                        id="input-sheets-url"
                      />
                    </div>

                    {/* Source Indicator */}
                    <div className="mt-2 text-xs leading-relaxed">
                      {localStorage.getItem('host_survey_custom_sheets_url') ? (
                        <div className="p-3 bg-brand-surface border border-brand-border rounded-md text-brand-text/90">
                          <span className="font-bold flex items-center space-x-1 text-brand-accent">
                            <span>⚠️ URL locale active (Définie pour ce poste)</span>
                          </span>
                          <span className="text-[10px] font-mono break-all block mt-1 bg-white/75 p-1 rounded border border-brand-border">
                            {localStorage.getItem('host_survey_custom_sheets_url')}
                          </span>
                          <p className="text-[10px] text-brand-text/60 mt-1.5 leading-normal">
                            Cette URL locale <strong>remplace temporairement</strong> la configuration globale.
                            Pour rétablir les paramètres initiaux du fichier de configuration, utilisez l'option <strong>Réinitialiser</strong> ci-dessous.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-brand-surface/40 border border-brand-border/60 rounded-md text-brand-text/90">
                          <span className="font-bold flex items-center space-x-1 text-brand-success">
                            <span>✅ Configuration globale active (Serveur institutionnel)</span>
                          </span>
                          <span className="text-[10px] font-mono break-all block mt-1 bg-white/40 p-1 rounded border border-brand-border/60 text-brand-text/60">
                            {import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL || 'Aucune URL configurée dans l\'environnement'}
                          </span>
                          <p className="text-[10px] text-brand-text/60 mt-1.5 leading-normal font-sans">
                            Toutes les soumissions scientifiques sont transmises à l'identifiant global répertorié ci-dessus.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connection Test Output */}
                  {testStatus !== 'idle' && (
                    <div className={`p-4 rounded-md text-xs leading-relaxed border ${
                      testStatus === 'testing' ? 'bg-brand-surface border-brand-border text-brand-text/80' :
                      testStatus === 'success' ? 'bg-brand-surface border-brand-success text-brand-text/90' :
                      'bg-red-50 border-red-200 text-red-900'
                    }`}>
                      <div className="flex items-center space-x-2 font-semibold mb-1">
                        {testStatus === 'testing' && <CloudLightning className="h-4 w-4 animate-spin text-brand-text/50" />}
                        {testStatus === 'success' && <Check className="h-4 w-4 text-brand-success" />}
                        {testStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                        <span>
                          {testStatus === 'testing' && 'Test de connexion réseau...'}
                          {testStatus === 'success' && 'Succès de transmission !'}
                          {testStatus === 'error' && 'Erreur détectée'}
                        </span>
                      </div>
                      <p className="mt-1 leading-normal font-sans text-brand-text/70">{testMessage}</p>
                    </div>
                  )}

                  {/* Collapsible Apps Script Code Guide */}
                  <div className="border border-brand-border rounded-md overflow-hidden bg-brand-surface/30">
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="w-full px-4 py-3 flex justify-between items-center text-xs font-semibold text-brand-text hover:bg-brand-surface transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <Database className="h-3.5 w-3.5 text-brand-text/60" />
                        <span>Code Google Apps Script Recommandé (V5)</span>
                      </span>
                      {showCode ? <ChevronUp className="h-4 w-4 text-brand-text/60" /> : <ChevronDown className="h-4 w-4 text-brand-text/60" />}
                    </button>

                    {showCode && (
                      <div className="p-4 border-t border-brand-border bg-brand-text text-[#FBFBFA]/90 text-xs space-y-3 font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-[#FBFBFA]/60">Séparation RESPONSES & ANALYTICS et en-têtes dynamiques V5</span>
                          <button
                            type="button"
                            onClick={handleCopyCode}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#121A16]/50 hover:bg-[#121A16] text-white border border-[#DCDCD3]/25 transition-colors text-[11px]"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto max-h-[250px] text-[11px] p-2 bg-brand-text/95 rounded border border-[#DCDCD3]/10 leading-relaxed text-[#D48C46]">
{`var MAX_ROWS_PER_SHEET = 500000;

function doGet() {
  return ContentService
    .createTextOutput("HOST Survey API OK - doGet est actif")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Payload vide" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    var payload = JSON.parse(rawData);
    var responsesPayload = payload.responsesPayload;
    var analyticsPayload = payload.analyticsPayload;
    var studyId = payload.studyId || "";
    
    if (!responsesPayload || !analyticsPayload) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Structure de payload invalide" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Extraction du suffixe d'étude (ex: "001" depuis "understudents-ci-001")
    var suffix = "001";
    if (studyId) {
      var parts = studyId.split("-");
      if (parts.length > 0) {
        suffix = parts[parts.length - 1];
      }
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Enregistrement des réponses (RESPONSES)
    var baseHeaders = ["submissionId", "studyId", "studyVersion", "startedAt", "completedAt", "tempsTotal"];
    var questionKeys = Object.keys(responsesPayload.answersByQuestion || {});
    var responsesHeaders = baseHeaders.concat(questionKeys);
    
    var responsesRow = [];
    baseHeaders.forEach(function(h) {
      responsesRow.push(responsesPayload[h] !== undefined ? responsesPayload[h] : "");
    });
    questionKeys.forEach(function(key) {
      responsesRow.push(responsesPayload.answersByQuestion[key] !== undefined ? responsesPayload.answersByQuestion[key] : "");
    });
    
    var responsesSheetName = "HOST_RESPONSES_" + suffix;
    var responsesSheet = getOrCreateTargetSheet(ss, responsesSheetName, responsesHeaders);
    appendOrUpdateDynamicRow(responsesSheet, responsesHeaders, responsesRow);
    
    // 2. Enregistrement des données comportementales (ANALYTICS)
    var analyticsHeaders = [
      "submissionId", 
      "studyId", 
      "studyVersion", 
      "tempsPasseParQuestion (JSON)", 
      "questionLaPlusLongue", 
      "questionsVisitees (JSON)", 
      "progressionFinale (%)", 
      "moduleAbandon", 
      "questionAbandon", 
      "statutCompletion", 
      "environment", 
      "createdAt"
    ];
    
    var analyticsRow = [
      analyticsPayload.submissionId || "",
      analyticsPayload.studyId || "",
      analyticsPayload.studyVersion || "",
      analyticsPayload["tempsPasseParQuestion (JSON)"] || "",
      analyticsPayload.questionLaPlusLongue || "",
      analyticsPayload["questionsVisitees (JSON)"] || "",
      analyticsPayload["progressionFinale (%)"] || "",
      analyticsPayload.moduleAbandon || "",
      analyticsPayload.questionAbandon || "",
      analyticsPayload.statutCompletion || "",
      analyticsPayload.environment || "",
      analyticsPayload.createdAt || ""
    ];
    
    var analyticsSheetName = "HOST_ANALYTICS_" + suffix;
    var analyticsSheet = getOrCreateTargetSheet(ss, analyticsSheetName, analyticsHeaders);
    appendOrUpdateDynamicRow(analyticsSheet, analyticsHeaders, analyticsRow);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      submissionId: payload.submissionId,
      responsesSheet: responsesSheet.getName(),
      analyticsSheet: analyticsSheet.getName()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateTargetSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
         .setBackground("#059669")
         .setFontColor("#ffffff")
         .setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function appendOrUpdateDynamicRow(sheet, incomingHeaders, incomingRow) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  var existingHeaders = [];
  if (lastRow > 0 && lastCol > 0) {
    existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    for (var i = 0; i < existingHeaders.length; i++) {
      existingHeaders[i] = existingHeaders[i] ? existingHeaders[i].toString().trim() : "";
    }
  }
  
  if (existingHeaders.length === 0) {
    existingHeaders = incomingHeaders.slice();
    sheet.appendRow(existingHeaders);
    sheet.getRange(1, 1, 1, existingHeaders.length)
         .setBackground("#059669")
         .setFontColor("#ffffff")
         .setFontWeight("bold");
    sheet.setFrozenRows(1);
    lastRow = 1;
    lastCol = existingHeaders.length;
  }
  
  var updated = false;
  for (var j = 0; j < incomingHeaders.length; j++) {
    var incomingHeader = incomingHeaders[j].toString().trim();
    if (existingHeaders.indexOf(incomingHeader) === -1) {
      var newColIndex = lastCol + 1;
      sheet.getRange(1, newColIndex).setValue(incomingHeader);
      sheet.getRange(1, newColIndex)
           .setBackground("#059669")
           .setFontColor("#ffffff")
           .setFontWeight("bold");
      existingHeaders.push(incomingHeader);
      lastCol = newColIndex;
      updated = true;
    }
  }
  
  var finalRow = [];
  for (var k = 0; k < existingHeaders.length; k++) {
    var header = existingHeaders[k];
    var incomingIndex = incomingHeaders.indexOf(header);
    if (incomingIndex !== -1) {
      finalRow.push(incomingRow[incomingIndex] !== undefined ? incomingRow[incomingIndex] : "");
    } else {
      finalRow.push("");
    }
  }
  
  var submissionIdIndex = existingHeaders.indexOf("submissionId");
  var submissionIdValue = "";
  var incomingSubIdIndex = incomingHeaders.indexOf("submissionId");
  if (incomingSubIdIndex !== -1) {
    submissionIdValue = incomingRow[incomingSubIdIndex];
  }
  
  var foundRowIndex = -1;
  if (submissionIdIndex !== -1 && lastRow > 1 && submissionIdValue) {
    var rangeValues = sheet.getRange(2, submissionIdIndex + 1, lastRow - 1, 1).getValues();
    for (var r = 0; r < rangeValues.length; r++) {
      if (rangeValues[r][0] == submissionIdValue) {
        foundRowIndex = r + 2;
        break;
      }
    }
  }
  
  if (foundRowIndex !== -1) {
    sheet.getRange(foundRowIndex, 1, 1, existingHeaders.length).setValues([finalRow]);
  } else {
    sheet.appendRow(finalRow);
  }
}`}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-brand-surface border-t border-brand-border/60 flex flex-wrap justify-between items-center gap-3">
                      <button 
                        type="button"
                        onClick={handleClearSettings}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-semibold text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Réinitialiser</span>
                      </button>

                      <div className="flex space-x-2.5">
                        <button 
                          type="button"
                          onClick={handleTestConnection}
                          disabled={testStatus === 'testing'}
                          className="px-4 py-2 text-xs font-semibold text-brand-text bg-white hover:bg-brand-surface border border-brand-border/80 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {testStatus === 'testing' ? 'Test en cours...' : 'Tester la connexion'}
                        </button>
                        <button 
                          type="button"
                          onClick={handleSaveSettings}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md border border-brand-primary transition-all cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Enregistrer</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
