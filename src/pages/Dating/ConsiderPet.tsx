import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import emailjs from "emailjs-com";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { area, shelterInfo } from "./ConstantInfo";
import { Dating } from "../../reducers/dating";
import { db, deleteFirebaseData } from "../../utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { Card, InviteDating } from "../../reducers/dating";
import { setConsiderList } from "../../functions/datingReducerFunction";
import { Profile } from "../../reducers/profile";
import cutEgg from "./img/scissors.png";
import findplace from "./img/loupe.png";
import shelter from "./img/animal-shelter.png";
import googlemap from "./img/placeholder.png";
import tel from "./img/telephone.png";
import { Btn } from "../ProfileSetting/UserInfos";
import close from "./img/close.png";
import { CalendarContainer } from "../ProfileSetting/PetDiary";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  DeleteCheckBox,
  DeleteCheckText,
  DeleteCheckBoxBtnContainer,
  DeleteCheckBoxBtn,
  WarningDeleteBtn,
} from "../ProfileSetting/OwnPetInfo";
import { setNotification } from "../../functions/profileReducerFunction";

const ConsiderPetCalendarContainer = styled(CalendarContainer)`
  margin-left: 0;
  .react-calendar__month-view__weekdays__weekday {
    font-weight: bold;
    font-size: 8px;
  }
  .react-calendar__navigation {
    padding: 5px;
    button {
      min-width: 20px;
    }
  }
  .react-calendar__month-view__days__day {
    font-size: 12px;
  }
  .react-calendar__viewContainer {
    padding-left: 5px;
    padding-right: 5px;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #d1cfcf;
  }
  .react-calendar__tile:disabled,
  .react-calendar__navigation button:disabled {
    background-color: #fff;
    color: #ececec;
  }
  .react-calendar__tile {
    padding: 4px;
  }
  .react-calendar__tile--now {
    background-color: #fff;
  }
  .react-calendar__tile--active {
    background-color: #efefef;
  }
  @media (max-width: 654px) {
    width: 100%;
  }
  @media (max-width: 495px) {
    margin-left: 0;
    margin-top: 0;
  }
`;

const TimeBtnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TimeBtn = styled(Btn)<{ $isActive: boolean }>`
  position: relative;
  flex: 1;
  padding: 5px;
  margin-right: 15px;
  margin-top: 5px;
  font-size: 16px;
  background-color: ${(props) => (props.$isActive ? "#d1cfcf" : "#fff")};
  &:nth-child(2n) {
    margin-right: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

const PetCard = styled.div<{ $Top: number }>`
  width: 350px;
  /* height: 680px; */
  border-radius: 10px;
  overflow: hidden;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  left: 50%;
  top: ${(props) => props.$Top - 40}px;
  transform: translateX(-50%);
  box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.7);
  z-index: 2501;
  padding-bottom: 50px;
`;

const BlackMask = styled.div<{
  $isActive: boolean;
  $Height: number;
}>`
  opacity: ${(props) => (props.$isActive ? "1" : "0")};
  overflow-y: hidden;
  transition: 0.3s;
  position: fixed;
  background-color: transparent;
  width: 100%;
  top: 0;
  left: 0;
  height: ${(props) => props.$Height}px;
  z-index: ${(props) => (props.$isActive ? "2500" : "0")};
`;

const PetImg = styled.img`
  width: 350px;
  height: 350px;
  object-fit: cover;
`;
const PetInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  letter-spacing: 1px;
`;
const InfoTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const PetInfoImgContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PetInfoImg = styled.img`
  width: 20px;
  height: 20px;
`;
const PetInfo = styled.div`
  font-size: 16px;
  margin-left: 5px;
  line-height: 20px;
  word-break: break-all;
`;

const PetInfoWarning = styled(PetInfo)`
  color: #b54745;
  margin-left: 0;
`;

const PetShelterAddress = styled.a`
  color: #db5452;
`;

const CloseBtn = styled(Btn)`
  top: 15px;
  right: 15px;
  color: #fff;
  border: solid 3px #fff;
  &:hover {
    border: solid 3px #d1cfcf;
  }
`;

const InviteDatingBtn = styled(Btn)`
  bottom: 18px;
  left: 10px;
  padding: 5px 5px;
  width: 220px;
  font-size: 16px;
`;

const NotCondiserBtn = styled(Btn)`
  bottom: 18px;
  right: 10px;
  padding: 5px 5px;
  font-size: 16px;
`;
const MeetingBtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MeetingWayBtn = styled(Btn)<{ $isActive: boolean }>`
  position: relative;
  flex: 1;
  margin-right: 20px;
  padding: 5px 10px;
  background-color: ${(props) => (props.$isActive ? "#B7B0A8" : "#fff")};
  color: ${(props) => (props.$isActive ? "#3c3c3c" : "#737373")};
  &:last-child {
    margin-right: 0;
  }
`;

const InviteDatingBox = styled.div<{ $Top: number }>`
  width: 250px;
  position: absolute;
  right: 100px;
  top: ${(props) => props.$Top - 40}px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  letter-spacing: 1.5px;
  z-index: 2502;
`;

const InviteDatingTitle = styled.div`
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
`;
const InviteInfoContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;
const InviteInfoLabel = styled.label`
  margin-bottom: 5px;
`;
const InviteInfoInput = styled.input`
  border: 2px solid #d1cfcf;
  border-radius: 5px;
  padding: 10px 15px;
`;

const CloseInviteBoxBtn = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
`;

const ConsiderPetCard = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  bottom: 0;
  transition: 0.3s;
  &:hover {
    bottom: 3px;
    box-shadow: 2px 2px 3px 4px rgba(0, 0, 0, 0.2);
  }
`;

const ConsiderImgMask = styled.div`
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 69%,
    rgba(0, 0, 0, 0.8) 100%
  );
  width: 100%;
  height: 100%;
`;

const ConsiderImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const ConsiderTitle = styled.div`
  position: absolute;
  color: #fff;
  letter-spacing: 1.5px;
  left: 10px;
  bottom: 10px;
`;

const SendInviteBtn = styled(Btn)`
  font-size: 16px;
  position: relative;
  width: 100px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -5px;
`;

const ConsiderDeleteBox = styled(DeleteCheckBox)`
  width: 320px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: solid 3px #d1cfcf;
  padding: 20px 25px;
  font-size: 18px;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  @media (max-width: 605px) {
    font-size: 18px;
    width: 350px;
  } ;
`;

type ConsiderSingleCard = {
  setNowChosenPetIndex: (value: number) => void;
  setConsiderDetail: (value: Boolean) => void;
  tab: string;
  considerDetail: Boolean;
  nowChosenPetIndex: number;
  setDatingQty: Dispatch<SetStateAction<number>>;
};

export const ConsiderEverySinglePetCard: React.FC<ConsiderSingleCard> = (
  props
) => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [scroll, setScroll] = useState<number>(0);

  useEffect(() => {
    if (!props.considerDetail) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [props.considerDetail]);

  function handleScroll() {
    let scrollTop = document.documentElement.scrollTop;
    setScroll(scrollTop);
  }

  if (!dating.considerList) return null;
  return (
    <>
      {dating.considerList.map((pet, index) => (
        <ConsiderPetCard
          key={index}
          onClick={() => {
            props.setNowChosenPetIndex(index);
            props.setConsiderDetail(true);
          }}
        >
          <ConsiderImgMask></ConsiderImgMask>
          <ConsiderImg src={pet.image} />
          <ConsiderTitle>
            {area[Number(pet.area) - 2]}
            {pet.color}
            {pet.kind}
          </ConsiderTitle>
        </ConsiderPetCard>
      ))}
      {props.considerDetail ? (
        <ConsiderPetDetail
          nowChosenPetIndex={props.nowChosenPetIndex}
          setConsiderDetail={props.setConsiderDetail}
          considerDetail={props.considerDetail}
          scroll={scroll}
          setDatingQty={props.setDatingQty}
        />
      ) : (
        ""
      )}
    </>
  );
};

const ConsiderPetDetail = (props: {
  nowChosenPetIndex: number;
  setConsiderDetail: (considerDetail: Boolean) => void;
  considerDetail: Boolean;
  scroll: number;
  setDatingQty: Dispatch<SetStateAction<number>>;
}) => {
  const dating = useSelector<{ dating: Dating }>(
    (state) => state.dating
  ) as Dating;
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [inviteDatingInfo, setInviteDatingInfo] = useState<{
    name: string;
    email: string;
    date: Date | string;
    time: string;
    dateAndTime: number;
    way: string;
  }>({ name: "", email: "", date: "", time: "", dateAndTime: 0, way: "實體" });
  const [inviteBoxOpen, setInviteBoxOpen] = useState<Boolean>(false);
  const [timeSelect, setTimeSelect] = useState([
    "14:00",
    "14:30",
    "15:00",
    "15:30",
  ]);
  const [timeIndex, setTimeIndex] = useState<number>(-1);
  const [pageHigh, setPageHigh] = useState<number>(0);
  const [repeatInvite, setRepeatInvite] = useState(false);
  const [incompleteInfo, setIncompleteInfo] = useState(false);
  const [openDeleteBox, setOpenDeleteBox] = useState(false);
  const [meetingWay, setMeetingWay] = useState("實體");
  const [shelterDates, setShelterDates] = useState<InviteDating[]>();
  const [nowNoTimeSelect, setNowNoTimeSelect] = useState(false);

  useEffect(() => {
    window.addEventListener("click", togglePageHeight);
    return () => window.removeEventListener("scroll", togglePageHeight);
  }, []);

  useEffect(() => {
    getShelterUpcomingDates();
  }, []);

  function isSameDate(year: number, month: number, day: number) {
    const sameDate: InviteDating[] = [];
    shelterDates?.forEach((date) => {
      if (
        new Date(date.datingDate).getFullYear() === year &&
        new Date(date.datingDate).getMonth() + 1 === month &&
        new Date(date.datingDate).getDate() === day
      ) {
        sameDate.push(date);
      }
    });

    filterDateTime(sameDate);
    return sameDate;
  }

  function filterDateTime(thatDayDate: InviteDating[]) {
    const dateTime: string[] = [];
    thatDayDate.forEach((date) => {
      dateTime.push(date.time);
    });

    if (dateTime.length > 0) {
      const newTimeSelect = timeSelect.filter((e) =>
        dateTime.indexOf(e) > -1 ? false : true
      );
      setTimeSelect(newTimeSelect);
      if (dateTime.length === 4) {
        setNowNoTimeSelect(true);
      }
    } else {
      setTimeSelect(["14:00", "14:30", "15:00", "15:30"]);
    }
  }

  function togglePageHeight() {
    let pageHeight = document.documentElement.offsetHeight;
    setPageHigh(pageHeight);
  }

  async function getShelterUpcomingDates() {
    let upcomingDate: InviteDating[] = [];
    const q = query(
      collection(db, `/governmentDatings/OB5pxPMXvKfglyETMnqh/upcomingDates`),
      orderBy("datingDate")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      upcomingDate.push({
        ...info.data(),
        datingDate: info.data().dateAndTime,
      } as InviteDating);
    });
    setShelterDates(upcomingDate);
  }

  async function updateUpcomingDate(list: Card) {
    await addDoc(
      collection(db, `/memberProfiles/${profile.uid}/upcomingDates`),
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
        time: inviteDatingInfo.time,
        way: inviteDatingInfo.way,
        dateAndTime: inviteDatingInfo.dateAndTime,
        doneWithMeeting: false,
      }
    );
  }

  async function updateShelterUpcomingDate(list: Card) {
    await addDoc(
      collection(db, `/governmentDatings/OB5pxPMXvKfglyETMnqh/upcomingDates`),
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
        time: inviteDatingInfo.time,
        way: inviteDatingInfo.way,
        dateAndTime: inviteDatingInfo.dateAndTime,
        doneWithMeeting: false,
      }
    );
  }

  async function sendEmailToNotifyUser(list: Card) {
    emailjs.init("d3NE6N9LoE4ezwk2I");
    let templateParams = {
      to_name: inviteDatingInfo.name,
      shelterName: list.shelterName,
      petID: list.id,
      datingDate: `${new Date(inviteDatingInfo.date).getFullYear()}/
                  ${new Date(inviteDatingInfo.date).getMonth() + 1}/
                  ${new Date(inviteDatingInfo.date).getDate()}${" "}
                  ${inviteDatingInfo.time}`,
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
      <BlackMask
        $isActive={props.considerDetail === true}
        $Height={props.considerDetail ? pageHigh : 0}
        onClick={() =>
          props.considerDetail
            ? props.setConsiderDetail(false)
            : props.setConsiderDetail(true)
        }
      />
      <PetCard $Top={props.scroll}>
        <PetImg
          src={dating.considerList[props.nowChosenPetIndex].image}
          alt=""
        />
        <PetInfoContainer>
          <InfoTitle>
            {dating.considerList[props.nowChosenPetIndex].id} /{" "}
            {dating.considerList[props.nowChosenPetIndex].color}
            {dating.considerList[props.nowChosenPetIndex].kind}
            {dating.considerList[props.nowChosenPetIndex].sex === "M"
              ? "♂"
              : "♀"}
          </InfoTitle>
          <PetInfoImgContainer>
            <PetInfoImg src={cutEgg} />
            <PetInfo>
              結紮狀態:
              {dating.considerList[props.nowChosenPetIndex].sterilization ===
              "F"
                ? "尚未結紮"
                : "已結紮"}
            </PetInfo>
          </PetInfoImgContainer>
          <PetInfoImgContainer>
            <PetInfoImg src={findplace} />
            <PetInfo>
              發現地點:
              {dating.considerList[props.nowChosenPetIndex].foundPlace}
            </PetInfo>
          </PetInfoImgContainer>
          <PetInfoImgContainer>
            <PetInfoImg src={shelter} />
            <PetInfo>
              目前位於:
              {dating.considerList[props.nowChosenPetIndex].shelterName}
            </PetInfo>
          </PetInfoImgContainer>
          <PetInfoImgContainer>
            <PetInfoImg src={googlemap} />
            <PetInfo>
              <PetShelterAddress
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
              </PetShelterAddress>
            </PetInfo>
          </PetInfoImgContainer>
          <PetInfoImgContainer>
            <PetInfoImg src={tel} />
            <PetInfo>
              聯絡收容所:
              {dating.considerList[props.nowChosenPetIndex].shelterTel}
            </PetInfo>
          </PetInfoImgContainer>
          {repeatInvite && (
            <PetInfoWarning>
              已在「即將到來的約會」清單中，無法重複申請！
            </PetInfoWarning>
          )}
        </PetInfoContainer>

        <CloseBtn
          onClick={() => {
            props.setConsiderDetail(false);
          }}
        >
          關閉
        </CloseBtn>
        <InviteDatingBtn
          onClick={() => {
            if (
              dating.upcomingDateList.find(
                (date) =>
                  date.id === dating.considerList[props.nowChosenPetIndex].id
              )
            ) {
              setRepeatInvite(true);
              return;
            }
            setInviteBoxOpen(true);
            setInviteDatingInfo({
              ...inviteDatingInfo,
              name: profile.name,
              email: profile.email,
            });
          }}
        >
          申請與他約會: 相處體驗
        </InviteDatingBtn>
        <NotCondiserBtn
          onClick={async () => {
            setOpenDeleteBox(true);
          }}
        >
          不考慮領養
        </NotCondiserBtn>
        {openDeleteBox && (
          <ConsiderDeleteBox>
            <DeleteCheckText>確定從考慮領養清單移除嗎？</DeleteCheckText>
            <DeleteCheckText>若有約會，將會連同約會一起刪除</DeleteCheckText>
            <DeleteCheckBoxBtnContainer>
              <WarningDeleteBtn
                onClick={async () => {
                  deleteFirebaseData(
                    `/memberProfiles/${profile.uid}/considerLists`,
                    "id",
                    dating.considerList[props.nowChosenPetIndex].id
                  );
                  deleteFirebaseData(
                    `/memberProfiles/${profile.uid}/upcomingDates`,
                    "id",
                    dating.considerList[props.nowChosenPetIndex].id
                  );
                  await addDoc(
                    collection(
                      db,
                      `/memberProfiles/${profile.uid}/notConsiderLists`
                    ),
                    { id: dating.considerList[props.nowChosenPetIndex].id }
                  );
                  const newConsiderList = dating.considerList;
                  newConsiderList.splice(props.nowChosenPetIndex, 1);
                  dispatch(setConsiderList(newConsiderList));
                  props.setConsiderDetail(false);
                  dispatch(setNotification("已更新考慮領養清單"));
                  setTimeout(() => {
                    dispatch(setNotification(""));
                  }, 3000);
                }}
              >
                確定
              </WarningDeleteBtn>
              <DeleteCheckBoxBtn
                onClick={() => {
                  setOpenDeleteBox(false);
                }}
              >
                取消
              </DeleteCheckBoxBtn>
            </DeleteCheckBoxBtnContainer>
          </ConsiderDeleteBox>
        )}
      </PetCard>
      {inviteBoxOpen ? (
        <InviteDatingBox $Top={props.scroll}>
          <InviteDatingTitle>
            申請與 {dating.considerList[props.nowChosenPetIndex].id} 約會
          </InviteDatingTitle>
          <InviteInfoContainer>
            <InviteInfoLabel htmlFor="name">您的本名：</InviteInfoLabel>
            <InviteInfoInput
              value={inviteDatingInfo.name}
              type="text"
              id="name"
              onChange={(e) =>
                setInviteDatingInfo({
                  ...inviteDatingInfo,
                  name: e.target.value,
                })
              }
            />
          </InviteInfoContainer>
          <InviteInfoContainer>
            <InviteInfoLabel htmlFor="email">您的信箱：</InviteInfoLabel>
            <InviteInfoInput
              value={inviteDatingInfo.email}
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
          {dating.considerList[props.nowChosenPetIndex].shelterName ===
            "臺北市動物之家" && (
            <MeetingBtnContainer>
              <MeetingWayBtn
                $isActive={meetingWay === "實體"}
                onClick={() => {
                  setMeetingWay("實體");
                  setTimeSelect(["14:00", "14:30", "15:00", "15:30"]);
                  setInviteDatingInfo({ ...inviteDatingInfo, way: "實體" });
                  setNowNoTimeSelect(false);
                }}
              >
                實體
              </MeetingWayBtn>
              <MeetingWayBtn
                $isActive={meetingWay === "視訊"}
                onClick={() => {
                  setMeetingWay("視訊");
                  setInviteDatingInfo({ ...inviteDatingInfo, way: "視訊" });
                  if (inviteDatingInfo.date) {
                    setNowNoTimeSelect(false);
                    isSameDate(
                      new Date(inviteDatingInfo.date).getFullYear(),
                      new Date(inviteDatingInfo.date).getMonth() + 1,
                      new Date(inviteDatingInfo.date).getDate()
                    );
                  }
                }}
              >
                視訊
              </MeetingWayBtn>
            </MeetingBtnContainer>
          )}

          <InviteInfoContainer>
            <InviteInfoLabel htmlFor="datingTime">
              申請日期與時間：
            </InviteInfoLabel>
            <ConsiderPetCalendarContainer>
              <Calendar
                minDate={new Date()}
                onClickDay={(value) => {
                  setNowNoTimeSelect(false);
                  setInviteDatingInfo({
                    ...inviteDatingInfo,
                    date: value,
                  });
                  if (meetingWay === "視訊") {
                    isSameDate(
                      value.getFullYear(),
                      value.getMonth() + 1,
                      value.getDate()
                    );
                  }
                }}
              />
            </ConsiderPetCalendarContainer>
            {inviteDatingInfo.date && (
              <TimeBtnContainer>
                {timeSelect.map((time, index) => (
                  <TimeBtn
                    $isActive={timeIndex === index}
                    key={index}
                    onClick={() => {
                      setTimeIndex(index);
                      setInviteDatingInfo({
                        ...inviteDatingInfo,
                        time: timeSelect[index],
                        dateAndTime: (inviteDatingInfo.date as Date).setHours(
                          Number(timeSelect[index].split(":")[0]),
                          0
                        ),
                      });
                    }}
                  >
                    {time}
                  </TimeBtn>
                ))}
              </TimeBtnContainer>
            )}

            {incompleteInfo && (
              <PetInfoWarning>請填寫完整資料以利進行約會申請</PetInfoWarning>
            )}
          </InviteInfoContainer>
          {nowNoTimeSelect ? (
            <PetInfoWarning>
              此日期已無可預約時間，請選擇其他日期
            </PetInfoWarning>
          ) : (
            <SendInviteBtn
              onClick={async () => {
                if (
                  Object.values(inviteDatingInfo).some((item) => item === "")
                ) {
                  setIncompleteInfo(true);
                  return;
                }
                updateUpcomingDate(
                  dating.considerList[props.nowChosenPetIndex]
                );
                if (meetingWay === "視訊") {
                  updateShelterUpcomingDate(
                    dating.considerList[props.nowChosenPetIndex]
                  );
                }
                sendEmailToNotifyUser(
                  dating.considerList[props.nowChosenPetIndex]
                );
                props.setDatingQty((prev) => prev + 1);
                setInviteBoxOpen(false);
                dispatch(
                  setNotification("申請成功！可至「即將到來的約會」查看")
                );
                setTimeout(() => {
                  dispatch(setNotification(""));
                }, 3000);
              }}
            >
              送出邀請
            </SendInviteBtn>
          )}

          <CloseInviteBoxBtn
            onClick={() => {
              setInviteBoxOpen(false);
            }}
            src={close}
          />
        </InviteDatingBox>
      ) : (
        ""
      )}
    </>
  );
};

export default ConsiderPetDetail;
