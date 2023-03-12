import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 지영님 키
// const firebaseConfig = {
//   apiKey: 'AIzaSyDFTrfvXSbCqBOThx0ZW0h0q6H8dS2BpbA',
//   authDomain: 'gym-tivation.firebaseapp.com',
//   projectId: 'gym-tivation',
//   storageBucket: 'gym-tivation.appspot.com',
//   messagingSenderId: '668612991463',
//   appId: '1:668612991463:web:7d56df459c9ce58aed4542',
// };

// 지수님 키
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

//창순님 키
// const firebaseConfig = {
//   apiKey: 'AIzaSyBlo4W0GPP8wQVOhJeFmHzRdWBj8ND-KjU',
//   authDomain: 'gymtivation03.firebaseapp.com',
//   projectId: 'gymtivation03',
//   storageBucket: 'gymtivation03.appspot.com',
//   messagingSenderId: '344246592041',
//   appId: '1:344246592041:web:d6f2b301b9e44cd4f1b238',
//   measurementId: 'G-ETSC9ENJ6Z',
// };
export const app = initializeApp(firebaseConfig);
export const authService = getAuth(app);
export const database = getDatabase(app);
export const dbService = getFirestore(app);
export const storage = getStorage(app);
