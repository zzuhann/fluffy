import React from "react";
import styled from "styled-components";

const TogglePairingTab = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  position: absolute;
  top: 150px;
  left: 10px;
`;

const PairingTab = styled.div`
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

type Props = {
  setTab: (value: string) => void;
  getListsData: () => void;
  setConsiderDetail: (value: Boolean) => void;
  getUpcomingListData: () => void;
};

const TogglePairingTabs: React.FC<Props> = (props) => {
  return (
    <TogglePairingTab>
      <PairingTab onClick={() => props.setTab("pairing")}>配對系統</PairingTab>
      <PairingTab
        onClick={() => {
          props.setTab("considerAdopt");
          props.getListsData();
          props.setConsiderDetail(false);
        }}
      >
        考慮領養清單
      </PairingTab>
      <PairingTab
        onClick={() => {
          props.setTab("upcomingDate");
          props.getUpcomingListData();
        }}
      >
        即將到來的約會
      </PairingTab>
    </TogglePairingTab>
  );
};

export default TogglePairingTabs;
