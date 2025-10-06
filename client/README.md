# EFREI MyContacts Client

Ceci est le client de l'application MyContacts, développé dans le cadre du cours de Full-stack JS de l'EFREI. Ce client permet aux utilisateurs de gérer leurs contacts via une interface graphique en React.

Ce projet utilise vite comme outil de build et de développement.

Le client est hébergé à cette URL : https://efrei-my-contacts.netlify.app/

## Prérequis pour le développement
- Node.js (avec npm)
- Environnement:
  - Un fichier `.env` à la racine du client avec la variable `VITE_BACKEND_URL` pointant vers l'URL de l'API du serveur
  - Ou exporter la variable d'environnement `VITE_BACKEND_URL` avant de lancer le client

## Installation des dépendances
Pour installer les dépendances nécessaires, exécutez la commande suivante à la racine du client :

```bash
npm install
```


## Lancer le serveur de développement
Pour lancer le serveur de développement, utilisez la commande suivante à la racine du client :
```bash
npm run dev
```

## Faire un build
Pour créer un build de production, utilisez la commande suivante à la racine du client :
```bash
npm run build
```