// src/lib/firebase/client.ts
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

// ✅ Tohle jsou PUBLIC údaje z tvé Firebase web app (nejsou tajné).
// Beru je přímo z logu App Hosting (FIREBASE_WEBAPP_CONFIG).
const firebaseConfig = {
  apiKey: "AIzaSyBViu91sbCgXQz80D7In3fbP0HucnFYBA0",
  authDomain: "sprout-2643a.firebaseapp.com",
  projectId: "sprout-2643a",
  storageBucket: "sprout-2643a.firebasestorage.app",
  messagingSenderId: "637592873290",
  appId: "1:637592873290:web:b15dbe36182574b593f9b3",
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

// ✅ Nikdy neinicializuj Firebase při importu.
// Inicializuje se až když to zavolá klient (v prohlížeči).
export function getFirebaseApp(): FirebaseApp {
  if (!isBrowser()) {
    throw new Error("Firebase app can only be initialized in the browser.");
  }

  if (_app) return _app;

  // pokud už app existuje (HMR), vezmi ji
  const apps = getApps();
  _app = apps.length ? apps[0] : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  const app = getFirebaseApp();
  _auth = getAuth(app);
  return _auth;
}

export function getFirebaseDb(): Firestore {
  if (_db) return _db;
  const app = getFirebaseApp();
  _db = getFirestore(app);
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (_storage) return _storage;
  const app = getFirebaseApp();
  _storage = getStorage(app);
  return _storage;
}
