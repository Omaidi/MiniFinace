import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC8YaXtNoGuyR3yF1GmK9J_Vf4pm7yyp_k",
    authDomain: "minifinance-eb723.firebaseapp.com",
    projectId: "minifinance-eb723",
    storageBucket: "minifinance-eb723.firebasestorage.app",
    messagingSenderId: "448733622520",
    appId: "1:448733622520:web:a989d82c24f407ba20cb0d",
    measurementId: "G-6E8T2QPC3Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
