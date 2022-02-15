import { getApp, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import toast from "react-hot-toast";

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

// function to email the user a magic link
export const emailMagicLink = async (email: string) => {
  return await sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}`, // returns to origin
    handleCodeInApp: true,
  })
    .then(() => {
      toast.success("A link was sent to your email!");
      window.localStorage.setItem("emailForSignIn", email);
    })
    .catch((error) => {
      console.error(error);
    });
};

// function to sign in the current user from their magic link
export const signInWithMagicLink = () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem("emailForSignIn"); // get email to use for sign in
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }

    // @ts-ignore: email is stored in the localStorage already, and error is handled if it were null
    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        window.localStorage.removeItem("emailForSignIn");
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        let name = window.localStorage.getItem("displayName");
        updateProfile(auth.currentUser as User, {
          displayName: name,
        })
          .then(() => {
            console.log("Profile updated");
          })
          .catch((error) => {
            console.log(error);
          });
        window.localStorage.removeItem("displayName");
      });
  }
};

export default Firebase;
