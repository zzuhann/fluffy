import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import Meeting from "../../component/Meeting";
import ShelterMeeting from "../../component/ShelterMeeting";
import UpcomingList from "../Dating/UpcomingList";
import {
  NowNoInfoInHere,
  NowNoInfoText,
  NowNoInfoImg,
} from "../ProfileSetting/OwnPetInfo";
import { Title } from "../ProfileSetting/UserInfos";
import noUpcomingDate from "./img/kataomoi_woman-01.png";

const Wrap = styled.div`
  width: 100%;
  height: auto;
  min-height: 100vh;
  background-color: #fafafa;
  position: relative;
  padding-top: 120px;
  padding-bottom: 50px;
  overflow: hidden;
`;

const UpcomingListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1120px;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  padding: 20px;
  padding-top: 70px;
  min-height: 340px;
`;

const UpcomingTitle = styled(Title)`
  position: absolute;
  top: 0px;
`;

export const NowNoInfoInHereConsider = styled(NowNoInfoInHere)`
  flex-direction: column;
  top: 100px;
`;

export const NowNoInfoTextConsider = styled(NowNoInfoText)`
  line-height: 30px;
  text-align: center;
`;

const BlackMask = styled.div`
  opacity: 0.5;
  overflow-y: hidden;
  transition: 0.3s;
  position: fixed;
  background-color: black;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 2500;
`;

const Shelter = () => {
  useEffect(() => {}, []);
  return (
    <Wrap>
      <BlackMask />
      <ShelterMeeting />
      {/* <UpcomingListContainer>
              <UpcomingTitle>即將到來的約會</UpcomingTitle>
              {dating.upcomingDateList.length === 0 ? (
                <NowNoInfoInHereConsider>
                  <NowNoInfoImg src={noUpcomingDate} />
                  <NowNoInfoTextConsider>
                    目前沒有即將到來的約會，
                    <br />
                    到考慮領養清單邀請心儀的寵物來場約會吧！
                  </NowNoInfoTextConsider>
                </NowNoInfoInHereConsider>
              ) : (
                <>
                  <UpcomingList getUpcomingListData={getUpcomingListData} />
                </>
              )}
            </UpcomingListContainer> */}
    </Wrap>
  );
};

export default Shelter;
