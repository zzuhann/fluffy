import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAkTylknc1WuxVFunAYYec33YBelSDBQ0",
  authDomain: "fluffy-18025.firebaseapp.com",
  projectId: "fluffy-18025",
  storageBucket: "fluffy-18025.appspot.com",
  messagingSenderId: "490388718027",
  appId: "1:490388718027:web:e2fbd8d1692d2274c8f64e",
  measurementId: "G-QBTZBBYDXG",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
