import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { area, shelterInfo } from "./ConstantInfo";
import { Dating } from "../../reducers/dating";
import { db } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card } from "../../reducers/dating";

const PetCard = styled.div`
  width: 400px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const PetImg = styled.img`
  width: 400px;
  height: 400px;
  object-fit: cover;
`;
const PetInfo = styled.div``;

const CloseBtn = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  background-color: #000;
`;

const InviteDatingBtn = styled.div`
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const InviteDatingBox = styled.div`
  width: 250px;
  position: absolute;
  right: 20px;
  top: 80px;
`;

const InviteDatingTitle = styled.div`
  text-align: center;
  font-weight: bold;
`;
const InviteInfoContainer = styled.div``;
const InviteInfoLabel = styled.label``;
const InviteInfoInput = styled.input``;

const ConsiderPetDetail = (props: {
  nowChosenPetIndex: number;
  setConsiderDetail: (considerDetail: Boolean) => void;
}) => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const [inviteDatingInfo, setInviteDatingInfo] = useState<{
    name: string;
    email: string;
    date: number;
  }>({ name: "", email: "", date: 0 });

  async function updateUpcomingDate(list: Card) {
    await addDoc(
      collection(
        db,
        "/memberProfiles/FUQqyfQNAeMUvFyZgLlATEGTg6V2/upcomingDates"
      ),
      {
        id: list.id,
        area: list.area,
        shleterPkid: list.shleterPkid,
        shelterName: list.shelterName,
        shelterAddress: list.shelterAddress,
        shelterTel: list.shelterTel,
        kind: list.kind,
        sex: list.sex,
        color: list.color,
        sterilization: list.sterilization,
        image: list.image,
        datingDate: inviteDatingInfo.date,
        inviter: inviteDatingInfo.name,
      }
    );
  }

  async function sendEmailToNotifyUser(list: Card) {
    emailjs.init("d3NE6N9LoE4ezwk2I");
    let templateParams = {
      to_name: inviteDatingInfo.name,
      shelterName: list.shelterName,
      petID: list.id,
      datingDate: new Date(inviteDatingInfo.date * 1000),
      reply_to: "maorongrongfluffy@gmail.com",
      userEmail: inviteDatingInfo.email,
    };

    emailjs.send("fluffy_02tfnuf", "template_ausnrq5", templateParams).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );
  }

  return (
    <>
      <PetCard>
        <PetImg
          src={dating.considerList[props.nowChosenPetIndex].image}
          alt=""
        />
        <PetInfo>{dating.considerList[props.nowChosenPetIndex].id}</PetInfo>
        <PetInfo>
          {area[dating.considerList[props.nowChosenPetIndex].area - 2]}
        </PetInfo>
        <PetInfo>
          {dating.considerList[props.nowChosenPetIndex].color}
          {dating.considerList[props.nowChosenPetIndex].kind}
        </PetInfo>
        <PetInfo>
          {dating.considerList[props.nowChosenPetIndex].sex === "M" ? "♂" : "♀"}
        </PetInfo>
        <PetInfo>
          {dating.considerList[props.nowChosenPetIndex].sterilization === "F"
            ? "尚未結紮"
            : "已結紮"}
        </PetInfo>
        <PetInfo>
          發現地點：{dating.considerList[props.nowChosenPetIndex].foundPlace}
        </PetInfo>
        <PetInfo>
          目前位於：{dating.considerList[props.nowChosenPetIndex].shelterName}
        </PetInfo>
        <PetInfo>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${
              shelterInfo.find(
                (shelter) =>
                  shelter.pkid ===
                  dating.considerList[props.nowChosenPetIndex].shleterPkid
              )?.latAndLng
            }&query_place_id=${
              shelterInfo.find(
                (shelter) =>
                  shelter.pkid ===
                  dating.considerList[props.nowChosenPetIndex].shleterPkid
              )?.placeid
            }`}
            target="_blank"
            rel="noreferrer"
          >
            {dating.considerList[props.nowChosenPetIndex].shelterAddress}
          </a>
        </PetInfo>
        <PetInfo>
          聯絡收容所：{dating.considerList[props.nowChosenPetIndex].shelterTel}
        </PetInfo>
        <CloseBtn
          onClick={() => {
            props.setConsiderDetail(false);
          }}
        >
          X
        </CloseBtn>
        <InviteDatingBtn>申請與他約會：相處體驗</InviteDatingBtn>
      </PetCard>

      <InviteDatingBox>
        <InviteDatingTitle>
          申請與 {dating.considerList[props.nowChosenPetIndex].id} 約會
        </InviteDatingTitle>
        <InviteInfoContainer>
          <InviteInfoLabel htmlFor="name">您的本名：</InviteInfoLabel>
          <InviteInfoInput
            type="text"
            id="name"
            onChange={(e) =>
              setInviteDatingInfo({ ...inviteDatingInfo, name: e.target.value })
            }
          />
        </InviteInfoContainer>
        <InviteInfoContainer>
          <InviteInfoLabel htmlFor="email">您的信箱：</InviteInfoLabel>
          <InviteInfoInput
            type="email"
            id="email"
            onChange={(e) =>
              setInviteDatingInfo({
                ...inviteDatingInfo,
                email: e.target.value,
              })
            }
          />
        </InviteInfoContainer>
        <InviteInfoContainer>
          <InviteInfoLabel htmlFor="datingTime">
            申請日期與時間：
          </InviteInfoLabel>
          <InviteInfoInput
            type="datetime-local"
            id="datingTime"
            min={`${new Date().getFullYear()}-${
              new Date().getMonth() + 1 < 10
                ? `0${new Date().getMonth() + 1}`
                : `${new Date().getMonth() + 1}`
            }-${
              new Date().getDate() < 10
                ? `0${new Date().getDate()}`
                : `${new Date().getDate()}`
            }T${new Date().getHours()}:${new Date().getMinutes()}`}
            onChange={(e) => {
              setInviteDatingInfo({
                ...inviteDatingInfo,
                date: Date.parse(e.target.value) / 1000,
              });
            }}
          />
        </InviteInfoContainer>
        <InviteDatingBtn
          onClick={async () => {
            if (
              Object.values(inviteDatingInfo).some((item) => item === "") ||
              inviteDatingInfo.date === 0
            ) {
              window.alert("請填寫完整資料以利進行申請約會體驗！");
              return;
            }
            updateUpcomingDate(dating.considerList[props.nowChosenPetIndex]);
            sendEmailToNotifyUser(dating.considerList[props.nowChosenPetIndex]);
            window.alert("申請成功！可至「即將到來的約會」查看");
          }}
        >
          送出邀請
        </InviteDatingBtn>
      </InviteDatingBox>
    </>
  );
};

export default ConsiderPetDetail;
