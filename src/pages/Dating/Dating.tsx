import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import PetCardDetail from "./PairingFeature";
import { SettingPreference } from "./PairingFeature";
import ConsiderPetDetail from "./ConsiderPet";
import UpcomingList from "./UpcomingList";
import TogglePairingTabs from "./TogglePairingTabs";
import { ConsiderEverySinglePetCard } from "./ConsiderPet";

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

const ConsiderList = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  width: 750px;
  right: 80px;
  top: 120px;
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
        info[i]?.hasOwnProperty("animal_id") &&
        info[i].animal_id &&
        info[i]?.hasOwnProperty("album_file") &&
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

  async function deleteConsiderAndUpdateList(id: number) {
    const q = query(
      collection(
        db,
        "memberProfiles",
        "FUQqyfQNAeMUvFyZgLlATEGTg6V2",
        "considerLists"
      ),
      where("id", "==", id)
    );

    const querySnapshot = await getDocs(q);
    const promises: any[] = [];
    querySnapshot.forEach(async (info) => {
      promises.push(
        deleteDoc(
          doc(
            db,
            "memberProfiles",
            "FUQqyfQNAeMUvFyZgLlATEGTg6V2",
            "considerLists",
            info.id
          )
        )
      );
    });
    await Promise.all(promises);
    getListsData();
    await addDoc(
      collection(
        db,
        "/memberProfiles/FUQqyfQNAeMUvFyZgLlATEGTg6V2/notConsiderLists"
      ),
      { id: id }
    );
  }

  if (!dating.allCards) return null;
  return (
    <>
      <TogglePairingTabs
        setTab={setTab}
        getListsData={getListsData}
        setConsiderDetail={setConsiderDetail}
        getUpcomingListData={getUpcomingListData}
      />
      {tab === "pairing" ? (
        <>
          <SettingPreference
            setPreference={setPreference}
            preference={preference}
          />
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
          <ConsiderEverySinglePetCard
            setNowChosenPetIndex={setNowChosenPetIndex}
            setConsiderDetail={setConsiderDetail}
            deleteConsiderAndUpdateList={deleteConsiderAndUpdateList}
          />
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
