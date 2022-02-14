import { getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config for firebase project
const firebaseConfig = {
  apiKey: "AIzaSyAuTIEwf6ElsTax1QhRNCQrjUQa9qSINhM",
  authDomain: "compounding-calculator-3e2a1.firebaseapp.com",
  projectId: "compounding-calculator-3e2a1",
  storageBucket: "compounding-calculator-3e2a1.appspot.com",
  messagingSenderId: "565103727851",
  appId: "1:565103727851:web:2026c306db78ac6c865aae",
  measurementId: "G-2PV37F9J4C",
};

// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);

export const app = getApp();
export const auth = getAuth();
export const db = getFirestore();
export const provider = new GoogleAuthProvider();

export default Firebase;
