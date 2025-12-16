Fleet Management System – Web Application

A complete web platform for managing trucks, trailers, drivers, trips, maintenance, and fuel consumption.

Contexte du Projet

Une entreprise de transport routier possède une flotte utilisée entre différents sites (entrepôts, clients, ports…).
La gestion actuelle est essentiellement manuelle (Excel, appels téléphoniques, documents papier), ce qui provoque :

Manque de visibilité en temps réel sur les trajets et les véhicules

Difficulté à suivre le kilométrage

Suivi peu fiable de la consommation de gasoil

Mauvaise gestion des pneus et de la maintenance

Absence de centralisation des informations des chauffeurs

Objectif du projet : Digitaliser la gestion de la flotte à travers une application web complète.

Fonctionnalités Principales
Gestion des Ressources

Gestion des camions

Gestion des remorques

Gestion des pneus

Gestion du carburant

Gestion des Trajets

Création et modification des trajets

Assignation des trajets aux chauffeurs

Suivi du statut des trajets :

À faire

En cours

Terminé

Téléchargement des trajets en PDF (ordre de mission)

Suivi des Indicateurs

Kilométrage de départ et d’arrivée

Suivi de la consommation de gasoil

Gestion de l’état des pneus

Historique des opérations et coûts associés

Maintenance

Rappels automatiques

Configuration des périodicités de maintenance :

Pneus

Vidange

Révision

Rôles et Permissions
Administrateur

Gestion des camions, remorques et pneus

Création et assignation des trajets

Consultation des rapports : consommation, kilométrage, maintenance

Configuration des règles de maintenance

Accès complet à l’application

Chauffeur

Consultation de ses trajets assignés

Téléchargement du trajet en PDF

Mise à jour du statut du trajet

Saisie du kilométrage, volume du gasoil et remarques

Partie Back-End
Technologies

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Fonctionnalités Back-End

Architecture MVC

Services et contrôleurs séparés

Middleware de gestion des erreurs

Middleware d’authentification (JWT ou Basic Auth)

Système d’autorisation basé sur les rôles

Routes protégées

Génération de PDF (si nécessaire)

Tests Unitaires

Tests obligatoires pour :

Les services

Les contrôleurs
Avec Jest, Mocha ou Chai.

Partie Front-End
Technologies

React.js

React Router (avec Nested Routes)

Redux Toolkit ou Context API

Axios

Hooks (useState, useEffect)

Fonctionnalités Front-End

Interface Admin et Chauffeur

Formulaires de gestion des ressources

Protection des routes selon le rôle

Dashboard pour visualiser trajets, véhicules et maintenance

Gestion du state global

Déploiement Docker

Le projet inclut :

Un Dockerfile pour le backend

Un Dockerfile pour le frontend

Un réseau Docker pour connecter les deux

Possibilité d’ajouter Docker Compose pour l’orchestration

Structure du Projet (exemple)
project/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   └── assets/
│   ├── Dockerfile
│   └── package.json

Lancer le Projet
Back-end
cd backend
npm install
npm run dev

Front-end
cd frontend
npm install
npm run dev

Licence

Projet académique – YouCode / UM6P
Utilisation libre pour l’apprentissage.

Auteur

Abdo Taouil
Full Stack Developer – YouCode / UM6P
GitHub : Taouil-abdo
