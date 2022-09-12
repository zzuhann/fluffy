import { tab } from "@testing-library/user-event/dist/tab";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  setOwnArticle,
  setOwnPetDiary,
  setOwnPets,
} from "../../functions/profileReducerFunction";
import {
  OwnArticle,
  OwnPet,
  PetDiaryType,
  Profile,
} from "../../reducers/profile";
import { db } from "../../utils/firebase";
import { useParams } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
`;
const UserInfo = styled.div`
  display: flex;
`;
const UserImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const UserImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  object-fit: cover;
`;
const UserName = styled.div``;
const OutputCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const OutputTitle = styled.div``;
const OutputCount = styled.div``;
const Tabs = styled.div`
  display: flex;
`;
const Tab = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  text-align: center;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  background-color: ${(props) => (props.$isActive ? "salmon" : "#fff")};
  color: ${(props) => (props.$isActive ? "#fff" : "black")};
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;
const MainSection = styled.div``;
const AllPetNameContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  left: 5px;
  font-size: 20px;
`;
const AllPetBtn = styled.div`
  margin-right: 15px;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

// petdiary style

const AllDiariesContainer = styled.div`
  margin: 0 auto;
  padding: 70px 0 46px;
  display: flex;
  flex-wrap: wrap;
  transition: 0.3s;
  position: relative;
`;
const DiaryCard = styled(Link)<{ likecount: number; commentcount: number }>`
  width: 250px;
  height: 250px;
  margin: 0 auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: black;
  position: relative;
  &:hover:before {
    content: "喜歡 ${(props) => props.likecount} 
    留言 ${(props) => props.commentcount}";
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
`;
const DiaryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const DiaryBottom = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 24px;
`;
const DiaryTitle = styled.div``;
const PetAge = styled.div``;

// article style
const AllArticlesContainer = styled.div`
  margin: 0 auto;
  padding: 70px 0 46px;
  display: flex;
  flex-wrap: wrap;
`;

const ArticleCard = styled(Link)`
  width: 250px;
  margin: 0 auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: black;
`;

const ArticleCover = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ArticleCardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
`;

const ArticleTitle = styled.div`
  font-weight: bold;
  flex: 1;
`;

const HeartAndCommentRecordContainer = styled.div`
  display: flex;
`;
const Record = styled.div`
  flex-shrink: 0;
`;

// pet

const PetInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const PetSimpleCard = styled.div`
  width: 250px;
  height: 250px;
  position: relative;
  margin: 0 auto;
`;

const PetSimpleImage = styled.img`
  width: 250px;
  height: 250px;
  object-fit: cover;
`;
const PetSimpleInfos = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;
const PetSimpleInfo = styled.div`
  font-size: 25px;
  color: #fff;
`;

const UserProfile = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const tabs = ["日記", "文章", "寵物"];
  const [ownPet, setOwnPet] = useState<string[]>([]);
  const [choosePetDiary, setChoosePetDiary] = useState<number>(-1);
  const [userInfo, setUserInfo] = useState<{ img: string; name: string }>({
    img: "",
    name: "",
  });
  const { id } = useParams();
  const [userDiary, setUserDiary] = useState<PetDiaryType[]>();
  const [userArticle, setUserArticle] = useState<OwnArticle[]>();
  const [userPet, setUserPet] = useState<OwnPet[]>();

  async function getAuthorPetDiary(authorUid: string) {
    const authorPetDiary: PetDiaryType[] = [];
    const q = query(
      collection(db, "petDiaries"),
      where("authorUid", "==", authorUid),
      orderBy("postTime")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetDiary.push({ id: info.id, ...info.data() } as PetDiaryType);
    });
    setUserDiary(authorPetDiary);
  }

  async function getAuthorArticles(authorUid: string) {
    const authorPetDiary: OwnArticle[] = [];
    const q = query(
      collection(db, "petArticles"),
      where("authorUid", "==", authorUid)
      // orderBy("postTime")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetDiary.push({
        id: info.id,
        ...info.data(),
      } as OwnArticle);
    });
    setUserArticle(authorPetDiary);
  }

  useEffect(() => {
    getOwnPetList(id as string);
    getAuthorPetDiary(id as string);
    getAuthorArticles(id as string);

    async function getUserInfo() {
      const docRef = doc(db, "memberProfiles", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo({ ...userInfo, name: docSnap.data().name });
        setUserInfo({ ...userInfo, img: docSnap.data().img });
      } else {
        console.log("No such document!");
      }
    }
    getUserInfo();
  }, []);

  async function getOwnPetList(id: string) {
    const allOwnPet: OwnPet[] = [];
    const q = collection(db, `memberProfiles/${id}/ownPets`);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      allOwnPet.push(info.data() as OwnPet);
    });
    setUserPet(allOwnPet);
  }

  useEffect(() => {
    if (!userPet) return;
    let pets: string[] = [];
    userPet.forEach((pet) => {
      pets.push(pet.name);
    });
    setOwnPet(pets);
  }, [userPet]);

  if (!userDiary) return null;
  if (!userArticle) return null;
  if (!userPet) return null;

  return (
    <Wrapper>
      <UserInfo>
        <UserImageContainer>
          <UserImage src={userInfo.img} />
          <UserName>{userInfo.name}</UserName>
        </UserImageContainer>
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
      <Tabs>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            onClick={() => {
              setTabIndex(index);
            }}
            $isActive={index === tabIndex}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>
      <MainSection>
        {tabIndex === 0 ? (
          <AllDiariesContainer>
            <AllPetNameContainer>
              {ownPet.map((pet, index) => (
                <AllPetBtn key={index} onClick={() => setChoosePetDiary(index)}>
                  {pet}
                </AllPetBtn>
              ))}
              <AllPetBtn key={-1} onClick={() => setChoosePetDiary(-1)}>
                全部
              </AllPetBtn>
            </AllPetNameContainer>
            {choosePetDiary === 0
              ? userDiary
                  .filter((diary) => diary.petName === ownPet[0])
                  .map((diary, index) => (
                    <DiaryCard
                      key={index}
                      to={`/petdiary/${diary.id}`}
                      likecount={diary.likedBy.length}
                      commentcount={diary.commentCount}
                    >
                      <DiaryImg src={diary.img} />
                      <DiaryBottom>
                        <DiaryTitle>{diary.petName}</DiaryTitle>
                        <PetAge>
                          {`${new Date().getFullYear() - diary.birthYear}`}Y
                        </PetAge>
                      </DiaryBottom>
                    </DiaryCard>
                  ))
              : choosePetDiary === 1
              ? userDiary
                  .filter((diary) => diary.petName === ownPet[1])
                  .map((diary, index) => (
                    <DiaryCard
                      key={index}
                      to={`/petdiary/${diary.id}`}
                      likecount={diary.likedBy.length}
                      commentcount={diary.commentCount}
                    >
                      <DiaryImg src={diary.img} />
                      <DiaryBottom>
                        <DiaryTitle>{diary.petName}</DiaryTitle>
                        <PetAge>
                          {`${new Date().getFullYear() - diary.birthYear}`}Y
                        </PetAge>
                      </DiaryBottom>
                    </DiaryCard>
                  ))
              : choosePetDiary === 2
              ? userDiary
                  .filter((diary) => diary.petName === ownPet[2])
                  .map((diary, index) => (
                    <DiaryCard
                      key={index}
                      to={`/petdiary/${diary.id}`}
                      likecount={diary.likedBy.length}
                      commentcount={diary.commentCount}
                    >
                      <DiaryImg src={diary.img} />
                      <DiaryBottom>
                        <DiaryTitle>{diary.petName}</DiaryTitle>
                        <PetAge>
                          {`${new Date().getFullYear() - diary.birthYear}`}Y
                        </PetAge>
                      </DiaryBottom>
                    </DiaryCard>
                  ))
              : userDiary.map((diary, index) => (
                  <DiaryCard
                    key={index}
                    to={`/petdiary/${diary.id}`}
                    likecount={diary.likedBy.length}
                    commentcount={diary.commentCount}
                  >
                    <DiaryImg src={diary.img} />
                    <DiaryBottom>
                      <DiaryTitle>{diary.petName}</DiaryTitle>
                      <PetAge>
                        {`${new Date().getFullYear() - diary.birthYear}`}Y
                      </PetAge>
                    </DiaryBottom>
                  </DiaryCard>
                ))}
          </AllDiariesContainer>
        ) : tabIndex === 1 ? (
          <AllArticlesContainer>
            {userArticle.map((article, index) => (
              <ArticleCard key={index} to={`/articles/${article.id}`}>
                <ArticleCover src={article.img} />
                <ArticleCardBottom>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <HeartAndCommentRecordContainer>
                    <Record>喜歡 {article.likedBy.length}</Record>
                    <Record>留言 {article.commentCount}</Record>
                  </HeartAndCommentRecordContainer>
                </ArticleCardBottom>
              </ArticleCard>
            ))}
          </AllArticlesContainer>
        ) : (
          <PetInfo>
            {userPet.map((pet, index) => (
              <PetSimpleCard key={index}>
                <PetSimpleImage src={pet.img} alt="" />
                <PetSimpleInfos>
                  <PetSimpleInfo>
                    {pet.name} {pet.sex === "M" ? "♂" : "♀"}
                  </PetSimpleInfo>
                  <PetSimpleInfo>{`${2022 - pet.birthYear}`}Y</PetSimpleInfo>
                </PetSimpleInfos>
              </PetSimpleCard>
            ))}
          </PetInfo>
        )}
      </MainSection>
    </Wrapper>
  );
};

export default UserProfile;
