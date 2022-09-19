import React, { useState } from "react";
import logo from "./fluffylogo.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  setName,
  setImage,
  setOwnPetDiary,
  setOwnArticle,
  setEmail,
} from "../functions/profileReducerFunction";
import defaultProfile from "./defaultprofile.png";

import {
  checkIfLogged,
  targetRegisterOrLogin,
  setProfileUid,
  setOwnPets,
} from "../functions/profileReducerFunction";
import { OwnArticle, OwnPet, PetDiaryType, Profile } from "../reducers/profile";

const Wrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  position: fixed;
  z-index: 1002;
  background-color: ${(props) => (props.$isActive ? "#fff" : "transparent")};
  width: 100%;
  padding: 15px 20px;
  letter-spacing: 1.5px;
  transition: 0.1s;
`;

const Logo = styled(Link)``;
const LogoImg = styled.img`
  width: 150px;
`;

const NavBarContainer = styled.ul`
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: 50px;
`;

const NavBar = styled.li`
  margin-right: 20px;
  font-size: 18px;
  cursor: pointer;
  position: relative;

  &:after {
    transition: 0.3s;
    content: "";
    width: 0%;
    height: 3px;
    background-color: #b7b0a8;
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  &:hover:after {
    width: 100%;
  }
  &:last-child {
    margin-right: 0;
  }
`;

const LoginRegisterBtnWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LoginRegisterBtn = styled.div`
  cursor: pointer;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const Header = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scroll, setScroll] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    let scrollTop = document.documentElement.scrollTop;
    setScroll(scrollTop);
  }

  async function getAuthorPetDiary(authorUid: string) {
    const authorPetDiary: PetDiaryType[] = [];
    const q = query(
      collection(db, "petDiaries"),
      where("authorUid", "==", authorUid),
      orderBy("postTime")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetDiary.push({ id: info.id, ...info.data() } as PetDiaryType);
    });
    dispatch(setOwnPetDiary(authorPetDiary));
  }

  async function getAuthorArticles(authorUid: string) {
    const authorPetDiary: OwnArticle[] = [];
    const q = query(
      collection(db, "petArticles"),
      where("authorUid", "==", authorUid)
      // orderBy("postTime")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetDiary.push({
        id: info.id,
        ...info.data(),
      } as OwnArticle);
    });
    dispatch(setOwnArticle(authorPetDiary));
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        getOwnPetList(user.uid);
        dispatch(setProfileUid(user.uid));
        dispatch(checkIfLogged(true));
        getAuthorPetDiary(user.uid);
        getAuthorArticles(user.uid);
        const docRef = doc(db, "memberProfiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setName(docSnap.data().name));
          dispatch(setEmail(user.email as string));
          if (docSnap.data().img) {
            dispatch(setImage(docSnap.data().img));
          } else {
            dispatch(setImage(defaultProfile));
          }
        } else {
          console.log("No such document!");
        }
      } else {
        dispatch(checkIfLogged(false));
      }
    });
  }, []);

  async function getOwnPetList(id: string) {
    const allOwnPet: OwnPet[] = [];
    const q = collection(db, `memberProfiles/${id}/ownPets`);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      allOwnPet.push(info.data() as OwnPet);
    });
    dispatch(setOwnPets(allOwnPet));
  }

  return (
    <Wrapper $isActive={scroll > 0}>
      <Logo to="/">
        <LogoImg src={logo} alt="" />
      </Logo>
      <NavBarContainer>
        <NavBar
          onClick={() => {
            if (!profile.isLogged) {
              window.alert(
                "使用此功能需先註冊或登入！點擊確認後前往註冊與登入頁面"
              );
              navigate("/profile");
            } else {
              navigate("/dating");
            }
          }}
        >
          配對專區
        </NavBar>
        <NavBar
          onClick={() => {
            navigate("/petdiary");
          }}
        >
          寵物日記
        </NavBar>
        <NavBar
          onClick={() => {
            navigate("/articles");
          }}
        >
          寵物文章補給
        </NavBar>
        <NavBar
          onClick={() => {
            navigate("/clinic");
          }}
        >
          24 小時動物醫院
        </NavBar>
      </NavBarContainer>

      {profile.isLogged ? (
        <NavBarContainer style={{ marginRight: "5px" }}>
          <NavBar
            style={{ marginRight: "20px" }}
            onClick={() => navigate(`/profile/${profile.uid}`)}
          >
            會員專區
          </NavBar>
          <NavBar onClick={() => navigate("/profile")}>
            {profile.name} 您好！
          </NavBar>
        </NavBarContainer>
      ) : (
        <LoginRegisterBtnWrapper>
          <LoginRegisterBtn
            onClick={() => {
              dispatch(targetRegisterOrLogin("register"));
              navigate("/profile");
            }}
          >
            註冊
          </LoginRegisterBtn>
          <LoginRegisterBtn
            onClick={() => {
              dispatch(targetRegisterOrLogin("login"));
              navigate("/profile");
            }}
          >
            登入
          </LoginRegisterBtn>
        </LoginRegisterBtnWrapper>
      )}
    </Wrapper>
  );
};

export default Header;
