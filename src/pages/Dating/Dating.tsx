import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import {
  setAllCardInfrontOfUser,
  setConsiderList,
  setUpcomingDateList,
} from "../../functions/datingReducerFunction";
import { Card, Dating, petCardInfo, InviteDating } from "../../reducers/dating";
import api from "../../utils/api";
import { db } from "../../utils/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import PetCardDetail from "./PairingFeature";
import UpcomingList from "./UpcomingList";
import TogglePairingTabs from "./TogglePairingTabs";
import ConsiderPetDetail, { ConsiderEverySinglePetCard } from "./ConsiderPet";
import { Profile } from "../../reducers/profile";
import { Btn, Title } from "../ProfileSetting/UserInfos";
import preferenceSet from "./img/preference.png";
import { area } from "../../utils/ConstantInfo";
import close from "./img/close.png";
import menuburger from "./img/menuburger.png";
import question from "./img/help-sing.png";
import { CatLoading } from "../../utils/loading";
import {
  NowNoInfoInHere,
  NowNoInfoImg,
  NowNoInfoText,
} from "./../ProfileSetting/UserOwnPetInfos";
import noConsiderCard from "./img/dog_family.png";
import noUpcomingDate from "./img/kataomoi_woman-01.png";
import Meeting from "../../component/Meeting";
import { useNavigate } from "react-router-dom";
import { BlackMask } from "../../component/Header";

export const NowNoInfoInHereConsider = styled(NowNoInfoInHere)`
  flex-direction: column;
  top: 100px;
`;

export const NowNoInfoTextConsider = styled(NowNoInfoText)`
  line-height: 30px;
  text-align: center;
`;

const PopupAnimation = keyframes`
  0% {right: -300px}
  70% {right:0}
  100% {right: -300px}
`;

export const PopupHint = styled.div<{ $Top: number }>`
  background-color: #b54745;
  color: #fff;
  position: absolute;
  right: -200px;
  top: ${(props) => props.$Top + 120}px;
  padding: 15px 20px;
  letter-spacing: 1.5px;
  z-index: 100;
  animation: ${PopupAnimation} 3s ease infinite;
`;

const ConsiderTitle = styled(Title)`
  position: absolute;
  top: 0px;
  left: 20px;
  @media (max-width: 539px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const UpcomingTitle = styled(Title)`
  position: absolute;
  top: 0px;
`;

const Wrap = styled.div`
  width: 100%;
  height: auto;
  min-height: 100vh;
  background-color: #fafafa;
  position: relative;
  padding-top: 120px;
  padding-bottom: 50px;
  overflow: hidden;
`;

const Cards = styled.div`
  position: relative;
  width: 450px;
  height: 500px;
  left: 50%;
  /* top: 50%; */
  transform: translateX(-50%);
  @media (max-width: 574px) {
    width: 400px;
    height: 500px;
  }
  @media (max-width: 460px) {
    width: 350px;
    height: 500px;
  }
  @media (max-width: 385px) {
    width: 300px;
    height: 450px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  position: absolute;
  top: -30px;
  left: 20px;
  opacity: 0.85;
  cursor: pointer;
  letter-spacing: 1.5px;
  &:hover {
    opacity: 1;
  }
`;

const FilterImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const FilterTitle = styled.div`
  font-size: 16px;
  position: relative;
  top: 2px;
`;

const CloseFilterBtn = styled.img`
  position: absolute;
  width: 15px;
  height: 15px;
  top: 15px;
  right: 15px;
  opacity: 0.8;
  transition: 0.2s;
  cursor: pointer;
  z-index: 200;
  &:hover {
    opacity: 1;
  }
`;

const FilterInsideContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 20px;
  border-radius: 8px;
  z-index: 999;
  background-color: #fff;
  padding: 15px;
  font-size: 16px;
  letter-spacing: 1.5px;
  box-shadow: 2px 2px 4px 3px rgba(0, 0, 0, 0.2);
  width: 350px;
  @media (max-width: 460px) {
    width: 310px;
  }
  @media (max-width: 385px) {
    width: 280px;
  }
`;

const NomoreFilterInsideContainer = styled(FilterInsideContainer)`
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  width: 550px;
  @media (max-width: 1145px) {
    top: 170px;
  }
  @media (max-width: 615px) {
    width: 350px;
  }
  @media (max-width: 393px) {
    width: 280px;
  }
`;

const FilterInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0.85;
  margin-top: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

const NomoreFilterInfoContainer = styled(FilterInfoContainer)`
  align-items: flex-start;
`;
const FilterInfoTitle = styled.div``;
const FilterOptionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
`;
const FilterInfoOption = styled(Btn)`
  width: auto;
  font-size: 16px;
  position: relative;
  border: solid 2px #d1cfcf;
  padding: 5px 15px;
  transition: 0.3s;
  margin-right: 8px;
  margin-bottom: 8px;
  color: #3c3c3c;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    background-color: #b7b0a8;
  }
  @media (max-width: 385px) {
    padding: 5px 10px;
  }
`;

const KindOption = styled(FilterInfoOption)<{ $isActive: boolean }>`
  background-color: ${(props) => (props.$isActive ? "#B7B0A8" : "#fff")};
`;
const AreaOption = styled(FilterInfoOption)<{ $isActive: boolean }>`
  background-color: ${(props) => (props.$isActive ? "#B7B0A8" : "#fff")};
`;
const NoCardSWrapper = styled.div`
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NoCardsTitle = styled.div`
  font-size: 22px;
  letter-spacing: 1.5px;
  font-weight: bold;
  color: #3c3c3c;
  text-align: center;
  line-height: 40px;
`;

const NoCardsBtn = styled(Btn)`
  width: 250px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const RequestMoreCardsBtn = styled(NoCardsBtn)`
  top: 40px;
`;

const NomoreRequestMoreCardsBtn = styled(RequestMoreCardsBtn)`
  z-index: 100;
  width: 300px;
`;

const LookConsiderListBtn = styled(NoCardsBtn)`
  top: 70px;
`;

const NomoreLookConsiderListBtn = styled(LookConsiderListBtn)`
  width: 300px;
`;

const ConsiderList = styled.div`
  position: relative;
  max-width: 1120px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  padding-top: 70px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  justify-content: space-between;
  gap: 20px;
  grid-template-rows: 250px;
  @media (max-width: 539px) {
    justify-content: center;
  }
`;

const UpcomingListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1120px;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  padding: 20px;
  padding-top: 70px;
  min-height: 340px;
`;

const OpenToggleTabs = styled.div<{ $Notification: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: ${(props) =>
    props.$Notification ? "#DB5452" : " #FFB9B8"};
  z-index: 500;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0px 0px 4px 2px rgba(219, 84, 82, 0.4);
  &:hover {
    background-color: ${(props) =>
      props.$Notification ? "#B54745" : " #E4B2B1"};
  }
`;
const OpenToggleTabsIcon = styled.img`
  width: 40px;
  height: 40px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const OpenTutorial = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  z-index: 500;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0px 0px 1px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #ececec;
  }
`;
const OpenTutorialIcon = styled.img`
  width: 30px;
  height: 30px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const TutorialBox = styled.div<{ $isActive: boolean }>`
  width: 250px;
  position: absolute;
  top: -320px;
  right: 0;
  height: ${(props) => (props.$isActive ? "auto" : "0")};
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  transition: 0.3s;
  padding: ${(props) => (props.$isActive ? "10px 15px" : "0")};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.$isActive ? "2px 2px 6px 3px rgba(0, 0, 0, 0.1)" : "0"};
  background-color: #fbfbfb;
`;

const TutorialTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
`;

const TutorialContext = styled.div`
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
`;

const Pairing: React.FC = () => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [preference, setPreference] = useState({ kind: "all", location: "0" });
  const [considerDetail, setConsiderDetail] = useState<Boolean>(false);
  const [nowChosenPetIndex, setNowChosenPetIndex] = useState<number>(-1);
  const [tab, setTab] = useState<string>("pairing");
  const [areaTabIndex, setAreaTabIndex] = useState<number>(-1);
  const [kindTabIndex, setKindTabIndex] = useState<number>(-1);
  const [openFilterBox, setOpenFilterBox] = useState<boolean>(false);
  const chosenIdRef = useRef<number[]>([]);
  const [matchSuccessQty, setMatchSuccessQty] = useState<number>(0);
  const [datingQty, setDatingQty] = useState<number>(0);
  const [openDatingFeatureMenu, setOpenDatingFeatureMenu] =
    useState<boolean>(false);
  const [openTutorialMenu, setOpenTutorialMenu] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [nowMeetingShelter, setNowMeetingShelter] = useState<{
    petId: number;
    shelterName: string;
    userName: string;
    index: number;
  }>({ petId: 0, shelterName: "", userName: "", index: -1 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile.isLogged) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (preference.kind !== "all" || preference.location !== "0") {
      setOpenFilterBox(false);
      setLoading(true);
      checkChosenAndAppendNewPet(100);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [preference, profile.uid]);

  useEffect(() => {
    if (dating.allCards.length === 0) {
      setLoading(true);
      checkChosenAndAppendNewPet(100);
    }
    if (
      dating.allCards.length > 0 &&
      preference.kind === "all" &&
      preference.location === "0"
    ) {
      setLoading(false);
    }
  }, [dating.allCards, profile.uid]);

  async function checkChosenAndAppendNewPet(quantity: number) {
    await getListsData();
    await choosePreference(quantity);
  }

  async function getListsData() {
    if (!profile.uid) return;
    let userChosenId: number[] = [];
    let consider: Card[] = [];
    const q = query(
      collection(db, "memberProfiles", profile.uid, "considerLists"),
      orderBy("area")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      userChosenId.push(info.data().id);
      consider.push(info.data() as Card);
    });
    dispatch(setConsiderList(consider));

    const p = collection(db, "memberProfiles", profile.uid, "notConsiderLists");
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
      if (!info[i]) continue;
      if (!info[i].hasOwnProperty("animal_id") || !info[i].animal_id) continue;
      if (!info[i].hasOwnProperty("animal_id") || !info[i].album_file) continue;
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
    const q = query(
      collection(db, "memberProfiles", profile.uid, "upcomingDates"),
      orderBy("datingDate")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      upcomingDate.push({
        ...info.data(),
        datingDate: info.data().dateAndTime,
      } as InviteDating);
    });
    dispatch(setUpcomingDateList(upcomingDate));
  }

  if (!dating.allCards) return null;
  return (
    <>
      <OpenToggleTabs
        onMouseEnter={() => setOpenDatingFeatureMenu(true)}
        onClick={() => {
          openDatingFeatureMenu
            ? setOpenDatingFeatureMenu(false)
            : setOpenDatingFeatureMenu(true);
        }}
        $Notification={matchSuccessQty > 0 || datingQty > 0}
      >
        <OpenToggleTabsIcon src={menuburger} />
      </OpenToggleTabs>
      <OpenTutorial
        onClick={() => {
          openTutorialMenu
            ? setOpenTutorialMenu(false)
            : setOpenTutorialMenu(true);
        }}
      >
        <OpenTutorialIcon src={question} />
        <TutorialBox $isActive={openTutorialMenu === true}>
          <TutorialTitle>配對專區使用簡介</TutorialTitle>
          <TutorialContext>
            1. 這些動物皆來自台灣各地收容所，對喜歡的動物按個愛心吧！
          </TutorialContext>
          <TutorialContext>
            2. 按下愛心後，可以到左下角的「考慮領養清單」查看
          </TutorialContext>
          <TutorialContext>
            3. 想要實際和動物相處？按下「申請與他約會」按鈕！
          </TutorialContext>
          <TutorialContext>
            4. 申請約會後，可以在「即將到來的約會」中查看
          </TutorialContext>
          <TutorialContext>
            5. 完成約會後，再告訴我們你是否決定要領養唷！
          </TutorialContext>
        </TutorialBox>
      </OpenTutorial>
      <TogglePairingTabs
        matchSuccessQty={matchSuccessQty}
        setMatchSuccessQty={setMatchSuccessQty}
        datingQty={datingQty}
        setDatingQty={setDatingQty}
        tab={tab}
        setTab={setTab}
        getListsData={getListsData}
        setConsiderDetail={setConsiderDetail}
        getUpcomingListData={getUpcomingListData}
        setOpenDatingFeatureMenu={setOpenDatingFeatureMenu}
        openDatingFeatureMenu={openDatingFeatureMenu}
      />
      <Wrap>
        {tab === "pairing" ? (
          <>
            {dating.allCards.length <= 0 ? (
              isLoading ? (
                <CatLoading />
              ) : (
                <NoCardSWrapper>
                  <NoCardsTitle>
                    當前偏好設定已無動物進行配對！接下來您可以選擇 ...
                  </NoCardsTitle>
                  <NomoreRequestMoreCardsBtn
                    onClick={() => {
                      setOpenFilterBox(true);
                    }}
                  >
                    選擇其他動物種類或地區偏好
                  </NomoreRequestMoreCardsBtn>
                  <NomoreLookConsiderListBtn
                    onClick={() => {
                      setTab("considerAdopt");
                      getListsData();
                      setConsiderDetail(false);
                    }}
                  >
                    看目前考慮領養清單
                  </NomoreLookConsiderListBtn>
                  {openFilterBox && (
                    <NomoreFilterInsideContainer>
                      <CloseFilterBtn
                        src={close}
                        onClick={() => setOpenFilterBox(false)}
                      />
                      <NomoreFilterInfoContainer>
                        <FilterInfoTitle>偏好種類</FilterInfoTitle>
                        <FilterOptionGroup>
                          <KindOption
                            onClick={() => {
                              setPreference({
                                ...preference,
                                kind: "%E7%8B%97",
                              });
                              setKindTabIndex(0);
                            }}
                            $isActive={kindTabIndex === 0}
                          >
                            狗
                          </KindOption>
                          <KindOption
                            onClick={() => {
                              setPreference({
                                ...preference,
                                kind: "%E8%B2%93",
                              });
                              setKindTabIndex(1);
                            }}
                            $isActive={kindTabIndex === 1}
                          >
                            貓
                          </KindOption>
                        </FilterOptionGroup>
                      </NomoreFilterInfoContainer>
                      <NomoreFilterInfoContainer>
                        <FilterInfoTitle>偏好地區</FilterInfoTitle>
                        <FilterOptionGroup>
                          {area.map((loc, index) => (
                            <AreaOption
                              id={`${index + 2}`}
                              key={index}
                              onClick={(e) => {
                                setPreference({
                                  ...preference,
                                  location: (e.target as HTMLElement).id,
                                });
                                setAreaTabIndex(index);
                              }}
                              $isActive={index === areaTabIndex}
                            >
                              {loc}
                            </AreaOption>
                          ))}
                        </FilterOptionGroup>
                      </NomoreFilterInfoContainer>
                    </NomoreFilterInsideContainer>
                  )}
                </NoCardSWrapper>
              )
            ) : (
              <Cards>
                <FilterContainer onClick={() => setOpenFilterBox(true)}>
                  <FilterImg src={preferenceSet} />
                  <FilterTitle>偏好設定</FilterTitle>
                </FilterContainer>
                {openFilterBox ? (
                  <FilterInsideContainer>
                    <CloseFilterBtn
                      src={close}
                      onClick={() => setOpenFilterBox(false)}
                    />
                    <FilterInfoContainer>
                      <FilterInfoTitle>偏好種類</FilterInfoTitle>
                      <FilterOptionGroup>
                        <KindOption
                          onClick={() => {
                            setPreference({ ...preference, kind: "%E7%8B%97" });
                            setKindTabIndex(0);
                          }}
                          $isActive={kindTabIndex === 0}
                        >
                          狗
                        </KindOption>
                        <KindOption
                          onClick={() => {
                            setPreference({ ...preference, kind: "%E8%B2%93" });
                            setKindTabIndex(1);
                          }}
                          $isActive={kindTabIndex === 1}
                        >
                          貓
                        </KindOption>
                      </FilterOptionGroup>
                    </FilterInfoContainer>
                    <FilterInfoContainer>
                      <FilterInfoTitle>偏好地區</FilterInfoTitle>
                      <FilterOptionGroup>
                        {area.map((loc, index) => (
                          <AreaOption
                            id={`${index + 2}`}
                            key={index}
                            onClick={(e) => {
                              setPreference({
                                ...preference,
                                location: (e.target as HTMLElement).id,
                              });
                              setAreaTabIndex(index);
                            }}
                            $isActive={index === areaTabIndex}
                          >
                            {loc}
                          </AreaOption>
                        ))}
                      </FilterOptionGroup>
                    </FilterInfoContainer>
                  </FilterInsideContainer>
                ) : (
                  ""
                )}
                {isLoading ? (
                  <CatLoading />
                ) : (
                  <PetCardDetail
                    setMatchSuccessQty={setMatchSuccessQty}
                    petInfo={dating.allCards}
                  />
                )}
              </Cards>
            )}
          </>
        ) : (
          ""
        )}
        {tab === "considerAdopt" && (
          <>
            {considerDetail && (
              <ConsiderPetDetail
                nowChosenPetIndex={nowChosenPetIndex}
                setConsiderDetail={setConsiderDetail}
                considerDetail={considerDetail}
                setDatingQty={setDatingQty}
              />
            )}
            <ConsiderList>
              <ConsiderTitle>考慮領養清單</ConsiderTitle>
              {dating.considerList.length === 0 ? (
                <NowNoInfoInHereConsider>
                  <NowNoInfoImg src={noConsiderCard} />
                  <NowNoInfoTextConsider>
                    目前考慮領養清單無任何貓狗，
                    <br />
                    到配對系統選擇心儀的寵物吧！
                  </NowNoInfoTextConsider>
                </NowNoInfoInHereConsider>
              ) : (
                <ConsiderEverySinglePetCard
                  setNowChosenPetIndex={setNowChosenPetIndex}
                  setConsiderDetail={setConsiderDetail}
                  tab={tab}
                  considerDetail={considerDetail}
                  nowChosenPetIndex={nowChosenPetIndex}
                  setDatingQty={setDatingQty}
                  getUpcomingListData={getUpcomingListData}
                />
              )}
            </ConsiderList>
          </>
        )}
        {tab === "upcomingDate" && (
          <>
            {openMeeting && (
              <Meeting
                nowMeetingShelter={nowMeetingShelter}
                setOpenMeeting={setOpenMeeting}
              />
            )}
            <UpcomingListContainer>
              <UpcomingTitle>即將到來的約會</UpcomingTitle>
              {dating.upcomingDateList.length === 0 ? (
                <NowNoInfoInHereConsider>
                  <NowNoInfoImg src={noUpcomingDate} />
                  <NowNoInfoTextConsider>
                    目前沒有即將到來的約會，
                    <br />
                    到考慮領養清單邀請心儀的寵物來場約會吧！
                  </NowNoInfoTextConsider>
                </NowNoInfoInHereConsider>
              ) : (
                <>
                  <UpcomingList
                    getUpcomingListData={getUpcomingListData}
                    setOpenMeeting={setOpenMeeting}
                    setNowMeetingShelter={setNowMeetingShelter}
                  />
                </>
              )}
            </UpcomingListContainer>
          </>
        )}
      </Wrap>
    </>
  );
};
export default Pairing;
