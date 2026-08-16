
// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Reemplaza estos valores por los de tu proyecto en Firebase Console
// (Configuración del proyecto > Tus apps > SDK setup and configuration).
// Se recomienda mover estos valores a variables de entorno (.env) con
// prefijo VITE_ si usas Vite, o REACT_APP_ si usas Create React App.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Rutas (paths) usadas dentro del árbol de la RTDB
export const RUTA_ESPACIOS = "espacios";
export const RUTA_HISTORIAL = "historial";
