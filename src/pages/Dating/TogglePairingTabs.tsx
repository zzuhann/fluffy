import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import pairing from "./img/disguise.png";
import consideradopt from "./img/cat.png";
import upcomingdate from "./img/house.png";

const TogglePairingTab = styled.div`
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  position: fixed;
  top: 72px;
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

const AlertMatchQty = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  position: absolute;
  background-color: #ff5106;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  right: 10px;
  letter-spacing: 1px;
`;

type Props = {
  tab: string;
  setTab: (value: string) => void;
  getListsData: () => void;
  setConsiderDetail: (value: Boolean) => void;
  getUpcomingListData: () => void;
  matchSuccessQty: number;
  setMatchSuccessQty: Dispatch<SetStateAction<number>>;
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
          props.setMatchSuccessQty(0);
        }}
        $isActive={props.tab === "considerAdopt"}
      >
        <PairingTabIcon src={consideradopt} />
        <PairingTab>考慮領養清單</PairingTab>
        {props.matchSuccessQty > 0 ? (
          <AlertMatchQty>+{props.matchSuccessQty}</AlertMatchQty>
        ) : (
          ""
        )}
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
