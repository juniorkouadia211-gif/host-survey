/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../../types';

export const QUESTIONS_001: Question[] = [
  {
    id: 'q001_establishment',
    moduleId: 'm1_context',
    text: 'Quel est votre établissement ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez le nom de votre établissement...'
  },
  {
    id: 'q002_city',
    moduleId: 'm1_context',
    text: 'Dans quelle ville étudiez-vous ?',
    type: 'single_choice',
    required: true,
    options: [
      'Abidjan',
      'Bouaké',
      'Yamoussoukro',
      'Daloa',
      'Korhogo',
      'San Pedro',
      'Autre'
    ]
  },
  {
    id: 'q003_level',
    moduleId: 'm1_context',
    text: 'Quel est votre niveau d\'étude actuel ?',
    type: 'single_choice',
    required: true,
    options: [
      'BTS 1',
      'BTS 2',
      'Licence 1',
      'Licence 2',
      'Licence 3',
      'Master 1',
      'Master 2',
      'Doctorat',
      'Autre'
    ]
  },
  {
    id: 'q004_field',
    moduleId: 'm1_context',
    text: 'Quelle est votre filière principale ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez votre filière...'
  },
  {
    id: 'q006_gender',
    moduleId: 'm1_context',
    text: 'Quel est votre sexe ?',
    type: 'single_choice',
    required: true,
    options: [
      'Homme',
      'Femme',
      'Préfère ne pas répondre'
    ]
  },
  {
    id: 'q011_transport',
    moduleId: 'm2_vie_quotidienne',
    text: 'Quel est votre principal moyen de transport pour vous rendre à votre établissement ?',
    type: 'single_choice',
    required: true,
    options: [
      'Bus',
      'Gbaka',
      'Woro-woro',
      'Taxi',
      'Moto',
      'Véhicule personnel',
      'À pied',
      'Autre'
    ]
  },
  {
    id: 'q012_transport_time',
    moduleId: 'm2_vie_quotidienne',
    text: 'Combien de temps mettez-vous généralement pour rejoindre votre établissement ?',
    type: 'single_choice',
    required: true,
    options: [
      'Moins de 15 min',
      '15 à 30 min',
      '30 à 60 min',
      '1 à 2 heures',
      'Plus de 2 heures'
    ]
  },
  {
    id: 'q013_difficulty_domain',
    moduleId: 'm2_vie_quotidienne',
    text: "Dans quel domaine rencontrez-vous le plus de difficultés dans votre vie d'étudiant ?",
    type: 'single_choice',
    required: true,
    options: [
      'Transport',
      'Logement',
      'Nourriture',
      'Internet',
      'Argent',
      'Organisation',
      'Santé',
      'Accès aux cours',
      'Autre'
    ]
  },
  {
    id: 'q014_difficulty_impact',
    moduleId: 'm2_vie_quotidienne',
    text: 'À quel point cette difficulté perturbe-t-elle vos études ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Pas du tout',
      '2',
      '3',
      '4',
      '5 — Énormément'
    ]
  },
  {
    id: 'q021_main_difficulty',
    moduleId: 'm3_budget',
    text: "Quelle est votre principale difficulté au quotidien en tant qu'étudiant ?",
    type: 'text',
    required: true,
    placeholder: 'Saisissez votre principale difficulté...'
  },
  {
    id: 'q022_difficulty_frequency',
    moduleId: 'm3_budget',
    text: "À quelle fréquence rencontrez-vous cette difficulté ?",
    type: 'single_choice',
    required: true,
    options: [
      'Tous les jours',
      'Plusieurs fois par semaine',
      'Une fois par semaine',
      'Quelques fois par mois',
      'Rarement'
    ]
  },
  {
    id: 'q023_difficulty_action',
    moduleId: 'm3_budget',
    text: 'Quand vous rencontrez cette difficulté, que faites-vous le plus souvent ?',
    type: 'text',
    required: true,
    placeholder: 'Décrivez ce que vous faites le plus souvent...'
  },
  {
    id: 'q024_dissatisfaction_reason',
    moduleId: 'm3_budget',
    text: 'Pourquoi cette solution ne vous satisfait-elle pas complètement ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez les limites de cette solution...'
  },
  {
    id: 'q025_resolution_impact',
    moduleId: 'm3_budget',
    text: "Si ce problème disparaissait complètement demain, qu'est-ce que cela changerait dans votre vie ?",
    type: 'text',
    required: true,
    placeholder: 'Décrivez l\'impact positif de cette disparition...'
  },
  {
    id: 'q035_priority_improvement',
    moduleId: 'm4_frictions',
    text: "Quelle amélioration est aujourd'hui la plus importante pour toi ?",
    type: 'text',
    required: true,
    placeholder: 'Saisissez l\'amélioration la plus importante...'
  },
  {
    id: 'q036_ideal_solution',
    moduleId: 'm4_frictions',
    text: 'Si tu pouvais créer une solution pour les étudiants, que proposerais-tu ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez votre proposition de solution...'
  },
  {
    id: 'q037_ideal_app',
    moduleId: 'm4_frictions',
    text: 'Quelles fonctionnalités aimerais-tu retrouver dans une application destinée aux étudiants ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez les fonctionnalités souhaitées...'
  },
  {
    id: 'q038_tech_resolution',
    moduleId: 'm4_frictions',
    text: 'Penses-tu que la technologie peut résoudre ton principal problème ?',
    type: 'single_choice',
    required: true,
    options: [
      'Oui',
      'Non',
      'Peut-être'
    ]
  },
  {
    id: 'q040_future_vision',
    moduleId: 'm5_workarounds',
    text: 'Comment imagines-tu la vie étudiante idéale dans 5 ans ?',
    type: 'text',
    required: true,
    placeholder: 'Décrivez votre vision de la vie étudiante idéale...'
  },
  {
    id: 'q041_solution_adoption',
    moduleId: 'm5_workarounds',
    text: "Si une entreprise créait une solution qui résout parfaitement ton principal problème, serais-tu prêt(e) à l'utiliser ?",
    type: 'single_choice',
    required: true,
    options: [
      'Oui',
      'Non',
      'Peut-être'
    ]
  },
  {
    id: 'q042_ready_to_pay',
    moduleId: 'm5_workarounds',
    text: "Si cette solution te faisait réellement gagner du temps, de l'argent ou réduisait ton stress, serais-tu prêt(e) à payer pour l'utiliser ?",
    type: 'single_choice',
    required: true,
    options: [
      'Oui',
      'Non',
      'Cela dépend du prix'
    ]
  }
];