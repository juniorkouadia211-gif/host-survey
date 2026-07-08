# DESIGN SYSTEM — HOST Survey
## Version 1.0 (L'Art de la Rigueur Scientifique)

HOST Survey est une plateforme institutionnelle et scientifique de collecte de données et de recherche académique de classe mondiale, destinée aux universités, chercheurs, ONG et instituts statistiques. Ce document régit la direction artistique, les règles typographiques, la palette de couleurs, l'échelle d'espacement et les composants graphiques officiels de la marque.

---

## 1. Philosophie : African Research Modernism

La direction artistique de HOST Survey s'affranchit totalement des clichés des plateformes technologiques générées par IA. Elle fusionne :
*   **Swiss Design (Style Typographique International)** : Ordre, précision de la grille, clarté absolue, hiérarchie éditoriale stricte.
*   **IBM Design Language & Dieter Rams** : Sobriété technique, honnêteté fonctionnelle des composants.
*   **Design Éditorial Universitaire** : Mise en page inspirée des rapports de recherche, publications de la Banque Mondiale et d'Afrobarometer.
*   **Modernisme Architectural Africain** : Rythmes géométriques discrets, proportions équilibrées, utilisation du vide comme matière première.

---

## 2. Palette de Couleurs Écologiques & Minérales

Toutes les couleurs sont inspirées de matières minérales, du papier universitaire et de nuances organiques d'Afrique de l'Ouest. Aucune couleur néon ou ultra-saturée n'est autorisée.

| Rôle | Teinte | Code Hexa | Classe Tailwind v4 Equivalente |
| :--- | :--- | :--- | :--- |
| **Fond Principal** | Off-white Académique (Papier) | `#FBFBFA` | `--color-bg-base` / Custom Tailwind |
| **Fond Secondaire** | Beige Calcaire | `#F4F4F1` | `--color-bg-surface` / Slate-50 / Amber-50 |
| **Texte Principal** | Charbon Profond | `#121A16` | `--color-text-main` / Slate-900 |
| **Couleur Institutionnelle**| Vert Forêt Tropicale | `#1B3B32` | `--color-emerald-900` / Emerald-900 (customized) |
| **Validation / Succès** | Vert Sauge | `#3B7A57` | `--color-emerald-700` |
| **Accent Discret** | Ocre Doré / Terre de Sienne | `#D48C46` | `--color-amber-600` / Amber-600 (customized) |
| **Bordures Fines** | Argile Sèche / Gris Chaux | `#DCDCD3` | `--color-slate-200` (customized) |

---

## 3. Typographie

La typographie est l'élément le plus puissant du design. Nous utilisons trois familles de caractères bien distinctes :

1.  **IBM Plex Serif** (Display & Grands Titres)
    *   *Usage* : Titres principaux de sections, titres d'études, citations académiques.
    *   *Raison d'être* : Évoque le sérieux universitaire, la recherche rigoureuse et l'élégance éditoriale.
2.  **Inter** (Interface Générale)
    *   *Usage* : Boutons, formulaires, étiquettes, navigation, corps de texte.
    *   *Raison d'être* : Offre une lisibilité maximale à toutes les résolutions d'écran.
3.  **JetBrains Mono** (Données & Métriques)
    *   *Usage* : Numéros d'étude, pourcentages, indicateurs de temps, codes de questionnaire.
    *   *Raison d'être* : Confirme le caractère technique, statistique et structuré des données recueillies.

---

## 4. Système de Composants & Grille

### Grille & Composition Éditoriale
*   **Asymétrie et Alignements** : Éviter les structures de type "landing page marketing standard" où tout est centré de manière monotone. Favoriser un alignement rigoureux sur une grille asymétrique (généralement 1/3 pour le contexte méthodologique, 2/3 pour le contenu de recherche).
*   **Le Vide Actif** : Utiliser des marges généreuses (`py-16`, `py-24`, `space-y-8`) pour donner de la respiration et de la valeur académique aux questions.

### Coins et Bordures
*   **Rayon Maximal (Border Radius)** : Limité à un maximum de `8px` (`rounded-lg` ou `rounded-xl` selon la taille).
*   **Jamais de pilules** : Pas de boutons ou d'étiquettes à bords totalement circulaires (`rounded-full` interdit pour les grands éléments).
*   **Bordures** : Fines (`border border-[#DCDCD3]`), de préférence en contraste doux avec des fonds clairs `#F4F4F1`.
*   **Ombres (Shadows)** : Pas d'ombres diffuses, lourdes ou colorées. Utiliser des ombres fines à très basse opacité (`shadow-xs` ou `shadow-sm` uniquement), ou s'appuyer uniquement sur le contraste de fond et de bordure pour séparer les plans.

### Boutons
*   **Primaire** : Fond couleur institutionnelle solide (`#1B3B32`), texte blanc, angles fins, sans dégradé. Survol ultra-discret (légère réduction de luminosité, transition 150ms).
*   **Secondaire** : Bordure fine (`#DCDCD3`), fond beige calcaire (`#F4F4F1`) ou blanc, texte charbon.

### Formulaires & Choix de Questionnaire
*   **Champs de Saisie** : Style "papier blanc", bordure grise de chaux, police mono ou sans-serif. Focus par une bordure verte forêt subtile et propre.
*   **Options de Réponses** : De grandes zones rectangulaires avec une bordure fine. La sélection se marque par un fond vert sauge très clair (`bg-[#3B7A57]/5`) et une bordure vert forêt active.

---

## 5. Interdictions Absolues (No-Go List)

*   **PAS de blobs colorés** (formes floues de fond).
*   **PAS de néon, bleu électrique ou violet futuriste**.
*   **PAS de verre flouté (glassmorphism)**.
*   **PAS d'animations de type "ping", "bounce" ou "pulse"** pour attirer l'attention de manière agressive.
*   **PAS d'illustrations vectorielles de banques d'images** ou de personnages souriants en 3D.
*   **PAS de slogans marketing trompeurs**. Chaque titre doit énoncer un fait ou un axe de recherche objectif.
