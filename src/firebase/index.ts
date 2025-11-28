import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let db: Firestore;

try {
  firebaseApp = getApp();
} catch (e) {
  firebaseApp = initializeApp(firebaseConfig);
}

db = getFirestore(firebaseApp);

// Habilita a persistência offline.
// Isso armazena os dados localmente para que o aplicativo funcione offline
// e para evitar erros de "cliente offline" na inicialização.
try {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Múltiplas abas abertas, o que pode causar problemas.
          // A persistência funcionará na primeira aba, mas não nas outras.
          console.warn('Firestore persistence failed: Multiple tabs open.');
        } else if (err.code == 'unimplemented') {
          // O navegador não suporta a persistência.
          console.warn('Firestore persistence is not available in this browser.');
        }
      });
} catch (error) {
    console.error("Error enabling Firestore persistence:", error);
}


const auth: Auth = getAuth(firebaseApp);

export { auth, db };
