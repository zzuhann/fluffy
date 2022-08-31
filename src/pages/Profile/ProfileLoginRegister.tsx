import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  setName,
  setEmail,
  setPassword,
  setImage,
  clearProfileInfo,
  checkIfLogged,
  setProfileUid,
} from "../../functions/profileReducerFunction";
import { useSelector, useDispatch } from "react-redux";
import { Profile } from "../../reducers/profile";
import { useEffect } from "react";
import styled from "styled-components";

const ProfileLoginRegister = () => {
  const profile = useSelector((state: Profile) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(checkIfLogged(true));
        dispatch(setProfileUid(user.uid));
      } else {
        dispatch(checkIfLogged(false));
      }
    });
  }, []);

  function createProfile() {
    if (
      !profile.name &&
      !profile.email &&
      !profile.password &&
      Object.keys(profile.img).length === 0
    ) {
      window.alert("請填寫好基本資料再進行註冊");
      return;
    }

    createUserWithEmailAndPassword(auth, profile.email, profile.password).then(
      async (response) => {
        await setDoc(doc(db, "memberProfiles", response.user.uid), {
          name: profile.name,
          img: profile.img,
          //   上傳到storage 取用 url
        });
      }
    );
    dispatch(clearProfileInfo());
  }

  function logInProfile() {
    if (!profile.email && !profile.password) return;
    signInWithEmailAndPassword(auth, profile.email, profile.password).then(
      (userCredential) => {
        const user = userCredential.user;
        console.log(user);
      }
    );
    dispatch(clearProfileInfo());
  }

  return (
    <>
      <form>
        <label htmlFor="name">姓名</label>
        <input
          type="text"
          id="name"
          onChange={(e) => {
            dispatch(setName(e.target.value));
          }}
        />
        <label htmlFor="email">信箱</label>
        <input
          type="text"
          id="email"
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
        />
        <label htmlFor="password">密碼</label>
        <input
          type="text"
          id="password"
          onChange={(e) => {
            dispatch(setPassword(e.target.value));
          }}
        />
        <label htmlFor="image">上傳個人圖片</label>
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={(e) => {
            if (!e.target.files) return;
            dispatch(setImage(e.target.files[0]));
          }}
        />
        <div onClick={() => createProfile()}>註冊</div>
      </form>

      <form>
        <label htmlFor="email">信箱</label>
        <input
          type="text"
          id="email"
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
        />
        <label htmlFor="password">密碼</label>
        <input
          type="text"
          id="password"
          onChange={(e) => {
            dispatch(setPassword(e.target.value));
          }}
        />
        <div onClick={() => logInProfile()}>登入</div>
      </form>
    </>
  );
};

export default ProfileLoginRegister;
