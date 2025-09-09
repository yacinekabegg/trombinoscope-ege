# 🚀 Guide d'importation Airtable - Template prêt à l'emploi

## 📋 **Option 1 : Import manuel (Recommandé)**

### **Étape 1 : Créer votre base Airtable**

1. **Allez sur [Airtable.com](https://airtable.com)**
2. **Cliquez sur "Add a base"**
3. **Choisissez "Start from scratch"**
4. **Nommez votre base : "Trombinoscope EGE"**

### **Étape 2 : Créer les tables**

#### **Table 1 : Students (Étudiants)**

1. **Renommez "Table 1" en "Students"**
2. **Supprimez la colonne "Notes" par défaut**
3. **Ajoutez les colonnes suivantes :**

| Nom de la colonne | Type | Description |
|------------------|------|-------------|
| `firstName` | Single line text | Prénom de l'étudiant |
| `lastName` | Single line text | Nom de famille |
| `email` | Email | Adresse email |
| `studentNumber` | Single line text | Numéro d'étudiant |
| `photo` | URL | URL de la photo |
| `absenceCount` | Number | Nombre d'absences |

#### **Table 2 : Modules**

1. **Cliquez sur "+" pour ajouter une nouvelle table**
2. **Nommez-la "Modules"**
3. **Ajoutez les colonnes :**

| Nom de la colonne | Type | Description |
|------------------|------|-------------|
| `name` | Single line text | Nom du module |
| `description` | Long text | Description |
| `color` | Single line text | Couleur (format hex) |

#### **Table 3 : Projects**

1. **Ajoutez une nouvelle table "Projects"**
2. **Ajoutez les colonnes :**

| Nom de la colonne | Type | Description |
|------------------|------|-------------|
| `name` | Single line text | Nom du projet |
| `description` | Long text | Description |
| `moduleId` | Link to another record | Lien vers Modules |
| `deadline` | Date | Date limite |
| `studentIds` | Link to another record | Lien vers Students (multiple) |
| `status` | Single select | Statut (Non remis, Remis, À corriger, Validé) |
| `trackingType` | Single select | Type de suivi (simple, step_by_step) |
| `stepStatus` | Single select | Statut étape (Point d'étape 1, etc.) |
| `submissionDate` | Date | Date de soumission |
| `grade` | Number | Note |
| `comments` | Long text | Commentaires |

### **Étape 3 : Configurer les options des colonnes**

#### **Pour la colonne `status` dans Projects :**
- Cliquez sur la colonne → Configure → Options
- Ajoutez : "Non remis", "Remis", "À corriger", "Validé"

#### **Pour la colonne `trackingType` dans Projects :**
- Options : "simple", "step_by_step"

#### **Pour la colonne `stepStatus` dans Projects :**
- Options : "Point d'étape 1", "Point d'étape 2", "Validation des dates des restitutions", "Remise des travaux"

### **Étape 4 : Insérer les données**

#### **Table Students - Copiez-collez ces données :**

```
Juliette	ARMERO	juliette.armero@agroparistech.fr	EGE2024001	https://synapses.agroparistech.fr/images/photos/758f1d70-64a6-418a-a3a8-2871e526a45a.jpg	0
Emilie	ARNAUD	emilie.arnaud@agroparistech.fr	EGE2024002	https://synapses.agroparistech.fr/images/photos/caaf4428-562e-4516-8fc4-d30f30a5718a.jpg	0
Clemence	AVIGNON	clemence.avignon@agroparistech.fr	EGE2024003	https://synapses.agroparistech.fr/images/photos/8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpg	0
Clémence	BELGNAOUI	clemence.belgnaoui@agroparistech.fr	EGE2024004	https://synapses.agroparistech.fr/images/photos/9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c9c.jpg	0
Clara	BEZIER	clara.bezier@agroparistech.fr	EGE2024005	https://synapses.agroparistech.fr/images/photos/f572a8f5-269a-4fd4-a807-54abdc6ef0ea.jpg	0
Melissandre	BISCHOFF	melissandre.bischoff@agroparistech.fr	EGE2024006	https://synapses.agroparistech.fr/images/photos/8933db6f-2293-4d82-8738-146cf0b33694.jpg	0
Louis	BODIN	louis.bodin@agroparistech.fr	EGE2024007	https://synapses.agroparistech.fr/images/photos/165de92c-e015-4401-8a63-d379e17828ec.jpg	0
Paul	BONNEFONT	paul.bonnefont@agroparistech.fr	EGE2024008	https://synapses.agroparistech.fr/images/photos/6c440665-81cd-4da7-915a-2a63c4b3e07a.jpg	0
Pierre	BOURDIER	pierre.bourdier@agroparistech.fr	EGE2024009	https://synapses.agroparistech.fr/images/photos/6bb288d6-e8fd-4f0d-8fc6-76535cf7e219.jpg	0
Clemence	BRIAND	clemence.briand@agroparistech.fr	EGE2024010	https://synapses.agroparistech.fr/images/photos/dc435f5c-3df5-4c20-a0a3-e8829acae5ff.jpg	0
Adrien	CABANETTES	adrien.cabanettes@agroparistech.fr	EGE2024011	https://synapses.agroparistech.fr/images/photos/9c269fa6-04fd-40c8-a05d-3809923c0da2.jpg	0
Camille	DARMAILLE	camille.darmaille@agroparistech.fr	EGE2024012	https://synapses.agroparistech.fr/images/photos/bc53525b-21ca-4296-b97f-afad0c81e782.jpg	0
Gabrielle	DESCAMPS	gabrielle.descamps@agroparistech.fr	EGE2024013	https://synapses.agroparistech.fr/images/photos/6141a0fc-8b2c-4db5-9ebb-48cdb25f03e1.jpg	0
Julie	DUGIT	julie.dugit@agroparistech.fr	EGE2024014	https://synapses.agroparistech.fr/images/photos/3cf73364-d00f-4c68-a5d8-b3b27c201ad6.jpg	0
Lola	FERNANDEZ	lola.fernandez@agroparistech.fr	EGE2024015	https://synapses.agroparistech.fr/images/photos/44b1048b-a1bf-4aac-8990-1eddb182ccd4.jpg	0
Camille	GARREL	camille.garrel@agroparistech.fr	EGE2024016	https://synapses.agroparistech.fr/images/photos/ee1dc80e-c913-41fa-9b8e-126e036018f1.jpg	0
Anis	HAMMADI	anis.hammadi@agroparistech.fr	EGE2024017	https://synapses.agroparistech.fr/images/photos/3dcfde4a-1417-4884-88a8-1acd6ced840f.jpg	0
Clemence	JOULAIN	clemence.joulain@agroparistech.fr	EGE2024018	https://synapses.agroparistech.fr/images/photos/d9fb357a-5473-4bca-a2f1-69023cb605f5.jpg	0
Agathe	LAFARGE	agathe.lafarge@agroparistech.fr	EGE2024019	https://synapses.agroparistech.fr/images/photos/74a65fc0-294e-4417-8a7f-e36820d8dc3e.jpg	0
Leonie	LEMARE	leonie.lemare@agroparistech.fr	EGE2024020	https://synapses.agroparistech.fr/images/photos/f8e4c1e1-b33e-4338-8b77-1c3f4a48ce22.jpg	0
Camille	MICHAUX	camille.michaux@agroparistech.fr	EGE2024021	https://synapses.agroparistech.fr/images/photos/4224f7d0-9054-4d4d-b0f9-97aab6f6765a.jpg	0
Clotilde	REYNAUD	clotilde.reynaud@agroparistech.fr	EGE2024022	https://synapses.agroparistech.fr/images/photos/c2f232f6-40d2-4b49-a613-e79033e3de72.jpg	0
Matthieu	ROMANN	matthieu.romann@agroparistech.fr	EGE2024023	https://synapses.agroparistech.fr/images/photos/46bde109-5ff2-455d-a65e-60fab12a9e16.jpg	0
Morgane	SAUVAGE	morgane.sauvage@agroparistech.fr	EGE2024024	https://synapses.agroparistech.fr/images/photos/c274547b-7f33-4640-a417-7cdbf3da9c6b.jpg	0
Anna	TONDU	anna.tondu@agroparistech.fr	EGE2024025	https://synapses.agroparistech.fr/images/photos/70296674-0bfc-4a1d-a83d-a6d96bf91939.jpg	0
Quitterie	VUILLEMIN	quitterie.vuillemin@agroparistech.fr	EGE2024026	https://synapses.agroparistech.fr/images/photos/fb54de48-4645-4013-849d-157a1c029fb5.jpg	0
Ziyi	WANG	ziyi.wang@agroparistech.fr	EGE2024027	https://synapses.agroparistech.fr/images/photos/1ccb51db-ee12-418d-b0c3-4cbc9afee90c.jpg	0
```

#### **Table Modules - Copiez-collez ces données :**

```
Atelier Conseil	Module d'atelier conseil pour les étudiants	#4CAF50
Politique Générale	Module de politique générale	#2196F3
Global Challenge	Module de défi global	#FF9800
Projet d'Option	Module de projet d'option	#9C27B0
```

### **Étape 5 : Obtenir vos clés API**

1. **API Key :** [Airtable.com/account](https://airtable.com/account)
2. **Base ID :** Cliquez sur "Help" → "API documentation" dans votre base

### **Étape 6 : Configurer l'application**

Créez un fichier `.env` à la racine du projet :

```
REACT_APP_AIRTABLE_API_KEY=votre_api_key_ici
REACT_APP_AIRTABLE_BASE_ID=votre_base_id_ici
```

### **Étape 7 : Tester l'application**

```bash
npm start
```

## 📋 **Option 2 : Script automatique**

Si vous préférez utiliser le script automatique :

1. **Créez votre base Airtable vide** avec les 3 tables
2. **Configurez les colonnes** comme décrit ci-dessus
3. **Lancez le script :**

```bash
node scripts/create-airtable-base.js
```

## ✅ **Vérification**

Une fois configuré, votre application devrait :
- ✅ Se connecter à Airtable
- ✅ Charger les 27 étudiants
- ✅ Afficher les 4 modules
- ✅ Permettre la gestion des projets
- ✅ Sauvegarder en temps réel

## 🆘 **Aide**

Si vous rencontrez des problèmes :
1. Vérifiez que vos clés API sont correctes
2. Vérifiez que les noms des tables correspondent exactement
3. Vérifiez que les colonnes ont les bons types
4. Consultez la console du navigateur pour les erreurs
