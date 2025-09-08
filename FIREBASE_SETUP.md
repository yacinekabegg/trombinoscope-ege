# Configuration Firebase pour Trombinoscope EGE

## 🚀 Étapes pour configurer Firebase

### 1. Créer un projet Firebase
1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquez sur "Créer un projet"
3. Nom du projet : `trombinoscope-ege`
4. Activez Google Analytics (optionnel)
5. Créez le projet

### 2. Activer Firestore Database
1. Dans votre projet Firebase, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Commencer en mode test" (pour le développement)
4. Sélectionnez une région (Europe-west1 pour la France)

### 3. Obtenir les clés de configuration
1. Allez dans "Paramètres du projet" (icône d'engrenage)
2. Cliquez sur "Vos applications"
3. Cliquez sur "Ajouter une application" → Icône Web
4. Nom de l'application : `trombinoscope-ege-web`
5. Copiez les clés de configuration

### 4. Mettre à jour le fichier de configuration
Remplacez le contenu de `src/config/firebase.ts` par vos vraies clés :

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "trombinoscope-ege.firebaseapp.com",
  projectId: "trombinoscope-ege",
  storageBucket: "trombinoscope-ege.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
```

### 5. Configurer les règles de sécurité Firestore
Dans la console Firebase, allez dans "Firestore Database" → "Règles" :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture et l'écriture pour tous (mode développement)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Important** : Ces règles permettent l'accès à tous. Pour la production, configurez des règles plus strictes.

## 🎯 Avantages de Firebase

✅ **Données en ligne** : Sauvegardées dans le cloud  
✅ **Synchronisation temps réel** : Changements instantanés  
✅ **Partage entre utilisateurs** : Tous voient les mêmes données  
✅ **Sauvegarde automatique** : Plus de perte de données  
✅ **Gratuit** : Jusqu'à 1 Go de données  

## 🔧 Après configuration

1. **Redémarrez l'application** : `npm start`
2. **Testez** : Ajoutez un étudiant, il sera sauvegardé en ligne
3. **Vérifiez** : Les données apparaissent dans la console Firebase

## 📱 Utilisation

- **Tous les changements** sont automatiquement sauvegardés
- **Plusieurs utilisateurs** peuvent utiliser l'application simultanément
- **Les données persistent** même si vous changez d'ordinateur
- **Synchronisation temps réel** entre tous les utilisateurs
