import { collection, getDocs, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import { PageTitle } from "../PetDiaries/AllPetDiraies";
import notyetLike from "./heart.png";
import comment from "./chat.png";
import { CatLoading } from "../../utils/loading";

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
  /* flex: 1; */
  margin-bottom: 20px;
  line-height: 25px;
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const HeartAndCommentRecordContainer = styled.div`
  display: flex;
  font-size: 18px;
  color: #3c3c3c;
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
  const [isLoading, setIsLoading] = useState(false);

  async function getAuthorArticles() {
    setIsLoading(true);
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
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  useEffect(() => {
    getAuthorArticles();
  }, []);

  return (
    <Wrap>
      {isLoading ? (
        <CatLoading />
      ) : (
        <AllArticlesContainer>
          <PageTitle>寵物文章補給</PageTitle>
          {allPetArticles.map((article, index) => (
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
          ))}
        </AllArticlesContainer>
      )}
    </Wrap>
  );
};

export default AllArticles;
