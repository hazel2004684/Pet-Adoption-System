import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ_6O5FEioOibBakKovTsK9wH3HT4QD3Y",
  authDomain: "pet-adoption-system-25fb6.firebaseapp.com",
  projectId: "pet-adoption-system-25fb6",
  storageBucket: "pet-adoption-system-25fb6.firebasestorage.app",
  messagingSenderId: "956546374207",
  appId: "1:956546374207:web:a583773b7c061a3608f68a"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
