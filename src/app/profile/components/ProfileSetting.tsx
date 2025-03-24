'use client'

import type { imgType } from 'src/functions/commonFunctionAndType'
import type { OwnPet, Profile } from 'src/reducers/profile'
import { collection, getDocs } from 'firebase/firestore'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { imgInitialState } from 'src/functions/commonFunctionAndType'
import { setOwnPets } from 'src/functions/profileReducerFunction'
import { tabs } from 'src/utils/ConstantInfo'
import { db } from 'src/utils/firebase'
import styled from 'styled-components'
import { PetDiary } from './PetDiary'
import Topbar from './TopBar'
import UserInfos from './UserInfos'
import UserOwnPetInfos from './UserOwnPetInfos'
import { WritePetArticle } from './WritePetArticle'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 144px;
  overflow: hidden;
  padding-bottom: 72px;
  @media (max-width: 1120px) {
    padding-left: 50px;
    padding-right: 50px;
  }
  @media (max-width: 657px) {
    padding-left: 30px;
    padding-right: 30px;
  }
`

export const EditContainer = styled.div`
  display: flex;
`
export const EditInfoLabel = styled.label`
  flex-shrink: 0;
`
export const EditInfoInput = styled.input``

const MainInfo = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
`

interface AddArticleInfo {
  title: string
  context: string
}

function ProfileSetting() {
  const dispatch = useDispatch()
  const profile = useSelector<{ profile: Profile }>(
    state => state.profile,
  ) as Profile
  const [selectedTab, setSelectedTab] = useState<string>('個人資訊')
  const [newName, setNewName] = useState<string>('')
  const [articleCover, setArticleCover] = useState<imgType>(imgInitialState)
  const [addArticleInfo, setAddArticleInfo] = useState<AddArticleInfo>({
    title: '',
    context: '',
  })
  const [incompleteInfo, setIncompleteInfo] = useState(false)

  async function getOwnPetList() {
    const allOwnPet: OwnPet[] = []
    const q = collection(db, 'memberProfiles', profile.uid, 'ownPets')
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((info) => {
      allOwnPet.push(info.data() as OwnPet)
    })
    dispatch(setOwnPets(allOwnPet))
  }

  return (
    <>
      <Topbar
        tabs={tabs}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
      <Wrapper>
        <MainInfo>
          {selectedTab === tabs[0] && (
            <UserInfos
              newName={newName}
              setNewName={setNewName}
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          )}
          {selectedTab === tabs[1] && (
            <UserOwnPetInfos
              getOwnPetList={getOwnPetList}
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          )}
          {selectedTab === tabs[2] && (
            <PetDiary
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          )}
          {selectedTab === tabs[3] && (
            <WritePetArticle
              addArticleInfo={addArticleInfo}
              setAddArticleInfo={setAddArticleInfo}
              articleCover={articleCover}
              setArticleCover={setArticleCover}
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          )}
        </MainInfo>
      </Wrapper>
    </>
  )
}

export default ProfileSetting
