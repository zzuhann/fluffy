import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { Btn } from "../ProfileSetting/UserInfos";
import cover from "./img/indexcover.jpg";
import pairingcover from "./img/pairingcover.jpg";
import diarycover from "./img/diarycover.jpg";
import articlecover from "./img/articlecover.jpg";
import cliniccover from "./img/cliniccover.jpg";
import {
  PopImg,
  PopUpMessage,
  PopUpNote,
  PopUpText,
  BlackMask,
} from "../../component/Header";
import catHand from "./img/cat_hand_white.png";

const PopupTopMessage = styled(PopUpMessage)<{ $Top: number }>`
  top: ${(props) => props.$Top + 300}px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  background-color: #fafafa;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const CoverContainer = styled.div`
  display: flex;
  position: relative;
  @media (max-width: 892px) {
    height: 100vh;
    margin-bottom: 10px;
  }
`;
const CoverImg = styled.img`
  flex: 1;
  width: 65%;
  height: 100vh;
  object-fit: cover;
  @media (max-width: 1400px) {
    width: 50%;
  }
  @media (max-width: 974px) {
    width: 40%;
    object-position: 70%;
  }
  @media (max-width: 892px) {
    width: 100%;
    position: absolute;
  }
`;
const CoverTextContainer = styled.div`
  flex: 1;
  flex-shrink: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 50px;
  justify-content: center;
  position: relative;
  @media (max-width: 892px) {
    position: absolute;
    z-index: 10;
    top: 20%;
    width: 70%;
  }
  @media (max-width: 704px) {
    width: 60%;
  }
  @media (max-width: 530px) {
    width: 65%;
    top: 30%;
  }
  @media (max-width: 489px) {
    top: 35%;
    width: 80%;
  }
  @media (max-width: 413px) {
    left: -20px;
  }
`;
const CoverTitle = styled.h1`
  font-size: 32px;
  letter-spacing: 2px;
  line-height: 50px;
  @media (max-width: 704px) {
    font-size: 28px;
  }
  @media (max-width: 585px) {
    line-height: 40px;
    font-weight: bold;
  }
  @media (max-width: 489px) {
    line-height: 40px;
    font-size: 22px;
  }
`;
const CoverText = styled.div`
  margin-top: 20px;
  line-height: 30px;
  letter-spacing: 1.5px;
  position: relative;
  @media (max-width: 489px) {
    display: none;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  @media (max-width: 892px) {
    flex-direction: column;
    &:nth-child(odd) {
      flex-direction: column-reverse;
    }
    margin-bottom: 60px;
  }
`;

const SectionFirstTextContainer = styled.div`
  flex: 1;
  flex-shrink: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 50px;
  justify-content: center;
  position: relative;
  @media (max-width: 892px) {
    width: 100%;
    align-items: center;
  }
`;

const SectionTitle = styled.div`
  font-size: 32px;
  letter-spacing: 2px;
  line-height: 50px;
  @media (max-width: 892px) {
    text-align: center;
  }
  @media (max-width: 461px) {
    font-weight: bold;
    font-size: 22px;
    line-height: 30px;
  }
`;
const SectionText = styled.h2`
  margin-top: 20px;
  line-height: 30px;
  letter-spacing: 1.5px;
  position: relative;
  @media (max-width: 892px) {
    text-align: center;
  }
`;
const SectionFirstImg = styled.img`
  flex: 1;
  width: 65%;
  height: 100vh;
  object-fit: cover;
  @media (max-width: 1400px) {
    width: 50%;
  }
  @media (max-width: 974px) {
    width: 40%;
  }
  @media (max-width: 892px) {
    width: 100%;
  }
`;

const SectionLinkBtn = styled(Btn)`
  bottom: -65px;
  font-size: 16px;
  padding: 5px 15px;
  @media (max-width: 892px) {
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
  }
`;

const Home = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [openPopupBox, setOpenPopupBox] = useState(false);
  const [navigateToProfileTime, setNavigateToProfileTime] = useState(3);
  const [pageHigh, setPageHigh] = useState<number>(0);
  const [scroll, setScroll] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("click", togglePageHeight);
    return () => window.removeEventListener("scroll", togglePageHeight);
  }, []);
  useEffect(() => {
    if (!openPopupBox) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [openPopupBox]);

  function handleScroll() {
    let scrollTop = document.documentElement.scrollTop;
    setScroll(scrollTop);
  }

  function togglePageHeight() {
    let pageHeight = document.documentElement.offsetHeight;
    setPageHigh(pageHeight);
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
    <Wrapper>
      {openPopupBox && (
        <>
          <PopupTopMessage $Top={scroll}>
            <PopImg src={catHand} />
            <PopUpText>進入配對專區需先登入/註冊</PopUpText>
            <PopUpNote>
              {navigateToProfileTime} 秒後自動跳轉至登入頁面 ...
            </PopUpNote>
          </PopupTopMessage>
          <BlackMask $isActive={openPopupBox === true} />
        </>
      )}
      <CoverContainer>
        <CoverTextContainer>
          <CoverTitle>
            90% 的煩惱
            <br />
            養寵物就會好。
          </CoverTitle>
          <CoverText>
            即使生活僵硬粗糙地讓人受傷，
            <br />
            但有寵物相伴的日子，會讓我們的心靈逐漸痊癒。
          </CoverText>
        </CoverTextContainer>
        <CoverImg src={cover} />
      </CoverContainer>
      <SectionContainer>
        <SectionFirstImg src={pairingcover} />
        <SectionFirstTextContainer>
          <SectionTitle>我們在 此時此刻相遇</SectionTitle>
          <SectionText>
            透過配對，
            <br />
            找到你命中注定的寵物、成為彼此的家人。
            <SectionLinkBtn
              onClick={() => {
                if (!profile.isLogged) {
                  gotoProfilePage();
                } else {
                  navigate("/dating");
                }
              }}
            >
              前往配對專區
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
      </SectionContainer>
      <SectionContainer>
        <SectionFirstTextContainer>
          <SectionTitle>用日記 記錄我們的日常</SectionTitle>
          <SectionText>
            他的世界很小，有你就剛剛好
            <br />
            透過這個小小的空間，把你們的世界都濃縮在這裡
            <SectionLinkBtn
              onClick={() => {
                navigate("/petdiary");
              }}
            >
              前往寵物日記專區
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
        <SectionFirstImg src={diarycover} />
      </SectionContainer>
      <SectionContainer>
        <SectionFirstImg src={articlecover} />
        <SectionFirstTextContainer>
          <SectionTitle>
            想要成為一個
            <br />
            可以保護你的人
          </SectionTitle>
          <SectionText>
            要怎麼做才是為他好呢？
            <br />
            這裡有一群跟你一樣，想讓寵物過得更好的人
            <br />
            透過文章，獲得更多關於寵物的知識
            <SectionLinkBtn
              onClick={() => {
                navigate("/articles");
              }}
            >
              前往寵物文章補給
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
      </SectionContainer>
      <SectionContainer>
        <SectionFirstTextContainer>
          <SectionTitle>24 小時動物急診</SectionTitle>
          <SectionText>
            彙整全台 24 小時開放的動物醫院
            <br />
            保護這些小小的生命，是我們的使命
            <SectionLinkBtn
              onClick={() => {
                navigate("/clinic");
              }}
            >
              24 小時動物醫院專區
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
        <SectionFirstImg src={cliniccover} />
      </SectionContainer>
    </Wrapper>
  );
};

export default Home;
