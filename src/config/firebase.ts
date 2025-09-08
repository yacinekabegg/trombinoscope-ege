import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB0ctVM3Dyg10Qxe8Z5PTMhC9U9CFUIo10",
  authDomain: "trombinoscope-ege.firebaseapp.com",
  projectId: "trombinoscope-ege",
  storageBucket: "trombinoscope-ege.firebasestorage.app",
  messagingSenderId: "24023898958",
  appId: "1:24023898958:web:f7bc473420ff85c4c09c1f",
  measurementId: "G-V31LZZ6DZZ"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);

export default app;
