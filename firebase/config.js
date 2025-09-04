// Firebase configuration for ASTEL Marketplace
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// User-provided Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDfJpkOma0kIUzDvM9oXHW0D2iUzVrJFv4',
  authDomain: 'astel-fb630.firebaseapp.com',
  projectId: 'astel-fb630',
  storageBucket: 'astel-fb630.appspot.com',
  messagingSenderId: '515354404647',
  appId: '1:515354404647:web:ce6f907925e2aa87a1eb02'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;

export const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket'];
  const missingFields = requiredFields.filter((field) => !firebaseConfig[field]);
  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration fields:', missingFields);
    return false;
  }
  return true;
};
