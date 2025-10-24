// Import the functions you need from the SDKs you need
// Fix: The 'initializeApp' property does not exist on the modern Firebase v9+ 'firebase/app' import.
// Using the v8 compatibility libraries ('firebase/compat/*') allows us to use the legacy v8 namespaced API with a v9+ installation.
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// TODO: Add your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

export { db };