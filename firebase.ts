import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDveLK0_kCYs2KOUUJxV85KtLi2IdjjgZc',
  authDomain: 'gymtivation-a41d1.firebaseapp.com',
  databaseURL: 'https://gymtivation-a41d1-default-rtdb.firebaseio.com',
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
export const storage = getStorage(app);
