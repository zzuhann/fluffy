import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import setting from "./setting.png";
import styled from "styled-components";
import { setAllCardInfrontOfUser } from "../../functions/datingReducerFunction";
import { Card, Dating, petCardInfo } from "../../reducers/dating";
import api from "../../utils/api";
import { db } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const SettingPreference = styled.img`
  position: absolute;
  width: 50px;
  right: 20px;
  top: 100px;
  cursor: pointer;
`;

const SettingSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 20px;
  top: 150px;
  width: 60px;
`;

const SettingOption = styled.div`
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const Cards = styled.div`
  position: relative;
  width: 500px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

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

const Pairing: React.FC = () => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const dispatch = useDispatch();
  const [preference, setPreference] = useState({ kind: "all", location: "0" });

  const area = [
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

  useEffect(() => {
    api.getAnimalAPI().then((res) => pushCardsinAllCards(res.Data));
  }, []);

  useEffect(() => {
    choosePreference();
  }, [preference]);

  useEffect(() => {}, [dating]);

  function pushCardsinAllCards(info: petCardInfo[]) {
    const cards: Card[] = [];
    for (let i = 0; i < 20; i++) {
      if (
        info[i]?.hasOwnProperty("animal_id") &&
        info[i].animal_id &&
        info[i]?.hasOwnProperty("album_file") &&
        info[i].album_file
      ) {
        cards.push({
          id: info[i].animal_id,
          area: info[i].animal_area_pkid,
          shelterName: info[i].animal_place,
          shelterAddress: info[i].shelter_address,
          shelterTel: info[i].shelter_tel,
          kind: info[i].animal_kind,
          sex: info[i].animal_sex,
          color: info[i].animal_colour,
          sterilization: info[i].animal_sterilization,
          foundPlace: info[i].animal_foundplace,
          image: info[i].album_file,
        });
        dispatch(setAllCardInfrontOfUser(cards));
      }
    }
  }

  function choosePreference() {
    if (preference.kind !== "all" && preference.location !== "0") {
      api
        .getAnimapAPIWithAreaAndKind(preference.location, preference.kind)
        .then((res) => {
          pushCardsinAllCards(res.Data);
        });
    } else if (preference.kind !== "all") {
      api.getAnimapAPIWithKind(preference.kind).then((res) => {
        pushCardsinAllCards(res.Data);
      });
    } else if (preference.location !== "0") {
      api.getAnimapAPIWithArea(preference.location).then((res) => {
        pushCardsinAllCards(res.Data);
      });
    }
  }

  return (
    <>
      <SettingPreference src={setting} alt="" />
      <SettingSelectContainer>
        <SettingOption
          onClick={() => {
            setPreference({ ...preference, kind: "%E7%8B%97" });
          }}
        >
          狗
        </SettingOption>
        <SettingOption
          onClick={() => {
            setPreference({ ...preference, kind: "%E8%B2%93" });
          }}
        >
          貓
        </SettingOption>
      </SettingSelectContainer>
      <SettingSelectContainer style={{ top: "200px" }}>
        {area.map((loc, index) => (
          <SettingOption
            id={`${index + 2}`}
            key={index}
            onClick={(e) => {
              setPreference({
                ...preference,
                location: (e.target as HTMLElement).id,
              });
            }}
          >
            {loc}
          </SettingOption>
        ))}
      </SettingSelectContainer>
      <Cards>
        <PetCardDetail petInfo={dating.allCards} />
      </Cards>
    </>
  );
};
export default Pairing;
