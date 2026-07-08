/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Award, 
  MessageSquare, 
  PhoneCall, 
  User, 
  CheckCircle,
  AlertCircle,
  Layers,
  BookOpen,
  Quote,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Study, SurveyResponse } from '../types';
import { SurveyEngine, SurveyEngineState } from '../engine/SurveyEngine';
import BrandEmblem from './BrandEmblem';

const MODULE_METADATA: Record<string, { title: string; methodology: string; stat: string; citation: string }> = {
  m1_context: {
    title: "Profil Académique & Démographique",
    methodology: "Établit le profil académique et démographique du répondant afin de corréler ses difficultés matérielles avec son parcours, son niveau d'étude et son mode d'habitation.",
    stat: "En Côte d'Ivoire, plus de 55% des nouveaux inscrits font face à des vulnérabilités d'intégration socio-logistique majeures durant leur première année universitaire.",
    citation: "« L'analyse fine des profils démographiques est la clé de voûte de toute stratégie d'aide sociale ciblée et d'équité universitaire. »"
  },
  m2_vie_quotidienne: {
    title: "Mobilité & Connectivité numérique",
    methodology: "Analyse l'accès aux infrastructures de transport (Gbaka, Bus, Wôrô-wôrô) et la qualité de la connectivité numérique, qui constituent les fondations matérielles de l'apprentissage.",
    stat: "Un étudiant d'Abidjan consacre en moyenne 1h45 par jour à ses déplacements de transit, avec un budget transport grevant jusqu'à 30% de ses ressources mensuelles.",
    citation: "« Le temps perdu dans les transports quotidiens agit comme un impôt invisible et régressif sur la réussite universitaire des plus modestes. »"
  },
  m3_budget: {
    title: "Ressources & Arbitrages financiers",
    methodology: "Mesure la structure des revenus estudiantins, la répartition des charges de survie (alimentation, logement, fournitures) et l'impact du stress financier sur l'esprit d'étude.",
    stat: "Près de 45% des étudiants de Côte d'Ivoire déclarent sauter régulièrement au moins un repas par jour pour des raisons de restriction budgétaire sévère.",
    citation: "« La précarité matérielle n'est pas qu'un déficit budgétaire : c'est une charge cognitive continue qui sature l'espace mental dédié à la recherche. »"
  },
  m4_frictions: {
    title: "Frictions Systémiques & Obstacles",
    methodology: "Identifie de manière granulaire les goulets d'étranglement qui nuisent à l'assiduité académique, à la santé psychologique et au bien-être quotidien.",
    stat: "La fracture numérique liée au coût des données mobiles représente la deuxième cause d'abandon ou de retard lors des examens universitaires dématérialisés.",
    citation: "« Nommer et quantifier les barrières invisibles est le premier pas incontournable vers l'édification d'une pédagogie d'inclusion. »"
  },
  m5_workarounds: {
    title: "Résilience & Solidarités actives",
    methodology: "Observe les systèmes d'entraide informels, les innovations collectives et les mécanismes d'adaptation déployés pour compenser les limites des services publics.",
    stat: "Plus de 68% des apprenants s'appuient sur des réseaux informels (partage de connexion, hébergement collectif) pour surmonter les défaillances de service.",
    citation: "« L'ingéniosité d'adaptation des étudiants subsahariens témoigne d'une résilience remarquable qu'il convient de formaliser et d'accompagner. »"
  },
  m6_opportunities: {
    title: "Prospective & Solutions d'Avenir",
    methodology: "Récolte les aspirations directes et les propositions d'innovation des usagers afin de concevoir des réponses d'intérêt général à haut impact socio-technologique.",
    stat: "82% des répondants jugent prioritaires les solutions technologiques d'entraide (bourses, covoiturage étudiant, banques de cours mutualisées).",
    citation: "« Consulter l'étudiant comme un concepteur de son environnement, c'est concevoir des infrastructures publiques plus justes et plus pérennes. »"
  }
};

interface QuestionnaireProps {
  survey: Study;
  onBackToHome: () => void;
}

export default function Questionnaire({ survey: propSurvey, onBackToHome }: QuestionnaireProps) {
  const survey = useMemo(() => {
    return {
      ...propSurvey,
      questions: propSurvey.questions.map(q => q.type === 'text' ? { ...q, required: false } : q)
    };
  }, [propSurvey]);

  // Sync state from the pure SurveyEngine
  const [engineState, setEngineState] = useState<SurveyEngineState | null>(null);
  const engineRef = useRef<SurveyEngine | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Initialize engine once
  if (!engineRef.current) {
    engineRef.current = new SurveyEngine(survey, (state) => {
      setEngineState(state);
    });
  }

  // Effect to re-initialize if survey changes and check for drafts
  useEffect(() => {
    engineRef.current = new SurveyEngine(survey, (state) => {
      setEngineState(state);
    });
    
    // Check if draft exists to show recovery screen
    if (engineRef.current.hasDraft()) {
      setShowDraftPrompt(true);
    } else {
      setShowDraftPrompt(false);
    }
  }, [survey]);

  // Prevent accidental reloading or leaving during an active study session
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (engineState && !engineState.isCompleted && Object.keys(engineState.answers).length > 0) {
        e.preventDefault();
        e.returnValue = 'Voulez-vous vraiment quitter l\'étude en cours ? Votre progression est sauvegardée.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [engineState]);

  const [activeTransitionModule, setActiveTransitionModule] = useState<{
    completedModule: any;
    nextModule: any;
  } | null>(null);

  const lastIndexRef = useRef<number>(-1);

  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [isTransitionPaused, setIsTransitionPaused] = useState<boolean>(false);
  const [openModuleDropdown, setOpenModuleDropdown] = useState<string | null>(null);

  const currentModuleId = engineRef.current?.getCurrentModule()?.id;

  // Auto-expand the active module's methodology dropdown as they progress
  useEffect(() => {
    if (currentModuleId) {
      setOpenModuleDropdown(currentModuleId);
    }
  }, [currentModuleId]);

  // Auto-advance transition after 6 seconds (with pause on touch/mouse hold like WhatsApp Status)
  useEffect(() => {
    if (!activeTransitionModule) {
      setTransitionProgress(0);
      return;
    }

    let intervalId: any;
    if (!isTransitionPaused) {
      intervalId = setInterval(() => {
        setTransitionProgress((prev) => {
          const next = prev + (100 / 60); // 100ms ticks, total 6000ms (60 ticks)
          if (next >= 100) {
            clearInterval(intervalId);
            setActiveTransitionModule(null);
            return 0;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTransitionModule, isTransitionPaused]);

  // Detect module transition when moving forward sequentially
  useEffect(() => {
    if (!engineState) return;
    const prevIndex = lastIndexRef.current;
    const currIndex = engineState.currentIndex;
    lastIndexRef.current = currIndex;

    // Skip first mount or restoration initialization
    if (prevIndex === -1) {
      return;
    }

    // Trigger transition when moving forward sequentially (e.g., index goes from 10 to 11)
    if (currIndex === prevIndex + 1) {
      const prevQuestion = survey.questions[prevIndex];
      const currQuestion = survey.questions[currIndex];
      if (prevQuestion && currQuestion && prevQuestion.moduleId !== currQuestion.moduleId) {
        const completedModule = survey.modules.find(m => m.id === prevQuestion.moduleId);
        const nextModule = survey.modules.find(m => m.id === currQuestion.moduleId);
        if (completedModule && nextModule) {
          setActiveTransitionModule({
            completedModule,
            nextModule
          });
        }
      }
    }
  }, [engineState?.currentIndex, survey]);

  const isAutreOption = (opt: string) => {
    const normalized = opt.toLowerCase().trim();
    return normalized === 'autre' || 
           normalized.startsWith('autre ') || 
           normalized.startsWith('autres') || 
           normalized.startsWith('autre(');
  };

  const handleAutreTextChange = (opt: string, text: string) => {
    if (!engineState || !engineRef.current) return;
    const currentQuestion = engineRef.current.getCurrentQuestion();
    if (!currentQuestion) return;
    const value = text.trim() ? `${opt} : ${text}` : opt;
    engineRef.current.setSingleChoiceAnswer(value);
  };

  const handleMultipleChoiceToggle = (opt: string) => {
    if (!engineState || !engineRef.current) return;
    const currentQuestion = engineRef.current.getCurrentQuestion();
    if (!currentQuestion) return;
    const currentSelection = (engineState.answers[currentQuestion.id] as string[]) || [];
    
    if (isAutreOption(opt)) {
      const matchingIndex = currentSelection.findIndex(item => item === opt || item.startsWith(opt + ' : '));
      let nextSelection: string[];
      if (matchingIndex !== -1) {
        nextSelection = currentSelection.filter((_, idx) => idx !== matchingIndex);
      } else {
        nextSelection = [...currentSelection, opt];
      }
      engineRef.current.updateAnswer(currentQuestion.id, nextSelection);
    } else {
      engineRef.current.setMultipleChoiceAnswer(opt);
    }
  };

  const handleMultipleChoiceAutreTextChange = (opt: string, text: string) => {
    if (!engineState || !engineRef.current) return;
    const currentQuestion = engineRef.current.getCurrentQuestion();
    if (!currentQuestion) return;
    const currentSelection = (engineState.answers[currentQuestion.id] as string[]) || [];
    const newValue = text.trim() ? `${opt} : ${text}` : opt;
    
    const matchingIndex = currentSelection.findIndex(item => item === opt || item.startsWith(opt + ' : '));
    if (matchingIndex !== -1) {
      const nextSelection = [...currentSelection];
      nextSelection[matchingIndex] = newValue;
      engineRef.current.updateAnswer(currentQuestion.id, nextSelection);
    }
  };

  const isLastTwoTextQuestions = useMemo(() => {
    if (!engineState || !engineRef.current) return false;
    const currentQ = engineRef.current.getCurrentQuestion();
    if (!currentQ) return false;
    const textQIds = survey.questions.filter(q => q.type === 'text').map(q => q.id);
    const lastTwoTextQIds = textQIds.slice(-2);
    return lastTwoTextQIds.includes(currentQ.id);
  }, [survey, engineState]);

  const moduleProgressPercent = useMemo(() => {
    if (!engineState || !engineRef.current || !survey) return 0;
    const currentQ = engineRef.current.getCurrentQuestion();
    if (!currentQ) return 0;
    const currentModuleQuestions = survey.questions.filter(q => q.moduleId === currentQ.moduleId);
    if (currentModuleQuestions.length === 0) return 0;
    const indexInModule = currentModuleQuestions.findIndex(q => q.id === currentQ.id);
    return Math.round(((indexInModule + 1) / currentModuleQuestions.length) * 100);
  }, [engineState, survey]);

  if (!engineState || !engineRef.current) {
    return <div className="text-center py-10 text-brand-text/50 font-mono text-xs">Initialisation du moteur d'étude...</div>;
  }

  const currentQuestion = engineRef.current.getCurrentQuestion();
  const currentModule = engineRef.current.getCurrentModule();

  const getMotivationalMessage = (completedModuleId: string): string => {
    switch (completedModuleId) {
      case 'm1_context':
        return "Excellent début ! Votre profil académique est bien enregistré. Nous comprenons maintenant mieux vos bases d'études.";
      case 'm2_vie_quotidienne':
        return "Super ! Merci pour ces précisions sur votre mobilité quotidienne. Vos temps de trajet sont précieux pour nos statistiques.";
      case 'm3_budget':
        return "C'est parfait ! Vos habitudes financières et vos priorités budgétaires nous permettent d'identifier les pressions économiques majeures.";
      case 'm4_frictions':
        return "Merci pour votre franchise sur ces difficultés quotidiennes. Comprendre vos blocages est la clé pour bâtir de meilleures solutions.";
      case 'm5_workarounds':
        return "Formidable ! Votre ingéniosité face aux obstacles est extrêmement inspirante. Terminons en beauté par vos idées d'avenir.";
      default:
        return "Félicitations pour avoir complété ce module ! Chaque réponse nous rapproche d'un diagnostic complet.";
    }
  };

  const handleInterviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    engineRef.current?.submitInterviewConsent();
  };

  const isQuestionnaireActive = !showDraftPrompt && !showExitConfirm && !activeTransitionModule && !engineState.isCompleted;

  return (
    <div 
      className={`${isQuestionnaireActive ? 'max-w-7xl' : 'max-w-xl'} mx-auto px-4 sm:px-6 py-8 transition-all duration-300`} 
      id="survey-moteur-container"
    >
      <AnimatePresence mode="wait">
        {showDraftPrompt ? (
          // ================= RECOVERY SCREEN =================
          <motion.div
            key="draft-recovery-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-brand-border/80 rounded-none p-6 sm:p-10 text-center relative overflow-hidden font-sans"
          >
            {/* Terracotta brand top line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
            <div className="absolute top-0 right-0 h-8 w-8 border-t border-r border-brand-accent/20 pointer-events-none" />

            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-none bg-brand-surface border border-brand-border/80 mb-5 text-brand-primary">
              <Layers className="h-5 w-5" />
            </div>
            
            <h3 className="font-display font-semibold text-lg sm:text-xl text-brand-text tracking-tight">
              Session de recherche en cours détectée
            </h3>
            
            <p className="text-brand-text/75 text-xs sm:text-sm mt-3 mb-8 leading-relaxed max-w-sm mx-auto font-sans font-light">
              Nous avons retrouvé un brouillon de vos réponses sur cet appareil. Souhaitez-vous poursuivre là où vous vous étiez arrêté ou recommencer l'enquête ?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-mono text-xs uppercase tracking-wider font-bold">
              <button
                onClick={() => {
                  engineRef.current?.loadDraft();
                  setShowDraftPrompt(false);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-none border border-brand-primary transition-colors cursor-pointer inline-flex items-center justify-center space-x-2"
                id="resume-survey-btn"
              >
                <span>Continuer l'étude</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  engineRef.current?.discardDraft();
                  setShowDraftPrompt(false);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-brand-surface text-brand-text rounded-none border border-brand-border transition-colors cursor-pointer inline-flex items-center justify-center"
                id="restart-survey-btn"
              >
                Recommencer à zéro
              </button>
            </div>
          </motion.div>
        ) : showExitConfirm ? (
          // ================= CONFIRM ABANDON SCREEN =================
          <motion.div
            key="exit-confirm-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-brand-border/80 rounded-none p-6 sm:p-10 text-center relative overflow-hidden font-sans"
          >
            {/* Terracotta brand top line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-700" />
            <div className="absolute top-0 right-0 h-8 w-8 border-t border-r border-red-700/20 pointer-events-none" />

            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-none bg-red-50 text-red-700 mb-5 border border-red-200">
              <AlertCircle className="h-5 w-5" />
            </div>
            
            <h3 className="font-display font-semibold text-lg sm:text-xl text-brand-text tracking-tight">
              Interrompre l'étude de recherche ?
            </h3>
            
            <p className="text-brand-text/75 text-xs sm:text-sm mt-3 mb-8 leading-relaxed max-w-sm mx-auto font-light">
              Votre progression actuelle est automatiquement sauvegardée en tant que brouillon. Vous pourrez reprendre cette étude plus tard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-mono text-xs uppercase tracking-wider font-bold">
              <button
                onClick={() => {
                  if (engineRef.current) {
                    engineRef.current.recordAbandonment();
                  }
                  setShowExitConfirm(false);
                  onBackToHome();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-none border border-red-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                id="confirm-exit-btn"
              >
                Oui, abandonner
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-brand-surface text-brand-text rounded-none border border-brand-border transition-colors cursor-pointer inline-flex items-center justify-center"
                id="cancel-exit-btn"
              >
                Non, continuer l'étude
              </button>
            </div>
          </motion.div>
        ) : activeTransitionModule ? (
          // ================= SCREEN: MODULE TRANSITION =================
          <motion.div
            key="module-transition-card"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white border border-brand-border/80 rounded-none p-6 sm:p-10 text-center relative overflow-hidden select-none cursor-pointer shadow-xs font-sans"
            onMouseDown={() => setIsTransitionPaused(true)}
            onMouseUp={() => setIsTransitionPaused(false)}
            onMouseLeave={() => setIsTransitionPaused(false)}
            onTouchStart={() => setIsTransitionPaused(true)}
            onTouchEnd={() => setIsTransitionPaused(false)}
          >
            {/* Terracotta brand top line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
            <div className="absolute top-0 right-0 h-8 w-8 border-t border-r border-brand-accent/20 pointer-events-none" />
            
            {/* Animated Celebration Icon */}
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-none bg-brand-surface border border-brand-border/80 mb-6 text-brand-primary">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Award className="h-6 w-6 text-brand-primary" />
              </motion.div>
            </div>

            {/* Completion Message */}
            <h3 className="font-display font-semibold text-lg sm:text-xl text-brand-text tracking-tight">
              {activeTransitionModule.completedModule.title} validé !
            </h3>
            
            {/* Motivational message */}
            <p className="text-brand-text/75 text-xs sm:text-sm mt-3 mb-8 leading-relaxed max-w-sm mx-auto font-light">
              {getMotivationalMessage(activeTransitionModule.completedModule.id)}
            </p>

            {/* Next module announcement */}
            <div className="bg-brand-surface border border-brand-border/80 rounded-none p-5 mb-8 max-w-sm mx-auto text-left space-y-2">
              <span className="block text-[9px] font-bold text-brand-accent uppercase tracking-widest font-mono">
                Section suivante
              </span>
              <span className="font-display font-semibold text-sm text-brand-text flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-brand-primary shrink-0" />
                {activeTransitionModule.nextModule.title}
              </span>
              {activeTransitionModule.nextModule.description && (
                <p className="text-xs text-brand-text/60 leading-relaxed font-sans font-light">
                  {activeTransitionModule.nextModule.description}
                </p>
              )}
            </div>

            {/* Interactive button with countdown visual hint */}
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTransitionModule(null);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-none transition-colors border border-brand-primary cursor-pointer inline-flex items-center justify-center space-x-1.5 group"
                id="next-module-btn"
              >
                <span>Continuer l'étude</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              
              <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-brand-text/40">
                <span className="inline-block h-1.5 w-1.5 rounded-none bg-brand-accent animate-pulse" />
                <span>Transition automatique...</span>
              </div>
            </div>

            {/* Linear progress bar representing countdown */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-surface overflow-hidden border-t border-brand-border/30">
              <div
                className="h-full bg-brand-primary transition-all duration-100 ease-linear"
                style={{ width: `${transitionProgress}%` }}
              />
            </div>
          </motion.div>
        ) : !engineState.isCompleted ? (
          // ================= SCREEN 2: DYNAMIC QUESTIONNAIRE =================
          <div key="active-question-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            
            {/* LEFT COLUMN: 1/3 Academic Metadata Panel (Sticky on desktop, below on mobile) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 order-last lg:order-first">
              
              {/* Active module card */}
              {currentModule && (
                <div className="bg-brand-surface border-l-2 border-brand-accent bg-brand-surface/75 border-y border-r border-brand-border/80 p-5 rounded-none space-y-4">
                  <div className="border-b border-brand-border/60 pb-3">
                    <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest block mb-1 font-mono">
                      SECTION EN COURS
                    </span>
                    <h3 className="font-display font-semibold text-base text-brand-text leading-tight">
                      {currentModule.title}
                    </h3>
                  </div>

                  {/* Micro Stepper checklist representation of survey modules */}
                  <div className="space-y-2 font-mono text-[9px] uppercase tracking-wide">
                    {survey.modules.map((mod, idx) => {
                      const currentModuleIndex = survey.modules.findIndex(m => m.id === currentModule.id);
                      const isCompleted = currentModuleIndex > idx;
                      const isActive = mod.id === currentModule.id;
                      const isDropdownOpen = openModuleDropdown === mod.id;
                      const hasMethodology = !!MODULE_METADATA[mod.id]?.methodology;
                      
                      return (
                        <div key={mod.id} className="space-y-1">
                          <div 
                            onClick={() => {
                              if (hasMethodology) {
                                setOpenModuleDropdown(isDropdownOpen ? null : mod.id);
                              }
                            }}
                            className={`flex items-center justify-between py-1.5 px-2.5 border transition-colors duration-200 rounded-none cursor-pointer hover:border-brand-accent/50 ${
                              isActive 
                                ? 'bg-white border-brand-accent font-bold text-brand-primary shadow-xs' 
                                : isCompleted 
                                  ? 'bg-white/40 border-brand-border/30 text-brand-text/50' 
                                  : 'bg-transparent border-transparent text-brand-text/40'
                            }`}
                          >
                            <span className="truncate max-w-[160px] flex items-center gap-1">
                              {idx + 1}. {MODULE_METADATA[mod.id]?.title || mod.title}
                              {hasMethodology && (
                                <ChevronDown className={`h-3 w-3 text-brand-accent transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                              )}
                            </span>
                            <span className="shrink-0 font-bold">
                              {isCompleted ? (
                                <span className="text-brand-success flex items-center gap-0.5">
                                  <Check className="h-3 w-3" /> FAIT
                                </span>
                              ) : isActive ? (
                                <span className="text-brand-accent animate-pulse">ACTIF</span>
                              ) : (
                                <span className="text-brand-text/30">ATTENTE</span>
                              )}
                            </span>
                          </div>

                          {/* Collapsible Dropdown for Methodology */}
                          {hasMethodology && isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-white border border-brand-border/80 p-3.5 space-y-2 overflow-hidden text-left"
                            >
                              <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-1.5 mb-1.5">
                                <BookOpen className="h-3.5 w-3.5 text-brand-accent shrink-0" />
                                <span className="font-mono font-bold text-[8px] text-brand-primary uppercase tracking-widest">
                                  Cadre Méthodologique
                                </span>
                              </div>
                              <p className="text-[10px] text-brand-text/85 normal-case font-sans font-light leading-relaxed">
                                {MODULE_METADATA[mod.id].methodology}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Section overall progress indicator */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-brand-text/50 uppercase tracking-widest mb-1.5">
                      <span>Progression de la section</span>
                      <span className="text-brand-primary">{moduleProgressPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-white border border-brand-border/40 relative overflow-hidden">
                      <motion.div
                        className="h-full bg-brand-primary absolute left-0 top-0"
                        initial={{ width: `${moduleProgressPercent}%` }}
                        animate={{ width: `${moduleProgressPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata cards moved or removed as requested */}

            </div>

            {/* RIGHT COLUMN: 2/3 Questionnaire Card Block */}
            <div className="lg:col-span-8 order-first lg:order-last">
              <motion.div
                key="active-question-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-brand-border/80 p-6 sm:p-10 shadow-xs relative overflow-hidden font-sans"
              >
                {/* Terracotta brand left line & corner element */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary" />
                <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-brand-accent/30 pointer-events-none" />

                {/* Card Top Information Bar */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 pb-4 border-b border-brand-border/50 text-[11px] text-brand-text/70 font-mono">
                  <span className="font-bold text-brand-accent uppercase tracking-widest flex items-center">
                    <span className="inline-block h-2 w-2 rounded-none bg-brand-accent mr-2 animate-pulse" />
                    Question {(() => {
                      const currentModuleQuestions = survey.questions.filter(q => q.moduleId === currentQuestion.moduleId);
                      const indexInModule = currentModuleQuestions.findIndex(q => q.id === currentQuestion.id);
                      return indexInModule !== -1 ? indexInModule + 1 : 1;
                    })()} sur {survey.questions.filter(q => q.moduleId === currentQuestion.moduleId).length} de ce module
                  </span>
                  
                  <div className="flex items-center justify-end gap-2.5">
                    <span className="text-[9px] text-brand-text/40 font-mono">ID : {currentQuestion.id}</span>
                    <span className="text-brand-border/60">/</span>
                    <button
                      type="button"
                      onClick={() => setShowExitConfirm(true)}
                      className="inline-flex items-center px-2 py-0.5 text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100/50 font-bold border border-red-100 transition-colors cursor-pointer text-[9px] font-mono uppercase tracking-wider"
                      title="Quitter l'étude en cours"
                    >
                      Quitter
                    </button>
                  </div>
                </div>
                
                {/* Mobile-optimized Section Progress bar */}
                <div className="lg:hidden mb-6 -mt-4">
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-brand-text/50 uppercase tracking-widest mb-1">
                    <span>Progression {currentModule?.title}</span>
                    <span className="text-brand-primary">{moduleProgressPercent}%</span>
                  </div>
                  <div className="w-full h-1 bg-brand-surface border border-brand-border/40 relative overflow-hidden">
                    <div
                      className="h-full bg-brand-primary absolute left-0 top-0 transition-all duration-300"
                      style={{ width: `${moduleProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Animated Question Content (Fluid Transition) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="focus:outline-hidden"
                  >
                    {/* Question Title & Supportive Text */}
                    <div className="mb-6">
                      <h3 className="font-display font-semibold text-lg sm:text-xl text-brand-text leading-snug">
                        {currentQuestion.text}
                        {currentQuestion.required && <span className="text-brand-accent ml-1 font-sans" title="Requis">*</span>}
                      </h3>

                      {currentQuestion.helpText && (
                        <p className="text-xs text-brand-text/60 mt-2.5 flex items-start font-sans leading-relaxed">
                          <HelpCircle className="h-3.5 w-3.5 text-brand-accent shrink-0 mr-1.5 mt-0.5" />
                          <span>{currentQuestion.helpText}</span>
                        </p>
                      )}
                    </div>

                    {/* Error alerts */}
                    {engineState.error && (
                      <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-none text-xs text-red-700 flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{engineState.error}</span>
                      </div>
                    )}

                    {/* Response choices layout */}
                    <div className="mb-8 min-h-[220px]">
                      {/* SINGLE CHOICE */}
                      {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                        <div className="space-y-2.5">
                          {(() => {
                            // Detect if this is a rating style 1-5 question
                            const isRatingStyle = currentQuestion.options.length === 5 && 
                              (currentQuestion.options[0].includes('1') || currentQuestion.options[0].startsWith('1')) &&
                              (currentQuestion.options[4].includes('5') || currentQuestion.options[4].startsWith('5'));

                            if (isRatingStyle) {
                              const parseLabel = (str: string, fallback: string) => {
                                const match = str.match(/^\d\s*[-—=]\s*(.*)$/);
                                return match ? match[1] : fallback;
                              };
                              const label1 = parseLabel(currentQuestion.options[0], 'Minimum');
                              const label5 = parseLabel(currentQuestion.options[4], 'Maximum');

                              return (
                                <div className="py-2">
                                  <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-5">
                                    {currentQuestion.options.map((opt, index) => {
                                      const isSelected = engineState.answers[currentQuestion.id] === opt;
                                      const numValue = index + 1;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => engineRef.current?.setSingleChoiceAnswer(opt)}
                                          className={`h-12 rounded-none flex flex-col items-center justify-center font-mono text-lg font-bold border transition-all duration-150 cursor-pointer active:scale-95 ${
                                            isSelected
                                              ? 'bg-brand-primary border-brand-primary text-white shadow-xs'
                                              : 'bg-brand-surface border-brand-border/60 text-brand-text/80 hover:bg-brand-border/20 active:bg-brand-border/40'
                                          }`}
                                        >
                                          <span className="leading-none">{numValue}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="flex justify-between items-start text-[10px] font-mono font-medium text-brand-text/50 px-1">
                                    <div className="max-w-[45%] leading-relaxed">
                                      <span className="font-mono text-[9px] uppercase block text-brand-accent mb-0.5 font-bold">Min (1)</span>
                                      {label1}
                                    </div>
                                    <div className="max-w-[45%] text-right leading-relaxed">
                                      <span className="font-mono text-[9px] uppercase block text-brand-accent mb-0.5 font-bold">Max (5)</span>
                                      {label5}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Standard layout
                            return (
                              <div className="space-y-2.5">
                                {currentQuestion.options.map((opt) => {
                                  const answerValue = (engineState.answers[currentQuestion.id] as string) || '';
                                  const isSelected = answerValue === opt || 
                                    (isAutreOption(opt) && answerValue.startsWith(opt + ' : '));
                                  return (
                                    <div key={opt} className="space-y-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isAutreOption(opt)) {
                                            const currentVal = (engineState.answers[currentQuestion.id] as string) || '';
                                            if (currentVal.startsWith(opt + ' : ')) {
                                              engineRef.current?.setSingleChoiceAnswer(currentVal);
                                            } else {
                                              engineRef.current?.setSingleChoiceAnswer(opt);
                                            }
                                          } else {
                                            engineRef.current?.setSingleChoiceAnswer(opt);
                                          }
                                        }}
                                        className={`w-full text-left p-4 rounded-none border text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                                          isSelected
                                            ? 'bg-brand-surface/50 border-brand-primary text-brand-text ring-1 ring-brand-primary/40'
                                            : 'bg-white hover:bg-brand-surface/35 border-brand-border/60 hover:border-brand-accent/50 text-brand-text/90 active:bg-brand-surface/60'
                                        }`}
                                      >
                                        <span className="pr-4 leading-relaxed">{opt}</span>
                                        <div className={`h-4.5 w-4.5 rounded-none border shrink-0 flex items-center justify-center transition-all ${
                                          isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-brand-border/80 bg-brand-bg'
                                        }`}>
                                          {isSelected && (
                                            <motion.div
                                              initial={{ scale: 0.5 }}
                                              animate={{ scale: 1 }}
                                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            >
                                              <Check className="h-3 w-3 stroke-[3]" />
                                            </motion.div>
                                          )}
                                        </div>
                                      </button>
                                      {isSelected && isAutreOption(opt) && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="px-0.5"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Veuillez préciser..."
                                            value={answerValue.startsWith(opt + ' : ') ? answerValue.slice((opt + ' : ').length) : ''}
                                            onChange={(e) => handleAutreTextChange(opt, e.target.value)}
                                            className="w-full p-3 bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 rounded-none text-sm font-normal outline-hidden transition-all shadow-xs"
                                            autoFocus
                                          />
                                        </motion.div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* MULTIPLE CHOICE */}
                      {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                        <div className="space-y-2.5">
                          {currentQuestion.options.map((opt) => {
                            const selectedList = (engineState.answers[currentQuestion.id] as string[]) || [];
                            const isSelected = selectedList.includes(opt) || 
                              (isAutreOption(opt) && selectedList.some(item => item.startsWith(opt + ' : ')));
                            return (
                              <div key={opt} className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleMultipleChoiceToggle(opt)}
                                  className={`w-full text-left p-4 rounded-none border text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                                    isSelected
                                      ? 'bg-brand-surface/50 border-brand-primary text-brand-text ring-1 ring-brand-primary/40'
                                      : 'bg-white hover:bg-brand-surface/35 border-brand-border/60 hover:border-brand-accent/50 text-brand-text/90 active:bg-brand-surface/60'
                                  }`}
                                >
                                  <span className="pr-4 leading-relaxed">{opt}</span>
                                  <div className={`h-4.5 w-4.5 rounded-none border shrink-0 flex items-center justify-center transition-all ${
                                    isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-brand-border/80 bg-brand-bg'
                                  }`}>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                      >
                                        <Check className="h-3 w-3 stroke-[3]" />
                                      </motion.div>
                                    )}
                                  </div>
                                </button>
                                {isSelected && isAutreOption(opt) && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-0.5"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Veuillez préciser..."
                                      value={(() => {
                                        const matchingItem = selectedList.find(item => item === opt || item.startsWith(opt + ' : '));
                                        if (matchingItem && matchingItem.startsWith(opt + ' : ')) {
                                          return matchingItem.slice((opt + ' : ').length);
                                        }
                                        return '';
                                      })()}
                                      onChange={(e) => handleMultipleChoiceAutreTextChange(opt, e.target.value)}
                                      className="w-full p-3 bg-white border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 rounded-none text-sm font-normal outline-hidden transition-all shadow-xs"
                                      autoFocus
                                    />
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* OPEN-ENDED TEXT */}
                      {currentQuestion.type === 'text' && (
                        <div className="space-y-3">
                          <textarea
                            value={(engineState.answers[currentQuestion.id] as string) || ''}
                            onChange={(e) => engineRef.current?.setTextAnswer(e.target.value)}
                            placeholder={currentQuestion.placeholder || 'Saisissez votre réponse libre ici...'}
                            rows={6}
                            className="w-full p-4 text-xs sm:text-sm bg-white border border-brand-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text transition-all leading-relaxed font-sans font-light resize-y"
                          />
                          {isLastTwoTextQuestions && (
                            <div className="flex items-center gap-1.5 p-2 bg-[#F4F4F1] border border-brand-border/40 text-[10px] text-brand-text/60 font-mono font-medium uppercase tracking-wider">
                              <Info className="h-3.5 w-3.5 text-brand-accent shrink-0" />
                              <span>Cette question est facultative. Vous pouvez la laisser vide.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Control Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-brand-border/60">
                  <button
                    onClick={() => engineRef.current?.previousQuestion()}
                    disabled={engineState.currentIndex === 0}
                    className={`inline-flex items-center space-x-1.5 px-5 py-3 rounded-none text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                      engineState.currentIndex === 0
                        ? 'text-brand-text/30 border-brand-border/40 bg-brand-surface/45 cursor-not-allowed'
                        : 'text-brand-text border-brand-border bg-white hover:bg-brand-surface cursor-pointer'
                    }`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Précédent</span>
                  </button>

                  <button
                    onClick={() => engineRef.current?.nextQuestion()}
                    disabled={engineState.isSubmitting}
                    className={`inline-flex items-center justify-center px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white rounded-none transition-all border ${
                      engineState.isSubmitting
                        ? 'bg-brand-primary/60 border-brand-primary/40 cursor-not-allowed'
                        : 'bg-brand-primary hover:bg-brand-primary/95 border-brand-primary cursor-pointer shadow-xs'
                    }`}
                    id="next-question-btn"
                  >
                    <span>
                      {engineState.isSubmitting 
                        ? 'Soumission...' 
                        : engineState.currentIndex === survey.questions.length - 1 
                          ? 'Terminer l\'étude' 
                          : 'Suivant'}
                    </span>
                    {!engineState.isSubmitting && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
                    {engineState.isSubmitting && (
                      <svg className="animate-spin ml-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Secure confidentiality notice */}
                <div className="mt-8 flex items-center justify-center space-x-1.5 text-[9px] text-brand-text/45 font-mono font-bold uppercase tracking-widest border-t border-brand-border/30 pt-4">
                  <ShieldCheck className="h-4 w-4 text-brand-success shrink-0" />
                  <span>Traitement crypté & anonymisation totale de Niveau 1 garantie par le protocole HOST.</span>
                </div>
              </motion.div>
            </div>

          </div>
        ) : (
          // ================= SCREEN 3: END OF QUESTIONNAIRE =================
          <motion.div
            key="completed-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-white border border-brand-border/80 rounded-none p-6 sm:p-10 shadow-xs text-center relative overflow-hidden font-sans"
          >
            {/* Terracotta brand top line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
            <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-brand-accent/30 pointer-events-none" />

            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-none bg-brand-surface border border-brand-border/80 mb-6 text-brand-primary">
              <CheckCircle className="h-6 w-6 text-brand-success" />
            </div>

            <h2 className="font-display font-semibold text-xl sm:text-2xl text-brand-text tracking-tight max-w-lg mx-auto leading-snug">
              Merci pour votre précieuse contribution
            </h2>
            
            <p className="text-brand-accent font-mono text-[9px] font-bold uppercase tracking-widest mt-2 mb-5">
              Diagnostic n°{survey.number} complété avec rigueur
            </p>

            {/* Displaying unique submissionId for research and export reference */}
            {engineState.submissionId && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-brand-surface border border-brand-border/80 text-brand-text font-mono text-[9px] mb-8">
                <span className="font-semibold text-brand-text/50">RÉFÉRENCE :</span>
                <span className="font-bold text-brand-primary">{engineState.submissionId}</span>
              </div>
            )}

            <p className="text-brand-text/75 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-8 font-light">
              Vos réponses ont été enregistrées avec rigueur. Elles alimenteront nos analyses pour bâtir des diagnostics socio-économiques précis et éclairer les projets à venir.
            </p>

            {/* Recruitment form container */}
            <div className="bg-brand-surface border border-brand-border/80 rounded-none p-6 text-left max-w-md mx-auto mb-8">
              {!engineState.interviewSubmitted ? (
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-sm text-brand-text flex items-center space-x-2">
                    <MessageSquare className="h-4.5 w-4.5 text-brand-primary shrink-0" />
                    <span>Souhaitez-vous participer à un entretien ?</span>
                  </h3>
                  <p className="text-xs text-brand-text/60 leading-relaxed font-light">
                    Pour aller plus loin, nous organisons de courts entretiens approfondis (facultatifs, 15 min). Acceptez-vous d'être contacté(e) ?
                  </p>

                  {/* Choice controls */}
                  <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-[10px] uppercase tracking-wider font-bold">
                    <button
                      type="button"
                      onClick={() => engineRef.current?.setWantsInterview(true)}
                      className={`py-2.5 px-3 rounded-none border text-center transition-all cursor-pointer ${
                        engineState.wantsInterview === true
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-brand-text/80 border-brand-border/80 hover:bg-brand-surface'
                      }`}
                    >
                      Oui, volontiers
                    </button>
                    <button
                      type="button"
                      onClick={() => engineRef.current?.setWantsInterview(false)}
                      className={`py-2.5 px-3 rounded-none border text-center transition-all cursor-pointer ${
                        engineState.wantsInterview === false
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-brand-text/80 border-brand-border/80 hover:bg-brand-surface'
                      }`}
                    >
                      Non, merci
                    </button>
                  </div>

                  {/* Fields if YES */}
                  <AnimatePresence>
                    {engineState.wantsInterview === true && (
                      <motion.form
                        onSubmit={handleInterviewSubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t border-brand-border/60 overflow-hidden"
                      >
                        <div>
                          <label htmlFor="first_name_input" className="block text-[9px] font-bold text-brand-text/50 uppercase tracking-widest font-mono mb-1.5">
                            Prénom & Nom
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-3.5 w-3.5 text-brand-text/40" />
                            </div>
                            <input
                              type="text"
                              id="first_name_input"
                              required
                              value={engineState.firstName}
                              onChange={(e) => engineRef.current?.setFirstName(e.target.value)}
                              placeholder="Ex: Jean-Eudes Kouadio"
                              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-brand-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="contact_input" className="block text-[9px] font-bold text-brand-text/50 uppercase tracking-widest font-mono mb-1.5">
                            Numéro de téléphone ou Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <PhoneCall className="h-3.5 w-3.5 text-brand-text/40" />
                            </div>
                            <input
                              type="text"
                              id="contact_input"
                              required
                              value={engineState.contact}
                              onChange={(e) => engineRef.current?.setContact(e.target.value)}
                              placeholder="Ex: +225 07..."
                              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-brand-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full mt-2 py-3 px-4 text-xs font-mono uppercase tracking-wider font-bold text-white bg-brand-primary hover:bg-brand-primary/95 rounded-none border border-brand-primary transition-colors cursor-pointer text-center"
                        >
                          Enregistrer mon contact
                        </button>
                      </motion.form>
                    )}

                    {engineState.wantsInterview === false && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-2 text-center"
                      >
                        <button
                          onClick={handleInterviewSubmit}
                          className="w-full py-3 px-4 text-xs font-mono uppercase tracking-wider font-bold text-brand-text/80 bg-white hover:bg-brand-surface border border-brand-border rounded-none transition-colors cursor-pointer"
                        >
                          Valider et quitter
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center h-10 w-10 bg-brand-surface border border-brand-border/80 text-brand-success mb-3 rounded-none">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <h4 className="font-semibold text-sm text-brand-text">Choix enregistré !</h4>
                  <p className="text-xs text-brand-text/60 mt-1.5 leading-relaxed font-light">
                    Merci pour votre retour. Nous ajustons nos panels en conséquence.
                  </p>
                </div>
              )}
            </div>

            {/* Quick stats counter in localStorage to make it fun */}
            <div className="flex items-center justify-center space-x-1.5 text-[9px] text-brand-text/50 font-mono font-bold uppercase tracking-widest mb-8">
              <Award className="h-4 w-4 text-brand-accent" />
              <span>
                Total réponses enregistrées sur cet appareil :{' '}
                <strong className="text-brand-primary">
                  {JSON.parse(localStorage.getItem('host_survey_all_submissions') || '[]').length}
                </strong>
              </span>
            </div>

            {/* Final return button */}
            <button
              onClick={() => {
                engineRef.current?.reset();
                onBackToHome();
              }}
              className="px-6 py-3.5 bg-brand-surface hover:bg-brand-border/40 text-brand-text/80 border border-brand-border rounded-none font-mono text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer"
              id="return-portal-btn"
            >
              Retourner au portail
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
