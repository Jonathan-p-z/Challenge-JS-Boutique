# Challenge-JS-Boutiquex

# Projet Node.js avec Express

## Description
Ce projet est une application web développée avec Node.js et Express. Il contient un backend pour gérer les routes et un site frontend structuré en fichiers EJS pour l'affichage dynamique.

## Routes
Voici les différentes routes disponibles dans l'application :

### Backend Routes
```javascript
router.get("/accueil", controllers.getAccueil); // Page d'accueil
router.get("/car/:id", controllers.getCar); // Page produit (voiture spécifique)
router.get("/bran/:id", controllers.getBrand); // Page marque (marque spécifique)
router.get("/profil/:id", controllers.getProfil); // Page profil utilisateur
router.get("/connect", controllers.getConnect); // Page de connexion
```

## Architecture du Projet
Le projet est structuré de la manière suivante :

```
- backend
     |- controller
           |- controller.js
           |- controller_db.js
     |- routes
           |- routes.js
     |- data
          |- connect.json
          |- brandCar.json
     |- app.js
- site
   |- assets
       |- css
           |- accueil.css
           |- connect.css
           |- produit.css
           |- profil.css
           |- header.css
           |- footer.css
       |- img
       |- js
   |- views
       |- accueil.ejs
       |- connect.ejs
       |- produit.ejs
       |- profil.ejs
   |- partials
       |- header.ejs
       |- footer.ejs
```

## Explication des Dossiers

### Backend
- **controller/** : Contient les fichiers gérant la logique métier et les interactions avec la base de données.
- **routes/** : Contient les routes définies pour le backend.
- **data/** : Contient des fichiers JSON pour stocker des données statiques.
- **app.js** : Point d'entrée principal du serveur.

### Site
- **assets/** : Contient les fichiers statiques tels que CSS, images et scripts JS.
- **views/** : Contient les fichiers EJS pour générer les pages dynamiquement.
- **partials/** : Contient les éléments réutilisables comme l'en-tête et le pied de page.

## Installation
1. Clonez le dépôt :
   ```sh
   git clone https://github.com/votre-repo.git
   ```
2. Accédez au dossier backend :
   ```sh
   cd backend
   ```
3. Installez les dépendances :
   ```sh
   npm install
   ```
4. Démarrez le serveur :
   ```sh
   node app.js
   ```

## Auteur
Développé par Alexandre Petitfrere & Jonathan Perez

