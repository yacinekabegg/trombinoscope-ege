# 📁 Fichiers CSV pour importation Airtable

## 🚀 **Importation ultra-simple !**

Ces fichiers CSV contiennent toutes vos données prêtes à importer dans Airtable.

### **📋 Fichiers disponibles :**

1. **`Students.csv`** - 27 étudiants avec toutes leurs informations
2. **`Modules.csv`** - 4 modules d'enseignement  
3. **`Projects.csv`** - 4 projets d'exemple

## 📖 **Instructions d'importation :**

### **Étape 1 : Créer votre base Airtable**

1. **Allez sur [Airtable.com](https://airtable.com)**
2. **Créez une nouvelle base** "Trombinoscope EGE"
3. **Créez 3 tables** : `Students`, `Modules`, `Projects`

### **Étape 2 : Configurer les colonnes**

#### **Table Students :**
- `firstName` → Single line text
- `lastName` → Single line text  
- `email` → Email
- `studentNumber` → Single line text
- `photo` → URL
- `absenceCount` → Number

#### **Table Modules :**
- `name` → Single line text
- `description` → Long text
- `color` → Single line text

#### **Table Projects :**
- `name` → Single line text
- `description` → Long text
- `deadline` → Date
- `status` → Single select (Non remis, Remis, À corriger, Validé)
- `trackingType` → Single select (simple, step_by_step)
- `stepStatus` → Single select (Point d'étape 1, Point d'étape 2, Validation des dates des restitutions, Remise des travaux)
- `submissionDate` → Date
- `grade` → Number
- `comments` → Long text

### **Étape 3 : Importer les données**

#### **Pour chaque table :**

1. **Cliquez sur la table** (Students, Modules, ou Projects)
2. **Cliquez sur l'icône "+"** en haut à droite
3. **Sélectionnez "Import data"**
4. **Choisissez "CSV file"**
5. **Uploadez le fichier CSV** correspondant
6. **Vérifiez que les colonnes** correspondent
7. **Cliquez sur "Import"**

### **Étape 4 : Configurer les options de sélection**

#### **Dans la table Projects :**

**Colonne `status` :**
- Cliquez sur la colonne → Configure → Options
- Ajoutez : "Non remis", "Remis", "À corriger", "Validé"

**Colonne `trackingType` :**
- Options : "simple", "step_by_step"

**Colonne `stepStatus` :**
- Options : "Point d'étape 1", "Point d'étape 2", "Validation des dates des restitutions", "Remise des travaux"

### **Étape 5 : Obtenir vos clés API (NOUVELLE MÉTHODE 2024)**

⚠️ **Important :** Airtable a migré vers les **Personal Access Tokens** (plus sécurisés)

#### **Personal Access Token :**
1. **Allez sur [Airtable.com/account](https://airtable.com/account)**
2. **Cliquez sur "Developer hub"** (ou "Espace développeurs")
3. **Cliquez sur "Personal access tokens"**
4. **Cliquez sur "Create new token"**
5. **Nommez votre token** (ex: "Trombinoscope EGE")
6. **Sélectionnez les scopes** : `data.records:read`, `data.records:write`, `schema.bases:read`
7. **Sélectionnez votre base** "Trombinoscope EGE"
8. **Cliquez sur "Create token"**
9. **Copiez le token** (commence par `pat...`)

#### **Base ID :**
1. **Dans votre base** → "Help" → "API documentation"
2. **Copiez votre Base ID** (commence par `app...`)

### **Étape 6 : Configurer l'application**

Créez un fichier `.env` à la racine du projet :

```
REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN=pat.votre_token_ici
REACT_APP_AIRTABLE_BASE_ID=app.votre_base_id_ici
```

### **Étape 7 : Tester l'application**

```bash
npm start
```

## ✅ **Vérification**

Une fois importé, vous devriez avoir :
- ✅ **27 étudiants** dans la table Students
- ✅ **4 modules** dans la table Modules  
- ✅ **4 projets** dans la table Projects
- ✅ **Application fonctionnelle** avec Airtable

## 🔐 **Sécurité des Personal Access Tokens**

Les nouveaux tokens sont plus sécurisés car :
- ✅ **Scopes spécifiques** (lecture/écriture limitées)
- ✅ **Base spécifique** (accès limité à votre base)
- ✅ **Révocables** à tout moment
- ✅ **Expiration** configurable

## 🆘 **Aide**

Si vous rencontrez des problèmes :
1. Vérifiez que les noms des colonnes correspondent exactement
2. Vérifiez que les types de colonnes sont corrects
3. Vérifiez que votre Personal Access Token est valide
4. Vérifiez que le token a les bons scopes
5. Consultez la console du navigateur pour les erreurs

## 🎉 **Avantages de cette méthode :**

- ✅ **Import en 1 clic** pour chaque table
- ✅ **Pas de programmation** requise
- ✅ **Données prêtes** à l'emploi
- ✅ **Interface graphique** intuitive
- ✅ **Vérification visuelle** des données
- ✅ **Sécurité renforcée** avec les nouveaux tokens