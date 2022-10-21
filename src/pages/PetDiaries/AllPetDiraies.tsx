import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { db } from "../../utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  position: absolute;
  top: 120px;
  padding-left: 12px;
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    background-color: #db5452;
    position: absolute;
    left: 0;
  }
  @media (max-width: 1120px) {
    left: 50px;
  }
  @media (max-width: 725px) {
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 28px;
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
  padding: 220px 0 46px;
  transition: 0.3s;
  position: relative;
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
  /* margin-bottom: 30px; */
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
const DiaryTitle = styled.div`
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 30px;
  white-space: nowrap;
`;
const PetAge = styled.div``;

const PetDiaryNote = styled.div`
  font-size: 18px;
  position: absolute;
  top: 165px;
  padding-left: 12px;
  letter-spacing: 1.5px;
  @media (max-width: 1120px) {
    left: 50px;
  }
  @media (max-width: 725px) {
    top: 140px;
    line-height: 25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    text-align: center;
  }
`;

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

const slide = keyframes`
  from {
    left: -120%;
  }
  to {
    left: 100%;
  }
`;

const SkeletonDiaryCard = styled.div`
  margin-bottom: 30px;
  bottom: 0;
  flex-shrink: 0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  background: #eee;
  width: 250px;
  height: 250px;
  &:last-child {
    margin-right: 0;
  }
  &:before {
    content: "";
    position: absolute;
    height: 100%;
    width: 120px;
    top: 0px;
    background: linear-gradient(
      to right,
      transparent 0%,
      #ffffff99 50%,
      transparent 100%
    );
    animation: ${slide} 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    box-shadow: 0 4px 10px 0 #ffffff33;
  }
  @media (max-width: 725px) {
    width: 300px;
  }
  @media (max-width: 432px) {
    width: 250px;
  }
`;

const AllPetDiaries = () => {
  const [allPetDiraies, setAllPetArticles] = useState<AllPetDiariesType[]>([]);
  const [openLikeBox, setOpenLikeBox] = useState<boolean>(false);
  const [nowid, setNowId] = useState<number>(-1);

  useEffect(() => {
    async function getPetDiaries() {
      const authorPetDiaries: AllPetDiariesType[] = [];
      const q = query(
        collection(db, "petDiaries"),
        orderBy("postTime", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((info) => {
        authorPetDiaries.push({
          id: info.id,
          ...info.data(),
        } as AllPetDiariesType);
      });
      setAllPetArticles(authorPetDiaries);
    }
    getPetDiaries();
  }, []);
  return (
    <Wrap>
      <AllDiariesContainer>
        <PageTitle>寵物日記</PageTitle>
        <PetDiaryNote>登入後，透過日記紀錄你與寵物共同擁有的回憶</PetDiaryNote>
        {allPetDiraies.length === 0 ? (
          <>
            <SkeletonDiaryCard></SkeletonDiaryCard>{" "}
            <SkeletonDiaryCard></SkeletonDiaryCard>{" "}
            <SkeletonDiaryCard></SkeletonDiaryCard>{" "}
            <SkeletonDiaryCard></SkeletonDiaryCard>{" "}
            <SkeletonDiaryCard></SkeletonDiaryCard>{" "}
            <SkeletonDiaryCard></SkeletonDiaryCard>{" "}
            <SkeletonDiaryCard></SkeletonDiaryCard>{" "}
            <SkeletonDiaryCard></SkeletonDiaryCard>
          </>
        ) : (
          allPetDiraies.map((diary, index) => (
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
                  {`${
                    new Date(diary.takePhotoTime).getFullYear() -
                    diary.birthYear
                  }`}
                  y
                </PetAge>
              </DiaryBottom>
            </DiaryCard>
          ))
        )}
      </AllDiariesContainer>
    </Wrap>
  );
};

export default AllPetDiaries;
