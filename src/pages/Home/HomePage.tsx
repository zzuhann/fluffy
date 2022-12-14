import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { Btn } from "../ProfileSetting/UserInfos";
import cover from "./img/index.webp";
import pairingcover from "./img/pairing.webp";
import diarycover from "./img/diary.webp";
import articlecover from "./img/article.webp";
import cliniccover from "./img/clinic.webp";
import {
  PopImg,
  PopUpMessage,
  PopUpNote,
  PopUpText,
  BlackMask,
} from "../../component/Header";
import catHand from "./img/cat_hand_white.png";

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
  const navigate = useNavigate();
  const fromPage: string = useLocation().state as string;

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

  useEffect(() => {
    if (fromPage === "/dating" && profile.isLogged) {
      navigate(fromPage);
    }
  }, [fromPage, navigate, profile.isLogged]);

  return (
    <Wrapper>
      {openPopupBox && (
        <>
          <PopUpMessage>
            <PopImg src={catHand} />
            <PopUpText>??????????????????????????????/??????</PopUpText>
            <PopUpNote>
              {navigateToProfileTime} ????????????????????????????????? ...
            </PopUpNote>
          </PopUpMessage>
          <BlackMask $isActive={openPopupBox === true} />
        </>
      )}
      <CoverContainer>
        <CoverTextContainer>
          <CoverTitle>
            90% ?????????
            <br />
            ?????????????????????
          </CoverTitle>
          <CoverText>
            ??????????????????????????????????????????
            <br />
            ??????????????????????????????????????????????????????????????????
          </CoverText>
        </CoverTextContainer>
        <CoverImg src={cover} alt="home" />
      </CoverContainer>
      <SectionContainer>
        <SectionFirstImg src={pairingcover} alt="pairing" />
        <SectionFirstTextContainer>
          <SectionTitle>????????? ??????????????????</SectionTitle>
          <SectionText>
            ???????????????
            <br />
            ?????????????????????????????????????????????????????????
            <SectionLinkBtn
              onClick={() => {
                if (!profile.isLogged) {
                  gotoProfilePage();
                } else {
                  navigate("/dating");
                }
              }}
            >
              ??????????????????
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
      </SectionContainer>
      <SectionContainer>
        <SectionFirstTextContainer>
          <SectionTitle>????????? ?????????????????????</SectionTitle>
          <SectionText>
            ???????????????????????????????????????
            <br />
            ??????????????????????????????????????????????????????????????????
            <SectionLinkBtn
              onClick={() => {
                navigate("/petdiary");
              }}
            >
              ????????????????????????
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
        <SectionFirstImg src={diarycover} alt="diary" />
      </SectionContainer>
      <SectionContainer>
        <SectionFirstImg src={articlecover} alt="article" />
        <SectionFirstTextContainer>
          <SectionTitle>
            ??????????????????
            <br />
            ?????????????????????
          </SectionTitle>
          <SectionText>
            ?????????????????????????????????
            <br />
            ????????????????????????????????????????????????????????????
            <br />
            ????????????????????????????????????????????????
            <SectionLinkBtn
              onClick={() => {
                navigate("/articles");
              }}
            >
              ????????????????????????
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
      </SectionContainer>
      <SectionContainer>
        <SectionFirstTextContainer>
          <SectionTitle>24 ??????????????????</SectionTitle>
          <SectionText>
            ???????????? 24 ???????????????????????????
            <br />
            ????????????????????????????????????????????????
            <SectionLinkBtn
              onClick={() => {
                navigate("/clinic");
              }}
            >
              24 ????????????????????????
            </SectionLinkBtn>
          </SectionText>
        </SectionFirstTextContainer>
        <SectionFirstImg src={cliniccover} alt="clinic" />
      </SectionContainer>
    </Wrapper>
  );
};

export default Home;
