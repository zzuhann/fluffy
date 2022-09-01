import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import setting from "./setting.png";
import styled from "styled-components";
import { setAllCardInfrontOfUser } from "../../functions/datingReducerFunction";
import { Card, Dating } from "../../reducers/dating";

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

  return (
    <>
      {props.petInfo.map((info) => (
        <PetCard>
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
        </PetCard>
      ))}
    </>
  );
};

const Pairing: React.FC = () => {
  const dating = useSelector((state: any) => state.DatingReducer);
  const dispatch = useDispatch();
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
    fetch("https://data.coa.gov.tw/api/v1/AnimalRecognition")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const cards: Card[] = [];
        for (let i = 0; i < 20; i++) {
          cards.push({
            id: res.Data[i].animal_id,
            area: res.Data[i].animal_area_pkid,
            shelterName: res.Data[i].animal_place,
            shelterAddress: res.Data[i].shelter_address,
            shelterTel: res.Data[i].shelter_tel,
            kind: res.Data[i].animal_kind,
            sex: res.Data[i].animal_sex,
            color: res.Data[i].animal_colour,
            sterilization: res.Data[i].animal_sterilization,
            foundPlace: res.Data[i].animal_foundplace,
            image: res.Data[i].album_file,
          });
          dispatch(setAllCardInfrontOfUser(cards));
        }
      });
  }, []);
  function choosePreference(target: string) {
    fetch(
      `https://data.coa.gov.tw/api/v1/AnimalRecognition/?animal_kind=${target}`
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const cards: Card[] = [];
        for (let i = 0; i < 20; i++) {
          cards.push({
            id: res.Data[i].animal_id,
            area: res.Data[i].animal_area_pkid,
            shelterName: res.Data[i].animal_place,
            shelterAddress: res.Data[i].shelter_address,
            shelterTel: res.Data[i].shelter_tel,
            kind: res.Data[i].animal_kind,
            sex: res.Data[i].animal_sex,
            color: res.Data[i].animal_colour,
            sterilization: res.Data[i].animal_sterilization,
            foundPlace: res.Data[i].animal_foundplace,
            image: res.Data[i].album_file,
          });
          dispatch(setAllCardInfrontOfUser(cards));
        }
      });
  }

  return (
    <>
      <SettingPreference src={setting} alt="" />
      <SettingSelectContainer>
        <SettingOption
          onClick={() => {
            choosePreference("%E7%8B%97");
          }}
        >
          狗
        </SettingOption>
        <SettingOption
          onClick={() => {
            choosePreference("%E8%B2%93");
          }}
        >
          貓
        </SettingOption>
      </SettingSelectContainer>
      <SettingSelectContainer>
        {area.map((loc) => (
          <SettingOption>{loc}</SettingOption>
        ))}
      </SettingSelectContainer>
      <Cards>
        <PetCardDetail petInfo={dating.allCards} />
      </Cards>
    </>
  );
};
export default Pairing;
