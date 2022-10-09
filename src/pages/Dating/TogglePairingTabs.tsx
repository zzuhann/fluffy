import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

const TogglePairingTab = styled.div<{ $isActive: boolean }>`
  position: fixed;
  width: 200px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  bottom: 75px;
  left: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.3s;
  height: ${(props) => (props.$isActive ? "auto" : "0")};
`;

const PairingTabContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  position: relative;
  align-items: center;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 18px;
  transition: 0.3s;
  background-color: ${(props) => (props.$isActive ? "#FFE5E5" : "#fff")};
  opacity: ${(props) => (props.$isActive ? "1" : "0.9")};
  &:hover {
    background-color: #ffe5e5;
    opacity: 1;
  }
  @media (max-width: 688px) {
    padding: 5px 15px;
  }
  @media (max-width: 574px) {
    padding: 5px;
  }
`;

const PairingTab = styled.div`
  letter-spacing: 1.5px;
  margin-left: 15px;
  position: relative;
  padding: 10px;
  @media (max-width: 688px) {
    letter-spacing: 1px;
    margin-left: 10px;
  }
`;

const AlertMatchQty = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  background-color: #db5452;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  letter-spacing: 1px;
`;

export type TogglePairingTabsProps = {
  tab: string;
  setTab: (value: string) => void;
  getListsData: () => void;
  setConsiderDetail: (value: Boolean) => void;
  getUpcomingListData: () => void;
  matchSuccessQty: number;
  setMatchSuccessQty: Dispatch<SetStateAction<number>>;
  setOpenDatingFeatureMenu: Dispatch<SetStateAction<boolean>>;
  openDatingFeatureMenu: boolean;
  datingQty: number;
  setDatingQty: Dispatch<SetStateAction<number>>;
};

const TogglePairingTabs: React.FC<TogglePairingTabsProps> = (props) => {
  return (
    <TogglePairingTab
      onMouseLeave={() => props.setOpenDatingFeatureMenu(false)}
      $isActive={props.openDatingFeatureMenu === true}
    >
      <PairingTabContainer
        onClick={() => props.setTab("pairing")}
        $isActive={props.tab === "pairing"}
      >
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
        {props.matchSuccessQty > 0 ? (
          <AlertMatchQty>+{props.matchSuccessQty}</AlertMatchQty>
        ) : (
          ""
        )}
        <PairingTab>考慮領養清單</PairingTab>
      </PairingTabContainer>
      <PairingTabContainer
        onClick={() => {
          props.setTab("upcomingDate");
          props.getUpcomingListData();
          props.setDatingQty(0);
        }}
        $isActive={props.tab === "upcomingDate"}
      >
        {props.datingQty > 0 ? (
          <AlertMatchQty>+{props.datingQty}</AlertMatchQty>
        ) : (
          ""
        )}
        <PairingTab>即將到來的約會</PairingTab>
      </PairingTabContainer>
    </TogglePairingTab>
  );
};

export default TogglePairingTabs;
