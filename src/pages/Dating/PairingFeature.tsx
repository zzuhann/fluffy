import React, { Dispatch, SetStateAction, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { setAllCardInfrontOfUser } from "../../functions/datingReducerFunction";
import { Card, Dating } from "../../reducers/dating";
import { db } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { area } from "../../utils/ConstantInfo";
import { Profile } from "../../reducers/profile";
import consider from "./img/consider.png";
import notconsider from "./img/close.png";

const ChooseBtnAnimation = keyframes`
  0% {bottom: 200px}
  100% {bottom: 250px}
`;

const ChooseMask = styled.div`
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
`;

const AnimationChooseBtn = styled.img`
  z-index: 1001;
  font-size: 50px;
  position: absolute;
  bottom: 200px;
  background-color: #fff;
  border-radius: 30px;
  width: 60px;
  height: 60px;
  padding: 15px;
  animation-name: ${ChooseBtnAnimation};
  animation-duration: 0.35s;
  scale: 1.5;
`;

const PetCard = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;

  padding: 7.5px;
  &:last-child {
    box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.2);
  }
  @media (max-width: 574px) {
    width: 100%;
  }
`;

const PetImg = styled.img`
  width: calc(100% - 15px);
  height: calc(100% - 15px);
  object-fit: cover;
  position: absolute;
  border-radius: 10px;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ImgMask = styled.div`
  width: calc(100% - 15px);
  height: calc(100% - 15px);
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 69%,
    rgba(0, 0, 0, 0.8) 100%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
`;

const PetTextInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  color: #fff;
  bottom: 20px;
  font-size: 18px;
  letter-spacing: 1.5px;
  @media (max-width: 385px) {
    font-size: 16px;
  }
`;
const PetText = styled.div`
  margin-bottom: 8px;
`;

const ChooseIcon = styled.img`
  font-size: 50px;
  position: absolute;
  bottom: 30px;
  cursor: pointer;
  background-color: #fff;
  border-radius: 30px;
  width: 60px;
  height: 60px;
  padding: 15px;
  transition: 0.2s;
  &:hover {
    bottom: 34px;
    box-shadow: 2px 2px 2px 2px rgba(255, 255, 255, 0.2);
  }
  @media (max-width: 385px) {
    width: 50px;
    height: 50px;
  }
`;

const Cross = styled(ChooseIcon)`
  left: 40px;
  @media (max-width: 385px) {
    left: 30px;
  }
`;

const Circle = styled(ChooseIcon)`
  right: 40px;
  padding: 10px;
  @media (max-width: 385px) {
    right: 30px;
  }
`;

interface PetInfos {
  petInfo: Card[];
  setMatchSuccessQty: Dispatch<SetStateAction<number>>;
}

const PetCardDetail: React.FC<PetInfos> = (props) => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [openAnimation, setOpenAnimation] = useState<boolean>(false);
  const [pressBtn, setPressBtn] = useState<string>("");
  const [clickIndex, setClickIndex] = useState<number>(0);

  return (
    <>
      {props.petInfo.map((info, index) => (
        <PetCard key={index}>
          {openAnimation &&
          pressBtn === "notconsider" &&
          clickIndex === index ? (
            <>
              <ChooseMask></ChooseMask>
              <AnimationChooseBtn src={notconsider} />
            </>
          ) : openAnimation &&
            pressBtn === "consider" &&
            clickIndex === index ? (
            <>
              <ChooseMask></ChooseMask>
              <AnimationChooseBtn src={consider} />
            </>
          ) : (
            ""
          )}

          <PetImg src={info.image} alt="" />
          <ImgMask></ImgMask>
          <PetTextInfoContainer>
            <PetText>{info.id}</PetText>
            <PetText>{area[info.area - 2]}</PetText>
            <PetText>
              {info.color}
              {info.kind} ({info.sex === "M" ? "♂" : "♀"})
            </PetText>
            <PetText>
              {info.sterilization === "F" ? "尚未結紮" : "已結紮"}
            </PetText>
          </PetTextInfoContainer>
          <Cross
            src={notconsider}
            onClick={async () => {
              await addDoc(
                collection(
                  db,
                  `/memberProfiles/${profile.uid}/notConsiderLists`
                ),
                { id: info.id }
              );
              let cardsInFrontOfUser = dating.allCards;
              setOpenAnimation(true);
              setClickIndex(index);
              setPressBtn("notconsider");
              setTimeout(() => {
                setOpenAnimation(false);
                cardsInFrontOfUser.pop();
                dispatch(setAllCardInfrontOfUser(cardsInFrontOfUser));
              }, 350);
            }}
          />
          <Circle
            src={consider}
            onClick={async () => {
              await addDoc(
                collection(db, `/memberProfiles/${profile.uid}/considerLists`),
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
              setOpenAnimation(true);
              props.setMatchSuccessQty((prev) => prev + 1);
              setClickIndex(index);
              setPressBtn("consider");
              setTimeout(() => {
                setOpenAnimation(false);
                cardsInFrontOfUser.pop();
                dispatch(setAllCardInfrontOfUser(cardsInFrontOfUser));
              }, 350);
            }}
          />
        </PetCard>
      ))}
    </>
  );
};

export default PetCardDetail;
