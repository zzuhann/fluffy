import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDAkTylknc1WuxVFunAYYec33YBelSDBQ0",
  authDomain: "fluffy-18025.firebaseapp.com",
  projectId: "fluffy-18025",
  storageBucket: "fluffy-18025.appspot.com",
  messagingSenderId: "490388718027",
  appId: "1:490388718027:web:e2fbd8d1692d2274c8f64e",
  measurementId: "G-QBTZBBYDXG",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
