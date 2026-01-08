import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración oficial de tu proyecto NeonQuiz
const firebaseConfig = {
  apiKey: "AIzaSyBNF9rV3ECXtOsl5daR6ReRwLvqkDWkO3U",
  authDomain: "neonquiz-8e0db.firebaseapp.com",
  projectId: "neonquiz-8e0db",
  storageBucket: "neonquiz-8e0db.firebasestorage.app",
  messagingSenderId: "522527975212",
  appId: "1:522527975212:web:b994d3ac0444bfa28d2e89",
  measurementId: "G-91H8MXE8WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// PayPal Client ID (Sandbox/Live)
export const PAYPAL_CLIENT_ID = "ASNwhaVMSYdges3MUw8I42lfil4W48m1DzNDMcHXK6daImbn-twodfrsFQHNCLfQ8s83sZmZRjG_74HK";