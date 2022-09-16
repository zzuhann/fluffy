import React from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, uploadImage, db } from "../../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
import ProfileSetting from "./ProfileSetting";
import defaultProfile from "./defaultprofile.png";

const RegisterLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 450px;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 36px;
  padding-top: 95px;
  background-color: #f8f6f6;
  border-radius: 5px;
  box-shadow: 5px 5px 2px 1px rgba(255, 255, 255, 0.2),
    0 0 0 10000px rgba(0, 0, 0, 0.5);
`;

const ToggleRegisterLogin = styled.div`
  position: absolute;
  top: 52px;
  right: 36px;
  cursor: pointer;
`;

const RegisterLoginTitle = styled.div`
  font-size: 32px;
  position: absolute;
  top: 36px;
  left: 36px;
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    background-color: #d0470c;
    position: absolute;
    left: -8px;
    top: 1px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const Label = styled.label`
  font-size: 18px;
`;

const Input = styled.input`
  font-size: 18px;
  border-radius: 5px;
  letter-spacing: 1px;
  margin-top: 8px;
  background-color: #ececec;
  border: none;
  padding: 10px;
  ::placeholder,
  ::-webkit-input-placeholder {
    font-size: 16px;
    letter-spacing: 1px;
  }
  :-ms-input-placeholder {
    font-size: 16px;
    letter-spacing: 1px;
  }
`;

export const RegisterLoginBtn = styled.div`
  width: 100%;
  font-size: 18px;
  letter-spacing: 1.5px;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  background-color: #952f04;
  color: #fff;
  cursor: pointer;
  align-self: center;
  text-align: center;
  transition: 0.3s;
  &:hover {
    background-color: #8a2b02;
  }
`;
const ProfileLoginRegister = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  let navigate = useNavigate();

  function createProfile() {
    if (!profile.name || !profile.email || !profile.password) {
      window.alert("請填寫好基本資料再進行註冊");
      return;
    }

    createUserWithEmailAndPassword(auth, profile.email, profile.password).then(
      async (response) => {
        const userUid = response.user.uid;
        await setDoc(doc(db, "memberProfiles", userUid), {
          name: profile.name,
        });
        dispatch(afterRegisterSaveName());
        window.alert("註冊成功！");
        navigate("/");
      }
    );
  }

  function logInProfile() {
    if (!profile.email && !profile.password) return;
    signInWithEmailAndPassword(auth, profile.email, profile.password).then(
      async (userCredential) => {
        window.alert("登入成功！");
        dispatch(clearProfileInfo());
        navigate("/");
        const docRef = doc(db, "memberProfiles", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setName(docSnap.data().name));
          if (docSnap.data().img) {
            dispatch(setImage(docSnap.data().img));
          } else {
            dispatch(setImage(defaultProfile));
          }
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
        <ProfileSetting signOutProfile={signOutProfile} />
      ) : profile.clickLoginOrRegister === "login" ? (
        <RegisterLoginWrapper>
          <RegisterLoginTitle>登入</RegisterLoginTitle>
          <ToggleRegisterLogin
            onClick={() => {
              dispatch(setEmail(""));
              dispatch(setPassword(""));
              dispatch(targetRegisterOrLogin("register"));
            }}
          >
            尚未有帳號？進行註冊
          </ToggleRegisterLogin>
          <InputContainer>
            <Label htmlFor="email">Email 帳號</Label>
            <Input
              type="text"
              placeholder="請輸入 Email"
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
              placeholder="請輸入密碼"
              id="password"
              onChange={(e) => {
                dispatch(setPassword(e.target.value));
              }}
            />
          </InputContainer>
          <RegisterLoginBtn onClick={() => logInProfile()}>
            登入
          </RegisterLoginBtn>
        </RegisterLoginWrapper>
      ) : (
        <RegisterLoginWrapper>
          <RegisterLoginTitle>註冊</RegisterLoginTitle>
          <InputContainer>
            <Label htmlFor="name">使用者名稱</Label>
            <Input
              type="text"
              placeholder="輸入使用者名稱"
              id="name"
              value={profile.name}
              onChange={(e) => {
                dispatch(setName(e.target.value));
              }}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="email">Email 帳號</Label>
            <Input
              type="text"
              placeholder="請輸入 email"
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
              placeholder="長度至少六位字元"
              id="password"
              value={profile.password}
              onChange={(e) => {
                dispatch(setPassword(e.target.value));
              }}
            />
          </InputContainer>
          {/* <InputContainer>
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
          </InputContainer> */}
          <RegisterLoginBtn onClick={() => createProfile()}>
            註冊
          </RegisterLoginBtn>
          <ToggleRegisterLogin
            onClick={() => {
              dispatch(setName(""));
              dispatch(setEmail(""));
              dispatch(setPassword(""));
              dispatch(targetRegisterOrLogin("login"));
            }}
          >
            已經有帳號？進行登入
          </ToggleRegisterLogin>
        </RegisterLoginWrapper>
      )}
    </>
  );
};

export default ProfileLoginRegister;
