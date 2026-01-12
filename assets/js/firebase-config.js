// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDy4XLTYhuT0RMGio_DUQ1rqpD2ZcdQwQ",
    authDomain: "adhirat-website.firebaseapp.com",
    projectId: "adhirat-website",
    storageBucket: "adhirat-website.firebasestorage.app",
    messagingSenderId: "663501027472",
    appId: "1:663501027472:web:dca6b9f02a82d367d94015",
    measurementId: "G-BMYNEG9X4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export services for use in other modules
export {
    auth,
    db,
    analytics,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
};
