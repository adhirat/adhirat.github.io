// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const db = getFirestore(app);
const storage = getStorage(app);

// Export services for use in other modules
export {
    db,
    storage,
    analytics,
    collection,
    addDoc,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL
};
