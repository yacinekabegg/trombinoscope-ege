# Configuration Airtable

## Étapes pour configurer Airtable

### 1. Créer une base Airtable

1. Allez sur [Airtable.com](https://airtable.com)
2. Créez une nouvelle base appelée "Trombinoscope EGE"
3. Créez 3 tables :
   - `Students` (Étudiants)
   - `Projects` (Projets)
   - `Modules` (Modules)

### 2. Structure des tables

#### Table `Students` :
- `firstName` (Single line text)
- `lastName` (Single line text)
- `email` (Email)
- `studentNumber` (Single line text)
- `photo` (URL)
- `absenceCount` (Number)

#### Table `Projects` :
- `name` (Single line text)
- `description` (Long text)
- `moduleId` (Link to Modules)
- `deadline` (Date)
- `studentIds` (Multiple record links to Students)
- `status` (Single select: Non remis, Remis, À corriger, Validé)
- `trackingType` (Single select: simple, step_by_step)
- `stepStatus` (Single select: Point d'étape 1, Point d'étape 2, Validation des dates des restitutions, Remise des travaux)
- `submissionDate` (Date)
- `grade` (Number)
- `comments` (Long text)

#### Table `Modules` :
- `name` (Single line text)
- `description` (Long text)
- `color` (Single line text)

### 3. Obtenir les clés API

1. Allez sur [Airtable.com/account](https://airtable.com/account)
2. Copiez votre **API Key**
3. Allez sur votre base "Trombinoscope EGE"
4. Cliquez sur "Help" → "API documentation"
5. Copiez votre **Base ID** (commence par `app...`)

### 4. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```
REACT_APP_AIRTABLE_API_KEY=votre_api_key_ici
REACT_APP_AIRTABLE_BASE_ID=votre_base_id_ici
```

### 5. Redémarrer l'application

```bash
npm start
```

## Migration des données

Une fois Airtable configuré, l'application migrera automatiquement les données mockées vers Airtable au premier lancement.

## Avantages d'Airtable

- ✅ Interface graphique intuitive
- ✅ Gestion des relations entre tables
- ✅ API REST simple
- ✅ Pas de configuration complexe
- ✅ Sauvegarde automatique
- ✅ Collaboration en temps réel
