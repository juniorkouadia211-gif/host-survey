/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Study } from './types';
import { STUDY_001 } from './studies/001/study';

// Extensible registry of active studies on HOST Survey
export const ALL_STUDIES: Study[] = [
  STUDY_001
];

export const SURVEY_UNDERSTUDENTS_CI_001 = STUDY_001;

/**
 * Utility helper to retrieve a study by its unique code or number
 */
export function findStudyById(id: string): Study | undefined {
  return ALL_STUDIES.find((study) => study.id === id);
}

export function findStudyByNumber(num: string): Study | undefined {
  return ALL_STUDIES.find((study) => study.number === num);
}
