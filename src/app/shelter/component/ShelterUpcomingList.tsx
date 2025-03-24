import type { Dispatch, SetStateAction } from 'react'
import type { InviteDating } from '../../../reducers/dating'
import shelter from 'public/img/animal-shelter.png'
import clock from 'public/img/clock.png'
import cutEgg from 'public/img/scissors.png'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Btn } from 'src/app/profile/components/UserInfos'
import styled from 'styled-components'
import { useNotifyDispatcher } from '../../../component/SidebarNotify'
import { setUpcomingDateList } from '../../../functions/datingReducerFunction'
import { deleteFirebaseData } from '../../../utils/firebase'

const UpcomingListCard = styled.div`
  display: flex;
  position: relative;
  border-radius: 5px;
  margin-bottom: 20px;
  border: solid 2px #d1cfcf;
  @media (max-width: 612px) {
    flex-direction: column;
  }
`

const InvitePetImgContainer = styled.div`
  aspect-ratio: 1;
  flex: 0.5;
  position: relative;
  @media (max-width: 612px) {
    aspect-ratio: inherit;
  }
`
const InvitePetImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  @media (max-width: 612px) {
    height: 250px;
  }
`
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
`

const UpcomingInfoImgContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`

const UpcomingInfoImg = styled.img`
  width: 20px;
  height: 20px;
  @media (max-width: 437px) {
    display: none;
  }
`

const UpcomingInfoTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`
const UpcomingInfo = styled.div`
  margin-left: 15px;
  @media (max-width: 437px) {
    margin-left: 0;
  }
`

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
`

const TimeNotComeBtn = styled(DatingDoneBtn)`
  cursor: not-allowed;
`

interface Props {
  shelterUpcomingList: InviteDating[]
  setOpenMeeting: Dispatch<SetStateAction<boolean>>
  setShelterUpcomingList: Dispatch<SetStateAction<InviteDating[] | undefined>>
  setNowMeetingShelter: Dispatch<
    SetStateAction<{
      petId: number
      shelterName: string
      userName: string
      index: number
    }>
  >
}

const UpcomingList: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const notifyDispatcher = useNotifyDispatcher()
  const [datingDone, setDatingDone] = useState<{
    id: number
    open: boolean
    index: number
  }>({
    id: 0,
    open: false,
    index: -1,
  })

  if (!props.shelterUpcomingList)
    return null
  return (
    <>
      {props.shelterUpcomingList.map((date, index) => (
        <UpcomingListCard key={index}>
          <InvitePetImgContainer>
            <InvitePetImg src={date.image} alt="pet" />
          </InvitePetImgContainer>

          <UpcomingInfoContainer>
            <UpcomingInfoTitle>
              {date.id}
              {' '}
              /
              {date.color}
              {date.kind}
              {' '}
              {date.sex === 'F' ? '♀' : '♂'}
            </UpcomingInfoTitle>
            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={cutEgg.src} alt="sterilization" />
              <UpcomingInfo>
                結紮狀態：
                {date.sterilization === 'T' ? '已結紮' : '未結紮'}
              </UpcomingInfo>
            </UpcomingInfoImgContainer>
            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={shelter.src} alt="shelter" />
              <UpcomingInfo>
                申請人：
                {date.inviter}
              </UpcomingInfo>
            </UpcomingInfoImgContainer>

            <UpcomingInfoImgContainer>
              <UpcomingInfoImg src={clock.src} alt="clock" />
              {typeof date.datingDate === 'number' && (
                <UpcomingInfo>
                  預約時間：
                  {new Date(date.datingDate).getFullYear()}
                  /
                  {new Date(date.datingDate).getMonth() + 1 < 10
                    ? `0${new Date(date.datingDate).getMonth() + 1}`
                    : new Date(date.datingDate).getMonth() + 1}
                  /
                  {new Date(date.datingDate).getDate() < 10
                    ? `0${new Date(date.datingDate).getDate()}`
                    : new Date(date.datingDate).getDate()}
                  {' '}
                  {date.time}
                </UpcomingInfo>
              )}
            </UpcomingInfoImgContainer>
          </UpcomingInfoContainer>

          {(date.datingDate as number) > Date.parse(`${new Date()}`)
            ? (
                <TimeNotComeBtn>視訊約會時間未到</TimeNotComeBtn>
              )
            : Date.parse(`${new Date()}`) - (date.datingDate as number)
              <= 7200000
              ? (
                  !date.doneWithMeeting
                    ? (
                        <DatingDoneBtn
                          onClick={() => {
                            props.setOpenMeeting(true)
                            props.setNowMeetingShelter({
                              petId: date.id,
                              shelterName: date.shelterName,
                              userName: date.inviter,
                              index,
                            })
                          }}
                        >
                          點擊開始視訊
                        </DatingDoneBtn>
                      )
                    : (
                        <DatingDoneBtn
                          onClick={() => {
                            setDatingDone({
                              id: date.id,
                              open: !datingDone.open,
                              index,
                            })
                            deleteFirebaseData(
                              `/governmentDatings/OB5pxPMXvKfglyETMnqh/upcomingDates`,
                              'id',
                              date.id,
                            )
                            const newUpcomingList = props.shelterUpcomingList
                            newUpcomingList.splice(index, 1)
                            dispatch(setUpcomingDateList(newUpcomingList))
                            notifyDispatcher('已更新視訊申請清單')
                          }}
                        >
                          已完成約會
                        </DatingDoneBtn>
                      )
                )
              : (
                  <DatingDoneBtn
                    onClick={() => {
                      setDatingDone({
                        id: date.id,
                        open: !datingDone.open,
                        index,
                      })
                      deleteFirebaseData(
                        `/governmentDatings/OB5pxPMXvKfglyETMnqh/upcomingDates`,
                        'id',
                        date.id,
                      )
                      const newUpcomingList = props.shelterUpcomingList
                      newUpcomingList.splice(index, 1)
                      dispatch(setUpcomingDateList(newUpcomingList))
                      notifyDispatcher('已更新視訊申請清單')
                    }}
                  >
                    已完成約會
                  </DatingDoneBtn>
                )}
        </UpcomingListCard>
      ))}
    </>
  )
}

export default UpcomingList
