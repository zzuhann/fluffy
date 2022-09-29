import React, { useRef, useState } from "react";
import logo from "./fluffylogo.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  setNotification,
} from "../functions/profileReducerFunction";
import defaultProfile from "./defaultprofile.png";
import catHand from "./cat_hand_white.png";

import {
  checkIfLogged,
  targetRegisterOrLogin,
  setProfileUid,
  setOwnPets,
} from "../functions/profileReducerFunction";
import { OwnArticle, OwnPet, PetDiaryType, Profile } from "../reducers/profile";
import burgerMenu from "./bar.png";

const Wrapper = styled.div<{ $isActive: boolean }>`
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

const Logo = styled(Link)`
  @media (max-width: 1025px) {
    margin-right: auto;
  }
`;
const LogoImg = styled.img`
  width: 150px;
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
  $Height: number;
}>`
  opacity: ${(props) => (props.$isActive ? "1" : "0")};
  overflow-y: hidden;
  transition: 0.3s;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  left: 0;
  top: 0;
  width: 100%;
  height: ${(props) => props.$Height}px;
  z-index: ${(props) => (props.$isActive ? "2500" : "0")};
`;

const NavBarContainer = styled.ul`
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: 50px;
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
  /* margin-right: 20px; */
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
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  position: absolute;
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

export const PopImg = styled.img`
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
  const navigate = useNavigate();
  const nowLocation = useLocation();
  const [scroll, setScroll] = useState<number>(0);
  const [pageHigh, setPageHigh] = useState<number>(0);
  const [clickBurgerMenu, setClickBurgerMenu] = useState<boolean>(false);
  const [openProfileBox, setOpenProfileBox] = useState<boolean>(false);
  const [openPopupBox, setOpenPopupBox] = useState(false);
  const [navigateToProfileTime, setNavigateToProfileTime] = useState(3);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.addEventListener("click", togglePageHeight);
    return () => window.removeEventListener("scroll", togglePageHeight);
  }, []);

  function togglePageHeight() {
    let pageHeight = document.documentElement.offsetHeight;
    setPageHigh(pageHeight);
  }

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
        dispatch(targetRegisterOrLogin("login"));
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

  function signOutProfile() {
    signOut(auth)
      .then(() => {
        dispatch(checkIfLogged(false));
        dispatch(clearProfileInfo());
        dispatch(setNotification("登出成功"));
        setTimeout(() => {
          dispatch(setNotification(""));
        }, 3000);
        if (nowLocation.pathname === "/dating") {
          navigate("/");
        }
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
          navigate("/profile");
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
        $Height={clickBurgerMenu ? pageHigh : 0}
        onClick={() =>
          clickBurgerMenu ? setClickBurgerMenu(false) : setClickBurgerMenu(true)
        }
      />
      <Wrapper $isActive={scroll > 0}>
        <BurgerMenu
          src={burgerMenu}
          onClick={() =>
            clickBurgerMenu
              ? setClickBurgerMenu(false)
              : setClickBurgerMenu(true)
          }
        />
        <Logo to="/">
          <LogoImg src={logo} alt="" />
        </Logo>
        <NavBarContainer>
          <NavBar
            onClick={() => {
              if (!profile.isLogged) {
                gotoProfilePage();
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
        {openPopupBox && (
          <>
            <PopUpMessage>
              <PopImg src={catHand} />
              <PopUpText>進入配對專區需先登入/註冊</PopUpText>
              <PopUpNote>
                {navigateToProfileTime} 秒後自動跳轉至登入頁面 ...
              </PopUpNote>
            </PopUpMessage>
            <BlackMask
              $isActive={openPopupBox === true}
              $Height={openPopupBox ? pageHigh : 0}
            />
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
            <ProfileImg src={profile.img as string} />
            <ProfileNavBar>{profile.name}</ProfileNavBar>
            <ProfileHoverBox $isActive={openProfileBox === true}>
              <ProfileHoverUnit
                onClick={() => navigate(`/profile/${profile.uid}`)}
              >
                個人頁面
              </ProfileHoverUnit>
              <ProfileHoverUnit onClick={() => navigate("/profile")}>
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
      <SidebarContainer $isActive={clickBurgerMenu === true}>
        <NavBar
          onClick={() => {
            setClickBurgerMenu(false);
            if (!profile.isLogged) {
              gotoProfilePage();
            } else {
              navigate("/dating");
            }
          }}
        >
          配對專區
        </NavBar>
        <NavBar
          onClick={() => {
            setClickBurgerMenu(false);
            navigate("/petdiary");
          }}
        >
          寵物日記
        </NavBar>
        <NavBar
          onClick={() => {
            setClickBurgerMenu(false);
            navigate("/articles");
          }}
        >
          寵物文章補給
        </NavBar>
        <NavBar
          onClick={() => {
            setClickBurgerMenu(false);
            navigate("/clinic");
          }}
        >
          24 小時動物醫院
        </NavBar>
      </SidebarContainer>
    </>
  );
};

export default Header;
