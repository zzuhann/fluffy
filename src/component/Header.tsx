import React from "react";
import logo from "./fluffylogo.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "../functions/profileReducerFunction";

import {
  checkIfLogged,
  targetRegisterOrLogin,
  setProfileUid,
  setOwnPets,
} from "../functions/profileReducerFunction";
import { OwnArticle, OwnPet, PetDiaryType, Profile } from "../reducers/profile";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NavBarContainer = styled.ul`
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: 50px;
`;

const NavBar = styled.li`
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background-color: black;
    color: white;
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
          dispatch(setImage(docSnap.data().img));
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
    <Wrapper>
      <a href="/">
        <img src={logo} alt="" style={{ width: "150px" }} />
      </a>
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
