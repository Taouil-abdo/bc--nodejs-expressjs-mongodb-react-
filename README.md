Fleet Management System – Web Application

Digital platform for managing trucks, trailers, drivers, trips, fuel consumption, and maintenance operations.

📌 Contexte du Projet

Une entreprise de transport routier utilise une flotte de camions et remorques pour transporter des marchandises entre plusieurs sites (entrepôts, clients, fournisseurs, ports…).
La gestion actuelle est manuelle (Excel, appels, papier), ce qui pose plusieurs problèmes :

❌ Pas de visibilité en temps réel sur les trajets

❌ Difficulté à suivre le kilométrage

❌ Suivi non fiable du gasoil

❌ Gestion des pneus et maintenance approximative

❌ Aucune centralisation des informations chauffeurs & trajets

Ce projet vise à créer une application web complète pour digitaliser et automatiser l’ensemble du processus.

🎯 Objectif du Projet

Créer une application web moderne permettant de gérer :

✔️ Les ressources (camions, remorques, pneus, carburant)
✔️ Les trajets et leur assignation
✔️ La consommation (gasoil, kilométrage)
✔️ La maintenance
✔️ Les actions des chauffeurs
✔️ Les permissions selon les rôles

✨ Fonctionnalités Principales
🚚 Gestion des Ressources

Camions

Remorques

Pneus

Carburant

🗺️ Gestion des Trajets

Création et assignation aux chauffeurs

Mise à jour du statut : À faire, En cours, Terminé

Téléchargement du trajet en PDF (ordre de mission)

⛽ Suivi des Indicateurs

Kilométrage départ / arrivée

Consommation de gasoil

État des pneus

Coûts associés

🔧 Maintenance

Rappels automatiques

Configuration des périodicités :

Pneus

Vidange

Révision

👤 Rôles & Permissions
🛠️ Admin

Gérer camions, remorques, pneus

Créer/assigner les trajets

Voir les rapports : consommation, kilométrage, maintenance

Configurer les règles de maintenance

Accès complet

🚛 Chauffeur

Voir ses trajets assignés

Télécharger un PDF mission

Mettre à jour le statut du trajet

Saisir :

kilométrage

volume gasoil

remarques

🖥️ Partie Back-End
🛠️ Technologies

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

🔧 Fonctionnalités

Architecture MVC

Services & contrôleurs séparés

Middleware de gestion des erreurs

Vérification d’authentification avec JWT / Basic Auth

Autorisation par rôle (Admin / Chauffeur)

Routes protégées

Génération de PDF (selon besoin)

🧪 Tests Unitaires

Obligatoires sur :

Services

Contrôleurs

Avec Jest, Mocha ou Chai

🎨 Partie Front-End (React.js)
🛠️ Technologies

React.js

React Router (Nested Routes)

Redux Toolkit ou Context API

Axios

Hooks (useState, useEffect)

🔧 Fonctionnalités

Pages protégées selon rôle

Gestion d’état global

Dashboards Admin / Chauffeur

Formulaires de gestion : camions, remorques, pneus, trajets

Page maintenance + rapports

🐳 Déploiement Docker

Le projet inclut :

Un Dockerfile pour le backend

Un Dockerfile pour le frontend

Création d’un réseau Docker pour permettre la communication entre les conteneurs

Potentiel Docker Compose pour simplification

📂 Structure du Projet (exemple)
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

🚀 Lancement du Projet
🔹 Back-end
cd backend
npm install
npm run dev

🔹 Front-end
cd frontend
npm install
npm run dev

📜 Licence

Projet académique — YouCode / UM6P.
Usage libre pour l’apprentissage.

👤 Auteur

Abdo Taouil
Full Stack Developer – YouCode / UM6P
GitHub: Taouil-abdo
