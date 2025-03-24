'use client'

import type { Dispatch, SetStateAction } from 'react'
import type { Card, Dating, InviteDating } from '../../../reducers/dating'
import type { Profile } from '../../../reducers/profile'
import emailjs from 'emailjs-com'
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore'
import shelter from 'public/img/animal-shelter.png'
import close from 'public/img/close.png'
import findplace from 'public/img/loupe.png'
import googlemap from 'public/img/placeholder.png'
import cutEgg from 'public/img/scissors.png'
import tel from 'public/img/telephone.png'
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { BlackMask } from '../../../component/Header'
import { useNotifyDispatcher } from '../../../component/SidebarNotify'
import {
  setConsiderList,
  setUpcomingDateList,
} from '../../../functions/datingReducerFunction'
import { area, shelterInfo } from '../../../utils/ConstantInfo'
import { db, deleteFirebaseData } from '../../../utils/firebase'
import { CalendarContainer } from '../../profile/components/PetDiary'
import { Btn } from '../../profile/components/UserInfos'
import {
  DeleteCheckBox,
  DeleteCheckBoxBtn,
  DeleteCheckBoxBtnContainer,
  DeleteCheckText,
  WarningDeleteBtn,
} from '../../profile/components/UserOwnPetInfos'
import 'react-calendar/dist/Calendar.css'

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
`

const TimeBtnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const TimeBtn = styled(Btn)<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-basis: 45%;
  padding: 3px;
  margin-right: 15px;
  margin-top: 5px;
  font-size: 16px;
  background-color: ${props => (props.$isActive ? '#d1cfcf' : '#fff')};
  &:nth-child(2n) {
    margin-right: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`

const PetCard = styled.div`
  width: 350px;
  border-radius: 10px;
  overflow: hidden;
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  left: 50%;
  top: 15vh;
  transform: translateX(-50%);
  z-index: 2502;
  padding-bottom: 50px;
`

const PetImg = styled.img`
  width: 350px;
  height: 300px;
  object-fit: cover;
`
const PetInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  letter-spacing: 1px;
`
const InfoTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`

const PetInfoImgContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const PetInfoImg = styled.img`
  width: 20px;
  height: 20px;
`
const PetInfo = styled.div`
  font-size: 16px;
  margin-left: 5px;
  line-height: 20px;
  word-break: break-all;
`

const PetInfoWarning = styled(PetInfo)`
  color: #b54745;
  margin-left: 0;
`

const PetShelterAddress = styled.a`
  color: #db5452;
`

const CloseBtn = styled(Btn)`
  top: 15px;
  right: 15px;
  color: #fff;
  border: solid 3px #fff;
  &:hover {
    border: solid 3px #d1cfcf;
  }
`

const InviteDatingBtn = styled(Btn)`
  bottom: 18px;
  left: 10px;
  padding: 5px 5px;
  width: 220px;
  font-size: 16px;
`

const NotCondiserBtn = styled(Btn)`
  bottom: 18px;
  right: 10px;
  padding: 5px 5px;
  font-size: 16px;
`
const MeetingBtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

const MeetingWayBtn = styled(Btn)<{ $isActive: boolean }>`
  position: relative;
  flex: 1;
  margin-right: 20px;
  padding: 5px 10px;
  background-color: ${props => (props.$isActive ? '#B7B0A8' : '#fff')};
  color: ${props => (props.$isActive ? '#3c3c3c' : '#737373')};
  &:last-child {
    margin-right: 0;
  }
`

const InviteDatingBox = styled.div`
  width: 250px;
  position: fixed;
  left: 65%;
  top: 10vh;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  letter-spacing: 1.5px;
  z-index: 2502;
  @media (max-width: 766px) {
    right: 50px;
    left: auto;
  } ;
`

const InviteDatingTitle = styled.div`
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
`
const InviteInfoContainer = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
`
const InviteInfoLabel = styled.label`
  margin-bottom: 5px;
`
const InviteInfoInput = styled.input`
  border: 2px solid #d1cfcf;
  border-radius: 5px;
  padding: 5px;
`

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
`

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
`

const ConsiderImgMask = styled.div`
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 69%,
    rgba(0, 0, 0, 0.8) 100%
  );
  width: 100%;
  height: 100%;
`

const ConsiderImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`

const ConsiderTitle = styled.div`
  position: absolute;
  color: #fff;
  letter-spacing: 1.5px;
  left: 10px;
  bottom: 10px;
`

const SendInviteBtn = styled(Btn)`
  font-size: 16px;
  position: relative;
  width: 100px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -5px;
`

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
`

interface ConsiderSingleCard {
  setNowChosenPetIndex: (value: number) => void
  setConsiderDetail: (value: boolean) => void
  tab: string
  considerDetail: boolean
  nowChosenPetIndex: number
  getUpcomingListData: () => void
}

export const ConsiderEverySinglePetCard: React.FC<ConsiderSingleCard> = (
  props,
) => {
  const dating = useSelector<{ dating: Dating }>(
    state => state.dating,
  ) as Dating

  useEffect(() => {
    props.getUpcomingListData()
  }, [])

  if (!dating.considerList)
    return null
  return (
    <>
      {dating.considerList.map((pet, index) => (
        <ConsiderPetCard
          key={index}
          onClick={() => {
            props.setNowChosenPetIndex(index)
            props.setConsiderDetail(true)
          }}
        >
          <ConsiderImgMask />
          <ConsiderImg src={pet.image} alt="pet" />
          <ConsiderTitle>
            {area[Number(pet.area) - 2]}
            {pet.color}
            {pet.kind}
          </ConsiderTitle>
        </ConsiderPetCard>
      ))}
    </>
  )
}

function ConsiderPetDetail(props: {
  nowChosenPetIndex: number
  setConsiderDetail: (considerDetail: boolean) => void
  considerDetail: boolean
  setDatingArr: Dispatch<SetStateAction<number[]>>
  datingArr: number[]
}) {
  const dating = useSelector<{ dating: Dating }>(
    state => state.dating,
  ) as Dating
  const profile = useSelector<{ profile: Profile }>(
    state => state.profile,
  ) as Profile
  const dispatch = useDispatch()
  const notifyDispatcher = useNotifyDispatcher()
  const [inviteDatingInfo, setInviteDatingInfo] = useState<{
    name: string
    email: string
    date: Date | string
    time: string
    dateAndTime: number
    way: string
  }>({ name: '', email: '', date: '', time: '', dateAndTime: 0, way: '實體' })
  const [inviteBoxOpen, setInviteBoxOpen] = useState<boolean>(false)
  const [timeSelect, setTimeSelect] = useState([
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    'Right Now',
  ])
  const [timeIndex, setTimeIndex] = useState<number>(-1)
  const [repeatInvite, setRepeatInvite] = useState(false)
  const [incompleteInfo, setIncompleteInfo] = useState(false)
  const [openDeleteBox, setOpenDeleteBox] = useState(false)
  const [meetingWay, setMeetingWay] = useState('實體')
  const [shelterDates, setShelterDates] = useState<InviteDating[]>()
  const [nowNoTimeSelect, setNowNoTimeSelect] = useState(false)

  useEffect(() => {
    async function getShelterUpcomingDates() {
      const upcomingDate: InviteDating[] = []
      const q = query(
        collection(db, `/governmentDatings/OB5pxPMXvKfglyETMnqh/upcomingDates`),
        orderBy('datingDate'),
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((info) => {
        upcomingDate.push({
          ...info.data(),
          datingDate: info.data().dateAndTime,
        } as InviteDating)
      })
      setShelterDates(upcomingDate)
    }
    getShelterUpcomingDates()
  }, [])

  function isSameDate(year: number, month: number, day: number) {
    const sameDate: InviteDating[] = []
    shelterDates?.forEach((date) => {
      if (
        new Date(date.datingDate).getFullYear() === year
          && new Date(date.datingDate).getMonth() + 1 === month
          && new Date(date.datingDate).getDate() === day
      ) {
        sameDate.push(date)
      }
    })

    filterDateTime(sameDate, year, month, day)
    return sameDate
  }

  function filterDateTime(
    thatDayDate: InviteDating[],
    year: number,
    month: number,
    day: number,
  ) {
    const dateTime: string[] = []
    thatDayDate.forEach((date) => {
      dateTime.push(date.time)
    })
    if (
      year === new Date().getFullYear()
      && day === new Date().getDate()
      && month === new Date().getMonth() + 1
    ) {
      if (dateTime.length > 0) {
        const newTimeSelect = [
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          'Right Now',
        ].filter(e => (!dateTime.includes(e)))
        setTimeSelect(newTimeSelect)
        if (dateTime.length === 4) {
          setNowNoTimeSelect(true)
        }
      }
      else {
        setTimeSelect(['14:00', '14:30', '15:00', '15:30', 'Right Now'])
      }
    }
    else {
      if (dateTime.length > 0) {
        const newTimeSelect = ['14:00', '14:30', '15:00', '15:30'].filter(e =>
          !dateTime.includes(e),
        )
        setTimeSelect(newTimeSelect)
        if (dateTime.length === 4) {
          setNowNoTimeSelect(true)
        }
      }
      else {
        setTimeSelect(['14:00', '14:30', '15:00', '15:30'])
      }
    }
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
      },
    )
  }

  function updateUpcomingDateState(list: Card) {
    const newUpcomingDate = [...dating.upcomingDateList]
    newUpcomingDate.push({
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
      datingDate: inviteDatingInfo.date as Date,
      inviter: inviteDatingInfo.name,
      time: inviteDatingInfo.time,
      way: inviteDatingInfo.way,
      doneWithMeeting: false,
    })
    dispatch(setUpcomingDateList(newUpcomingDate))
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
      },
    )
  }

  async function sendEmailToNotifyUser(list: Card) {
    emailjs.init('d3NE6N9LoE4ezwk2I')
    const templateParams = {
      to_name: inviteDatingInfo.name,
      shelterName: list.shelterName,
      petID: list.id,
      datingDate: `${new Date(inviteDatingInfo.date).getFullYear()}/
                  ${new Date(inviteDatingInfo.date).getMonth() + 1}/
                  ${new Date(inviteDatingInfo.date).getDate()}${' '}
                  ${inviteDatingInfo.time}`,
      reply_to: 'maorongrongfluffy@gmail.com',
      userEmail: inviteDatingInfo.email,
    }

    emailjs.send('fluffy_02tfnuf', 'template_ausnrq5', templateParams).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text)
      },
      (error) => {
        console.log('FAILED...', error)
      },
    )
  }

  return (
    <>
      <BlackMask $isActive={props.considerDetail as boolean} />
      <PetCard>
        <PetImg
          src={dating.considerList[props.nowChosenPetIndex].image}
          alt="pet"
        />
        <PetInfoContainer>
          <InfoTitle>
            {dating.considerList[props.nowChosenPetIndex].id}
            {' '}
            /
            {' '}
            {dating.considerList[props.nowChosenPetIndex].color}
            {dating.considerList[props.nowChosenPetIndex].kind}
            {dating.considerList[props.nowChosenPetIndex].sex === 'M'
              ? '♂'
              : '♀'}
          </InfoTitle>
          <PetInfoImgContainer>
            <PetInfoImg src={cutEgg.src} alt="sterilization" />
            <PetInfo>
              結紮狀態:
              {dating.considerList[props.nowChosenPetIndex].sterilization
                === 'F'
                ? '尚未結紮'
                : '已結紮'}
            </PetInfo>
          </PetInfoImgContainer>
          <PetInfoImgContainer>
            <PetInfoImg src={findplace.src} alt="place" />
            <PetInfo>
              發現地點:
              {dating.considerList[props.nowChosenPetIndex].foundPlace}
            </PetInfo>
          </PetInfoImgContainer>
          <PetInfoImgContainer>
            <PetInfoImg src={shelter.src} alt="shelter" />
            <PetInfo>
              目前位於:
              {dating.considerList[props.nowChosenPetIndex].shelterName}
            </PetInfo>
          </PetInfoImgContainer>
          <PetInfoImgContainer>
            <PetInfoImg src={googlemap.src} alt="map" />
            <PetInfo>
              <PetShelterAddress
                href={`https://www.google.com/maps/search/?api=1&query=${
                  shelterInfo.find(
                    shelter =>
                      shelter.pkid
                      === dating.considerList[props.nowChosenPetIndex].shleterPkid,
                  )?.latAndLng
                }&query_place_id=${
                  shelterInfo.find(
                    shelter =>
                      shelter.pkid
                      === dating.considerList[props.nowChosenPetIndex].shleterPkid,
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
            <PetInfoImg src={tel.src} alt="phone" />
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
            props.setConsiderDetail(false)
          }}
        >
          關閉
        </CloseBtn>
        <InviteDatingBtn
          onClick={() => {
            if (
              dating.upcomingDateList.find(
                date =>
                  date.id === dating.considerList[props.nowChosenPetIndex].id,
              )
            ) {
              setRepeatInvite(true)
              return
            }
            setInviteBoxOpen(true)
            setInviteDatingInfo({
              ...inviteDatingInfo,
              name: profile.name,
              email: profile.email,
            })
          }}
        >
          申請與他約會: 相處體驗
        </InviteDatingBtn>
        <NotCondiserBtn
          onClick={async () => {
            setOpenDeleteBox(true)
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
                  const newUpcomingDatingArr = props.datingArr.filter(
                    date =>
                      date !== dating.considerList[props.nowChosenPetIndex].id,
                  )
                  props.setDatingArr(newUpcomingDatingArr)
                  deleteFirebaseData(
                    `/memberProfiles/${profile.uid}/considerLists`,
                    'id',
                    dating.considerList[props.nowChosenPetIndex].id,
                  )
                  deleteFirebaseData(
                    `/memberProfiles/${profile.uid}/upcomingDates`,
                    'id',
                    dating.considerList[props.nowChosenPetIndex].id,
                  )
                  await addDoc(
                    collection(
                      db,
                      `/memberProfiles/${profile.uid}/notConsiderLists`,
                    ),
                    { id: dating.considerList[props.nowChosenPetIndex].id },
                  )
                  const newConsiderList = dating.considerList
                  newConsiderList.splice(props.nowChosenPetIndex, 1)
                  dispatch(setConsiderList(newConsiderList))
                  props.setConsiderDetail(false)
                  notifyDispatcher('已更新考慮領養清單')
                }}
              >
                確定
              </WarningDeleteBtn>
              <DeleteCheckBoxBtn
                onClick={() => {
                  setOpenDeleteBox(false)
                }}
              >
                取消
              </DeleteCheckBoxBtn>
            </DeleteCheckBoxBtnContainer>
          </ConsiderDeleteBox>
        )}
      </PetCard>
      {inviteBoxOpen
        ? (
            <InviteDatingBox>
              <InviteDatingTitle>
                申請與
                {' '}
                {dating.considerList[props.nowChosenPetIndex].id}
                {' '}
                約會
              </InviteDatingTitle>
              <InviteInfoContainer>
                <InviteInfoLabel htmlFor="name">您的本名：</InviteInfoLabel>
                <InviteInfoInput
                  value={inviteDatingInfo.name}
                  type="text"
                  id="name"
                  onChange={e =>
                    setInviteDatingInfo({
                      ...inviteDatingInfo,
                      name: e.target.value,
                    })}
                />
              </InviteInfoContainer>
              <InviteInfoContainer>
                <InviteInfoLabel htmlFor="email">您的信箱：</InviteInfoLabel>
                <InviteInfoInput
                  value={inviteDatingInfo.email}
                  type="email"
                  id="email"
                  onChange={e =>
                    setInviteDatingInfo({
                      ...inviteDatingInfo,
                      email: e.target.value,
                    })}
                />
              </InviteInfoContainer>
              {dating.considerList[props.nowChosenPetIndex].shelterName
                === '臺北市動物之家' && (
                <MeetingBtnContainer>
                  <MeetingWayBtn
                    $isActive={meetingWay === '實體'}
                    onClick={() => {
                      setMeetingWay('實體')
                      setTimeSelect(['14:00', '14:30', '15:00', '15:30'])
                      setInviteDatingInfo({ ...inviteDatingInfo, way: '實體' })
                      setNowNoTimeSelect(false)
                    }}
                  >
                    實體
                  </MeetingWayBtn>
                  <MeetingWayBtn
                    $isActive={meetingWay === '視訊'}
                    onClick={() => {
                      setMeetingWay('視訊')
                      setInviteDatingInfo({ ...inviteDatingInfo, way: '視訊' })
                      if (inviteDatingInfo.date) {
                        setNowNoTimeSelect(false)
                        isSameDate(
                          new Date(inviteDatingInfo.date).getFullYear(),
                          new Date(inviteDatingInfo.date).getMonth() + 1,
                          new Date(inviteDatingInfo.date).getDate(),
                        )
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
                      setNowNoTimeSelect(false)
                      setInviteDatingInfo({
                        ...inviteDatingInfo,
                        date: value,
                      })
                      if (meetingWay === '視訊') {
                        isSameDate(
                          value.getFullYear(),
                          value.getMonth() + 1,
                          value.getDate(),
                        )
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
                          if (timeSelect[index] === 'Right Now') {
                            setTimeIndex(index)
                            setInviteDatingInfo({
                              ...inviteDatingInfo,
                              time: `${new Date().getHours()}:${new Date().getMinutes()}`,
                              dateAndTime: Number(new Date()),
                            })
                          }
                          else {
                            setTimeIndex(index)
                            setInviteDatingInfo({
                              ...inviteDatingInfo,
                              time: timeSelect[index],
                              dateAndTime: (inviteDatingInfo.date as Date).setHours(
                                Number(timeSelect[index].split(':')[0]),
                                Number(timeSelect[index].split(':')[1]),
                              ),
                            })
                          }
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
              {nowNoTimeSelect
                ? (
                    <PetInfoWarning>
                      此日期已無可預約時間，請選擇其他日期
                    </PetInfoWarning>
                  )
                : (
                    <SendInviteBtn
                      onClick={async () => {
                        if (
                          Object.values(inviteDatingInfo).includes('')
                        ) {
                          setIncompleteInfo(true)
                          return
                        }
                        updateUpcomingDate(
                          dating.considerList[props.nowChosenPetIndex],
                        )
                        updateUpcomingDateState(
                          dating.considerList[props.nowChosenPetIndex],
                        )
                        if (meetingWay === '視訊') {
                          updateShelterUpcomingDate(
                            dating.considerList[props.nowChosenPetIndex],
                          )
                        }
                        sendEmailToNotifyUser(
                          dating.considerList[props.nowChosenPetIndex],
                        )
                        const newDatingArr = [...props.datingArr]
                        newDatingArr.push(
                          dating.considerList[props.nowChosenPetIndex].id,
                        )
                        props.setDatingArr(newDatingArr)
                        setInviteBoxOpen(false)
                        notifyDispatcher('申請成功！可至「即將到來的約會」查看')
                      }}
                    >
                      送出邀請
                    </SendInviteBtn>
                  )}

              <CloseInviteBoxBtn
                onClick={() => {
                  setInviteBoxOpen(false)
                }}
                src={close.src}
                alt="close"
              />
            </InviteDatingBox>
          )
        : (
            ''
          )}
    </>
  )
}

export default ConsiderPetDetail
