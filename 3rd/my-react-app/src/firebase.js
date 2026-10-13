import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkW6KaYSVyvForex_TAdQBHdnlzueTPj4",
  authDomain: "ps-002.firebaseapp.com",
  projectId: "ps-002",
  storageBucket: "ps-002.firebasestorage.app",
  messagingSenderId: "523430337454",
  appId: "1:523430337454:web:cbcae337afd7080577c63f",
  measurementId: "G-ZVFVQXVR35"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);