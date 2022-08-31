import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../utils/firebase";

import {
  setName,
  setEmail,
  setPassword,
  clearProfileInfo,
} from "../../functions/profileReducerFunction";
import { useSelector, useDispatch } from "react-redux";
import { Profile } from "../../reducers/profile";

const ProfileLoginRegister = () => {
  const profile = useSelector((state: Profile) => state);
  const dispatch = useDispatch();

  function createProfile() {
    if (Object.values(profile).some((item) => item === "")) return;

    createUserWithEmailAndPassword(auth, profile.email, profile.password).then(
      (userCredential) => {
        const user = userCredential.user;
        console.log(user);
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
