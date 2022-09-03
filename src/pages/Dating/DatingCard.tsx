import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { setAllCardInfrontOfUser } from "../../functions/datingReducerFunction";
import { Card, Dating } from "../../reducers/dating";
import { db } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

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

const PetCardDetail: React.FC<PetInfos> = (props) => {
  const area = [
    0,
    1,
    "臺北市",
    "新北市",
    "基隆市",
    "宜蘭縣",
    "桃園市",
    "新竹縣",
    "新竹市",
    "苗栗縣",
    "臺中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "嘉義市",
    "臺南市",
    "高雄市",
    "屏東縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ];
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
          <PetArea>{area[info.area]}</PetArea>
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
