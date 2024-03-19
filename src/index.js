import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNgIZDpjoIwAvFKsnTGRlp3a2ne5ZlPtY",
    authDomain: "inp-legends.firebaseapp.com",
    projectId: "inp-legends",
    storageBucket: "inp-legends.appspot.com",
    messagingSenderId: "170345546974",
    appId: "1:170345546974:web:9733718c20ceba5842ee4f",
    measurementId: "G-2NHCRCFXZV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services
export { db, auth };
