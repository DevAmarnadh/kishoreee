import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAgWynalRh9LtAhVHk4l9w9PmGe_yHkcE0",
  authDomain: "kisho-46188.firebaseapp.com",
  projectId: "kisho-46188",
  storageBucket: "kisho-46188.appspot.com", // <-- FIXED HERE
  messagingSenderId: "8152857337",
  appId: "1:8152857337:web:2c303c5aa85b5003318028",
  measurementId: "G-LGCDKCQK29"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;