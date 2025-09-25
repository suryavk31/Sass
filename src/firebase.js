import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your existing Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAixxskGK0AQ5pwr-mS7-9s_w7UbqVFsdc",
  authDomain: "vivimart-seller-840f7.firebaseapp.com",
  projectId: "vivimart-seller-840f7",
  storageBucket: "vivimart-seller-840f7.firebasestorage.app",
  messagingSenderId: "587166488931",
  appId: "1:587166488931:web:21e257f711eb8e78ba1b56",
  measurementId: "G-QKPPE68EMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
  })
  .catch((error) => {
      console.error('Service Worker registration failed:', error);
  });
}

// Requesting permission and getting the token
export const requestForToken = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: "BFrFsp3Q-1qBPWqhE2iigGsFt6Phm_b2AHFQIo6KPyGxepQmcjrjl13EHnANq0N3iwBUBxXtZP--bybqr_ThNTg" });
        console.log('Token generated:', token);
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
    }
};
