import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  initializeFirestore, 
  persistentLocalCache
} from 'firebase/firestore';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  firebaseApp = getApp();
} catch (e) {
  firebaseApp = initializeApp(firebaseConfig);
}

// ✅ Inicializa Firestore com cache persistente (substitui enableIndexedDbPersistence)
db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache()
});

// Initialize Auth
auth = getAuth(firebaseApp);

export { auth, db };
