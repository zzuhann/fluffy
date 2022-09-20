import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { db, deleteFirebaseData } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { shelterInfo } from "./constantInfo";
import { Dating } from "../../reducers/dating";
import { Profile } from "../../reducers/profile";
import cutEgg from "./img/scissors.png";
import shelter from "./img/animal-shelter.png";
import googlemap from "./img/placeholder.png";
import tel from "./img/telephone.png";
import clock from "./img/clock.png";
import close from "./img/close.png";
import { Btn } from "../ProfileSetting/UserInfos";

const UpcomingListCard = styled.div`
  display: flex;
  position: relative;
  border-radius: 5px;
  margin-bottom: 20px;
  border: solid 2px #d1cfcf;
`;

const InvitePetImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  object-position: center;
`;
const UpcomingInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  letter-spacing: 1.5px;
  justify-content: center;
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
`;

const UpcomingInfoTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;
const UpcomingInfo = styled.div`
  margin-left: 15px;
`;

const PetShelterAddress = styled.a`
  color: #952f04;
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
    bottom: 160px;
    padding: 5px 10px;
  }
  @media (max-width: 630px) {
    bottom: 10px;
    left: 5px;
    right: auto;
    background-color: #aca8a8;
    color: #fff;
    font-size: 12px;
    padding: 5px;
  }
`;

type Props = {
  getUpcomingListData: () => void;
};

const UpcomingList: React.FC<Props> = (props) => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  // const dispatch = useDispatch();
  const [checkToAdoptPet, setCheckToAdoptPet] = useState<Boolean>(false);
  const [datingDone, setDatingDone] = useState<{ id: number; open: Boolean }>({
    id: 0,
    open: false,
  });
  const [adoptPetInfo, setAdoptPetInfo] = useState<{
    name: string;
    birthYear: number;
  }>({ name: "", birthYear: 0 });
  const [adoptAnswer, setAdoptAnswer] = useState<number>(-1);

  if (!dating.upcomingDateList) return null;
  return (
    <>
      {dating.upcomingDateList.map((date, index) => (
        <UpcomingListCard key={index}>
          <InvitePetImg src={date.image} />
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
              <UpcomingInfoImg src={clock} />
              <UpcomingInfo>
                預約時間：
                {new Date(date.datingDate * 1000).getFullYear()}/
                {new Date(date.datingDate * 1000).getMonth() + 1 < 10
                  ? `0${new Date(date.datingDate * 1000).getMonth() + 1}`
                  : new Date(date.datingDate * 1000).getMonth() + 1}
                /
                {new Date(date.datingDate * 1000).getDate() < 10
                  ? `0${new Date(date.datingDate * 1000).getDate()}`
                  : new Date(date.datingDate * 1000).getDate()}{" "}
                {new Date(date.datingDate * 1000).getHours() < 10
                  ? `0${new Date(date.datingDate * 1000).getHours()}`
                  : new Date(date.datingDate * 1000).getHours()}
                :
                {new Date(date.datingDate * 1000).getMinutes() < 10
                  ? `0${new Date(date.datingDate * 1000).getMinutes()}`
                  : new Date(date.datingDate * 1000).getMinutes()}
              </UpcomingInfo>
            </UpcomingInfoImgContainer>
          </UpcomingInfoContainer>
          {date.datingDate * 1000 < Date.now() ? (
            <>
              <DatingDoneBtn
                onClick={() => {
                  setDatingDone({ id: date.id, open: !datingDone.open });
                  setCheckToAdoptPet(false);
                }}
              >
                已完成約會
              </DatingDoneBtn>
              {datingDone.id === date.id && datingDone.open ? (
                <AskIfAdoptPetBox>
                  <CloseAdoptBtn
                    src={close}
                    onClick={() => setDatingDone({ id: 0, open: false })}
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
                        window.alert("好ㄛ🙆");
                        props.getUpcomingListData();
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
                          onChange={(e) =>
                            setAdoptPetInfo({
                              ...adoptPetInfo,
                              name: e.target.value,
                            })
                          }
                        ></ConfirmInput>
                      </ConfirmInputContainer>
                      <ConfirmInputContainer>
                        <ConfirmLabel htmlFor="year">出生年</ConfirmLabel>
                        <ConfirmInput
                          type="number"
                          id="year"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={new Date().getFullYear()}
                          onChange={(e) =>
                            setAdoptPetInfo({
                              ...adoptPetInfo,
                              birthYear: Number(e.target.value),
                            })
                          }
                        ></ConfirmInput>
                      </ConfirmInputContainer>
                      <AnswerBtnContainer>
                        <CheckAdoptBtn
                          onClick={async () => {
                            if (
                              !adoptPetInfo.name &&
                              adoptPetInfo.birthYear === 0
                            ) {
                              window.alert("請填寫完整資訊！");
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
                                image: date.image,
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
                            window.alert("已將領養寵物新增至您的會員資料！");
                            props.getUpcomingListData();
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
                deleteFirebaseData(
                  `/memberProfiles/${profile.uid}/upcomingDates`,
                  "id",
                  date.id
                );
                props.getUpcomingListData();
              }}
            >
              取消此次約會
            </DatingDoneBtn>
          )}
        </UpcomingListCard>
      ))}
    </>
  );
};

export default UpcomingList;
