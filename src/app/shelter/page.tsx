'use client'

import type { InviteDating } from '../../reducers/dating'
import type { Profile } from '../../reducers/profile'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import noUpcomingDate from 'public/img/kataomoi_woman-01.png'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Title } from 'src/app/profile/components/UserInfos'
import {
  NowNoInfoImg,
  NowNoInfoInHere,
  NowNoInfoText,
} from 'src/app/profile/components/UserOwnPetInfos'
import UpcomingList from 'src/app/shelter/component/ShelterUpcomingList'
import styled from 'styled-components'
import ShelterMeeting from '../../component/ShelterMeeting'
import { db } from '../../utils/firebase'

const Wrap = styled.div`
  width: 100%;
  height: auto;
  min-height: 100vh;
  background-color: #fafafa;
  position: relative;
  padding-top: 120px;
  padding-bottom: 50px;
  overflow: hidden;
`

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
`

const UpcomingTitle = styled(Title)`
  position: absolute;
  top: 0px;
`

export const NowNoInfoInHereConsider = styled(NowNoInfoInHere)`
  flex-direction: column;
  top: 100px;
`

export const NowNoInfoTextConsider = styled(NowNoInfoText)`
  line-height: 30px;
  text-align: center;
`

function Shelter() {
  const profile = useSelector<{ profile: Profile }>(
    state => state.profile,
  ) as Profile
  const router = useRouter()
  const [shelterUpcomingList, setShelterUpcomingList]
    = useState<InviteDating[]>()
  const [openMeeting, setOpenMeeting] = useState(false)
  const [nowMeetingShelter, setNowMeetingShelter] = useState<{
    petId: number
    shelterName: string
    userName: string
    index: number
  }>({ petId: 0, shelterName: '', userName: '', index: -1 })

  useEffect(() => {
    if (!profile.isShelter) {
      router.push('/')
    }

    async function getUpcomingListData() {
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
      setShelterUpcomingList(upcomingDate)
    }
    getUpcomingListData()
  }, [profile.isShelter, router])

  if (!shelterUpcomingList)
    return null

  return (
    <Wrap>
      {openMeeting && (
        <ShelterMeeting
          nowMeetingShelter={nowMeetingShelter}
          setOpenMeeting={setOpenMeeting}
          shelterUpcomingList={shelterUpcomingList}
          setShelterUpcomingList={setShelterUpcomingList}
        />
      )}
      <UpcomingListContainer>
        <UpcomingTitle>即將到來的約會</UpcomingTitle>
        {shelterUpcomingList.length === 0
          ? (
              <NowNoInfoInHereConsider>
                <NowNoInfoImg src={noUpcomingDate.src} alt="now-no-upcoming-date" />
                <NowNoInfoTextConsider>
                  目前沒有即將到來的約會，
                  <br />
                  到考慮領養清單邀請心儀的寵物來場約會吧！
                </NowNoInfoTextConsider>
              </NowNoInfoInHereConsider>
            )
          : (
              <UpcomingList
                shelterUpcomingList={shelterUpcomingList}
                setOpenMeeting={setOpenMeeting}
                setNowMeetingShelter={setNowMeetingShelter}
                setShelterUpcomingList={setShelterUpcomingList}
              />
            )}
      </UpcomingListContainer>
    </Wrap>
  )
}

export default Shelter
