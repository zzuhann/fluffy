import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, uploadImage, db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

import {
  setName,
  setEmail,
  setPassword,
  setImage,
  clearProfileInfo,
  targetRegisterOrLogin,
  checkIfLogged,
  afterRegisterSaveName,
} from "../../functions/profileReducerFunction";
import { useSelector, useDispatch } from "react-redux";
import { Profile } from "../../reducers/profile";
import { useRef } from "react";
import styled from "styled-components";

const RegisterLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  margin: 0 auto;
`;

const InputContainer = styled.div`
  display: flex;
`;

const Label = styled.label``;

const Input = styled.input``;

const RegisterLoginBtn = styled.div`
  width: 200px;
  cursor: pointer;
  align-self: center;
  text-align: center;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const ProfileLoginRegister = () => {
  const profile = useSelector<{ dating: Profile }>((state) => state) as Profile;
  const dispatch = useDispatch();
  const imageRef = useRef<HTMLInputElement>(null);

  function createProfile() {
    if (!profile.name || !profile.email || !profile.password || !profile.img) {
      window.alert("請填寫好基本資料再進行註冊");
      return;
    }

    createUserWithEmailAndPassword(auth, profile.email, profile.password).then(
      (response) => {
        const userUid = response.user.uid;
        uploadImage(userUid, profile.img as File, profile.name);
        dispatch(afterRegisterSaveName());
        window.alert("註冊成功！");
      }
    );
    if (null !== imageRef.current) {
      imageRef.current.value = "";
    }
  }

  function logInProfile() {
    if (!profile.email && !profile.password) return;
    signInWithEmailAndPassword(auth, profile.email, profile.password).then(
      async (userCredential) => {
        window.alert("登入成功！");
        dispatch(clearProfileInfo());
        const docRef = doc(db, "memberProfiles", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setName(docSnap.data().name));
          dispatch(setImage(docSnap.data().img));
        } else {
          console.log("No such document!");
        }
      }
    );
  }

  function signOutProfile() {
    signOut(auth)
      .then(() => {
        dispatch(checkIfLogged(false));
        dispatch(clearProfileInfo());
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      {profile.isLogged ? (
        <>
          <div>已經登入</div>
          <img src={profile.img as string} alt="" style={{ width: "200px" }} />
          <RegisterLoginBtn onClick={() => signOutProfile()}>
            登出
          </RegisterLoginBtn>
        </>
      ) : profile.clickLoginOrRegister === "login" ? (
        <RegisterLoginWrapper>
          <InputContainer>
            <Label htmlFor="email">信箱</Label>
            <Input
              type="text"
              id="email"
              onChange={(e) => {
                dispatch(setEmail(e.target.value));
              }}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="password">密碼</Label>
            <Input
              type="text"
              id="password"
              onChange={(e) => {
                dispatch(setPassword(e.target.value));
              }}
            />
          </InputContainer>
          <RegisterLoginBtn onClick={() => logInProfile()}>
            登入
          </RegisterLoginBtn>
          <RegisterLoginBtn
            onClick={() => dispatch(targetRegisterOrLogin("register"))}
          >
            尚未有帳號？進行註冊
          </RegisterLoginBtn>
        </RegisterLoginWrapper>
      ) : (
        <RegisterLoginWrapper>
          <InputContainer>
            <Label htmlFor="name">姓名</Label>
            <Input
              type="text"
              id="name"
              value={profile.name}
              onChange={(e) => {
                dispatch(setName(e.target.value));
              }}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="email">信箱</Label>
            <Input
              type="text"
              id="email"
              value={profile.email}
              onChange={(e) => {
                dispatch(setEmail(e.target.value));
              }}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="password">密碼</Label>
            <Input
              type="password"
              id="password"
              value={profile.password}
              onChange={(e) => {
                dispatch(setPassword(e.target.value));
              }}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="image">上傳個人圖片</Label>
            <Input
              type="file"
              accept="image/*"
              id="image"
              ref={imageRef}
              onChange={(e) => {
                if (!e.target.files) return;
                dispatch(setImage(e.target.files[0]));
              }}
            />
          </InputContainer>
          <RegisterLoginBtn onClick={() => createProfile()}>
            註冊
          </RegisterLoginBtn>
          <RegisterLoginBtn
            onClick={() => dispatch(targetRegisterOrLogin("login"))}
          >
            已經有帳號？進行登入
          </RegisterLoginBtn>
        </RegisterLoginWrapper>
      )}
    </>
  );
};

export default ProfileLoginRegister;
