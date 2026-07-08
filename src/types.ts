/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionType = 'single_choice' | 'multiple_choice' | 'text' | 'rating';

export interface StudyModule {
  id: string;
  title: string; // e.g. "Contexte", "Vie quotidienne", "Habitudes", "Frictions", "Contournements", "Opportunités"
  description?: string;
}

export interface Question {
  id: string;
  moduleId: string; // Links this question to a specific methodological block
  text: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  required: boolean;
  helpText?: string;
}

export interface Study {
  id: string;
  number: string; // e.g. "001"
  code: string; // e.g. "Understudents"
  title: string; // e.g. "Étude n°001"
  subtitle: string;
  description: string;
  estimatedTime: string; // e.g. "8 minutes"
  targetAudience: string;
  country: string;
  modules: StudyModule[];
  questions: Question[];
  coverImage?: string; // Prepared for future UI upgrades
  metadata?: Record<string, any>; // Extensible metadata
}

export interface QuestionMetric {
  questionId: string;
  startedAt: string;
  answeredAt?: string;
  durationSeconds: number;
}

export interface JourneyData {
  firstQuestionStartedAt: string;
  lastQuestionAnsweredAt?: string;
  totalDuration: string | number; // e.g., duration in seconds or minutes formatted
  questionsVisited: string[];
  abandonedAtQuestion: string | null;
}

export interface SurveyResponse {
  submissionId: string; // HS-2026-XXXXXX
  studyId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
  wantsInterview?: boolean;
  contactInfo?: {
    firstName?: string;
    contact?: string; // phone / email
  };
  // Metadata fields for analytics & dashboard
  startedAt?: string;
  completedAt?: string;
  progressPercent?: number;
  lastQuestionIndex?: number;
  lastQuestionId?: string;
  lastModuleId?: string;
  lastModuleTitle?: string;
  abandoned?: boolean;
  syncStatus?: 'pending' | 'synced' | 'failed';
  questionMetrics?: QuestionMetric[];
  journeyData?: JourneyData;
}

/**
 * Storage Abstraction layer
 * Allows HOST Survey engine to persist data to LocalStorage, 
 * and swap seamlessly to Google Sheets, Supabase, or PostgreSQL in the future.
 */
export interface ISurveyRepository {
  generateSubmissionId(): string;
  saveResponse(response: SurveyResponse): Promise<boolean>;
  getResponses(studyId?: string): Promise<SurveyResponse[]>;
  getResponsesCount(studyId: string): Promise<number>;
}
