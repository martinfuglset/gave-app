// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACFO7UKvClQxeYtUTZLQQRrTzffxyHpmU",
  authDomain: "gaver-874cf.firebaseapp.com",
  projectId: "gaver-874cf",
  storageBucket: "gaver-874cf.appspot.com",
  messagingSenderId: "718930594494",
  appId: "1:718930594494:web:913f5d878da35f23732cef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);