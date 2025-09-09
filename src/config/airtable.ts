import Airtable from 'airtable';

// Configuration Airtable
const AIRTABLE_PERSONAL_ACCESS_TOKEN = process.env.REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN || 'YOUR_PERSONAL_ACCESS_TOKEN_HERE';
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID || 'YOUR_BASE_ID_HERE';

// Initialiser Airtable
const base = new Airtable({ apiKey: AIRTABLE_PERSONAL_ACCESS_TOKEN }).base(AIRTABLE_BASE_ID);

export default base;

// Noms des tables
export const TABLES = {
  STUDENTS: 'Students',
  PROJECTS: 'Projects', 
  MODULES: 'Modules'
} as const;
