// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO-V4cF2-afx51d8MCkvQMykBDXO94sTI",
  authDomain: "yokai-a90e8.firebaseapp.com",
  projectId: "yokai-a90e8",
  storageBucket: "yokai-a90e8.firebasestorage.app",
  messagingSenderId: "218256721884",
  appId: "1:218256721884:web:2b257f3c954aea68aa7119",
  measurementId: "G-EY0BV6DPRG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);