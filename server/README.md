# EFREI MyContacts Server

Ceci est le serveur de l'application MyContacts, développé dans le cadre du cours de Full-stack JS de l'EFREI. Ce serveur permet de gérer un CRUD d'utilisateurs avec des contacts via une API RESTful.

Le serveur est hébergé à cette URL et requiert une authentification sauf pour les endpoints publiques : https://efrei-my-contacts.onrender.com/

## Prérequis pour le développement
- Node.js (avec npm)
- BDD MongoDB

Les variables d'environnement nécessaires sont :
- `MONGODB_URI` : L'URI de connexion à la base de données Mongo
- `JWT_SECRET` : La clé secrète pour la génération des tokens JWT

Pour consulter les variables d'environnement disponibles, vous pouvez vous référer au fichier `.env.example`.

## Installation des dépendances
Pour installer les dépendances nécessaires, exécutez la commande suivante à la racine du serveur :
```bash
npm install
```

## Lancer le serveur de développement
Pour lancer le serveur de développement, utilisez la commande suivante à la racine du serveur :
```bash
npm run dev
```

## Faire un build
Pour créer un build de production, utilisez la commande suivante à la racine du serveur :
```bash
npm run build
```

## Les endpoints

Tous les endpoints peuvent être retrouvé dans le documentation de l'API : https://efrei-my-contacts.onrender.com/api-docs/

Voici un apercu des endpoints et de leurs fonctions : 

- **Routes d'authentification** `/auth`
  - Connexion `/auth/login`
  - Inscription `/auth/register`
- **Routes utilisateurs** `/users`
  - **GET** Informations utilisateurs connecté `/users/me`
  - **Routes Contacts** `/users/me/contacts`
    - **GET** Récupérer tous les contacts de l'utilisateur connecté `/users/me/contacts`
      - Query param optionnel : `favorite=true` pour récupérer uniquement les contacts favoris
    - **POST** Créer un contact `/users/me/contacts`
    - **PUT** Modifier un contact `/users/me/contacts/{contactId}`
    - **DELETE** Supprimer un contact `/users/me/contacts/{contactId}`
    - **PATCH** Changer le statut favori d'un contact `/users/me/contacts/{contactId}/favorite`
- **Documentation de l'API** `/api-docs`