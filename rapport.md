# INP Legends

**Auteurs :** Achraf BENABDELLAH, Yakoub DEHBI, Youssef ELAASRI  
**Encadrant :** Sebastien VIARDOT \
**Date :** 19/03/2024

## Résumé
Dans "INP Legends", un jeu RPG-2D web situé à Grenoble INP en l'an 2077, les joueurs sont plongés au cœur d'une épopée futuriste captivante. L'intrigue se déploie autour d'une intelligence artificielle de pointe qui, ayant échappé à ses créateurs, sème le chaos dans le campus.
Conçu comme une expérience éducative immersive, ce jeu invite les joueurs à relever une série de défis de programmation ingénieux. L'objectif est double : neutraliser l'intelligence artificielle rebelle et restaurer la sérénité au sein de l'INP. À travers cette quête, "INP Legends" ne se contente pas de divertir ; il vise à aiguiser les compétences en programmation des joueurs tout en préservant l'équilibre entre éducation et divertissement.

## Table des Matières
- [Résumé](#résumé)
- [Introduction](#introduction)
- [Conception du Jeu](#conception-du-jeu)
- [Technologies et Outils de Développement](#technologies-et-outils-de-développement)
- [Développement du Jeu](#développement-du-jeu)
<!-- - [Interface Utilisateur et Expérience Utilisateur (UI/UX)](#interface-utilisateur-et-expérience-utilisateur-uiux) -->
- [Tests et Déploiement](#tests-et-déploiement)
<!-- - [Résultats et Évaluation](#résultats-et-évaluation) -->
- [Discussion](#discussion)
- [Conclusion](#conclusion)
<!-- - [Références](#références)
- [Annexes](#annexes) -->

## Introduction
Dans "INP Legends", un jeu captivant situé dans le Grenoble INP de 2077, nous plongeons dans une ère où l'innovation et la technologie redéfinissent les frontières du possible. Au cœur de cette révolution se trouve un projet ambitieux : une intelligence artificielle (IA) d'une sophistication sans précédent, conçue pour transcender les capacités humaines et robotiques. Cependant, la disparition inattendue de cette IA marque le début d'une aventure semée d'embûches, transformant Grenoble INP en un terrain de jeu dynamique où se mêlent suspense et découverte.

Le protagoniste de notre histoire n'est autre qu'un étudiant fraîchement inscrit à l'INP, qui se retrouve propulsé au premier plan d'une quête épique. À travers un périple à travers les six écoles emblématiques de l'INP, le joueur est invité à maîtriser une multitude de compétences en programmation, ingénierie et sciences appliquées. Débutant par les fondamentaux à CPP, il traverse ensuite les univers spécialisés de Phelma, GI, E3, Pagora et Ensimag, chacun contribuant à forger les aptitudes nécessaires pour affronter l'ultime épreuve.

Cette odyssée n'est pas seulement une course contre la montre pour restaurer la paix au sein de l'INP; elle est une immersion profonde dans les valeurs de l'ingénierie et de l'innovation que représente Grenoble INP. Le jour J, notre héros doit relever un défi captivant, un face-à-face avec l'IA déchaînée, un test ultime de ses compétences et de sa détermination à rétablir l'ordre. "INP Legends" n'est pas qu'un jeu; c'est une aventure formatrice, un voyage initiatique au cœur de la technologie de demain.

## Conception du Jeu
### Univers et Setting
"INP Legends" prend place à Grenoble en 2077, offrant aux joueurs la liberté d'explorer les différentes écoles de Grenoble INP. La carte principale est une réplique stylisée de Grenoble, avec des sous-cartes dédiées à chaque école, enrichissant l'expérience par leur diversité et spécificités.

### Personnages Principaux
Le joueur incarne un étudiant nouvellement inscrit, confronté à une intelligence artificielle (IA) rebelle, développée par un professeur de l'ENSIMAG. L'objectif est de résoudre les problèmes causés par cette IA dans chaque école et ultimement, de neutraliser l'IA pour restaurer la paix.

### Mécaniques de Jeu
La liberté de déplacement sur la carte permet aux joueurs d'aborder les défis à leur rythme, avec des challenges spécifiques à chaque école, basés sur des problèmes de codage en Python. Ces défis sont conçus pour refléter les domaines d'expertise de chaque école, comme l'informatique à l'Ensimag ou l'énergie à l'ENSE3.

### Progression et Évolution du Personnage
Les joueurs débloquent progressivement des défis plus avancés en réussissant les tâches initiales. Cette progression assure une courbe d'apprentissage et une satisfaction croissante à mesure que de nouveaux défis sont surmontés.

### Interaction avec l'Environnement
Les interactions avec les NPC sont essentielles pour l'avancement dans le jeu, avec des défis et quêtes se débloquant suite à des dialogues. Chaque école dispose de ses propres NPC, ajoutant à la diversité et à l'immersion dans l'univers du jeu.

### Éléments Narratifs
L'histoire se déploie au travers des interactions, défis, et explorations, bien que la méthode précise de narration reste à être définie, permettant une flexibilité dans la manière dont l'histoire est contée.

### Art et Style Visuel
L'aspect visuel du jeu s'inspire directement de la ville de Grenoble et de ses écoles, avec une attention particulière portée à la création d'une carte et de sous-cartes qui reflètent fidèlement leur modèle réel. Le style 2D est choisi pour son esthétique et sa capacité à immerger les joueurs dans cet univers futuriste.

## Technologies et Outils de Développement
Pour "INP Legends", nous exploitons HTML5, CSS3, et JavaScript, enrichis par des bibliothèques comme  PicoCSS pour l'esthétique et des scripts sur mesure pour la dynamique du jeu. Ces technologies assurent une expérience fluide sur tous les navigateurs modernes. 

Nous garantissons la qualité du code via linting en CI/CD et des tests prochainement disponibles, assurant ainsi fiabilité et performance.

Prochainement, nous enrichirons "INP Legends" d'une composante back-end, destinée à héberger les ressources du jeu et à exécuter le code des joueurs, augmentant ainsi l'interactivité et la profondeur du gameplay.

## Développement du Jeu
### Choix Technologiques
Le développement de "INP Legends" repose sur une combinaison de HTML, CSS, et JavaScript, privilégiant une approche web pour une accessibilité maximale.

### Architecture du Jeu
L'organisation du code s'appuie sur une architecture orientée objet en JavaScript, divisant le projet en plusieurs classes essentielles telles que DirectionInput, GameObject, MainWorld, NPC, OverWorldMap, Person, Sprite, et Utils. Cette structuration facilite la maintenance et l'évolution du jeu.

### Gestion des Défis de Programmation
Les défis de programmation sont affichés grâce à la bibliothèque ACE, bien que le système d'évaluation des solutions des joueurs soit encore à définir.

### Graphismes et Design Visuel
Les éléments visuels, tels que les cartes et les personnages, sont représentés par des images statiques, offrant une simplicité dans le déploiement et la manipulation des éléments du jeu.

### Intégration des Éléments Narratifs
La narration et les interactions avec les NPC sont intégrées directement dans le gameplay, permettant aux joueurs de dialoguer avec les différents personnages à tout moment.

### Tests et Assurance Qualité
Les procédures de test et d'assurance qualité n'ont pas encore été établies, soulignant une étape importante à venir dans le développement.

### Collaboration et Gestion de Projet
La collaboration entre les membres de l'équipe se fait via Discord, avec des salons dédiés et un bot notifiant les mises à jour de GitLab. Les tâches sont gérées et suivies grâce aux issues sur GitLab, permettant un suivi clair du travail en cours et à venir.

<!-- ## Interface Utilisateur et Expérience Utilisateur (UI/UX)
Conception de l'interface, approches pour une UX engageante, feedback utilisateur. -->

## Tests et Déploiement
Les stratégies de test sont un point à voir très prochainement.

<!-- 
## Résultats et Évaluation
Les premiers retours des joueurs indiquent une réception positive, avec des éloges particuliers pour la combinaison d'éléments éducatifs et ludiques. Les performances du jeu et l'engagement des utilisateurs sont suivis pour guider les mises à jour futures. -->

## Discussion
### Réactions et Équilibre
Bien que "INP Legends" n'ait pas encore été soumis à des tests avec des utilisateurs externes, l'équipe de développement est confiante que le jeu offrira une expérience éducative amusante et engageante, en particulier pour l'apprentissage du Python. L'objectif est de fournir un équilibre entre l'éducation et le divertissement, permettant aux joueurs non seulement de s'amuser mais aussi d'acquérir de précieuses compétences en programmation.

### Complexité et Adaptabilité
Les défis de programmation dans "INP Legends" sont conçus pour augmenter progressivement en difficulté, commençant par les bases du Python et devenant plus complexes au fil du jeu. L'équipe prévoit d'ajuster la difficulté en fonction des retours des joueurs, ce qui souligne l'importance de la flexibilité et de l'adaptabilité du jeu. Grâce à une architecture bien pensée, "INP Legends" est prêt à évoluer, permettant l'ajout facile de nouveaux défis ou scénarios.

### Accessibilité et Impact
Initialement, "INP Legends" est destiné aux étudiants de Grenoble INP.
Bien qu'il ne soit pas conçu pour remplacer les cours et les travaux pratiques, il se positionne comme un outil complémentaire pour l'apprentissage du Python. L'accessibilité à un public plus large est une perspective future, potentiellement en adaptant le jeu pour d'autres langages de programmation.

### Vision à Long Terme
L'équipe envisage la possibilité que "INP Legends" puisse, à l'avenir, jouer un rôle plus significatif dans l'éducation, voire remplacer certains travaux pratiques. Bien qu'il n'y ait pas encore de plans concrets pour des mises à jour ou des extensions, l'idée d'améliorer le jeu est envisagée, reflétant une volonté d'adaptation et d'innovation continues.

### Potentiel Éducatif Élargi
"INP Legends" représente un modèle potentiellement révolutionnaire pour l'enseignement de divers sujets. L'approche adoptée pour enseigner le Python pourrait être appliquée à d'autres domaines, ouvrant la voie à des adaptations qui pourraient bénéficier à une gamme plus large d'institutions éducatives.

## Conclusion
"INP Legends" se présente comme un projet innovant à l'intersection du divertissement et de l'éducation, enraciné dans la passion de ses créateurs pour la programmation et l'enseignement. En plongeant les joueurs dans une aventure captivante au sein de Grenoble INP en 2077, le jeu cherche non seulement à divertir mais aussi à instruire, en mettant l'accent sur l'apprentissage du Python à travers des défis de programmation progressifs et engageants.

Le développement de "INP Legends" a mis en évidence l'importance de la collaboration, de l'innovation et de la flexibilité, des valeurs qui ont guidé l'équipe tout au long du processus créatif. Bien que le jeu soit actuellement destiné aux étudiants de Grenoble INP, son potentiel d'adaptation et d'expansion vers d'autres domaines et audiences est une perspective enthousiasmante pour l'avenir.

À travers "INP Legends", nous visons non seulement à enrichir l'expérience éducative des étudiants en informatique mais aussi à inspirer d'autres créateurs de contenu éducatif à explorer des approches ludiques pour l'apprentissage. Les défis rencontrés et les leçons apprises au cours de ce projet serviront de fondement précieux pour les futures initiatives.

Alors que "INP Legends" continue d'évoluer, nous sommes impatients de recueillir le feedback des premiers utilisateurs et d'intégrer leurs suggestions pour améliorer le jeu. Notre ambition est de voir "INP Legends" devenir non seulement un outil d'apprentissage reconnu mais aussi une source d'inspiration pour la manière dont l'éducation peut être rendue plus interactive et amusante.

Nous tenons à remercier tous ceux qui ont contribué à la réalisation de "INP Legends", en particulier notre encadrant Sebastien VIARDOT.

<!-- 
## Références

## Annexes
Documentation technique, diagrammes, captures d'écran.
 -->
