import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { Btn } from "../ProfileSetting/UserInfos";
import cover from "./indexcover.jpg";
import pairingcover from "./pairingcover.jpg";
import diarycover from "./diarycover.jpg";
import articlecover from "./articlecover.jpg";
import cliniccover from "./cliniccover.jpg";

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  background-color: #fafafa;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const SectionContainer = styled.div`
  display: flex;
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
`;

const SectionTitle = styled.div`
  font-size: 32px;
  letter-spacing: 2px;
  line-height: 50px;
`;
const SectionText = styled.div`
  margin-top: 20px;
  line-height: 30px;
  letter-spacing: 1.5px;
  position: relative;
`;
const SectionFirstImg = styled.img`
  flex: 1;
  width: 65%;
  height: 100vh;
  object-fit: cover;
`;

const SectionLinkBtn = styled(Btn)`
  bottom: -65px;
  font-size: 16px;
  padding: 5px 15px;
`;

const Home = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const navigate = useNavigate();
  return (
    <Wrapper>
      <SectionContainer>
        <SectionFirstTextContainer>
          <SectionTitle>
            90% 的煩惱
            <br />
            養寵物就會好。
          </SectionTitle>
          <SectionText>
            即使生活僵硬粗糙地讓人受傷，
            <br />
            但有寵物相伴的日子，會讓我們的心靈逐漸痊癒。
          </SectionText>
        </SectionFirstTextContainer>
        <SectionFirstImg src={cover} />
      </SectionContainer>
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
                  window.alert(
                    "使用此功能需先註冊或登入！點擊確認後前往註冊與登入頁面"
                  );
                  navigate("/profile");
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
