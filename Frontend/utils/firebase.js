// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "fridayai-ce2d3.firebaseapp.com",
    projectId: "fridayai-ce2d3",
    storageBucket: "fridayai-ce2d3.firebasestorage.app",
    messagingSenderId: "281413027718",
    appId: "1:281413027718:web:60152652feb89214568e07"
};
console.log(import.meta.env.VITE_FIREBASE_API_KEY)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()

export { app, auth, googleProvider }