/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ISurveyRepository, SurveyResponse } from '../types';

export class LocalStorageSurveyRepository implements ISurveyRepository {
  private readonly storageKey = 'host_survey_all_submissions';

  /**
   * Generates a robust, highly unique ID for research referencing
   * Format: HS-YYYY-[6 Padded digits]
   * Example: HS-2026-081734
   */
  public generateSubmissionId(): string {
    const year = new Date().getFullYear();
    // Generate a secure-enough 6-digit random number
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `HS-${year}-${randomNum}`;
  }

  public async saveResponse(response: SurveyResponse): Promise<boolean> {
    try {
      const allResponses = await this.getResponses();
      
      // Check if submissionId is already set; if not, generate one
      if (!response.submissionId) {
        response.submissionId = this.generateSubmissionId();
      }

      // Check if this submission already exists in the local list
      const existingIndex = allResponses.findIndex(r => r.submissionId === response.submissionId);
      if (existingIndex !== -1) {
        allResponses[existingIndex] = response;
      } else {
        allResponses.push(response);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(allResponses));
      return true;
    } catch (e) {
      console.error('Error saving survey response to local repository:', e);
      return false;
    }
  }

  public async getResponses(studyId?: string): Promise<SurveyResponse[]> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed: SurveyResponse[] = JSON.parse(raw);
      if (studyId) {
        return parsed.filter((r) => r.studyId === studyId);
      }
      return parsed;
    } catch (e) {
      console.error('Error reading survey responses:', e);
      return [];
    }
  }

  public async getResponsesCount(studyId: string): Promise<number> {
    const list = await this.getResponses(studyId);
    return list.length;
  }
}

// Global Export of active repository for application-wide dependency injection
export const surveyRepository: LocalStorageSurveyRepository = new LocalStorageSurveyRepository();
