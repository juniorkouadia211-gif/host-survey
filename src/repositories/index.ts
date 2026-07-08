/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ISurveyRepository } from '../types';
import { LocalStorageSurveyRepository } from './LocalStorageSurveyRepository';
import { GoogleSheetsRepository } from './adapters/GoogleSheetsRepository';

// Always use GoogleSheetsRepository to support seamless backend proxy syncing.
export const surveyRepository: ISurveyRepository & {
  syncPendingResponses?: () => Promise<{ synced: number; failed: number }>;
} = new GoogleSheetsRepository();

export { LocalStorageSurveyRepository } from './LocalStorageSurveyRepository';
export { GoogleSheetsRepository } from './adapters/GoogleSheetsRepository';
