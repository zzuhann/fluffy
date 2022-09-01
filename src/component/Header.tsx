import React from "react";
import logo from "./fluffylogo.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { setName, setImage } from "../functions/profileReducerFunction";

import {
  checkIfLogged,
  targetRegisterOrLogin,
  setProfileUid,
} from "../functions/profileReducerFunction";
import { Profile } from "../reducers/profile";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LoginRegisterBtn = styled.div`
  cursor: pointer;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const Header = () => {
  const profile = useSelector((state: Profile) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setProfileUid(user.uid));
        dispatch(checkIfLogged(true));
        const docRef = doc(db, "memberProfiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setName(docSnap.data().name));
          dispatch(setImage(docSnap.data().img));
        } else {
          console.log("No such document!");
        }
      } else {
        dispatch(checkIfLogged(false));
      }
    });
  }, []);

  return (
    <Wrapper>
      <a href="/">
        <img src={logo} alt="" style={{ width: "150px" }} />
      </a>
      {profile.isLogged ? (
        <p>{profile.name} 您好！</p>
      ) : (
        <div>
          <LoginRegisterBtn
            onClick={() => {
              dispatch(targetRegisterOrLogin("register"));
            }}
          >
            註冊
          </LoginRegisterBtn>
          <LoginRegisterBtn
            onClick={() => {
              dispatch(targetRegisterOrLogin("login"));
            }}
          >
            登入
          </LoginRegisterBtn>
        </div>
      )}
    </Wrapper>
  );
};

export default Header;
