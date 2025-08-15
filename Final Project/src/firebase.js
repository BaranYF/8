// Firebase configuration for Cinelist project
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5dOJssKiGJ5PfJtBmWRZJS9ZeVB27S2E",
  authDomain: "cinelist-d993f.firebaseapp.com",
  projectId: "cinelist-d993f",
  storageBucket: "cinelist-d993f.firebasestorage.app",
  messagingSenderId: "409119943516",
  appId: "1:409119943516:web:31b0111d8b27f6cd5b2f99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
