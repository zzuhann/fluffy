import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { db, deleteFirebaseData } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { shelterInfo } from "./constantInfo";
import { Dating } from "../../reducers/dating";
import { Profile } from "../../reducers/profile";

const UpcomingListCard = styled.div`
  display: flex;
  position: relative;
`;

const InvitePetImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
`;
const UpcomingInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const UpcomingInfo = styled.div``;

const AskIfAdoptPetBox = styled.div`
  position: absolute;
  top: 0;
  right: -250px;
  width: 220px;
  text-align: center;
`;
const AskAdoptTitle = styled.div``;
const AnswerBtnContainer = styled.div`
  display: flex;
`;
const AnswerBtn = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const ConfirmToAdoptPetContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const ConfirmTitle = styled.div``;
const ConfirmInputContainer = styled.div`
  display: flex;
`;
const ConfirmLabel = styled.label``;
const ConfirmInput = styled.input``;

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

  if (!dating.upcomingDateList) return null;
  return (
    <>
      {dating.upcomingDateList.map((date, index) => (
        <UpcomingListCard key={index}>
          <InvitePetImg src={date.image} />
          <UpcomingInfoContainer>
            <UpcomingInfo>{date.id}</UpcomingInfo>
            <UpcomingInfo>
              {date.color}
              {date.kind}({date.sex === "F" ? "♀" : "♂"})
            </UpcomingInfo>
            <UpcomingInfo>
              {date.sterilization === "T" ? "已結紮" : "未結紮"}
            </UpcomingInfo>
            <UpcomingInfo>收容所地點：{date.shelterName}</UpcomingInfo>
            <UpcomingInfo>
              地址：{" "}
              <a
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
              </a>
            </UpcomingInfo>
            <UpcomingInfo>收容所電話：{date.shelterTel}</UpcomingInfo>
            <UpcomingInfo>
              預約時間：
              {new Date(date.datingDate * 1000).getFullYear()}/
              {new Date(date.datingDate * 1000).getMonth() + 1}/
              {new Date(date.datingDate * 1000).getDate()}{" "}
              {new Date(date.datingDate * 1000).getHours()}:
              {new Date(date.datingDate * 1000).getMinutes()}
            </UpcomingInfo>
          </UpcomingInfoContainer>
          {date.datingDate * 1000 < Date.now() ? (
            <>
              <NotConsiderBtn
                onClick={() => {
                  setDatingDone({ id: date.id, open: !datingDone.open });
                  setCheckToAdoptPet(false);
                }}
              >
                已完成約會
              </NotConsiderBtn>
              {datingDone.id === date.id && datingDone.open ? (
                <AskIfAdoptPetBox>
                  <AskAdoptTitle>是否領養 {date.id} ?</AskAdoptTitle>
                  <AnswerBtnContainer>
                    <AnswerBtn
                      onClick={() => {
                        setCheckToAdoptPet(true);
                      }}
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
                      }}
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
                        <AnswerBtn
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
                        </AnswerBtn>
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
            <NotConsiderBtn
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
            </NotConsiderBtn>
          )}
        </UpcomingListCard>
      ))}
    </>
  );
};

export default UpcomingList;
