import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArzTfKtpI7XGoGqx4GrIxztLkMnefb_7Y",
  authDomain: "bivithcrm.firebaseapp.com",
  projectId: "bivithcrm",
  storageBucket: "bivithcrm.firebasestorage.app",
  messagingSenderId: "589873050777",
  appId: "1:589873050777:web:8a126755c6fbfeeb5f7408",
  measurementId: "G-SZHMBK5D0Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
