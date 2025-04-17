# BlogHub

BlogHub est une plateforme moderne de blogging permettant aux utilisateurs de créer, gérer, personnaliser et explorer des articles avec une expérience utilisateur fluide et réactive.

---

## Sommaire
- [Fonctionnalités](#fonctionnalités)
- [Architecture & Stack](#architecture--stack)
- [Installation & Lancement](#installation--lancement)
- [Structure du Projet](#structure-du-projet)
- [Gestion des Utilisateurs](#gestion-des-utilisateurs)
- [Sécurité & Authentification](#sécurité--authentification)
- [Mise à jour du profil utilisateur](#mise-à-jour-du-profil-utilisateur)
- [Gestion des images](#gestion-des-images)
- [Personnalisation & UI](#personnalisation--ui)
- [Variables d'environnement](#variables-denvironnement)
- [FAQ & Dépannage](#faq--dépannage)

---

## Fonctionnalités
- **Inscription, connexion et gestion sécurisée des sessions utilisateur (JWT, cookies)**
- **Mise à jour du profil utilisateur (nom, email, mot de passe, avatar, etc.)**
- **Upload d'images de profil**
- **Navigation fluide grâce à un contexte utilisateur global (UserContext)**
- **Affichage instantané des infos utilisateur dans toute l'app (navbar, menus, profil, etc.)**
- **Création, modification, suppression et affichage d'articles**
- **Système de favoris (articles marqués)**
- **Dashboard personnel (mes posts, articles marqués, etc.)**
- **Recherche d'articles**
- **Notifications (structure prête)**
- **Interface moderne, responsive et animée**

---

## Architecture & Stack

- **Frontend** : Next.js 13+ (App Router, TypeScript, React Context API, TailwindCSS, js-cookie, jwt-decode)
- **Backend** : NestJS, Prisma ORM, MongoDB, JWT, Multer (upload images), bcrypt
- **Autres** : Envoi d'emails (nodemailer), gestion des variables d'environnement (.env)

---

## Installation & Lancement

### 1. Cloner le dépôt
```bash
git clone <repo-url>
cd BlogHub
```

### 2. Configuration du Backend
- Aller dans le dossier `backend`
- Installer les dépendances :
```bash
npm install
```
- Copier `.env.example` vers `.env` et renseigner :
  - `DATABASE_URL` (MongoDB)
  - `JWT_SECRET` (clé secrète JWT)
  - `EMAIL_USER` et `EMAIL_PASS` (pour l'envoi d'emails)
- Lancer le serveur :
```bash
npm run start:dev
```

### 3. Configuration du Frontend
- Aller dans le dossier `frontend`
- Installer les dépendances :
```bash
npm install
```
- Lancer le serveur :
```bash
npm run dev
```

### 4. Accès à l'application
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001

---

## Structure du Projet

```
BlogHub/
├── backend/
│   ├── src/
│   │   ├── user/            # Gestion des utilisateurs (service, controller, module)
│   │   ├── auth/            # Authentification JWT
│   │   ├── prisma/          # Service Prisma
│   │   └── ...
│   ├── uploads/             # Images uploadées
│   └── .env                 # Variables d'environnement backend
├── frontend/
│   ├── app/                 # Pages Next.js (profile, edit, dashboard, etc.)
│   ├── components/          # Composants UI (navbar, search&avatar, dashboard, etc.)
│   ├── context/             # UserContext pour gestion globale de l'utilisateur
│   ├── public/              # Images statiques (logo, avatars, etc.)
│   └── ...
└── README.md
```

---

## Gestion des Utilisateurs
- **Inscription et connexion** avec vérification du mot de passe (bcrypt) et génération d'un token JWT.
- **Contexte utilisateur global** : toutes les infos utilisateur sont accessibles partout via le contexte React (`UserContext`).
- **Modification du profil** : changement du nom, email, mot de passe, image de profil (upload), avec vérification du mot de passe actuel.
- **Mise à jour instantanée** : après modification, le contexte utilisateur est rafraîchi et toutes les infos sont à jour dans l'UI.

---

## Sécurité & Authentification
- **JWT** : chaque requête protégée nécessite un token JWT valide (stocké en cookie).
- **Vérification du mot de passe** avant toute modification sensible.
- **Endpoints protégés** côté backend avec des guards NestJS.
- **Hashage des mots de passe** avec bcrypt.

---

## Mise à jour du profil utilisateur
- **API** : `PUT /user/profile` (protégé JWT)
- **Payload** : `{ userName, email, password, oldPassword, image }`
- **Réponse** : `{ message, token, user }`
- **Frontend** : après update, le cookie token est remplacé et le contexte utilisateur est rafraîchi (pas besoin de reload)
- **Image** : uploadée dans `/uploads` côté backend, accessible via `http://localhost:3001/uploads/...`

---

## Gestion des images
- **Upload** : via Multer (NestJS)
- **Stockage** : dossier `backend/uploads`
- **Accès** : l'URL de l'image est automatiquement préfixée côté frontend pour affichage (voir UserContext et SearchAvatar)

---

## Personnalisation & UI
- **Navbar** et **menus** affichent toujours les infos utilisateur à jour (nom, avatar)
- **Dashboard** : accès rapide à mes posts, articles marqués, édition du profil
- **Composants réutilisables** : SearchAvatar, Marked, MyPosts, Footer, etc.
- **Design** : TailwindCSS, animations Framer Motion, responsive mobile/desktop

---

## Variables d'environnement

### Backend (`backend/.env`)
```
DATABASE_URL=... # URL MongoDB
JWT_SECRET=...   # Clé secrète JWT
EMAIL_USER=...   # Email pour l'envoi de mails
EMAIL_PASS=...   # Mot de passe d'application email
```

### Frontend
- Pas de variable critique, tout passe par le backend sécurisé

---

## FAQ & Dépannage

### Je ne vois pas mon image de profil après upload
- Vérifie que l'URL de l'image commence par `/uploads/` et que le backend est bien accessible sur `localhost:3001`.
- Si tu déploies, adapte l'URL de base dans le frontend.

### Les modifications de profil ne s'appliquent pas
- Vérifie que tu fournis l'ancien mot de passe lors de la modification.
- Vérifie que le token JWT est bien mis à jour côté frontend (cookie) et que le contexte utilisateur est rafraîchi.

### Erreur "secretOrPrivateKey must have a value"
- Vérifie la présence de `JWT_SECRET` dans le `.env` du backend et que le `JwtModule` l'utilise bien.

### Problèmes de CORS
- Assure-toi que le backend autorise les requêtes du frontend (voir config CORS NestJS).

---

## Contribution

1. Fork du repo
2. Création d'une branche (`feature/ma-fonctionnalite`)
3. PR détaillée

---

## Auteurs
- Brandon Medehou (et contributeurs)

---

## Licence
[MIT](LICENSE)
