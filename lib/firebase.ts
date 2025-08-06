import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Si usarás Realtime DB
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Si usarás Storage

const firebaseConfig = {
  apiKey: "AIzaSyAjkj2Mvbm8SEwbjLmbrOqWUrXR0VNwM8k",
  authDomain: "coyote-workout-5d85f.firebaseapp.com",
  databaseURL: "https://coyote-workout-5d85f-default-rtdb.firebaseio.com",
  projectId: "coyote-workout-5d85f",
  storageBucket: "coyote-workout-5d85f.firebasestorage.app",
  messagingSenderId: "622606458190",
  appId: "1:622606458190:web:695fee810d2357b4add21f",
  measurementId: "G-GE0RTJ13QG",
};

const app = initializeApp(firebaseConfig);

// Exporta los servicios que vayas a usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);  // Realtime Database (opcional)
export const storage = getStorage(app); // Storage (opcional)
