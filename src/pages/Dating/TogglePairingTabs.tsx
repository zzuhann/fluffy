import React from "react";
import styled from "styled-components";
import pairing from "./disguise.png";
import consideradopt from "./cat.png";
import upcomingdate from "./house.png";

const TogglePairingTab = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  position: fixed;
  /* border: solid 1px black; */
  background-color: #fff;
  min-height: 100vh;
  box-shadow: 1px 9px 5px 2px rgba(0, 0, 0, 0.2);
`;

const PairingTabContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 30px;
  width: 100%;
  cursor: pointer;
  transition: 0.3s;
  background-color: ${(props) => (props.$isActive ? "#b7b0a8" : "#fff")};
  opacity: ${(props) => (props.$isActive ? "1" : "0.7")};
  &:hover {
    background-color: #b7b0a8;
    opacity: 1;
  }
`;

const PairingTabIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const PairingTab = styled.div`
  letter-spacing: 1.5px;
  margin-left: 15px;
`;

type Props = {
  tab: string;
  setTab: (value: string) => void;
  getListsData: () => void;
  setConsiderDetail: (value: Boolean) => void;
  getUpcomingListData: () => void;
};

const TogglePairingTabs: React.FC<Props> = (props) => {
  return (
    <TogglePairingTab>
      <PairingTabContainer
        onClick={() => props.setTab("pairing")}
        $isActive={props.tab === "pairing"}
      >
        <PairingTabIcon src={pairing} />
        <PairingTab>配對系統</PairingTab>
      </PairingTabContainer>
      <PairingTabContainer
        onClick={() => {
          props.setTab("considerAdopt");
          props.getListsData();
          props.setConsiderDetail(false);
        }}
        $isActive={props.tab === "considerAdopt"}
      >
        <PairingTabIcon src={consideradopt} />
        <PairingTab>考慮領養清單</PairingTab>
      </PairingTabContainer>
      <PairingTabContainer
        onClick={() => {
          props.setTab("upcomingDate");
          props.getUpcomingListData();
        }}
        $isActive={props.tab === "upcomingDate"}
      >
        <PairingTabIcon src={upcomingdate} />
        <PairingTab>即將到來的約會</PairingTab>
      </PairingTabContainer>
    </TogglePairingTab>
  );
};

export default TogglePairingTabs;
