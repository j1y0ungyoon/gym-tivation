import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDFTrfvXSbCqBOThx0ZW0h0q6H8dS2BpbA',
  authDomain: 'gym-tivation.firebaseapp.com',
  projectId: 'gym-tivation',
  storageBucket: 'gym-tivation.appspot.com',
  messagingSenderId: '668612991463',
  appId: '1:668612991463:web:7d56df459c9ce58aed4542',
};

export const app = initializeApp(firebaseConfig);
export const authService = getAuth(app);
export const database = getDatabase(app);
export const dbService = getFirestore(app);
export const storage = getStorage(app);
