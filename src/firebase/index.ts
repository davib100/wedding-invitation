import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (typeof window !== 'undefined') {
    try {
      firebaseApp = getApp();
      auth = getAuth(firebaseApp);
      firestore = getFirestore(firebaseApp);
    } catch (e) {
      firebaseApp = initializeApp(firebaseConfig);
      auth = getAuth(firebaseApp);
      firestore = getFirestore(firebaseApp);
    }
  }
  return { firebaseApp, auth, firestore };
}

export { initializeFirebase };
