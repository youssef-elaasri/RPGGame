import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


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


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

const analytics = getAnalytics(app);

// Export services
export { db, auth };
