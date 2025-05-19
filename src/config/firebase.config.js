
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1yTPFj9uI5qufmS6f9Gl4Wq3S9SZ3X7E",
  authDomain: "kc-cms.firebaseapp.com",
  projectId: "kc-cms",
  storageBucket: "kc-cms.firebasestorage.app",
  messagingSenderId: "771925062416",
  appId: "1:771925062416:web:c8f7c799196d085ed0ab95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app