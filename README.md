# Documentation Équipe IFRI 2025

Ce dépôt contient la documentation officielle de l'équipe IFRI pour l'année académique 2025. Il est hébergé via GitHub Pages et accessible à l'adresse [2025-team-ifri-docs.github.io](https://2025-team-ifri-docs.github.io).

## Contenu du dépôt

Notre documentation est organisée comme suit:

- **Pages principales**: Introduction et présentation des projets
- **Guides de démarrage**: Tutoriels et documentation pour les nouveaux membres
- **Référence API**: Documentation technique des API développées
- **Ressources**: Liens utiles, bonnes pratiques et standards

## Structure technique

Ce site est construit avec:
- **GitHub Pages** pour l'hébergement
- **Jekyll** comme générateur de site statique
- **Markdown** pour le contenu
- **SCSS/CSS** pour le style personnalisé

## Navigation

La documentation comprend une barre latérale de navigation permettant d'accéder facilement aux différentes sections. Le design a été optimisé pour une expérience utilisateur moderne et agréable.

## Contribution

Pour contribuer à cette documentation:

1. Clonez ce dépôt
2. Créez une branche pour vos modifications
3. Soumettez une pull request

## Développement local

Pour exécuter cette documentation localement:

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/2025-Team-IFRI-Docs.git

# Installer les dépendances
bundle install

# Lancer le serveur local
bundle exec jekyll serve
```

## Équipe

Cette documentation est maintenue par l'équipe IFRI 2025 - Institut de Formation en Informatique.

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
