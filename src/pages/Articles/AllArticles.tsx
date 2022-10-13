import { collection, getDocs, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { db } from "../../utils/firebase";
import { PageTitle } from "../PetDiaries/AllPetDiraies";
import notyetLike from "./img/heart.png";
import comment from "./img/chat.png";

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fafafa;
  position: relative;
`;

const AllArticlesContainer = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
  padding: 200px 0 46px;
  display: flex;
  flex-wrap: wrap;
  transition: 0.3s;
  position: relative;
  justify-content: space-between;
  @media (max-width: 1120px) {
    padding-left: 50px;
    padding-right: 50px;
  }
  @media (max-width: 860px) {
    justify-content: center;
  }
  @media (max-width: 643px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const ArticleCard = styled(Link)`
  width: calc((100% - 150px) / 2);
  /* margin: 0 20px 50px; */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #3c3c3c;
  transition: 0.2s;
  bottom: 0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  border: solid 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
  @media (max-width: 860px) {
    width: calc((100% - 100px));
    align-items: center;
    margin-bottom: 30px;
  }
  @media (max-width: 556px) {
    width: 100%;
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
  padding: 10px 15px;
  font-size: 22px;
  letter-spacing: 1.5px;
`;

const ArticleTitle = styled.div`
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 25px;
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  height: 50px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const HeartAndCommentRecordContainer = styled.div`
  display: flex;
  font-size: 18px;
  color: #3c3c3c;
  justify-self: flex-end;
`;

const RecordImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;
const Record = styled.div`
  flex-shrink: 0;
  margin-right: 15px;
`;

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
  width: calc((100% - 150px) / 2);
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
  @media (max-width: 860px) {
    width: calc((100% - 100px));
  }
  @media (max-width: 556px) {
    width: 100%;
  }
`;

export type AllPetArticlesType = {
  title: string;
  context: string;
  authorUid: string;
  postTime: number;
  likedBy: string[];
  img: string;
  commentCount: number;
  author: {
    name: string;
    img: string;
  };
  id: string;
};

const AllArticles = () => {
  const [allPetArticles, setAllPetArticles] = useState<AllPetArticlesType[]>(
    []
  );

  async function getAuthorArticles() {
    const authorPetAricles: AllPetArticlesType[] = [];
    const q = query(collection(db, "petArticles"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetAricles.push({
        id: info.id,
        ...info.data(),
      } as AllPetArticlesType);
    });
    setAllPetArticles(authorPetAricles);
  }

  useEffect(() => {
    getAuthorArticles();
  }, []);

  return (
    <Wrap>
      <AllArticlesContainer>
        <PageTitle>寵物文章補給</PageTitle>
        {allPetArticles.length === 0 ? (
          <>
            <SkeletonDiaryCard />
            <SkeletonDiaryCard />
            <SkeletonDiaryCard />
            <SkeletonDiaryCard />
          </>
        ) : (
          allPetArticles.map((article, index) => (
            <ArticleCard key={index} to={`/articles/${article.id}`}>
              <ArticleCover src={article.img} />
              <ArticleCardBottom>
                <ArticleTitle>{article.title}</ArticleTitle>
                <HeartAndCommentRecordContainer>
                  <RecordImg src={notyetLike} />
                  <Record>{article.likedBy.length}</Record>
                  <RecordImg src={comment} />
                  <Record>{article.commentCount}</Record>
                </HeartAndCommentRecordContainer>
              </ArticleCardBottom>
            </ArticleCard>
          ))
        )}
      </AllArticlesContainer>
    </Wrap>
  );
};

export default AllArticles;
