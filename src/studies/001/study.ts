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
    title: 'Budget & Habitudes financières',
    description: 'Comprendre les ressources financières des étudiants, leurs habitudes de dépenses, leur capacité d\'épargne et les difficultés économiques qui influencent leur quotidien.'
  },
  {
    id: 'm4_frictions',
    title: 'Frictions & Difficultés majeures',
    description: 'Comprendre les principaux blocages rencontrés par les étudiants dans leur vie académique et quotidienne : études, transport, finances, digital, accès aux services.'
  },
  {
    id: 'm5_workarounds',
    title: 'Contournements & Connectivité',
    description: 'Étudier comment les étudiants s\'organisent et surmontent leurs obstacles.'
  },
  {
    id: 'm6_opportunities',
    title: 'Opportunités & Solutions d\'avenir',
    description: 'Recueillir l\'imagination et les besoins de solutions des étudiants.'
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
