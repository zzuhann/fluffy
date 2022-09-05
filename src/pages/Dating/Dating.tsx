import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import setting from "./setting.png";
import styled from "styled-components";
import {
  setAllCardInfrontOfUser,
  setConsiderList,
  setUpcomingDateList,
} from "../../functions/datingReducerFunction";
import { Card, Dating, petCardInfo, InviteDating } from "../../reducers/dating";
import api from "../../utils/api";
import { db } from "../../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import PetCardDetail from "./DatingCard";
import { area, shelterInfo } from "./ConstantInfo";
import ConsiderPetDetail from "./ConsiderPetDetail";
import UpcomingList from "./UpcomingList";

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

const RequestMoreCardsBtn = styled.div`
  text-align: center;
  position: relative;
  left: 50%;
  top: 200px;
  width: 200px;
  transform: translate(-50%);
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const TogglePairingTabs = styled.div`
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

const ConsiderList = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  width: 750px;
  right: 80px;
  top: 120px;
`;

const ConsiderPetCard = styled.div`
  position: relative;
  width: 250px;
  flex-shrink: 0;
`;

const ConsiderImg = styled.img`
  width: 250px;
  height: 250px;
  object-fit: cover;
  object-position: center;
`;

const ConsiderTitle = styled.div``;

const NotConsiderBtn = styled.div`
  position: absolute;
  right: 5px;
  bottom: 0;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const UpcomingListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  left: 30%;
  top: 50%;
  position: relative;
`;

const Pairing: React.FC = () => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const dispatch = useDispatch();
  const [preference, setPreference] = useState({ kind: "all", location: "0" });
  const [considerDetail, setConsiderDetail] = useState<Boolean>(false);

  const [nowChosenPetIndex, setNowChosenPetIndex] = useState<number>(-1);
  const [tab, setTab] = useState<string>("pairing");
  const chosenIdRef = useRef<number[]>([]);

  useEffect(() => {
    checkChosenAndAppendNewPet(50);
  }, [preference]);

  async function checkChosenAndAppendNewPet(quantity: number) {
    await getListsData();
    await choosePreference(quantity);
  }

  async function getListsData() {
    let userChosenId: number[] = [];
    let consider: Card[] = [];
    const q = collection(
      db,
      "memberProfiles",
      "FUQqyfQNAeMUvFyZgLlATEGTg6V2",
      "considerLists"
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      userChosenId.push(info.data().id);
      consider.push(info.data() as Card);
    });
    dispatch(setConsiderList(consider));

    const p = collection(
      db,
      "memberProfiles",
      "FUQqyfQNAeMUvFyZgLlATEGTg6V2",
      "notConsiderLists"
    );
    const querySecond = await getDocs(p);
    querySecond.forEach((info) => {
      userChosenId.push(info.data().id);
    });
    chosenIdRef.current = userChosenId;
  }

  function pushCardsinAllCards(info: petCardInfo[], totalCards: number) {
    let cards: Card[] = [];
    let repeatId: number[] = [];
    for (let i = 0; i < totalCards; i++) {
      if (
        info[i].hasOwnProperty("animal_id") &&
        info[i].animal_id &&
        info[i].hasOwnProperty("album_file") &&
        info[i].album_file
      ) {
        for (let j = 0; j < chosenIdRef.current.length; j++) {
          if (chosenIdRef.current[j] === info[i].animal_id) {
            repeatId.push(chosenIdRef.current[j]);
          }
        }
        if (repeatId.includes(info[i].animal_id)) {
          continue;
        }
        cards.push({
          id: info[i].animal_id,
          area: info[i].animal_area_pkid,
          shelterName: info[i].animal_place,
          shleterPkid: info[i].animal_shelter_pkid,
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

  async function choosePreference(quantity: number) {
    if (preference.kind === "all" && preference.location === "0") {
      api.getAnimalAPI().then((res) => pushCardsinAllCards(res.Data, quantity));
    }
    if (preference.kind !== "all" && preference.location !== "0") {
      api
        .getAnimapAPIWithAreaAndKind(preference.location, preference.kind)
        .then((res) => {
          pushCardsinAllCards(res.Data, quantity);
        });
    } else if (preference.kind !== "all") {
      api.getAnimapAPIWithKind(preference.kind).then((res) => {
        pushCardsinAllCards(res.Data, quantity);
      });
    } else if (preference.location !== "0") {
      api.getAnimapAPIWithArea(preference.location).then((res) => {
        pushCardsinAllCards(res.Data, quantity);
      });
    }
  }

  async function getUpcomingListData() {
    let upcomingDate: InviteDating[] = [];
    const q = collection(
      db,
      "memberProfiles",
      "FUQqyfQNAeMUvFyZgLlATEGTg6V2",
      "upcomingDates"
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      upcomingDate.push(info.data() as InviteDating);
    });
    dispatch(setUpcomingDateList(upcomingDate));
  }

  return (
    <>
      <TogglePairingTabs>
        <PairingTab onClick={() => setTab("pairing")}>配對系統</PairingTab>
        <PairingTab
          onClick={() => {
            setTab("considerAdopt");
            getListsData();
            setConsiderDetail(false);
          }}
        >
          考慮領養清單
        </PairingTab>
        <PairingTab
          onClick={() => {
            setTab("upcomingDate");
            getUpcomingListData();
          }}
        >
          即將到來的約會
        </PairingTab>
      </TogglePairingTabs>
      {tab === "pairing" ? (
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
          {dating.allCards.length <= 0 ? (
            <>
              <RequestMoreCardsBtn
                onClick={() => checkChosenAndAppendNewPet(200)}
              >
                配對更多狗狗貓貓
              </RequestMoreCardsBtn>
              <RequestMoreCardsBtn
                onClick={() => {
                  setTab("considerAdopt");
                  getListsData();
                  setConsiderDetail(false);
                }}
              >
                看目前考慮領養清單
              </RequestMoreCardsBtn>
            </>
          ) : (
            <Cards>
              <PetCardDetail petInfo={dating.allCards} />
            </Cards>
          )}
        </>
      ) : (
        ""
      )}
      {tab === "considerAdopt" && !considerDetail ? (
        <ConsiderList>
          {dating.considerList.map((pet, index) => (
            <ConsiderPetCard
              key={index}
              onClick={() => {
                setNowChosenPetIndex(index);
                setConsiderDetail(true);
              }}
            >
              <ConsiderImg src={pet.image} />
              <ConsiderTitle>
                {area[Number(pet.area) - 2]}
                {pet.color}
                {pet.kind}
              </ConsiderTitle>
              <NotConsiderBtn
                onClick={async () => {
                  const q = query(
                    collection(
                      db,
                      "memberProfiles",
                      "FUQqyfQNAeMUvFyZgLlATEGTg6V2",
                      "considerLists"
                    ),
                    where("id", "==", pet.id)
                  );

                  const querySnapshot = await getDocs(q);
                  querySnapshot.forEach(async (info) => {
                    await deleteDoc(
                      doc(
                        db,
                        "memberProfiles",
                        "FUQqyfQNAeMUvFyZgLlATEGTg6V2",
                        "considerLists",
                        info.id
                      )
                    );
                    getListsData();

                    await addDoc(
                      collection(
                        db,
                        "/memberProfiles/FUQqyfQNAeMUvFyZgLlATEGTg6V2/notConsiderLists"
                      ),
                      { id: pet.id }
                    );
                  });
                }}
              >
                不考慮領養
              </NotConsiderBtn>
            </ConsiderPetCard>
          ))}
        </ConsiderList>
      ) : (
        ""
      )}
      {tab === "considerAdopt" && considerDetail ? (
        <ConsiderPetDetail
          nowChosenPetIndex={nowChosenPetIndex}
          setConsiderDetail={setConsiderDetail}
        />
      ) : (
        ""
      )}
      {tab === "upcomingDate" ? (
        <UpcomingListContainer>
          <UpcomingList getUpcomingListData={getUpcomingListData} />
        </UpcomingListContainer>
      ) : (
        ""
      )}
    </>
  );
};
export default Pairing;
