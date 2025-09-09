const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');

// Configuration
const AIRTABLE_PERSONAL_ACCESS_TOKEN = process.env.REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;

if (!AIRTABLE_PERSONAL_ACCESS_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('❌ Veuillez configurer REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN et REACT_APP_AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_PERSONAL_ACCESS_TOKEN }).base(AIRTABLE_BASE_ID);

// Charger le template
const templatePath = path.join(__dirname, '..', 'airtable-template.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

console.log('🚀 Création de la base Airtable...');
console.log(`📋 Base: ${template.name}`);
console.log(`📊 Tables: ${template.tables.length}`);

async function createBase() {
  try {
    // Vérifier que la base existe
    console.log('✅ Connexion à la base Airtable...');
    
    // Pour chaque table du template
    for (const tableTemplate of template.tables) {
      console.log(`\n📋 Traitement de la table: ${tableTemplate.name}`);
      
      // Vérifier si la table existe
      try {
        const existingRecords = await base(tableTemplate.name).select({
          maxRecords: 1
        }).firstPage();
        
        if (existingRecords.length > 0) {
          console.log(`⚠️  La table ${tableTemplate.name} existe déjà avec des données`);
          continue;
        }
      } catch (error) {
        console.log(`❌ La table ${tableTemplate.name} n'existe pas ou n'est pas accessible`);
        console.log('💡 Veuillez créer la table manuellement dans Airtable avec les champs suivants:');
        console.log('   Champs requis:');
        tableTemplate.fields.forEach(field => {
          console.log(`   - ${field.name} (${field.type}): ${field.description}`);
        });
        continue;
      }
      
      // Insérer les données
      if (tableTemplate.records && tableTemplate.records.length > 0) {
        console.log(`📝 Insertion de ${tableTemplate.records.length} enregistrements...`);
        
        // Airtable limite à 10 enregistrements par batch
        const batchSize = 10;
        for (let i = 0; i < tableTemplate.records.length; i += batchSize) {
          const batch = tableTemplate.records.slice(i, i + batchSize);
          
          await base(tableTemplate.name).create(batch.map(record => ({
            fields: record
          })));
          
          console.log(`   ✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(tableTemplate.records.length/batchSize)} inséré`);
        }
      }
    }
    
    console.log('\n🎉 Base Airtable créée avec succès !');
    console.log('🔗 Vous pouvez maintenant accéder à votre base sur Airtable.com');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la base:', error);
    process.exit(1);
  }
}

createBase();
