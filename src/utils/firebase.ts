import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

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
export const db = getFirestore(app);
export const storage = getStorage(app);

export const uploadImage = (uid: string, file: File, name: string) => {
  const storageRef = ref(storage, `images/${uid}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      console.log("upload");
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        await setDoc(doc(db, "memberProfiles", uid), {
          name: name,
          img: downloadURL,
        });
      });
    }
  );
};

export async function deleteFirebaseData(
  url: string,
  field: string,
  target: string | number
) {
  const q = query(collection(db, url), where(field, "==", target));
  const querySnapshot = await getDocs(q);
  const promises: any[] = [];
  querySnapshot.forEach(async (d) => {
    promises.push(deleteDoc(doc(db, url, d.id)));
  });
  await Promise.all(promises);
}
