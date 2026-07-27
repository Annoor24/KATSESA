import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// REPLACE WITH YOUR ACTUAL KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDT9s17yFrw85jfIqo0nrI5tFC_9HgEUHs",
  authDomain: "katsesa-da0c7.firebaseapp.com",
  projectId: "katsesa-da0c7",
  storageBucket: "katsesa-da0c7.firebasestorage.app",
  messagingSenderId: "508694926332",
  appId: "1:508694926332:web:3d8f03609f070a58e85879",
  measurementId: "G-1FP7MTGD67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
