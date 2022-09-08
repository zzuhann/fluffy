import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { setAllCardInfrontOfUser } from "../../functions/datingReducerFunction";
import { Card, Dating } from "../../reducers/dating";
import { db } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { area } from "./constantInfo";

// preference

const SettingSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 20px;
  top: 150px;
  width: 60px;
`;

const SettingTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const SettingOption = styled.div`
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

// card

const PetCard = styled.div`
  width: 100%;
  position: absolute;
  top: 20px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

const PetImg = styled.img`
  width: 300px;
  height: 500px;
  object-fit: cover;
`;
const PetId = styled.div``;
const PetColorKind = styled.div``;
const PetSterilization = styled.div``;
const PetArea = styled.div``;
const PetSex = styled.div``;

const ChooseIcon = styled.div`
  font-size: 50px;
  position: absolute;
  bottom: 15px;
  cursor: pointer;
`;

const Cross = styled(ChooseIcon)`
  left: 40px;
`;

const Circle = styled(ChooseIcon)`
  right: 40px;
`;

interface PetInfos {
  petInfo: Card[];
}
type preference = {
  setPreference: (value: { kind: string; location: string }) => void;
  preference: { kind: string; location: string };
};
export const SettingPreference: React.FC<preference> = (props) => {
  return (
    <SettingSelectContainer>
      <SettingTitle>種類</SettingTitle>
      <SettingOption
        onClick={() => {
          props.setPreference({ ...props.preference, kind: "%E7%8B%97" });
        }}
      >
        狗
      </SettingOption>
      <SettingOption
        onClick={() => {
          props.setPreference({ ...props.preference, kind: "%E8%B2%93" });
        }}
      >
        貓
      </SettingOption>
      <SettingTitle>地區</SettingTitle>
      {area.map((loc, index) => (
        <SettingOption
          id={`${index + 2}`}
          key={index}
          onClick={(e) => {
            props.setPreference({
              ...props.preference,
              location: (e.target as HTMLElement).id,
            });
          }}
        >
          {loc}
        </SettingOption>
      ))}
    </SettingSelectContainer>
  );
};

const PetCardDetail: React.FC<PetInfos> = (props) => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const dispatch = useDispatch();

  return (
    <>
      {props.petInfo.map((info, index) => (
        <PetCard key={index}>
          <PetImg src={info.image} alt="" />
          <PetId>{info.id}</PetId>
          <PetArea>{area[info.area - 2]}</PetArea>
          <PetColorKind>
            {info.color}
            {info.kind}
          </PetColorKind>
          <PetSex>{info.sex === "M" ? "♂" : "♀"}</PetSex>
          <PetSterilization>
            {info.sterilization === "F" ? "尚未結紮" : "已結紮"}
          </PetSterilization>
          <Cross
            onClick={async () => {
              await addDoc(
                collection(
                  db,
                  "/memberProfiles/FUQqyfQNAeMUvFyZgLlATEGTg6V2/notConsiderLists"
                ),
                { id: info.id }
              );
              let cardsInFrontOfUser = dating.allCards;
              cardsInFrontOfUser.pop();
              dispatch(setAllCardInfrontOfUser(cardsInFrontOfUser));
            }}
          >
            X
          </Cross>
          <Circle
            onClick={async () => {
              await addDoc(
                collection(
                  db,
                  "/memberProfiles/FUQqyfQNAeMUvFyZgLlATEGTg6V2/considerLists"
                ),
                {
                  id: info.id,
                  area: info.area,
                  shleterPkid: info.shleterPkid,
                  shelterName: info.shelterName,
                  shelterAddress: info.shelterAddress,
                  shelterTel: info.shelterTel,
                  kind: info.kind,
                  sex: info.sex,
                  color: info.color,
                  sterilization: info.sterilization,
                  foundPlace: info.foundPlace,
                  image: info.image,
                }
              );
              let cardsInFrontOfUser = dating.allCards;
              cardsInFrontOfUser.pop();
              dispatch(setAllCardInfrontOfUser(cardsInFrontOfUser));
            }}
          >
            O
          </Circle>
        </PetCard>
      ))}
    </>
  );
};

export default PetCardDetail;
