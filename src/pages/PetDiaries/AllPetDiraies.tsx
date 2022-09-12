import { collection, getDocs, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { db } from "../../utils/firebase";

const AllDiariesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 0 46px;
  display: flex;
  flex-wrap: wrap;
  transition: 0.3s;
`;
const DiaryCard = styled(Link)<{ likeCount: number; commentCount: number }>`
  width: 300px;
  height: 300px;
  margin: 0 20px 50px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: black;
  position: relative;
  &:hover:before {
    content: "喜歡 ${(props) => props.likeCount} 
    留言 ${(props) => props.commentCount}";
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
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [allPetDiraies, setAllPetArticles] = useState<AllPetDiariesType[]>([]);

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

  console.log(allPetDiraies);
  return (
    <AllDiariesContainer>
      {allPetDiraies.map((diary, index) => (
        <DiaryCard
          key={index}
          to={`/petdiary/${diary.id}`}
          likeCount={diary.likedBy.length}
          commentCount={diary.commentCount}
        >
          <DiaryImg src={diary.img} />
          <DiaryBottom>
            <DiaryTitle>{diary.petName}</DiaryTitle>
            <PetAge>{`${new Date().getFullYear() - diary.birthYear}`}Y</PetAge>
          </DiaryBottom>
        </DiaryCard>
      ))}
    </AllDiariesContainer>
  );
};

export default AllPetDiaries;
