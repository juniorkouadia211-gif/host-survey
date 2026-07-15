/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Study, Question, StudyModule, SurveyResponse, QuestionMetric, JourneyData } from '../types';
import { surveyRepository } from '../repositories';

export interface SurveyEngineState {
  currentIndex: number;
  answers: Record<string, string | string[]>;
  isCompleted: boolean;
  error: string | null;
  wantsInterview: boolean | null;
  firstName: string;
  contact: string;
  interviewSubmitted: boolean;
  submissionId: string | null;
  isSubmitting: boolean;
  startedAt?: string;
}

export class SurveyEngine {
  private study: Study;
  private state: SurveyEngineState;
  private onStateChange: (state: SurveyEngineState) => void;

  // New fields for tracking analytics
  private currentQuestionStartedAt: string;
  private questionMetrics: Record<string, QuestionMetric> = {};
  private questionsVisited: string[] = [];
  private firstQuestionStartedAt: string;

  constructor(study: Study, onStateChange: (state: SurveyEngineState) => void, initialState?: Partial<SurveyEngineState>) {
    this.study = study;
    this.onStateChange = onStateChange;

    const initialStartedAt = initialState?.startedAt || new Date().toISOString();

    this.state = {
      currentIndex: 0,
      answers: {},
      isCompleted: false,
      error: null,
      wantsInterview: null,
      firstName: '',
      contact: '',
      interviewSubmitted: false,
      submissionId: null,
      isSubmitting: false,
      startedAt: initialStartedAt,
    this.state = {
      ...initialState
    };

    // Garantie que l'index courant reste dans les limites autorisées de la liste des questions
    if (this.study.questions.length > 0) {
      if (this.state.currentIndex >= this.study.questions.length) {
        this.state.currentIndex = this.study.questions.length - 1;
      }
      if (this.state.currentIndex < 0) {
        this.state.currentIndex = 0;
      }
    } else {
      this.state.currentIndex = 0;
    }

    // Initialize metrics
    this.currentQuestionStartedAt = new Date().toISOString();
    this.firstQuestionStartedAt = initialStartedAt;

    const currentQ = this.getCurrentQuestion();
    if (currentQ) {
      this.questionsVisited.push(currentQ.id);
      this.questionMetrics[currentQ.id] = {
        questionId: currentQ.id,
        startedAt: this.currentQuestionStartedAt,
        durationSeconds: 0
      };
    }

    this.notify();
  }

  private notify() {
    this.onStateChange({ ...this.state });
  }

  public getStudy(): Study {
    return this.study;
  }

  public getState(): SurveyEngineState {
    return this.state;
  }

  public getCurrentQuestion(): Question {
    return this.study.questions[this.state.currentIndex];
  }

  public getCurrentModule(): StudyModule | undefined {
    const question = this.getCurrentQuestion();
    if (!question) return undefined;
    return this.study.modules.find((m) => m.id === question.moduleId);
  }

  public getProgressPercentage(): number {
    if (this.study.questions.length === 0) return 0;
    return Math.round((this.state.currentIndex / this.study.questions.length) * 100);
  }

  /**
   * Check if a valid, non-empty draft exists for this study in LocalStorage
   */
  public hasDraft(): boolean {
    try {
      const draft = localStorage.getItem(`host_survey_draft_${this.study.id}`);
      if (!draft) return false;
      const parsed = JSON.parse(draft);
      return parsed && parsed.answers && Object.keys(parsed.answers).length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Restores engine state from saved draft
   */
  public loadDraft(): void {
    try {
      const draft = localStorage.getItem(`host_survey_draft_${this.study.id}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        let restoredIndex = parsed.currentIndex ?? 0;
        if (this.study.questions.length > 0) {
          if (restoredIndex >= this.study.questions.length) {
            restoredIndex = this.study.questions.length - 1;
          }
          if (restoredIndex < 0) {
            restoredIndex = 0;
          }
        } else {
          restoredIndex = 0;
        }
        this.state.currentIndex = restoredIndex;
        this.state.answers = parsed.answers ?? {};
        this.state.startedAt = parsed.startedAt ?? new Date().toISOString();
        
        // Restore timing arrays if available, otherwise reset
        this.questionMetrics = parsed.questionMetrics ?? {};
        this.questionsVisited = parsed.questionsVisited ?? [];
        this.firstQuestionStartedAt = parsed.firstQuestionStartedAt ?? this.state.startedAt;
        
        this.state.error = null;

        // Reset display timer for loaded question
        this.currentQuestionStartedAt = new Date().toISOString();
        const currentQ = this.getCurrentQuestion();
        if (currentQ) {
          if (!this.questionsVisited.includes(currentQ.id)) {
            this.questionsVisited.push(currentQ.id);
          }
          if (!this.questionMetrics[currentQ.id]) {
            this.questionMetrics[currentQ.id] = {
              questionId: currentQ.id,
              startedAt: this.currentQuestionStartedAt,
              durationSeconds: 0
            };
          } else {
            // Update its starting timestamp for the current active view period
            this.questionMetrics[currentQ.id].startedAt = this.currentQuestionStartedAt;
          }
        }

        this.notify();
      }
    } catch (e) {
      console.error('Error loading survey draft:', e);
    }
  }

  /**
   * Discards the saved draft and resets the engine state
   */
  public discardDraft(): void {
    try {
      localStorage.removeItem(`host_survey_draft_${this.study.id}`);
    } catch (e) {
      console.error('Error discarding survey draft:', e);
    }
    this.state.currentIndex = 0;
    this.state.answers = {};
    this.state.error = null;
    this.state.startedAt = new Date().toISOString();

    // Reset analytics
    this.currentQuestionStartedAt = new Date().toISOString();
    this.firstQuestionStartedAt = this.state.startedAt;
    this.questionMetrics = {};
    this.questionsVisited = [];

    const currentQ = this.getCurrentQuestion();
    if (currentQ) {
      this.questionsVisited.push(currentQ.id);
      this.questionMetrics[currentQ.id] = {
        questionId: currentQ.id,
        startedAt: this.currentQuestionStartedAt,
        durationSeconds: 0
      };
    }

    this.notify();
  }

  /**
   * Persists active answers and progression index as a draft
   */
  private saveDraft(): void {
    if (this.state.isCompleted) return;
    try {
      const draft = {
        currentIndex: this.state.currentIndex,
        answers: this.state.answers,
        startedAt: this.state.startedAt || new Date().toISOString(),
        questionMetrics: this.questionMetrics,
        questionsVisited: this.questionsVisited,
        firstQuestionStartedAt: this.firstQuestionStartedAt
      };
      localStorage.setItem(`host_survey_draft_${this.study.id}`, JSON.stringify(draft));
    } catch (e) {
      console.error('Error auto-saving draft:', e);
    }
  }

  /**
   * Clears the draft from storage (e.g. upon successful submission)
   */
  public clearDraft(): void {
    try {
      localStorage.removeItem(`host_survey_draft_${this.study.id}`);
    } catch (e) {
      console.error('Error clearing survey draft:', e);
    }
  }

  /**
   * Measures time spent on the active question since entry/resume and saves it.
   */
  private finalizeCurrentQuestionMetric(): void {
    const currentQ = this.getCurrentQuestion();
    if (!currentQ) return;

    const metric = this.questionMetrics[currentQ.id];
    const now = new Date();
    const started = metric ? new Date(metric.startedAt) : new Date(this.currentQuestionStartedAt);
    const durationMs = now.getTime() - started.getTime();
    const durationSec = Math.max(0, Math.round(durationMs / 1000));

    this.questionMetrics[currentQ.id] = {
      questionId: currentQ.id,
      startedAt: metric ? metric.startedAt : this.currentQuestionStartedAt,
      answeredAt: now.toISOString(),
      durationSeconds: (metric?.durationSeconds || 0) + durationSec
    };
  }

  public updateAnswer(questionId: string, value: string | string[]): void {
    this.state.answers[questionId] = value;
    this.state.error = null;
    this.saveDraft();
    this.notify();
  }

  public setSingleChoiceAnswer(option: string): void {
    const question = this.getCurrentQuestion();
    if (question) {
      this.updateAnswer(question.id, option);
    }
  }

  public setMultipleChoiceAnswer(option: string): void {
    const question = this.getCurrentQuestion();
    if (question) {
      const currentSelection = (this.state.answers[question.id] as string[]) || [];
      const nextSelection = currentSelection.includes(option)
        ? currentSelection.filter((item) => item !== option)
        : [...currentSelection, option];
      this.updateAnswer(question.id, nextSelection);
    }
  }

  public setTextAnswer(value: string): void {
    const question = this.getCurrentQuestion();
    if (question) {
      this.updateAnswer(question.id, value);
    }
  }

  public validateCurrentAnswer(): boolean {
    const question = this.getCurrentQuestion();
    if (!question) return true;

    if (question.required) {
      const answer = this.state.answers[question.id];
      if (answer === undefined || answer === null || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
        this.state.error = 'Cette question est obligatoire. Veuillez y répondre pour continuer.';
        this.notify();
        return false;
      }
    }

    this.state.error = null;
    return true;
  }

  public nextQuestion(): void {
    if (!this.validateCurrentAnswer()) {
      return;
    }

    this.finalizeCurrentQuestionMetric();

    if (this.state.currentIndex < this.study.questions.length - 1) {
      this.state.currentIndex += 1;
      this.state.error = null;

      this.currentQuestionStartedAt = new Date().toISOString();
      const newQ = this.getCurrentQuestion();
      if (newQ) {
        if (!this.questionsVisited.includes(newQ.id)) {
          this.questionsVisited.push(newQ.id);
        }
        if (!this.questionMetrics[newQ.id]) {
          this.questionMetrics[newQ.id] = {
            questionId: newQ.id,
            startedAt: this.currentQuestionStartedAt,
            durationSeconds: 0
          };
        } else {
          this.questionMetrics[newQ.id].startedAt = this.currentQuestionStartedAt;
        }
      }

      this.saveDraft();
      this.notify();
    } else {
      this.submitSurvey();
    }
  }

  public previousQuestion(): void {
    if (this.state.currentIndex > 0) {
      this.finalizeCurrentQuestionMetric();

      this.state.currentIndex -= 1;
      this.state.error = null;

      this.currentQuestionStartedAt = new Date().toISOString();
      const newQ = this.getCurrentQuestion();
      if (newQ) {
        if (!this.questionsVisited.includes(newQ.id)) {
          this.questionsVisited.push(newQ.id);
        }
        if (!this.questionMetrics[newQ.id]) {
          this.questionMetrics[newQ.id] = {
            questionId: newQ.id,
            startedAt: this.currentQuestionStartedAt,
            durationSeconds: 0
          };
        } else {
          this.questionMetrics[newQ.id].startedAt = this.currentQuestionStartedAt;
        }
      }

      this.saveDraft();
      this.notify();
    }
  }

  /**
   * Finalizes the main study and saves the anonymous responses to storage
   */
  private async submitSurvey(): Promise<void> {
    if (this.state.isCompleted || this.state.isSubmitting) return;
    this.state.isSubmitting = true;
    this.notify();

    this.finalizeCurrentQuestionMetric();

    const submissionId = surveyRepository.generateSubmissionId();
    const currentQuestion = this.getCurrentQuestion();
    const currentModule = this.getCurrentModule();

    // Calculate total duration
    const totalDurationSec = Math.round((new Date().getTime() - new Date(this.state.startedAt || new Date().toISOString()).getTime()) / 1000);

    // Build standard structure journey data
    const journeyData: JourneyData = {
      firstQuestionStartedAt: this.firstQuestionStartedAt || this.state.startedAt || new Date().toISOString(),
      lastQuestionAnsweredAt: new Date().toISOString(),
      totalDuration: totalDurationSec,
      questionsVisited: [...this.questionsVisited],
      abandonedAtQuestion: null
    };

    const response: SurveyResponse = {
      submissionId,
      studyId: this.study.id,
      answers: this.state.answers,
      submittedAt: new Date().toISOString(),
      startedAt: this.state.startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      progressPercent: 100,
      lastQuestionIndex: this.state.currentIndex,
      lastQuestionId: currentQuestion ? currentQuestion.id : 'N/A',
      lastModuleId: currentModule ? currentModule.id : 'N/A',
      lastModuleTitle: currentModule ? currentModule.title : 'N/A',
      abandoned: false,
      syncStatus: 'pending',
      questionMetrics: Object.values(this.questionMetrics),
      journeyData
    };

    const success = await surveyRepository.saveResponse(response);
    if (success) {
      this.state.submissionId = submissionId;
      this.state.isCompleted = true;
      this.clearDraft(); // Ensure we delete draft once finalized
      try {
        window.dispatchEvent(new Event('survey_submitted'));
      } catch (err) {
        console.error('Error dispatching event:', err);
      }
    } else {
      this.state.error = 'Une erreur est survenue lors de l\'enregistrement de vos réponses. Veuillez réessayer.';
    }
    
    this.state.isSubmitting = false;
    this.notify();
  }

  /**
   * Records a user dropout as an anonymous, abandoned survey response for research analytics
   */
  public async recordAbandonment(): Promise<void> {
    // Only record if some questions have been answered to prevent blank noise rows
    if (this.state.isCompleted || Object.keys(this.state.answers).length === 0) return;

    this.finalizeCurrentQuestionMetric();

    const submissionId = this.state.submissionId || surveyRepository.generateSubmissionId();
    const currentQuestion = this.getCurrentQuestion();
    const currentModule = this.getCurrentModule();

    // Calculate total duration
    const totalDurationSec = Math.round((new Date().getTime() - new Date(this.state.startedAt || new Date().toISOString()).getTime()) / 1000);

    const journeyData: JourneyData = {
      firstQuestionStartedAt: this.firstQuestionStartedAt || this.state.startedAt || new Date().toISOString(),
      lastQuestionAnsweredAt: new Date().toISOString(),
      totalDuration: totalDurationSec,
      questionsVisited: [...this.questionsVisited],
      abandonedAtQuestion: currentQuestion ? currentQuestion.id : 'N/A'
    };

    const response: SurveyResponse = {
      submissionId,
      studyId: this.study.id,
      answers: this.state.answers,
      submittedAt: new Date().toISOString(),
      startedAt: this.state.startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      progressPercent: this.getProgressPercentage(),
      lastQuestionIndex: this.state.currentIndex,
      lastQuestionId: currentQuestion ? currentQuestion.id : 'N/A',
      lastModuleId: currentModule ? currentModule.id : 'N/A',
      lastModuleTitle: currentModule ? currentModule.title : 'N/A',
      abandoned: true,
      syncStatus: 'pending',
      questionMetrics: Object.values(this.questionMetrics),
      journeyData
    };

    await surveyRepository.saveResponse(response);
    this.clearDraft();
    try {
      window.dispatchEvent(new Event('survey_submitted'));
    } catch (err) {
      console.error('Error dispatching event:', err);
    }
  }

  public setWantsInterview(wants: boolean): void {
    this.state.wantsInterview = wants;
    this.notify();
  }

  public setFirstName(name: string): void {
    this.state.firstName = name;
    this.notify();
  }

  public setContact(contactInfo: string): void {
    this.state.contact = contactInfo;
    this.notify();
  }

  /**
   * Appends research recruitment context optionally at Screen 3
   */
  public async submitInterviewConsent(): Promise<void> {
    if (this.state.wantsInterview === null) return;

    try {
      const allResponses = await surveyRepository.getResponses();
      if (allResponses.length > 0) {
        // Find current submission or append to last response matching the current study
        const lastResponse = allResponses.find(
          (r) => r.submissionId === this.state.submissionId
        ) || allResponses[allResponses.length - 1];

        if (lastResponse) {
          lastResponse.wantsInterview = this.state.wantsInterview;
          if (this.state.wantsInterview) {
            lastResponse.contactInfo = {
              firstName: this.state.firstName,
              contact: this.state.contact
            };
          }
          // Reset syncStatus to trigger updated push to Google Sheets
          lastResponse.syncStatus = 'pending';
          
          // Re-submit updated response with contact details
          await surveyRepository.saveResponse(lastResponse);
          try {
            window.dispatchEvent(new Event('survey_submitted'));
          } catch (err) {
            console.error('Error dispatching event:', err);
          }
        }
      }
      this.state.interviewSubmitted = true;
      this.notify();
    } catch (e) {
      console.error('Error recording interview choices:', e);
    }
  }

  public reset(): void {
    this.state = {
      currentIndex: 0,
      answers: {},
      isCompleted: false,
      error: null,
      wantsInterview: null,
      firstName: '',
      contact: '',
      interviewSubmitted: false,
      submissionId: null,
      isSubmitting: false,
      startedAt: new Date().toISOString()
    };

    this.currentQuestionStartedAt = new Date().toISOString();
    this.firstQuestionStartedAt = this.state.startedAt;
    this.questionMetrics = {};
    this.questionsVisited = [];

    const currentQ = this.getCurrentQuestion();
    if (currentQ) {
      this.questionsVisited.push(currentQ.id);
      this.questionMetrics[currentQ.id] = {
        questionId: currentQ.id,
        startedAt: this.currentQuestionStartedAt,
        durationSeconds: 0
      };
    }

    this.notify();
  }
}
