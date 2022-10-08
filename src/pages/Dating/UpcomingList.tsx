import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { db, deleteFirebaseData } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { shelterInfo } from "./ConstantInfo";
import { Dating } from "../../reducers/dating";
import { Profile } from "../../reducers/profile";
import cutEgg from "./img/scissors.png";
import shelter from "./img/animal-shelter.png";
import googlemap from "./img/placeholder.png";
import tel from "./img/telephone.png";
import clock from "./img/clock.png";
import close from "./img/close.png";
import meetingWay from "./img/chat.png";
import { Btn } from "../ProfileSetting/UserInfos";
import {
  setConsiderList,
  setUpcomingDateList,
} from "../../functions/datingReducerFunction";
import {
  DeleteCheckBox,
  DeleteCheckText,
  DeleteCheckBoxBtnContainer,
  DeleteCheckBoxBtn,
  WarningDeleteBtn,
} from "../ProfileSetting/OwnPetInfo";
import { setNotification } from "../../functions/profileReducerFunction";

const UpcomingListCard = styled.div`
  display: flex;
  position: relative;
  border-radius: 5px;
  margin-bottom: 20px;
  border: solid 2px #d1cfcf;
  @media (max-width: 612px) {
    flex-direction: column;
  }
`;

const InvitePetImgContainer = styled.div`
  aspect-ratio: 1;
  flex: 0.5;
  position: relative;
  @media (max-width: 612px) {
    aspect-ratio: inherit;
  }
`;
const InvitePetImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  @media (max-width: 612px) {
    height: 250px;
  }
`;
const UpcomingInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  letter-spacing: 1.5px;
  justify-content: center;
  line-height: 22px;
  @media (max-width: 612px) {
    padding-bottom: 60px;
  }
`;

const UpcomingInfoImgContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const UpcomingInfoImg = styled.img`
  width: 20px;
  height: 20px;
  @media (max-width: 437px) {
    display: none;
  }
`;

const UpcomingInfoTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;
const UpcomingInfo = styled.div`
  margin-left: 15px;
  @media (max-width: 437px) {
    margin-left: 0;
  }
`;

const PetShelterAddress = styled.a`
  color: #db5452;
`;

const AskIfAdoptPetBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  text-align: center;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.7);
  z-index: 50;
  border-radius: 8px;
  letter-spacing: 1.5px;
`;
const AskAdoptTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;
const AnswerBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const AnswerBtn = styled(Btn)<{ $isActive: boolean }>`
  position: relative;
  width: 100px;
  margin-right: 50px;
  background-color: ${(props) => (props.$isActive ? "#B7B0A8" : "#fff")};
  color: ${(props) => (props.$isActive ? "#fff" : "#737373")};
  &:last-child {
    margin-right: 0;
  }
`;

const ConfirmToAdoptPetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
`;
const ConfirmTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;
const ConfirmInputContainer = styled.div`
  display: flex;
  width: 300px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const ConfirmLabel = styled.label`
  width: 70px;
`;

const WarningText = styled.div`
  color: #b54745;
`;

const ConfirmInput = styled.input`
  flex: 1;
  border: solid 2px #d1cfcf;
  padding: 10px 15px;
  border-radius: 5px;
`;

const CheckAdoptBtn = styled(Btn)`
  position: relative;
  font-size: 16px;
`;

const CloseAdoptBtn = styled.img`
  position: absolute;
  width: 15px;
  height: 15px;
  top: 15px;
  right: 15px;
  opacity: 0.8;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const DatingDoneBtn = styled(Btn)`
  right: 15px;
  bottom: 15px;
  font-size: 16px;
  @media (max-width: 740px) {
    right: 15px;
    top: 5px;
    bottom: auto;
    padding: 5px 10px;
  }
  @media (max-width: 612px) {
    padding: 5px 10px;
    background-color: #fff;
    color: #737373;
    font-size: 16px;
    left: auto;
    right: 5px;
    top: auto;
    bottom: 10px;
  }
`;

type Props = {
  getUpcomingListData: () => void;
  setOpenMeeting: Dispatch<SetStateAction<boolean>>;
  setNowMeetingShelter: Dispatch<
    SetStateAction<{
      petId: number;
      shelterName: string;
      userName: string;
      index: number;
    }>
  >;
};

const UpcomingList: React.FC<Props> = (props) => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [checkToAdoptPet, setCheckToAdoptPet] = useState<Boolean>(false);
  const [datingDone, setDatingDone] = useState<{
    id: number;
    open: Boolean;
    index: number;
  }>({
    id: 0,
    open: false,
    index: -1,
  });
  const [adoptPetInfo, setAdoptPetInfo] = useState<{
    name: string;
    birthYear: number;
  }>({ name: "", birthYear: 0 });
  const [adoptAnswer, setAdoptAnswer] = useState<number>(-1);
  const [incompleteInfo, setIncompleteInfo] = useState(false);
  const [openDeleteBox, setOpenDeleteBox] = useState(false);
  const [invalidBirthYear, setInvalidBirthYear] = useState(false);
  const [invalidName, setInvalidName] = useState(false);

  if (!dating.upcomingDateList) return null;
  return (
    <>
      {dating.upcomingDateList.map((date, index) => (
        <UpcomingListCard key={index}>
          <InvitePetImgContainer>
            <InvitePetImg src={date.image} />
          </InvitePetImgContainer>

          <UpcomingInfoContainer>
            <UpcomingInfoTitle>
              {date.id} / {date.color}
              {date.kind} {date.sex === "F" ? "♀" : "♂"}
            </UpcomingInfoTitle>
            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={cutEgg} />
              <UpcomingInfo>
                結紮狀態：{date.sterilization === "T" ? "已結紮" : "未結紮"}
              </UpcomingInfo>
            </UpcomingInfoImgContainer>
            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={shelter} />
              <UpcomingInfo>收容所地點：{date.shelterName}</UpcomingInfo>
            </UpcomingInfoImgContainer>

            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={googlemap} />
              <UpcomingInfo>
                地址：{" "}
                <PetShelterAddress
                  href={`https://www.google.com/maps/search/?api=1&query=${
                    shelterInfo.find(
                      (shelter) => shelter.pkid === date.shleterPkid
                    )?.latAndLng
                  }&query_place_id=${
                    shelterInfo.find(
                      (shelter) => shelter.pkid === date.shleterPkid
                    )?.placeid
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {date.shelterAddress}
                </PetShelterAddress>
              </UpcomingInfo>
            </UpcomingInfoImgContainer>

            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={tel} />
              <UpcomingInfo>收容所電話：{date.shelterTel}</UpcomingInfo>
            </UpcomingInfoImgContainer>

            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={meetingWay} />
              <UpcomingInfo>約會形式：{date.way}</UpcomingInfo>
            </UpcomingInfoImgContainer>

            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={clock} />
              {typeof date.datingDate === "number" ? (
                <UpcomingInfo>
                  預約時間：
                  {new Date(date.datingDate).getFullYear()}/
                  {new Date(date.datingDate).getMonth() + 1 < 10
                    ? `0${new Date(date.datingDate).getMonth() + 1}`
                    : new Date(date.datingDate).getMonth() + 1}
                  /
                  {new Date(date.datingDate).getDate() < 10
                    ? `0${new Date(date.datingDate).getDate()}`
                    : new Date(date.datingDate).getDate()}{" "}
                  {date.time}
                </UpcomingInfo>
              ) : (
                ""
              )}
            </UpcomingInfoImgContainer>
          </UpcomingInfoContainer>
          {date.way === "實體" ? (
            (date.datingDate as number) < Date.parse(`${new Date()}`) ? (
              <>
                <DatingDoneBtn
                  onClick={() => {
                    setDatingDone({
                      id: date.id,
                      open: !datingDone.open,
                      index: index,
                    });
                    setCheckToAdoptPet(false);
                    setAdoptAnswer(-1);
                    setIncompleteInfo(false);
                  }}
                >
                  已完成約會
                </DatingDoneBtn>
                {datingDone.id === date.id && datingDone.open ? (
                  <AskIfAdoptPetBox>
                    <CloseAdoptBtn
                      src={close}
                      onClick={() =>
                        setDatingDone({ id: 0, open: false, index: -1 })
                      }
                    />
                    <AskAdoptTitle>是否領養 {date.id} ?</AskAdoptTitle>
                    <AnswerBtnContainer>
                      <AnswerBtn
                        onClick={() => {
                          setCheckToAdoptPet(true);
                          setAdoptAnswer(0);
                        }}
                        $isActive={adoptAnswer === 0}
                      >
                        是
                      </AnswerBtn>
                      <AnswerBtn
                        onClick={async () => {
                          deleteFirebaseData(
                            `/memberProfiles/${profile.uid}/upcomingDates`,
                            "id",
                            date.id
                          );
                          dispatch(setNotification("已完成本次約會並更新清單"));
                          setTimeout(() => {
                            dispatch(setNotification(""));
                            setAdoptAnswer(-1);
                          }, 3000);
                          const newUpcomingList = dating.upcomingDateList;
                          newUpcomingList.splice(datingDone.index, 1);
                          dispatch(setUpcomingDateList(newUpcomingList));
                          setAdoptAnswer(1);
                        }}
                        $isActive={adoptAnswer === 1}
                      >
                        否
                      </AnswerBtn>
                    </AnswerBtnContainer>
                    {checkToAdoptPet ? (
                      <ConfirmToAdoptPetContainer>
                        <ConfirmTitle>為他定一個名字和生日年吧！</ConfirmTitle>
                        <ConfirmInputContainer>
                          <ConfirmLabel htmlFor="name">名字</ConfirmLabel>
                          <ConfirmInput
                            type="text"
                            id="name"
                            onChange={(e) => {
                              setAdoptPetInfo({
                                ...adoptPetInfo,
                                name: e.target.value,
                              });
                              if (
                                profile.ownPets.some(
                                  (pet) => pet.name === e.target.value
                                )
                              ) {
                                setInvalidName(true);
                              } else {
                                setInvalidName(false);
                              }
                            }}
                          ></ConfirmInput>
                        </ConfirmInputContainer>
                        <ConfirmInputContainer>
                          <ConfirmLabel htmlFor="year">出生年</ConfirmLabel>
                          <ConfirmInput
                            type="number"
                            id="year"
                            min="1911"
                            max={new Date().getFullYear()}
                            step="1"
                            onKeyDown={(e) => {
                              if (
                                e.key === "." ||
                                e.key === "e" ||
                                e.key === "+" ||
                                e.key === "-"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              setAdoptPetInfo({
                                ...adoptPetInfo,
                                birthYear: Number(e.target.value),
                              });
                              if (
                                Number(e.target.value) >
                                  new Date().getFullYear() ||
                                Number(e.target.value) < 1911
                              ) {
                                setInvalidBirthYear(true);
                              } else {
                                setInvalidBirthYear(false);
                              }
                            }}
                          ></ConfirmInput>
                        </ConfirmInputContainer>
                        {invalidBirthYear && (
                          <WarningText>
                            請輸入1911~{new Date().getFullYear()}的數字
                          </WarningText>
                        )}
                        {incompleteInfo && (
                          <WarningText>請填寫完整資訊</WarningText>
                        )}
                        {invalidName && (
                          <WarningText>已存在相同名字的寵物</WarningText>
                        )}
                        <AnswerBtnContainer>
                          <CheckAdoptBtn
                            onClick={async () => {
                              if (
                                !adoptPetInfo.name ||
                                adoptPetInfo.birthYear === 0
                              ) {
                                setIncompleteInfo(true);
                                return;
                              }
                              if (invalidBirthYear) {
                                setIncompleteInfo(false);
                                return;
                              }
                              await addDoc(
                                collection(
                                  db,
                                  `/memberProfiles/${profile.uid}/ownPets`
                                ),
                                {
                                  id: date.id,
                                  shelterName: date.shelterName,
                                  kind: date.kind,
                                  img: date.image,
                                  sex: date.sex,
                                  name: adoptPetInfo.name,
                                  birthYear: adoptPetInfo.birthYear,
                                }
                              );
                              deleteFirebaseData(
                                `/memberProfiles/${profile.uid}/upcomingDates`,
                                "id",
                                date.id
                              );
                              const newUpcomingList = dating.upcomingDateList;
                              newUpcomingList.splice(index, 1);
                              dispatch(setUpcomingDateList(newUpcomingList));
                              const newConsiderList =
                                dating.considerList.filter((pet) => {
                                  return pet.id !== date.id;
                                });
                              dispatch(setConsiderList(newConsiderList));
                              deleteFirebaseData(
                                `/memberProfiles/${profile.uid}/considerLists`,
                                "id",
                                date.id
                              );
                              await addDoc(
                                collection(
                                  db,
                                  `/memberProfiles/${profile.uid}/notConsiderLists`
                                ),
                                { id: date.id }
                              );
                              dispatch(
                                setNotification("已將領養寵物新增至會員資料")
                              );
                              setTimeout(() => {
                                dispatch(setNotification(""));
                                setAdoptAnswer(-1);
                              }, 3000);
                            }}
                          >
                            確認(日後可修改)
                          </CheckAdoptBtn>
                        </AnswerBtnContainer>
                      </ConfirmToAdoptPetContainer>
                    ) : (
                      ""
                    )}
                  </AskIfAdoptPetBox>
                ) : (
                  ""
                )}
              </>
            ) : (
              <DatingDoneBtn
                onClick={async () => {
                  setDatingDone({
                    ...datingDone,
                    id: date.id,
                  });
                  setOpenDeleteBox(true);
                }}
              >
                取消此次約會
              </DatingDoneBtn>
            )
          ) : (
            ""
          )}

          {date.way === "視訊" &&
            ((date.datingDate as number) > Date.parse(`${new Date()}`) ? (
              <DatingDoneBtn
                onClick={async () => {
                  setDatingDone({
                    ...datingDone,
                    id: date.id,
                  });
                  setOpenDeleteBox(true);
                }}
              >
                取消此次約會
              </DatingDoneBtn>
            ) : Date.parse(`${new Date()}`) - (date.datingDate as number) <=
              7200000 ? (
              !date.doneWithMeeting ? (
                <DatingDoneBtn
                  onClick={() => {
                    props.setOpenMeeting(true);
                    props.setNowMeetingShelter({
                      petId: date.id,
                      shelterName: date.shelterName,
                      userName: profile.name,
                      index: index,
                    });
                  }}
                >
                  點擊開始視訊
                </DatingDoneBtn>
              ) : (
                <>
                  <DatingDoneBtn
                    onClick={() => {
                      setDatingDone({
                        id: date.id,
                        open: !datingDone.open,
                        index: index,
                      });
                      setCheckToAdoptPet(false);
                      setAdoptAnswer(-1);
                      setIncompleteInfo(false);
                    }}
                  >
                    已完成約會
                  </DatingDoneBtn>
                  {datingDone.id === date.id && datingDone.open ? (
                    <AskIfAdoptPetBox>
                      <CloseAdoptBtn
                        src={close}
                        onClick={() =>
                          setDatingDone({ id: 0, open: false, index: -1 })
                        }
                      />
                      <AskAdoptTitle>是否領養 {date.id} ?</AskAdoptTitle>
                      <AnswerBtnContainer>
                        <AnswerBtn
                          onClick={() => {
                            setCheckToAdoptPet(true);
                            setAdoptAnswer(0);
                          }}
                          $isActive={adoptAnswer === 0}
                        >
                          是
                        </AnswerBtn>
                        <AnswerBtn
                          onClick={async () => {
                            deleteFirebaseData(
                              `/memberProfiles/${profile.uid}/upcomingDates`,
                              "id",
                              date.id
                            );
                            dispatch(
                              setNotification("已完成本次約會並更新清單")
                            );
                            setTimeout(() => {
                              dispatch(setNotification(""));
                              setAdoptAnswer(-1);
                            }, 3000);
                            const newUpcomingList = dating.upcomingDateList;
                            newUpcomingList.splice(datingDone.index, 1);
                            dispatch(setUpcomingDateList(newUpcomingList));
                            setAdoptAnswer(1);
                          }}
                          $isActive={adoptAnswer === 1}
                        >
                          否
                        </AnswerBtn>
                      </AnswerBtnContainer>
                      {checkToAdoptPet ? (
                        <ConfirmToAdoptPetContainer>
                          <ConfirmTitle>
                            為他定一個名字和生日年吧！
                          </ConfirmTitle>
                          <ConfirmInputContainer>
                            <ConfirmLabel htmlFor="name">名字</ConfirmLabel>
                            <ConfirmInput
                              type="text"
                              id="name"
                              onChange={(e) => {
                                setAdoptPetInfo({
                                  ...adoptPetInfo,
                                  name: e.target.value,
                                });
                                if (
                                  profile.ownPets.some(
                                    (pet) => pet.name === e.target.value
                                  )
                                ) {
                                  setInvalidName(true);
                                } else {
                                  setInvalidName(false);
                                }
                              }}
                            ></ConfirmInput>
                          </ConfirmInputContainer>
                          <ConfirmInputContainer>
                            <ConfirmLabel htmlFor="year">出生年</ConfirmLabel>
                            <ConfirmInput
                              type="number"
                              id="year"
                              min="1911"
                              max={new Date().getFullYear()}
                              step="1"
                              onKeyDown={(e) => {
                                if (
                                  e.key === "." ||
                                  e.key === "e" ||
                                  e.key === "+" ||
                                  e.key === "-"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                setAdoptPetInfo({
                                  ...adoptPetInfo,
                                  birthYear: Number(e.target.value),
                                });
                                if (
                                  Number(e.target.value) >
                                    new Date().getFullYear() ||
                                  Number(e.target.value) < 1911
                                ) {
                                  setInvalidBirthYear(true);
                                } else {
                                  setInvalidBirthYear(false);
                                }
                              }}
                            ></ConfirmInput>
                          </ConfirmInputContainer>
                          {invalidBirthYear && (
                            <WarningText>
                              請輸入1911~{new Date().getFullYear()}的數字
                            </WarningText>
                          )}
                          {incompleteInfo && (
                            <WarningText>請填寫完整資訊</WarningText>
                          )}
                          {invalidName && (
                            <WarningText>已存在相同名字的寵物</WarningText>
                          )}
                          <AnswerBtnContainer>
                            <CheckAdoptBtn
                              onClick={async () => {
                                if (
                                  !adoptPetInfo.name ||
                                  adoptPetInfo.birthYear === 0
                                ) {
                                  setIncompleteInfo(true);
                                  return;
                                }
                                if (invalidBirthYear) {
                                  setIncompleteInfo(false);
                                  return;
                                }
                                await addDoc(
                                  collection(
                                    db,
                                    `/memberProfiles/${profile.uid}/ownPets`
                                  ),
                                  {
                                    id: date.id,
                                    shelterName: date.shelterName,
                                    kind: date.kind,
                                    img: date.image,
                                    sex: date.sex,
                                    name: adoptPetInfo.name,
                                    birthYear: adoptPetInfo.birthYear,
                                  }
                                );
                                deleteFirebaseData(
                                  `/memberProfiles/${profile.uid}/upcomingDates`,
                                  "id",
                                  date.id
                                );
                                const newUpcomingList = dating.upcomingDateList;
                                newUpcomingList.splice(index, 1);
                                dispatch(setUpcomingDateList(newUpcomingList));
                                const newConsiderList =
                                  dating.considerList.filter((pet) => {
                                    return pet.id !== date.id;
                                  });
                                dispatch(setConsiderList(newConsiderList));
                                deleteFirebaseData(
                                  `/memberProfiles/${profile.uid}/considerLists`,
                                  "id",
                                  date.id
                                );
                                await addDoc(
                                  collection(
                                    db,
                                    `/memberProfiles/${profile.uid}/notConsiderLists`
                                  ),
                                  { id: date.id }
                                );
                                dispatch(
                                  setNotification("已將領養寵物新增至會員資料")
                                );
                                setTimeout(() => {
                                  dispatch(setNotification(""));
                                  setAdoptAnswer(-1);
                                }, 3000);
                              }}
                            >
                              確認(日後可修改)
                            </CheckAdoptBtn>
                          </AnswerBtnContainer>
                        </ConfirmToAdoptPetContainer>
                      ) : (
                        ""
                      )}
                    </AskIfAdoptPetBox>
                  ) : (
                    ""
                  )}
                </>
              )
            ) : (
              <>
                <DatingDoneBtn
                  onClick={() => {
                    setDatingDone({
                      id: date.id,
                      open: !datingDone.open,
                      index: index,
                    });
                    setCheckToAdoptPet(false);
                    setAdoptAnswer(-1);
                    setIncompleteInfo(false);
                  }}
                >
                  已完成約會
                </DatingDoneBtn>
                {datingDone.id === date.id && datingDone.open ? (
                  <AskIfAdoptPetBox>
                    <CloseAdoptBtn
                      src={close}
                      onClick={() =>
                        setDatingDone({ id: 0, open: false, index: -1 })
                      }
                    />
                    <AskAdoptTitle>是否領養 {date.id} ?</AskAdoptTitle>
                    <AnswerBtnContainer>
                      <AnswerBtn
                        onClick={() => {
                          setCheckToAdoptPet(true);
                          setAdoptAnswer(0);
                        }}
                        $isActive={adoptAnswer === 0}
                      >
                        是
                      </AnswerBtn>
                      <AnswerBtn
                        onClick={async () => {
                          deleteFirebaseData(
                            `/memberProfiles/${profile.uid}/upcomingDates`,
                            "id",
                            date.id
                          );
                          dispatch(setNotification("已完成本次約會並更新清單"));
                          setTimeout(() => {
                            dispatch(setNotification(""));
                            setAdoptAnswer(-1);
                          }, 3000);
                          const newUpcomingList = dating.upcomingDateList;
                          newUpcomingList.splice(datingDone.index, 1);
                          dispatch(setUpcomingDateList(newUpcomingList));
                          setAdoptAnswer(1);
                        }}
                        $isActive={adoptAnswer === 1}
                      >
                        否
                      </AnswerBtn>
                    </AnswerBtnContainer>
                    {checkToAdoptPet ? (
                      <ConfirmToAdoptPetContainer>
                        <ConfirmTitle>為他定一個名字和生日年吧！</ConfirmTitle>
                        <ConfirmInputContainer>
                          <ConfirmLabel htmlFor="name">名字</ConfirmLabel>
                          <ConfirmInput
                            type="text"
                            id="name"
                            onChange={(e) => {
                              setAdoptPetInfo({
                                ...adoptPetInfo,
                                name: e.target.value,
                              });
                              if (
                                profile.ownPets.some(
                                  (pet) => pet.name === e.target.value
                                )
                              ) {
                                setInvalidName(true);
                              } else {
                                setInvalidName(false);
                              }
                            }}
                          ></ConfirmInput>
                        </ConfirmInputContainer>
                        <ConfirmInputContainer>
                          <ConfirmLabel htmlFor="year">出生年</ConfirmLabel>
                          <ConfirmInput
                            type="number"
                            id="year"
                            min="1911"
                            max={new Date().getFullYear()}
                            step="1"
                            onKeyDown={(e) => {
                              if (
                                e.key === "." ||
                                e.key === "e" ||
                                e.key === "+" ||
                                e.key === "-"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              setAdoptPetInfo({
                                ...adoptPetInfo,
                                birthYear: Number(e.target.value),
                              });
                              if (
                                Number(e.target.value) >
                                  new Date().getFullYear() ||
                                Number(e.target.value) < 1911
                              ) {
                                setInvalidBirthYear(true);
                              } else {
                                setInvalidBirthYear(false);
                              }
                            }}
                          ></ConfirmInput>
                        </ConfirmInputContainer>
                        {invalidBirthYear && (
                          <WarningText>
                            請輸入1911~{new Date().getFullYear()}的數字
                          </WarningText>
                        )}
                        {incompleteInfo && (
                          <WarningText>請填寫完整資訊</WarningText>
                        )}
                        {invalidName && (
                          <WarningText>已存在相同名字的寵物</WarningText>
                        )}
                        <AnswerBtnContainer>
                          <CheckAdoptBtn
                            onClick={async () => {
                              if (
                                !adoptPetInfo.name ||
                                adoptPetInfo.birthYear === 0
                              ) {
                                setIncompleteInfo(true);
                                return;
                              }
                              if (invalidBirthYear) {
                                setIncompleteInfo(false);
                                return;
                              }
                              await addDoc(
                                collection(
                                  db,
                                  `/memberProfiles/${profile.uid}/ownPets`
                                ),
                                {
                                  id: date.id,
                                  shelterName: date.shelterName,
                                  kind: date.kind,
                                  img: date.image,
                                  sex: date.sex,
                                  name: adoptPetInfo.name,
                                  birthYear: adoptPetInfo.birthYear,
                                }
                              );
                              deleteFirebaseData(
                                `/memberProfiles/${profile.uid}/upcomingDates`,
                                "id",
                                date.id
                              );
                              const newUpcomingList = dating.upcomingDateList;
                              newUpcomingList.splice(index, 1);
                              dispatch(setUpcomingDateList(newUpcomingList));
                              const newConsiderList =
                                dating.considerList.filter((pet) => {
                                  return pet.id !== date.id;
                                });
                              dispatch(setConsiderList(newConsiderList));
                              deleteFirebaseData(
                                `/memberProfiles/${profile.uid}/considerLists`,
                                "id",
                                date.id
                              );
                              await addDoc(
                                collection(
                                  db,
                                  `/memberProfiles/${profile.uid}/notConsiderLists`
                                ),
                                { id: date.id }
                              );
                              dispatch(
                                setNotification("已將領養寵物新增至會員資料")
                              );
                              setTimeout(() => {
                                dispatch(setNotification(""));
                                setAdoptAnswer(-1);
                              }, 3000);
                            }}
                          >
                            確認(日後可修改)
                          </CheckAdoptBtn>
                        </AnswerBtnContainer>
                      </ConfirmToAdoptPetContainer>
                    ) : (
                      ""
                    )}
                  </AskIfAdoptPetBox>
                ) : (
                  ""
                )}
              </>
            ))}
          {openDeleteBox && datingDone.id === date.id && (
            <DeleteCheckBox>
              <DeleteCheckText>確定要取消此次約會嗎？</DeleteCheckText>
              <DeleteCheckBoxBtnContainer>
                <WarningDeleteBtn
                  onClick={async () => {
                    deleteFirebaseData(
                      `/memberProfiles/${profile.uid}/upcomingDates`,
                      "id",
                      date.id
                    );
                    const newUpcomingList = dating.upcomingDateList;
                    newUpcomingList.splice(index, 1);
                    dispatch(setUpcomingDateList(newUpcomingList));
                    dispatch(setNotification("已更新即將到來的約會清單"));
                    setTimeout(() => {
                      dispatch(setNotification(""));
                    }, 3000);
                  }}
                >
                  確定
                </WarningDeleteBtn>
                <DeleteCheckBoxBtn
                  onClick={async () => {
                    setDatingDone({
                      ...datingDone,
                      id: 0,
                    });
                    setOpenDeleteBox(false);
                  }}
                >
                  取消
                </DeleteCheckBoxBtn>
              </DeleteCheckBoxBtnContainer>
            </DeleteCheckBox>
          )}
        </UpcomingListCard>
      ))}
    </>
  );
};

export default UpcomingList;
