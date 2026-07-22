import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyA5-YBy8vPXKKCXyvauYyG51iRy-lplmVw",
  authDomain: "trafficsello.firebaseapp.com",
  databaseURL: "https://trafficsello-default-rtdb.firebaseio.com",
  projectId: "trafficsello",
  storageBucket: "trafficsello.firebasestorage.app",
  messagingSenderId: "9677309092",
  appId: "1:9677309092:web:70159f8f85e4aa2f0ad231"
};

// Lazy safely initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
