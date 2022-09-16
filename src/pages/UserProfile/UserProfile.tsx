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

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fafafa;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 50px;
`;
const UserInfo = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const UserImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const UserImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  object-fit: cover;
`;
const UserName = styled.div`
  font-size: 22px;
  margin-top: 10px;
`;
const OutputCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 22px;
`;
const OutputTitle = styled.div`
  letter-spacing: 1.5px;
`;
const OutputCount = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;
const Tabs = styled.div`
  display: flex;
  border-radius: 5px;
  overflow: hidden;
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
  background-color: ${(props) => (props.$isActive ? "#B7B0A8" : "#EFEFEF")};
  color: ${(props) => (props.$isActive ? "#fff" : "black")};
  transition: 0.2s;
  &:hover {
    background-color: #b7b0a8;
    color: #fff;
  }
`;
const MainSection = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 15px;
  position: relative;
`;
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
`;
const NowChooseOption = styled.div`
  &:after {
    content: "ˇ";
    position: absolute;
    right: 10px;
    top: 15px;
  }
`;
const OptionGroup = styled.ul<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  height: ${(props) => (props.$isActive ? "auto" : "0px")};
  position: absolute;
  background-color: #fff;
  width: 200px;
  left: 0;
  top: 50px;
`;
const OptionName = styled.li`
  display: flex;
  justify-content: center;
  padding: 8px 10px;
  transition: 0.2s;
  &:hover {
    background-color: #d1cfcf;
    color: #3c3c3c;
  }
`;

const DiaryCard = styled(Link)<{ likecount: number; commentcount: number }>`
  width: 250px;
  height: 250px;
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
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
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
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  bottom: 1px;
  left: 0;
  width: 100%;
  padding: 10px 15px;
  font-size: 22px;
`;
const DiaryTitle = styled.div``;
const PetAge = styled.div`
  letter-spacing: 1.5px;
`;

// article style
const AllArticlesContainer = styled.div`
  padding: 70px 0 46px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 15px;
  position: relative;
`;

const ArticleCard = styled(Link)`
  width: 250px;
  margin: 0 auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: black;
  position: relative;
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s;
  bottom: 0;
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
`;

const ArticleCover = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ArticleCardBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 15px;
  background-color: #b7b0a8;
  color: #3c3c3c;
  letter-spacing: 1px;
`;

const ArticleTitle = styled.div`
  font-weight: bold;
  flex: 1;
  font-size: 22px;
  margin-bottom: 10px;
`;

const HeartAndCommentRecordContainer = styled.div`
  display: flex;
  font-size: 18px;
`;
const Record = styled.div`
  flex-shrink: 0;
`;

// pet

const PetInfo = styled.div`
  padding: 70px 0 46px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 15px;
  position: relative;
`;

const PetSimpleCard = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
  transition: 0.3s;
  bottom: 0;
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
`;

const PetSimpleImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
`;
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
  font-size: 22px;
  letter-spacing: 1.5px;
`;
const PetSimpleInfo = styled.div`
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
  const [nowChoosePet, setNowChoosePet] = useState<string>("全部");
  const [optionBoxOpen, setOptionBoxOpen] = useState<boolean>(false);

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
        setUserInfo({ name: docSnap.data().name, img: docSnap.data().img });
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

  console.log(optionBoxOpen);

  if (!userDiary) return null;
  if (!userArticle) return null;
  if (!userPet) return null;

  return (
    <Wrap>
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
            <>
              <SelectGroup>
                <NowChooseOption
                  onMouseEnter={() => {
                    setOptionBoxOpen(true);
                  }}
                >
                  {nowChoosePet}
                </NowChooseOption>
                <OptionGroup
                  $isActive={optionBoxOpen === true}
                  onMouseLeave={() => {
                    setOptionBoxOpen(false);
                  }}
                >
                  <OptionName
                    key="all"
                    value="全部"
                    onClick={(e) => {
                      setNowChoosePet("全部");
                    }}
                  >
                    全部
                  </OptionName>
                  {profile.ownPets.map((pet, index) => (
                    <OptionName
                      key={index}
                      value={pet.name}
                      onClick={(e) => {
                        setNowChoosePet(
                          (e.target as HTMLInputElement).innerText
                        );
                      }}
                    >
                      {pet.name}
                    </OptionName>
                  ))}
                </OptionGroup>
              </SelectGroup>
              <AllDiariesContainer>
                {/* <AllPetNameContainer>
                  {ownPet.map((pet, index) => (
                    <AllPetBtn
                      key={index}
                      onClick={() => setChoosePetDiary(index)}
                    >
                      {pet}
                    </AllPetBtn>
                  ))}
                  <AllPetBtn key={-1} onClick={() => setChoosePetDiary(-1)}>
                    全部
                  </AllPetBtn>
                </AllPetNameContainer> */}
                {nowChoosePet === "全部"
                  ? userDiary.map((diary, index) => (
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
                  : userDiary
                      .filter((diary) => diary.petName === nowChoosePet)
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
                      ))}
              </AllDiariesContainer>
            </>
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
    </Wrap>
  );
};

export default UserProfile;
