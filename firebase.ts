import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDveLK0_kCYs2KOUUJxV85KtLi2IdjjgZc',
  authDomain: 'gymtivation-a41d1.firebaseapp.com',
  projectId: 'gymtivation-a41d1',
  storageBucket: 'gymtivation-a41d1.appspot.com',
  messagingSenderId: '23396637230',
  appId: '1:23396637230:web:1c3035cb572abbd74cddbf',
  measurementId: 'G-8BKMFDZ3HS',
};

export const app = initializeApp(firebaseConfig);
export const authService = getAuth(app);
export const database = getDatabase(app);
export const dbService = getFirestore(app);
