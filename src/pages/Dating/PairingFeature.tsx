import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { setAllCardInfrontOfUser } from "../../functions/datingReducerFunction";
import { Card, Dating } from "../../reducers/dating";
import { db } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { area } from "./constantInfo";
import { Profile } from "../../reducers/profile";
import consider from "./consider.png";
import notconsider from "./close.png";

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
  position: absolute;
  margin: 0 auto;
  top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  height: 600px;
  &:last-child {
    box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.2);
  }
`;

const PetImg = styled.img`
  width: 420px;
  height: 570px;
  object-fit: cover;
  position: absolute;
  border-radius: 10px;
  overflow: hidden;
  top: 15px;
  left: 15px;
`;

const ImgMask = styled.div`
  width: 420px;
  height: 570px;
  top: 15px;
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 69%,
    rgba(0, 0, 0, 0.8) 100%
  );
  top: 15px;
  left: 15px;
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
`;

const Cross = styled(ChooseIcon)`
  left: 40px;
`;

const Circle = styled(ChooseIcon)`
  right: 40px;
  padding: 10px;
`;

interface PetInfos {
  petInfo: Card[];
}
// type preference = {
//   setPreference: (value: { kind: string; location: string }) => void;
//   preference: { kind: string; location: string };
// };
// export const SettingPreference: React.FC<preference> = (props) => {
//   return (
//     <SettingSelectContainer>
//       <SettingTitle>種類</SettingTitle>
//       <SettingOption
//         onClick={() => {
//           props.setPreference({ ...props.preference, kind: "%E7%8B%97" });
//         }}
//       >
//         狗
//       </SettingOption>
//       <SettingOption
//         onClick={() => {
//           props.setPreference({ ...props.preference, kind: "%E8%B2%93" });
//         }}
//       >
//         貓
//       </SettingOption>
//       <SettingTitle>地區</SettingTitle>
//       {area.map((loc, index) => (
//         <SettingOption
//           id={`${index + 2}`}
//           key={index}
//           onClick={(e) => {
//             props.setPreference({
//               ...props.preference,
//               location: (e.target as HTMLElement).id,
//             });
//           }}
//         >
//           {loc}
//         </SettingOption>
//       ))}
//     </SettingSelectContainer>
//   );
// };

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
