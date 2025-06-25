# Test & Qualité - TP06
![CI](https://github.com/EthanGely/qualite-test/workflows/CI/badge.svg)

## Objectif du projet

Application  dédiée au cours de test & qualité logicielle

## Instructions pour lancer l'app

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [https://github.com/EthanGely/qualite-test]
cd tp6-mock-react

# Installer les dépendances
npm install
# ou
yarn install
```

### Lancement en développement
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Lancement en production
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance l'application en mode développement avec Vite |
| `npm run build` | Compile l'application pour la production |
| `npm run lint` | Vérifie la qualité du code avec ESLint |
| `npm run preview` | Prévisualise la version de production localement |
| `npm run format` | Formate le code avec Prettier |
| `npm test` | Lance les tests Playwright |
| `npm run prepare` | Configure Husky pour les hooks Git |

## Structure du code

```
.
├── src/                    # Code source principal
|   └── mocks/              # Données de test et mocks
│       ├── browser.js      # Utilise le handler
│       └── handlers.js     # Handler qui renvoie les mock data
|
└── tests/                  # Tests de l'application
    └── producs.spec.js     # Tests E2E Playwright

```


#### `src/`
Contient tout le code source de l'application :
- **components/** : Composants React réutilisables organisés par fonctionnalité
- **pages/** : Composants représentant les différentes pages/routes
- **hooks/** : Hooks React personnalisés pour la logique métier
- **services/** : Fonctions pour les appels API et la logique métier
- **utils/** : Fonctions utilitaires et helpers
- **styles/** : Fichiers CSS/SCSS et thèmes
- **types/** : Définitions TypeScript pour les interfaces et types

#### `mocks/`
Données et services mockés pour le développement et les tests :
- **handlers/** : Gestionnaires d'API mockés avec MSW (Mock Service Worker)
- **data/** : Jeux de données fictives
- **server.js** : Configuration du serveur de développement avec mocks

#### `tests/`
Organisation complète des tests :
- **unit/** : Tests unitaires pour les composants et fonctions
- **integration/** : Tests d'intégration entre composants
- **e2e/** : Tests end-to-end avec Playwright
- **utils/** : Fonctions utilitaires partagées pour les tests

## Technologies utilisées

- **Frontend :** React
- **Tests :** Playwright
- **Linting :** ESLint
- **Bundler :** Vite
- **Mocking :** MSW (Mock Service Worker)

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout de la nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## Autheur
Ethan