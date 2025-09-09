# 🔐 Configuration Airtable 2024 - Personal Access Tokens

## ⚠️ **IMPORTANT : Migration vers les Personal Access Tokens**

Airtable a migré vers les **Personal Access Tokens** (jetons d'accès personnels) qui sont plus sécurisés que les anciennes clés API. Les clés API ne seront plus supportées à partir de fin janvier 2024.

## 🚀 **Nouvelle méthode de configuration**

### **Étape 1 : Créer votre Personal Access Token**

1. **Allez sur [Airtable.com/account](https://airtable.com/account)**
2. **Cliquez sur "Developer hub"** (ou "Espace développeurs")
3. **Cliquez sur "Personal access tokens"**
4. **Cliquez sur "Create new token"**
5. **Configurez votre token :**
   - **Nom** : "Trombinoscope EGE"
   - **Scopes** : 
     - ✅ `data.records:read` (lecture des données)
     - ✅ `data.records:write` (écriture des données)
     - ✅ `schema.bases:read` (lecture de la structure)
   - **Bases** : Sélectionnez votre base "Trombinoscope EGE"
6. **Cliquez sur "Create token"**
7. **Copiez le token** (commence par `pat...`)

### **Étape 2 : Obtenir votre Base ID**

1. **Dans votre base Airtable** → "Help" → "API documentation"
2. **Copiez votre Base ID** (commence par `app...`)

### **Étape 3 : Configurer l'application**

Créez un fichier `.env` à la racine du projet :

```bash
# Configuration Airtable 2024
REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN=pat.votre_token_ici
REACT_APP_AIRTABLE_BASE_ID=app.votre_base_id_ici
```

### **Étape 4 : Tester la configuration**

```bash
npm start
```

## 🔐 **Avantages des Personal Access Tokens**

- ✅ **Sécurité renforcée** : Accès limité aux bases spécifiques
- ✅ **Scopes granulaires** : Contrôle précis des permissions
- ✅ **Révocables** : Peuvent être supprimés à tout moment
- ✅ **Expiration** : Durée de vie configurable
- ✅ **Audit** : Traçabilité des accès

## 📋 **Structure des tables Airtable**

### **Table `Students` :**
- `firstName` (Single line text)
- `lastName` (Single line text)
- `email` (Email)
- `studentNumber` (Single line text)
- `photo` (URL)
- `absenceCount` (Number)

### **Table `Projects` :**
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

### **Table `Modules` :**
- `name` (Single line text)
- `description` (Long text)
- `color` (Single line text)

## 🚀 **Importation des données**

Utilisez les fichiers CSV dans le dossier `airtable-import/` :

1. **`Students.csv`** - 27 étudiants
2. **`Modules.csv`** - 4 modules
3. **`Projects.csv`** - 4 projets

### **Importation :**
1. **Dans Airtable** → Cliquez sur "+" → "Import data"
2. **Sélectionnez "CSV file"**
3. **Uploadez le fichier** correspondant
4. **Vérifiez les colonnes** et cliquez "Import"

## 🆘 **Dépannage**

### **Erreur d'authentification :**
- Vérifiez que votre Personal Access Token est correct
- Vérifiez que le token a les bons scopes
- Vérifiez que le token est associé à la bonne base

### **Erreur de permissions :**
- Vérifiez que le token a `data.records:read` et `data.records:write`
- Vérifiez que le token est associé à votre base

### **Erreur de structure :**
- Vérifiez que les noms des tables correspondent exactement
- Vérifiez que les types de colonnes sont corrects

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Consultez la [documentation Airtable](https://airtable.com/developers/web/api/introduction)
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que votre token est valide dans l'espace développeurs

## 🎉 **Migration terminée !**

Votre application utilise maintenant les Personal Access Tokens d'Airtable, plus sécurisés et conformes aux nouvelles normes de sécurité.
