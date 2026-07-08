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
    type: 'single_choice',
    required: true,
    options: [
      'Université Félix Houphouët-Boigny',
      'Université Nangui Abrogoua',
      'Université Alassane Ouattara',
      'Université Jean Lorougnon Guédé',
      'Université Péléforo Gon Coulibaly',
      'INP-HB',
      'Autre établissement'
    ],
    helpText: 'Sélectionnez l\'établissement d\'enseignement supérieur principal où vous êtes inscrit.'
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
      'Daloa',
      'Korhogo',
      'San Pedro',
      'Yamoussoukro',
      'Man',
      'Abengourou',
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
    placeholder: 'Ex: Sciences Économiques, Criminologie, Génie Logiciel, etc.',
    helpText: 'Saisissez l\'intitulé exact de votre spécialité principale.'
  },
  {
    id: 'q005_age',
    moduleId: 'm1_context',
    text: 'Quel est votre âge ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez votre âge (Ex: 21)',
    helpText: 'Saisie obligatoire (âge compris entre 16 et 45 ans).'
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
    id: 'q007_seniority',
    moduleId: 'm1_context',
    text: 'Depuis combien de temps étudiez-vous dans cet établissement ?',
    type: 'single_choice',
    required: true,
    options: [
      'Moins d\'un an',
      '1 à 2 ans',
      '3 à 4 ans',
      'Plus de 4 ans'
    ]
  },
  {
    id: 'q008_work_status',
    moduleId: 'm1_context',
    text: 'Travaillez-vous en parallèle de vos études ?',
    type: 'single_choice',
    required: true,
    options: [
      'Oui, à temps plein',
      'Oui, à temps partiel',
      'Non'
    ]
  },
  {
    id: 'q009_living',
    moduleId: 'm1_context',
    text: 'Avec qui vivez-vous actuellement ?',
    type: 'single_choice',
    required: true,
    options: [
      'Seul(e)',
      'Avec mes parents',
      'Avec ma famille',
      'En colocation',
      'En résidence universitaire',
      'Autre'
    ]
  },
  {
    id: 'q010_financial_perception',
    moduleId: 'm1_context',
    text: 'Comment qualifieriez-vous votre situation financière actuelle ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Très difficile',
      '2 — Difficile',
      '3 — Moyenne',
      '4 — Bonne',
      '5 — Très bonne'
    ],
    helpText: 'Évaluez votre ressenti sur une échelle de 1 (très difficile) à 5 (très bonne).'
  },
  {
    id: 'q011_transport',
    moduleId: 'm2_vie_quotidienne',
    text: 'Quel est votre principal moyen de transport pour vous rendre à votre établissement ?',
    type: 'single_choice',
    required: true,
    options: [
      'À pied',
      'Bus',
      'Gbaka',
      'Wôrô-wôrô',
      'Taxi',
      'Moto',
      'Véhicule personnel',
      'Vélo',
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
      'Moins de 15 minutes',
      '15 à 30 minutes',
      '30 à 45 minutes',
      '45 minutes à 1 heure',
      'Plus d\'une heure'
    ]
  },
  {
    id: 'q013_transport_cost',
    moduleId: 'm2_vie_quotidienne',
    text: 'Combien dépensez-vous en moyenne chaque jour pour vos déplacements liés aux études ?',
    type: 'single_choice',
    required: true,
    options: [
      'Moins de 500 FCFA',
      '500 à 1 000 FCFA',
      '1 001 à 2 000 FCFA',
      '2 001 à 3 000 FCFA',
      'Plus de 3 000 FCFA'
    ]
  },
  {
    id: 'q014_departure_time',
    moduleId: 'm2_vie_quotidienne',
    text: 'À quelle heure quittez-vous généralement votre domicile pour aller en cours ?',
    type: 'single_choice',
    required: true,
    options: [
      'Avant 6h',
      'Entre 6h et 7h',
      'Entre 7h et 8h',
      'Après 8h',
      'Variable selon les jours'
    ]
  },
  {
    id: 'q015_days_on_campus',
    moduleId: 'm2_vie_quotidienne',
    text: 'Combien de jours par semaine êtes-vous généralement présent(e) sur votre campus ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 jour',
      '2 jours',
      '3 jours',
      '4 jours',
      '5 jours',
      'Plus de 5 jours'
    ]
  },
  {
    id: 'q016_meals',
    moduleId: 'm2_vie_quotidienne',
    text: 'Où prenez-vous le plus souvent votre repas pendant les jours de cours ?',
    type: 'single_choice',
    required: true,
    options: [
      'À la maison',
      'Restaurant universitaire',
      'Restaurant privé',
      'Maquis',
      'Fast-food',
      'J\'apporte mon repas',
      'Je saute souvent le repas',
      'Autre'
    ]
  },
  {
    id: 'q017_internet_access',
    moduleId: 'm2_vie_quotidienne',
    text: 'Quel est votre principal moyen d\'accès à Internet pour vos études ?',
    type: 'single_choice',
    required: true,
    options: [
      'Données mobiles',
      'Wi-Fi de l\'établissement',
      'Wi-Fi personnel',
      'Cybercafé',
      'Je n\'ai pas un accès régulier à Internet'
    ]
  },
  {
    id: 'q018_connection_quality',
    moduleId: 'm2_vie_quotidienne',
    text: 'Comment évaluez-vous la qualité de votre connexion Internet pour vos études ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Très mauvaise',
      '2 — Mauvaise',
      '3 — Moyenne',
      '4 — Bonne',
      '5 — Excellente'
    ]
  },
  {
    id: 'q019_study_place',
    moduleId: 'm2_vie_quotidienne',
    text: 'Où étudiez-vous le plus souvent en dehors des salles de cours ?',
    type: 'single_choice',
    required: true,
    options: [
      'À la maison',
      'Bibliothèque',
      'Campus',
      'Cybercafé',
      'Chez un ami',
      'Café / Restaurant',
      'Autre'
    ]
  },
  {
    id: 'q020_daily_constraint',
    moduleId: 'm2_vie_quotidienne',
    text: 'Quelle est la principale difficulté que vous rencontrez dans vos déplacements ou votre organisation quotidienne pour suivre vos études ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez brièvement votre principale difficulté...',
    helpText: 'Ex: Embouteillages quotidiens, bus bondés, temps de trajet trop long...'
  },
  {
    id: 'q021_income_source',
    moduleId: 'm3_budget',
    text: 'Quelles sont vos principales sources de revenus ? (Plusieurs réponses possibles)',
    type: 'multiple_choice',
    required: true,
    options: [
      'Parents / Famille',
      'Bourse d\'études',
      'Emploi salarié',
      'Activité commerciale',
      'Freelance',
      'Soutien d\'un proche',
      'Épargne personnelle',
      'Aucune source de revenu',
      'Autre'
    ]
  },
  {
    id: 'q022_monthly_budget',
    moduleId: 'm3_budget',
    text: 'Quel est votre budget mensuel approximatif ?',
    type: 'single_choice',
    required: true,
    options: [
      'Moins de 25 000 FCFA',
      '25 000 à 50 000 FCFA',
      '50 001 à 75 000 FCFA',
      '75 001 à 100 000 FCFA',
      '100 001 à 150 000 FCFA',
      'Plus de 150 000 FCFA'
    ]
  },
  {
    id: 'q023_main_expenses',
    moduleId: 'm3_budget',
    text: 'Quels sont vos principaux postes de dépenses chaque mois ? (Plusieurs réponses possibles)',
    type: 'multiple_choice',
    required: true,
    options: [
      'Transport',
      'Nourriture',
      'Logement',
      'Internet / Téléphone',
      'Fournitures scolaires',
      'Santé',
      'Loisirs',
      'Vêtements',
      'Aide familiale',
      'Autre'
    ]
  },
  {
    id: 'q024_biggest_expense',
    moduleId: 'm3_budget',
    text: 'Quel est votre poste de dépense le plus important ?',
    type: 'single_choice',
    required: true,
    options: [
      'Transport',
      'Nourriture',
      'Logement',
      'Internet',
      'Fournitures scolaires',
      'Santé',
      'Loisirs',
      'Autre'
    ]
  },
  {
    id: 'q025_budget_management',
    moduleId: 'm3_budget',
    text: 'Comment évaluez-vous votre capacité à gérer votre budget ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Très mauvaise',
      '2 — Mauvaise',
      '3 — Moyenne',
      '4 — Bonne',
      '5 — Excellente'
    ]
  },
  {
    id: 'q026_end_of_month',
    moduleId: 'm3_budget',
    text: 'À la fin du mois, votre budget est généralement :',
    type: 'single_choice',
    required: true,
    options: [
      'Suffisant',
      'Tout juste suffisant',
      'Insuffisant',
      'Très insuffisant'
    ]
  },
  {
    id: 'q027_savings',
    moduleId: 'm3_budget',
    text: 'Parvenez-vous à épargner une partie de votre argent ?',
    type: 'single_choice',
    required: true,
    options: [
      'Oui, régulièrement',
      'Oui, occasionnellement',
      'Rarement',
      'Jamais'
    ]
  },
  {
    id: 'q028_unexpected_expense',
    moduleId: 'm3_budget',
    text: 'Si une dépense imprévue de 20 000 FCFA survenait aujourd\'hui, pourriez-vous y faire face immédiatement ?',
    type: 'single_choice',
    required: true,
    options: [
      'Oui, facilement',
      'Oui, avec quelques difficultés',
      'Non, je devrais emprunter',
      'Non, ce serait impossible'
    ]
  },
  {
    id: 'q029_financial_stress',
    moduleId: 'm3_budget',
    text: 'À quel niveau vos finances constituent-elles une source de stress dans votre vie étudiante ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Aucun stress',
      '2 — Faible',
      '3 — Moyen',
      '4 — Élevé',
      '5 — Très élevé'
    ]
  },
  {
    id: 'q030_financial_priority',
    moduleId: 'm3_budget',
    text: 'Si vous disposiez de 50 000 FCFA supplémentaires chaque mois, quelle serait votre première priorité ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez votre priorité principale...'
  },
  {
    id: 'q035_main_difficulty',
    moduleId: 'm4_frictions',
    text: 'Quelle est ta principale difficulté au quotidien ?',
    type: 'single_choice',
    required: true,
    options: [
      'Manque d’argent',
      'Transport difficile',
      'Problèmes de connexion Internet',
      'Charge académique trop élevée',
      'Stress / santé mentale',
      'Autre'
    ]
  },
  {
    id: 'q036_difficulty_frequency',
    moduleId: 'm4_frictions',
    text: 'À quelle fréquence rencontres-tu des difficultés dans ta vie d’étudiant ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Jamais',
      '2',
      '3',
      '4',
      '5 — Très souvent'
    ]
  },
  {
    id: 'q037_studies_impact',
    moduleId: 'm4_frictions',
    text: 'Ces difficultés impactent-elles tes études ?',
    type: 'single_choice',
    required: true,
    options: [
      'Pas du tout',
      'Un peu',
      'Moyennement',
      'Beaucoup',
      'Extrêmement'
    ]
  },
  {
    id: 'q038_difficult_moments',
    moduleId: 'm4_frictions',
    text: 'Dans quels moments rencontres-tu le plus de difficultés ?',
    type: 'multiple_choice',
    required: true,
    options: [
      'Aller en cours',
      'Réviser / étudier',
      'Faire les devoirs',
      'Se déplacer',
      'Gérer les dépenses',
      'Communication / internet'
    ]
  },
  {
    id: 'q039_main_blocker',
    moduleId: 'm4_frictions',
    text: 'Quel est ton plus grand problème actuel en tant qu’étudiant ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez votre plus grand problème actuel...'
  },
  {
    id: 'q040_workaround_strategy',
    moduleId: 'm5_workarounds',
    text: 'Quand tu rencontres une difficulté, que fais-tu le plus souvent ?',
    type: 'single_choice',
    required: true,
    options: [
      'J’abandonne',
      'Je cherche une solution alternative',
      'Je demande de l’aide à un ami',
      'Je demande de l’aide à la famille',
      'J’attends que ça passe',
      'Je contourne par un autre moyen'
    ]
  },
  {
    id: 'q041_alternative_use',
    moduleId: 'm5_workarounds',
    text: 'À quel point trouves-tu des solutions alternatives efficaces ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Pas du tout efficace',
      '2',
      '3',
      '4',
      '5 — Très efficace'
    ]
  },
  {
    id: 'q042_internet_workaround',
    moduleId: 'm5_workarounds',
    text: 'Que fais-tu quand tu as une mauvaise connexion Internet ?',
    type: 'single_choice',
    required: true,
    options: [
      'J’arrête ce que je fais',
      'Je me déplace vers un autre endroit',
      'J’attends un meilleur réseau',
      'J’utilise les données mobiles',
      'Je demande à quelqu’un de partager sa connexion'
    ]
  },
  {
    id: 'q043_transport_workaround',
    moduleId: 'm5_workarounds',
    text: 'Comment fais-tu face aux problèmes de transport ?',
    type: 'multiple_choice',
    required: true,
    options: [
      'Je marche',
      'Je partage le transport avec quelqu’un',
      'Je change mes horaires',
      'Je manque parfois les cours',
      'Je reste chez moi',
      'J’utilise des moyens alternatifs (moto, taxi, etc.)'
    ]
  },
  {
    id: 'q044_resilience',
    moduleId: 'm5_workarounds',
    text: 'À quel point te considères-tu capable de surmonter les difficultés ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Pas du tout résilient',
      '2',
      '3',
      '4',
      '5 — Très résilient'
    ]
  },
  {
    id: 'q045_priority_improvement',
    moduleId: 'm6_opportunities',
    text: 'Quelle amélioration est la plus importante pour toi actuellement ?',
    type: 'single_choice',
    required: true,
    options: [
      'Réduction des frais scolaires',
      'Amélioration du transport',
      'Meilleure connexion Internet',
      'Plus de ressources académiques',
      'Meilleure qualité de vie étudiante',
      'Accès à des emplois / stages'
    ]
  },
  {
    id: 'q046_ideal_solution',
    moduleId: 'm6_opportunities',
    text: 'Si tu pouvais créer une solution pour les étudiants, que proposerais-tu ?',
    type: 'text',
    required: true,
    placeholder: 'Saisissez votre proposition...'
  },
  {
    id: 'q047_digital_importance',
    moduleId: 'm6_opportunities',
    text: 'À quel point les outils numériques pourraient améliorer ta vie étudiante ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Pas du tout important',
      '2',
      '3',
      '4',
      '5 — Très important'
    ]
  },
  {
    id: 'q048_ideal_app',
    moduleId: 'm6_opportunities',
    text: 'Quelles fonctionnalités aimerais-tu dans une application pour étudiants ?',
    type: 'multiple_choice',
    required: true,
    options: [
      'Aide financière / bourses',
      'Cours en ligne',
      'Transport optimisé',
      'Réseau social étudiant',
      'Offres de stages / emplois',
      'Gestion du temps / planning'
    ]
  },
  {
    id: 'q049_future_impact',
    moduleId: 'm6_opportunities',
    text: 'Penses-tu que la technologie peut résoudre tes principaux problèmes ?',
    type: 'single_choice',
    required: true,
    options: [
      '1 — Pas du tout',
      '2',
      '3',
      '4',
      '5 — Complètement'
    ]
  },
  {
    id: 'q050_long_term_vision',
    moduleId: 'm6_opportunities',
    text: 'Comment imagines-tu la vie étudiante idéale dans 5 ans ?',
    type: 'text',
    required: true,
    placeholder: 'Décrivez votre vision de la vie étudiante idéale...'
  }
];
