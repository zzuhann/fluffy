import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
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

export async function deleteFirebaseDataMutipleWhere(
  url: string,
  field: string,
  target: string | number,
  field2: string,
  target2: string
) {
  const q = query(
    collection(db, url),
    where(field, "==", target),
    where(field2, "==", target2)
  );
  const querySnapshot = await getDocs(q);
  const promises: any[] = [];
  querySnapshot.forEach(async (d) => {
    promises.push(deleteDoc(doc(db, url, d.id)));
  });
  await Promise.all(promises);
}

export function addDataWithUploadImage(
  imageUrl: string,
  imageFile: File,
  fn: Function
) {
  const storageRef = ref(storage, imageUrl);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);
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
        fn(downloadURL);
      });
    }
  );
}

export function updateUseStateInputImage(file: FileList, fn: Function) {
  if (!file) return;
  const newImage = {
    file: file[0],
    url: URL.createObjectURL(file[0]),
  };
  fn(newImage);
}

export async function updateFirebaseDataMutipleWhere(
  collectionUrl: string,
  field1: string,
  target1: number,
  field2: string,
  target2: string,
  imgURL: string,
  data: any
) {
  const q = query(
    collection(db, collectionUrl),
    where(field1, "==", target1),
    where(field2, "==", target2)
  );
  const querySnapshot = await getDocs(q);
  const promises: any[] = [];
  querySnapshot.forEach(async (d) => {
    const targetRef = doc(db, collectionUrl, d.id);
    if (imgURL) {
      promises.push(updateDoc(targetRef, data));
    } else {
      promises.push(updateDoc(targetRef, data));
    }
  });
  await Promise.all(promises);
}
