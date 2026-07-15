/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Study, StudyModule } from '../../types';
import { QUESTIONS_001 } from './questions';

export const MODULES_001: StudyModule[] = [
  {
    id: 'm1_context',
    title: 'Contexte académique',
    description: 'Comprendre le cadre d\'études et les bases de l\'étudiant.'
  },
  {
    id: 'm2_vie_quotidienne',
    title: 'Vie quotidienne & Mobilité',
    description: 'Comprendre le mode de vie des étudiants, leurs habitudes de déplacement, leur temps de transport et les contraintes quotidiennes pouvant influencer leur expérience universitaire.'
  },
  {
    id: 'm3_budget',
    title: 'Comprendre le problème',
    description: 'Identifier précisément la principale difficulté des étudiants, sa fréquence, leurs solutions actuelles et l\'impact de sa résolution.'
  },
  {
    id: 'm4_frictions',
    title: 'Solutions actuelles',
    description: 'Recueillir l\'avis des étudiants sur les améliorations prioritaires, leurs propositions de solutions et le rôle de la technologie.'
  },
  {
    id: 'm5_workarounds',
    title: 'Vision d\'avenir',
    description: 'Recueillir la vision à long terme des étudiants, leur volonté d\'adopter de nouvelles solutions et d\'y contribuer.'
  }
];

export const STUDY_001: Study = {
  id: 'understudents-ci-001',
  number: '001',
  code: 'Understudents',
  title: 'Étude n°001',
  subtitle: 'Comprendre la vie quotidienne des étudiants en Côte d\'Ivoire',
  description: 'Cette étude vise à comprendre les réalités, habitudes et difficultés rencontrées par les étudiants afin d\'identifier les opportunités de solutions adaptées au contexte africain.',
  estimatedTime: '8 minutes',
  targetAudience: 'Étudiants résidant en Côte d\'Ivoire',
  country: 'Côte d\'Ivoire',
  modules: MODULES_001,
  questions: QUESTIONS_001
};