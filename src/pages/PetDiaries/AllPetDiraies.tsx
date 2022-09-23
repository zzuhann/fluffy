import { collection, getDocs, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  position: absolute;
  top: 90px;
  padding-left: 12px;
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    background-color: #d0470c;
    position: absolute;
    left: 0;
  }
  @media (max-width: 1120px) {
    left: 50px;
  }
  @media (max-width: 725px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fafafa;
  position: relative;
`;

const AllDiariesContainer = styled.div`
  max-width: 1120px;
  width: 100%;
  margin: 0 auto;
  padding: 150px 0 46px;
  /* display: flex;
  flex-wrap: wrap; */
  transition: 0.3s;
  position: relative;
  /* justify-content: space-between; */
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  justify-content: space-between;
  gap: 20px;
  grid-template-rows: 250px;
  @media (max-width: 1120px) {
    padding-left: 50px;
    padding-right: 50px;
  }
  @media (max-width: 725px) {
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 300px);
  }
  @media (max-width: 432px) {
    grid-template-columns: repeat(auto-fill, 250px);
  }
`;
const DiaryCard = styled(Link)`
  margin-bottom: 30px;
  transition: 0.2s;
  bottom: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #3c3c3c;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
`;
const LikeRecord = styled.div`
  display: flex;
  margin-right: 30px;
  &:last-child {
    margin-right: 0;
  }
  svg {
    margin-right: 10px;
    font-size: 25px;
  }
`;

const HoverCard = styled.div<{ $isActive: boolean }>`
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 22px;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: 0.2s;
`;

const DiaryImg = styled.img`
  width: 250px;
  height: 250px;
  object-fit: cover;
  @media (max-width: 725px) {
    width: 300px;
  }
  @media (max-width: 432px) {
    width: 250px;
  }
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
  letter-spacing: 1.5px;
`;
const DiaryTitle = styled.div``;
const PetAge = styled.div``;

export type AllPetDiariesType = {
  petName: string;
  context: string;
  authorUid: string;
  postTime: number;
  takePhotoTime: number;
  likedBy: string[];
  img: string;
  commentCount: number;
  author: {
    name: string;
    img: string;
  };
  id: string;
  birthYear: number;
};

const AllPetDiaries = () => {
  const [allPetDiraies, setAllPetArticles] = useState<AllPetDiariesType[]>([]);
  const [openLikeBox, setOpenLikeBox] = useState<boolean>(false);
  const [nowid, setNowId] = useState<number>(-1);

  async function getPetDiaries() {
    const authorPetDiaries: AllPetDiariesType[] = [];
    const q = query(collection(db, "petDiaries"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetDiaries.push({
        id: info.id,
        ...info.data(),
      } as AllPetDiariesType);
    });
    setAllPetArticles(authorPetDiaries);
  }

  useEffect(() => {
    getPetDiaries();
  }, []);

  return (
    <Wrap>
      <AllDiariesContainer>
        <PageTitle>寵物日記</PageTitle>
        {allPetDiraies.map((diary, index) => (
          <DiaryCard
            key={index}
            to={`/petdiary/${diary.id}`}
            onMouseEnter={() => {
              setOpenLikeBox(true);
              setNowId(index);
            }}
            onMouseLeave={() => {
              setOpenLikeBox(false);
              setNowId(-1);
            }}
          >
            <HoverCard $isActive={openLikeBox === true && nowid === index}>
              <LikeRecord>
                <FontAwesomeIcon icon={faHeart} /> {diary.likedBy.length}
              </LikeRecord>
              <LikeRecord>
                <FontAwesomeIcon icon={faComment} /> {diary.commentCount}
              </LikeRecord>
            </HoverCard>
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
    </Wrap>
  );
};

export default AllPetDiaries;
