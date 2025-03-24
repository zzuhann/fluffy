"use client";

import React, { useState } from "react";
import logo from "./img/fluffylogo.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
  clearProfileInfo,
  setShelter,
} from "../functions/profileReducerFunction";
import defaultProfile from "./img/defaultprofile.png";
import catHand from "./img/cat_hand_white.png";
import {
  checkIfLogged,
  targetRegisterOrLogin,
  setProfileUid,
  setOwnPets,
} from "../functions/profileReducerFunction";
import { OwnArticle, OwnPet, PetDiaryType, Profile } from "../reducers/profile";
import burgerMenu from "./img/bar.png";
import { InviteDating } from "../reducers/dating";
import { setUpcomingDateList } from "../functions/datingReducerFunction";
import { navbars } from "../utils/ConstantInfo";
import { useNotifyDispatcher } from "./SidebarNotify";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 2502;
  background-color: #fff;
  width: 100%;
  padding: 15px 20px;
  letter-spacing: 1.5px;
  transition: 0.1s;
  height: 72px;
`;

const BurgerMenu = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 30px;
  display: none;
  cursor: pointer;
  @media (max-width: 1025px) {
    display: block;
  }
`;

const Logo = styled.a`
  @media (max-width: 1025px) {
    margin-right: auto;
  }
`;
const LogoImg = styled.img`
  width: 150px;
  height: 41px;
`;

const SidebarContainer = styled.ul<{ $isActive: boolean }>`
  left: -250px;
  top: 72px;
  display: none;
  @media (max-width: 1025px) {
    left: ${(props) => (props.$isActive ? "0" : "-250px")};
    transition: ${(props) => (props.$isActive ? "0.3s" : "0")};
    width: 250px;
    height: 100vh;
    position: fixed;
    top: 72px;
    background-color: #fff;
    z-index: 2501;
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-top: solid 1px #d1cfcf;
  }
`;

export const BlackMask = styled.div<{
  $isActive: boolean;
}>`
  opacity: ${(props) => (props.$isActive ? "1" : "0")};
  overflow-y: hidden;
  transition: 0.3s;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  left: 0;
  top: 0;
  width: 100%;
  height: ${(props) => (props.$isActive ? "100%" : "0")};
  z-index: ${(props) => (props.$isActive ? "2500" : "0")};
`;

const NavBarTag = styled.nav`
  margin-right: auto;
  margin-left: 50px;
  @media (max-width: 1025px) {
    display: none;
  }
`;

const NavBarContainer = styled.ul`
  display: flex;
  align-items: center;
  @media (max-width: 1025px) {
    display: none;
  }
`;

const ProfileNavBarContainer = styled.ul`
  display: flex;
  align-items: center;
  margin-right: 5px;
  cursor: pointer;
`;

const NavBar = styled.li`
  margin-right: 20px;
  font-size: 18px;
  cursor: pointer;
  position: relative;
  width: fit-content;
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
  @media (max-width: 1025px) {
    font-size: 22px;
    letter-spacing: 1.5px;
    margin-right: 0;
    margin-top: 40px;
  }
`;

const ProfileNavBar = styled.li`
  font-size: 18px;
  cursor: pointer;
  position: relative;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
  line-height: 24px;
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
  @media (max-width: 564px) {
    display: none;
  }
`;

const LoginRegisterBtnWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LoginRegisterBtn = styled.div`
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

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 25px;
  margin-right: 20px;
  @media (max-width: 564px) {
    margin-right: 0;
  }
`;

const ProfileHoverBox = styled.ul<{ $isActive: boolean }>`
  width: 150px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: ${(props) => (props.$isActive ? "solid 1px #d1cfcf" : "none")};
  position: absolute;
  top: 70px;
  transition: 0.3s;
  height: ${(props) => (props.$isActive ? "auto" : "0")};
  overflow: hidden;
  border-radius: 5px;
  right: 20px;
  padding: ${(props) => (props.$isActive ? "20px" : "0")};
  @media (max-width: 564px) {
    width: 120px;
    top: 70px;
    padding: ${(props) => (props.$isActive ? "10px" : "0")};
  }
`;

const ProfileHoverUnit = styled.li`
  font-size: 22px;
  margin-bottom: 20px;
  position: relative;
  text-align: center;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
    &:hover:after {
      width: 50%;
    }
  }
  @media (max-width: 564px) {
    font-size: 18px;
    margin-bottom: 25px;
  }
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
`;

export const PopUpMessage = styled.div`
  width: 400px;
  left: 50%;
  transform: translateX(-50%);
  top: 40vh;
  position: fixed;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  z-index: 2505;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const PopUpText = styled.div`
  text-align: center;
  vertical-align: middle;
  font-size: 22px;
  margin-top: 20px;
`;

export const PopUpNote = styled.div`
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
  letter-spacing: 1.5px;
  margin-top: 15px;
`;

export const PopImg = styled(Image)`
  width: 100px;
  height: 100px;
  object-fit: cover;
  object-position: top;
`;

const Header = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const router = useRouter();
  const notifyDispatcher = useNotifyDispatcher();
  const [clickBurgerMenu, setClickBurgerMenu] = useState<boolean>(false);
  const [openProfileBox, setOpenProfileBox] = useState<boolean>(false);
  const [openPopupBox, setOpenPopupBox] = useState(false);
  const [navigateToProfileTime, setNavigateToProfileTime] = useState(3);

  useEffect(() => {
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

    async function getUpcomingListData(uid: string) {
      let upcomingDate: InviteDating[] = [];
      const q = query(
        collection(db, "memberProfiles", uid, "upcomingDates"),
        orderBy("datingDate")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((info) => {
        upcomingDate.push({
          ...info.data(),
          datingDate: info.data().dateAndTime,
        } as InviteDating);
      });
      dispatch(setUpcomingDateList(upcomingDate));
    }

    async function getOwnPetList(id: string) {
      const allOwnPet: OwnPet[] = [];
      const q = collection(db, `memberProfiles/${id}/ownPets`);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((info) => {
        allOwnPet.push(info.data() as OwnPet);
      });
      dispatch(setOwnPets(allOwnPet));
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        getOwnPetList(user.uid);
        dispatch(setProfileUid(user.uid));
        dispatch(checkIfLogged(true));
        getAuthorPetDiary(user.uid);
        getAuthorArticles(user.uid);
        getUpcomingListData(user.uid);
        const docRef = doc(db, "memberProfiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setName(docSnap.data().name));
          dispatch(setEmail(user.email as string));
          if (docSnap.data().shelter === "true") {
            dispatch(setShelter(true));
          }
          if (docSnap.data().img) {
            dispatch(setImage(docSnap.data().img));
          } else {
            dispatch(setImage(defaultProfile.src));
          }
        } else {
          console.log("No such document!");
        }
      } else {
        dispatch(checkIfLogged(false));
        dispatch(targetRegisterOrLogin("login"));
      }
    });
  }, [dispatch]);

  function signOutProfile() {
    signOut(auth)
      .then(() => {
        dispatch(checkIfLogged(false));
        dispatch(clearProfileInfo());
        notifyDispatcher("登出成功");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function gotoProfilePage() {
    setNavigateToProfileTime(3);
    setOpenPopupBox(true);
    const coundDownTimer = setInterval(() => {
      setNavigateToProfileTime((prev) => {
        if (prev <= 0) {
          clearInterval(coundDownTimer);
          setOpenPopupBox(false);
          router.push("/profile");
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  }

  return (
    <>
      <BlackMask
        $isActive={clickBurgerMenu === true}
        onClick={() =>
          clickBurgerMenu ? setClickBurgerMenu(false) : setClickBurgerMenu(true)
        }
      />
      <Wrapper>
        <BurgerMenu
          src={burgerMenu.src}
          alt="sidebar"
          onClick={() =>
            clickBurgerMenu
              ? setClickBurgerMenu(false)
              : setClickBurgerMenu(true)
          }
        />
        <Logo href="/">
          <LogoImg src={logo.src} alt="fluffy" />
        </Logo>
        <NavBarTag>
          <NavBarContainer>
            {navbars.map((navbar, index) => (
              <NavBar
                key={index}
                onClick={() => {
                  if (navbar.needToLogin && !profile.isLogged) {
                    gotoProfilePage();
                  } else {
                    router.push(navbar.targetLink);
                  }
                }}
              >
                {navbar.name}
              </NavBar>
            ))}
            {profile.isShelter && (
              <NavBar
                onClick={() => {
                  router.push("/shelter");
                }}
              >
                所有視訊申請
              </NavBar>
            )}
          </NavBarContainer>
        </NavBarTag>
        {openPopupBox && (
          <>
            <PopUpMessage>
              <PopImg
                src={catHand.src}
                alt="loding-first"
                width={100}
                height={100}
              />
              <PopUpText>進入配對專區需先登入/註冊</PopUpText>
              <PopUpNote>
                {navigateToProfileTime} 秒後自動跳轉至登入頁面 ...
              </PopUpNote>
            </PopUpMessage>
            <BlackMask $isActive={openPopupBox === true} />
          </>
        )}

        {profile.isLogged ? (
          <ProfileNavBarContainer
            onClick={() =>
              openProfileBox
                ? setOpenProfileBox(false)
                : setOpenProfileBox(true)
            }
          >
            {/* {typeof profile.img === "string" && profile.img !== "" && (
              <ProfileImg src={profile.img} alt="profile" />
            )}
            {typeof profile.img === "object" && (
              <ProfileImg
                src={URL.createObjectURL(profile.img)}
                alt="profile"
              />
            )} */}
            <ProfileNavBar>{profile.name}</ProfileNavBar>
            <ProfileHoverBox $isActive={openProfileBox === true}>
              <ProfileHoverUnit
                onClick={() => router.push(`/profile/${profile.uid}`)}
              >
                個人頁面
              </ProfileHoverUnit>
              <ProfileHoverUnit onClick={() => router.push("/profile")}>
                會員設定
              </ProfileHoverUnit>
              <ProfileHoverUnit onClick={() => signOutProfile()}>
                登出
              </ProfileHoverUnit>
            </ProfileHoverBox>
          </ProfileNavBarContainer>
        ) : (
          <LoginRegisterBtnWrapper>
            <LoginRegisterBtn
              onClick={() => {
                dispatch(targetRegisterOrLogin("register"));
                router.push("/profile");
              }}
            >
              註冊
            </LoginRegisterBtn>
            <LoginRegisterBtn
              onClick={() => {
                dispatch(targetRegisterOrLogin("login"));
                router.push("/profile");
              }}
            >
              登入
            </LoginRegisterBtn>
          </LoginRegisterBtnWrapper>
        )}
      </Wrapper>
      <SidebarContainer $isActive={clickBurgerMenu === true}>
        {navbars.map((navbar, index) => (
          <NavBar
            onClick={() => {
              setClickBurgerMenu(false);
              if (navbar.needToLogin && !profile.isLogged) {
                gotoProfilePage();
              } else {
                router.push(navbar.targetLink);
              }
            }}
            key={index}
          >
            {navbar.name}
          </NavBar>
        ))}
        {profile.isShelter && (
          <NavBar
            onClick={() => {
              setClickBurgerMenu(false);
              router.push("/shelter");
            }}
          >
            所有視訊申請
          </NavBar>
        )}
      </SidebarContainer>
    </>
  );
};

export default Header;
