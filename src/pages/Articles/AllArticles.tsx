import { collection, getDocs, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../utils/firebase";

const AllArticlesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 0 46px;
  display: flex;
  flex-wrap: wrap;
`;

const ArticleCard = styled(Link)`
  width: calc((100% - 120px) / 3);
  margin: 0 20px 50px;
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
    <AllArticlesContainer>
      {allPetArticles.map((article, index) => (
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
  );
};

export default AllArticles;
