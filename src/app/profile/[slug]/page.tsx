'use client'

import type { OwnArticle, OwnPet, PetDiaryType } from '../../../reducers/profile'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useRouter, useSearchParams } from 'next/navigation'
import defaultProfile from 'public/img/defaultprofile.png'
import noDiary from 'public/img/pet_darui_cat.png'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { userProfileTabs } from '../../../utils/ConstantInfo'
import { db } from '../../../utils/firebase'
import {
  NowNoInfoImg,
  NowNoInfoInHere,
  NowNoInfoText,
} from '../components/UserOwnPetInfos'

export const NowNoInfoInHereConsider = styled(NowNoInfoInHere)`
  flex-direction: column;
`

export const NowNoInfoTextConsider = styled(NowNoInfoText)`
  text-align: center;
  @media (max-width: 913px) {
    font-size: 22px;
  }
  @media (max-width: 465px) {
    font-size: 22px;
  }
  @media (max-width: 387px) {
    font-size: 22px;
  }
`

const NowNoInfoImgUserProfile = styled(NowNoInfoImg)`
  height: 70%;
`

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fafafa;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 100px;
`
const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
`

const UserImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  object-fit: cover;
  @media (max-width: 529px) {
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
`
const UserName = styled.div`
  font-size: 22px;
  letter-spacing: 1px;
  line-height: 24px;
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 10px;
  @media (max-width: 529px) {
    font-size: 18px;
  }
`
const OutputCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 22px;
`
const OutputTitle = styled.div`
  letter-spacing: 1.5px;
`
const OutputCount = styled.div`
  margin-top: 10px;
  font-weight: bold;
`
const Tabs = styled.div`
  display: flex;
  border-radius: 5px;
  overflow: hidden;
`
const Tab = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  text-align: center;
  height: 50px;
  font-size: 22px;
  letter-spacing: 2px;
  cursor: pointer;
  background-color: ${props => (props.$isActive ? '#B7B0A8' : '#EFEFEF')};
  color: ${props => (props.$isActive ? '#fff' : 'black')};
  transition: 0.2s;
  &:hover {
    background-color: #b7b0a8;
    color: #fff;
  }
`
const MainSection = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 15px;
  position: relative;
`

const AllDiariesContainer = styled.div`
  margin: 0 auto;
  padding: 70px 0 46px;
  transition: 0.3s;
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px);
  justify-content: space-between;
  gap: 20px;
  grid-template-rows: 230px;
  @media (max-width: 769px) {
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: 250px;
  }

  @media (max-width: 649px) {
    grid-template-columns: repeat(auto-fill, 200px);
    grid-template-rows: 200px;
  }
  @media (max-width: 549px) {
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: 250px;
  }
`

const SelectGroup = styled.div`
  position: absolute;
  border: solid 1px black;
  font-size: 22px;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 10px;
  padding: 10px 15px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  width: 200px;
  z-index: 1000;
`
const NowChooseOption = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 30px;
  white-space: nowrap;
  &:after {
    content: "ˇ";
    position: absolute;
    right: 10px;
    top: 15px;
  }
`
const OptionGroup = styled.ul<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  max-height: ${props => (props.$isActive ? '300px' : '0px')};
  transition: max-height 0.15s ease-out;
  border: ${props => (props.$isActive ? 'solid 3px #d1cfcf' : 'none')};
  position: absolute;
  background-color: #fff;
  width: 200px;
  left: 0;
  top: 50px;
  border-radius: 8px;
`
const OptionName = styled.li`
  display: flex;
  padding: 8px 10px;
  transition: 0.2s;
  &:hover {
    background-color: #d1cfcf;
    color: #3c3c3c;
  }
`

const DiaryCard = styled.a<{ likecount: number, commentcount: number }>`
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  margin-bottom: 30px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: black;
  position: relative;
  transition: 0.3s;
  bottom: 0;
  &:hover:before {
    content: "喜歡 ${props => props.likecount} 留言 ${props =>
      props.commentcount}";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 25px;
  }
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
`
const DiaryImg = styled.img`
  width: 230px;
  height: 230px;
  object-fit: cover;
  @media (max-width: 769px) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: 649px) {
    width: 200px;
    height: 200px;
  }
  @media (max-width: 549px) {
    width: 250px;
    height: 250px;
  }
`
const DiaryBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  bottom: 1px;
  left: 0;
  width: 100%;
  padding: 10px 15px;
  font-size: 18px;
  letter-spacing: 1.5px;
`
const DiaryTitle = styled.div`
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 30px;
  white-space: nowrap;
`
const PetAge = styled.div``

const AllArticlesContainer = styled.div`
  min-height: 346px;
  padding: 0px 0 46px;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  justify-content: space-between;
  gap: 10px;
  position: relative;
  @media (max-width: 640px) {
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 300px);
  }
`

const ArticleCard = styled.a`
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #3c3c3c;
  position: relative;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s;
  bottom: 0;
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
`

const ArticleCover = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  flex-shrink: 0;
  @media (max-width: 640px) {
    height: 150px;
  }
`

const ArticleCardBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 15px;
  background-color: #fff;
  color: #3c3c3c;
  letter-spacing: 1.5px;
  border-radius: 0 0 10px 10px;
  height: 100%;
`

const ArticleTitle = styled.div`
  font-weight: bold;
  height: 60px;
  font-size: 22px;
  line-height: 30px;
  margin-bottom: 10px;
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const HeartAndCommentRecordContainer = styled.div`
  display: flex;
  font-size: 18px;
`
const Record = styled.div`
  flex-shrink: 0;
`

const PetInfo = styled.div`
  padding: 70px 0 46px;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 15px;
  position: relative;
  min-height: 346px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px);
  justify-content: space-between;
  gap: 20px;
  grid-template-rows: 230px;
  @media (max-width: 769px) {
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: 250px;
  }

  @media (max-width: 649px) {
    grid-template-columns: repeat(auto-fill, 200px);
    grid-template-rows: 200px;
  }
  @media (max-width: 549px) {
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: 250px;
  }
`

const PetSimpleCard = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s;
  bottom: 0;
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
`

const PetSimpleImage = styled.img`
  width: 230px;
  height: 230px;
  object-fit: cover;
  @media (max-width: 769px) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: 649px) {
    width: 200px;
    height: 200px;
  }
  @media (max-width: 549px) {
    width: 250px;
    height: 250px;
  }
`
const PetSimpleInfos = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  position: absolute;
  color: #fff;
  bottom: 1px;
  left: 0;
  width: 100%;
  padding: 10px 15px;
  font-size: 18px;
  letter-spacing: 1.5px;
`
const PetSimpleInfo = styled.div`
  color: #fff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  line-height: 25px;
`

const PetYearAge = styled.div`
  color: #fff;
  flex-shrink: 0;
`

function UserProfile() {
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [userInfo, setUserInfo] = useState<{ img: string, name: string }>({
    img: '',
    name: '',
  })
  const searchParams = useSearchParams()
  const id: string = searchParams?.get('id') as string
  const router = useRouter()
  const [userDiary, setUserDiary] = useState<PetDiaryType[]>()
  const [userArticle, setUserArticle] = useState<OwnArticle[]>()
  const [userPet, setUserPet] = useState<OwnPet[]>()
  const [nowChoosePet, setNowChoosePet] = useState<string>('全部')
  const [optionBoxOpen, setOptionBoxOpen] = useState<boolean>(false)

  useEffect(() => {
    getOwnPetList(id as string)
    getAuthorPetDiary(id as string)
    getAuthorArticles(id as string)
    getUserInfo()

    async function getOwnPetList(id: string) {
      const allOwnPet: OwnPet[] = []
      const q = collection(db, `memberProfiles/${id}/ownPets`)
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((info) => {
        allOwnPet.push(info.data() as OwnPet)
      })
      setUserPet(allOwnPet)
    }

    async function getAuthorPetDiary(authorUid: string) {
      const authorPetDiary: PetDiaryType[] = []
      const q = query(
        collection(db, 'petDiaries'),
        where('authorUid', '==', authorUid),
        orderBy('takePhotoTime'),
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((info) => {
        authorPetDiary.push({ id: info.id, ...info.data() } as PetDiaryType)
      })
      setUserDiary(authorPetDiary)
    }

    async function getAuthorArticles(authorUid: string) {
      const authorPetDiary: OwnArticle[] = []
      const q = query(
        collection(db, 'petArticles'),
        where('authorUid', '==', authorUid),
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((info) => {
        authorPetDiary.push({
          id: info.id,
          ...info.data(),
        } as OwnArticle)
      })
      setUserArticle(authorPetDiary)
    }

    async function getUserInfo() {
      const docRef = doc(db, 'memberProfiles', id as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUserInfo({
          name: docSnap.data().name,
          img: docSnap.data().img || defaultProfile,
        })
      }
      else {
        router.push('/')
      }
    }
  }, [id, router])

  if (!userDiary)
    return null
  if (!userArticle)
    return null
  if (!userPet)
    return null

  return (
    <Wrap>
      <Wrapper>
        <UserInfo>
          <UserImage src={userInfo.img} alt="user" />
          <OutputCountContainer>
            <OutputTitle>日記</OutputTitle>
            <OutputCount>{userDiary.length}</OutputCount>
          </OutputCountContainer>
          <OutputCountContainer>
            <OutputTitle>文章</OutputTitle>
            <OutputCount>{userArticle.length}</OutputCount>
          </OutputCountContainer>
          <OutputCountContainer>
            <OutputTitle>寵物</OutputTitle>
            <OutputCount>{userPet.length}</OutputCount>
          </OutputCountContainer>
        </UserInfo>
        <UserName>{userInfo.name}</UserName>
        <Tabs>
          {userProfileTabs.map((tab, index) => (
            <Tab
              key={index}
              onClick={() => {
                setTabIndex(index)
              }}
              $isActive={index === tabIndex}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>
        <MainSection>
          {tabIndex === 0
            ? (
                <>
                  {userPet.length !== 0 && (
                    <SelectGroup>
                      <NowChooseOption
                        onMouseEnter={() => {
                          setOptionBoxOpen(true)
                        }}
                        onClick={() => {
                          optionBoxOpen
                            ? setOptionBoxOpen(false)
                            : setOptionBoxOpen(true)
                        }}
                      >
                        {nowChoosePet}
                      </NowChooseOption>
                      <OptionGroup
                        $isActive={optionBoxOpen === true}
                        onMouseLeave={() => {
                          setOptionBoxOpen(false)
                        }}
                      >
                        <OptionName
                          key="all"
                          value="全部"
                          onClick={(e) => {
                            setNowChoosePet('全部')
                          }}
                        >
                          全部
                        </OptionName>
                        {userPet.map((pet, index) => (
                          <OptionName
                            key={index}
                            value={pet.name}
                            onClick={(e) => {
                              setNowChoosePet(
                                (e.target as HTMLInputElement).innerText,
                              )
                            }}
                          >
                            {pet.name}
                          </OptionName>
                        ))}
                      </OptionGroup>
                    </SelectGroup>
                  )}
                  <AllDiariesContainer>
                    {userDiary.length === 0
                      ? (
                          <NowNoInfoInHereConsider>
                            <NowNoInfoTextConsider>尚無日記</NowNoInfoTextConsider>
                            <NowNoInfoImgUserProfile
                              src={noDiary.src}
                              alt="now-no-diary"
                            />
                          </NowNoInfoInHereConsider>
                        )
                      : nowChoosePet === '全部'
                        ? (
                            userDiary.map((diary, index) => (
                              <DiaryCard
                                key={index}
                                href={`/pet-diary/${diary.id}`}
                                likecount={diary.likedBy.length}
                                commentcount={diary.commentCount}
                              >
                                <DiaryImg src={diary.img} alt="diary" />
                                <DiaryBottom>
                                  <DiaryTitle>{diary.petName}</DiaryTitle>
                                  <PetAge>
                                    {`${
                                      new Date(diary.takePhotoTime).getFullYear()
                                        - diary.birthYear
                                    }`}
                                    y
                                  </PetAge>
                                </DiaryBottom>
                              </DiaryCard>
                            ))
                          )
                        : (
                            userDiary
                              .filter(diary => diary.petName === nowChoosePet)
                              .map((diary, index) => (
                                <DiaryCard
                                  key={index}
                                  href={`/pet-diary/${diary.id}`}
                                  likecount={diary.likedBy.length}
                                  commentcount={diary.commentCount}
                                >
                                  <DiaryImg src={diary.img} alt="diary" />
                                  <DiaryBottom>
                                    <DiaryTitle>{diary.petName}</DiaryTitle>
                                    <PetAge>
                                      {`${
                                        new Date(diary.takePhotoTime).getFullYear()
                                          - diary.birthYear
                                      }`}
                                      Y
                                    </PetAge>
                                  </DiaryBottom>
                                </DiaryCard>
                              ))
                          )}
                  </AllDiariesContainer>
                </>
              )
            : tabIndex === 1
              ? (
                  <AllArticlesContainer>
                    {userArticle.length === 0
                      ? (
                          <NowNoInfoInHereConsider>
                            <NowNoInfoTextConsider>尚無文章</NowNoInfoTextConsider>
                            <NowNoInfoImgUserProfile
                              src={noDiary.src}
                              alt="now-no-article"
                            />
                          </NowNoInfoInHereConsider>
                        )
                      : (
                          userArticle.map((article, index) => (
                            <ArticleCard key={index} href={`/articles/${article.id}`}>
                              <ArticleCover src={article.img} alt="article" />
                              <ArticleCardBottom>
                                <ArticleTitle>{article.title}</ArticleTitle>
                                <HeartAndCommentRecordContainer>
                                  <Record>
                                    喜歡
                                    {article.likedBy.length}
                                  </Record>
                                  <Record>
                                    留言
                                    {article.commentCount}
                                  </Record>
                                </HeartAndCommentRecordContainer>
                              </ArticleCardBottom>
                            </ArticleCard>
                          ))
                        )}
                  </AllArticlesContainer>
                )
              : (
                  <PetInfo>
                    {userPet.length === 0
                      ? (
                          <NowNoInfoInHereConsider>
                            <NowNoInfoTextConsider>尚無寵物</NowNoInfoTextConsider>
                            <NowNoInfoImgUserProfile src={noDiary.src} alt="now-no-pet" />
                          </NowNoInfoInHereConsider>
                        )
                      : (
                          userPet.map((pet, index) => (
                            <PetSimpleCard key={index}>
                              <PetSimpleImage src={pet.img} alt="pet" />
                              <PetSimpleInfos>
                                <PetSimpleInfo>
                                  {pet.name}
                                  {' '}
                                  {pet.sex === 'M' ? '♂' : '♀'}
                                </PetSimpleInfo>
                                <PetYearAge>
                                  {`${new Date().getFullYear() - pet.birthYear}`}
                                  Y
                                </PetYearAge>
                              </PetSimpleInfos>
                            </PetSimpleCard>
                          ))
                        )}
                  </PetInfo>
                )}
        </MainSection>
      </Wrapper>
    </Wrap>
  )
}

export default UserProfile
