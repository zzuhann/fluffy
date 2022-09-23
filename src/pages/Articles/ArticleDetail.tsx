import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { db } from "../../utils/firebase";
import { useParams } from "react-router-dom";
import { AllPetArticlesType } from "./AllArticles";
import parse from "html-react-parser";
import "./ArticleDetail.css";
import notyetLike from "./heart.png";
import alreadyLike from "./love.png";
import comment from "./chat.png";
import { Btn } from "../ProfileSetting/UserInfos";

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  height: auto;
  background-color: #fafafa;
  position: relative;
`;

const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  position: relative;
  margin: 0 auto;
  padding-top: 120px;
  padding-bottom: 30px;
  border-radius: 5px;
  overflow: hidden;
  letter-spacing: 1px;
  @media (max-width: 800px) {
    padding-left: 30px;
    padding-right: 30px;
  }
  @media (max-width: 650px) {
    padding-left: 15px;
    padding-right: 15px;
  }
  @media (max-width: 400px) {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const CoverAuthorContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  border: solid 1px rgba(0, 0, 0, 0.1);
`;
const ArticleCover = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  @media (max-width: 440px) {
    height: 200px;
  }
`;
const TitleContainer = styled.div`
  position: relative;
  padding: 20px;
`;
const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 38px;
  @media (max-width: 650px) {
    font-size: 28px;
  }
`;
const Author = styled(Link)`
  font-size: 18px;
  color: #3c3c3c;
`;
const ArticleDate = styled.div`
  color: #7d7d7d;
  margin-bottom: 10px;
  font-size: 18px;
`;
const ArticleContext = styled.div`
  padding: 20px;
  font-size: 18px;
  line-height: 34px;
  letter-spacing: 1.2px;
  @media (max-width: 650px) {
    font-size: 16px;
  }
  @media (max-width: 400px) {
    line-height: 20px;
  }
`;
const RecordContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
`;
const Record = styled.div`
  font-size: 16px;
  margin-right: 15px;
  margin-left: 5px;
`;
const RecordImg = styled.img`
  width: 25px;
  height: 25px;
`;
const CommentRecordImg = styled.img`
  width: 23px;
  height: 23px;
`;
const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0;
`;
const AddComment = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
const AddCommentTextArea = styled.textarea`
  resize: vertical;
  width: 100%;
  min-height: 60px;
  max-height: 80px;
  border: 3px solid #efefef;
  border-radius: 5px;
  padding: 10px 15px;
  padding-right: 80px;
  font-size: 18px;
`;
const AddCommentBtn = styled(Btn)`
  bottom: 20px;
  right: 10px;
  font-size: 16px;
  padding: 5px 10px;
`;
const CommentCount = styled.div`
  margin-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 15px;
`;

const CommentCard = styled.div`
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 15px;
  word-break: break-all;
`;
const CommentUserContainer = styled.div`
  display: flex;
`;
const CommentUserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  object-fit: cover;
`;
const CommentUserName = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 15px;
  font-weight: bold;
`;
const CommentTime = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 14px;
  color: #7d7d7d;
`;
const CommentContext = styled.div`
  margin-left: 55px;
  padding-right: 10px;
  line-height: 20px;
  @media (max-width: 440px) {
    margin-left: 0;
    margin-top: 10px;
    font-size: 14px;
  }
`;

export type CommentType = {
  user: {
    name: string;
    img: string;
  };
  useruid: string;
  context: string;
  commentTime: number;
};

const ArticleDetail = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const { id } = useParams();
  const navigate = useNavigate();
  const [targetArticle, setTargetArticle] = useState<AllPetArticlesType>();
  const [articleComments, setArticleComments] = useState<CommentType[]>([]);
  const [newCommentContext, setNewCommentContext] = useState<string>();

  async function addArticleComment() {
    if (!targetArticle) return;
    if (!newCommentContext) {
      window.alert("留言內容不能為空白！");
      return;
    }
    await addDoc(collection(db, `petArticles/${targetArticle.id}/comments`), {
      user: {
        name: profile.name,
        img: profile.img,
      },
      useruid: profile.uid,
      context: newCommentContext,
      commentTime: Date.now(),
    });
    const articlesRef = doc(db, "petArticles", targetArticle.id);
    await updateDoc(articlesRef, {
      commentCount: targetArticle.commentCount + 1,
    });
    setNewCommentContext("");
    window.alert("留言成功");
    getArticleComments();
    getSpecificArticle();
  }

  async function getArticleComments() {
    if (!targetArticle) return;
    const articleComments: CommentType[] = [];
    const articlesRef = collection(
      db,
      `petArticles/${targetArticle.id}/comments`
    );
    let articlesSnapshot = await getDocs(
      query(articlesRef, orderBy("commentTime"))
    );
    articlesSnapshot.forEach((info) => {
      articleComments.push(info.data() as CommentType);
    });

    setArticleComments(articleComments);
  }

  async function getSpecificArticle() {
    const docRef = doc(db, "petArticles", id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTargetArticle({
        id: docSnap.id,
        ...docSnap.data(),
      } as AllPetArticlesType);
    } else {
      console.log("No such document!");
    }
  }

  async function toggleLike() {
    if (!targetArticle) return;
    if (!profile.isLogged) {
      window.alert("按讚需先登入，確認後導向登入頁面");
      navigate("/profile");
      return;
    }
    const articleDetailRef = doc(db, "petArticles", id as string);
    if (targetArticle.likedBy.includes(profile.uid)) {
      await updateDoc(articleDetailRef, {
        likedBy: arrayRemove(profile.uid),
      });
      const index = targetArticle.likedBy.indexOf(profile.uid);
      if (index > -1) {
        targetArticle.likedBy.splice(index, 1);
        setTargetArticle({
          ...targetArticle,
          likedBy: targetArticle.likedBy,
        });
      }
    } else {
      await updateDoc(articleDetailRef, {
        likedBy: arrayUnion(profile.uid),
      });
      targetArticle.likedBy.push(profile.uid);
      setTargetArticle({
        ...targetArticle,
        likedBy: targetArticle.likedBy,
      });
    }
  }

  useEffect(() => {
    getSpecificArticle();
  }, []);
  useEffect(() => {
    getArticleComments();
  }, [targetArticle]);

  if (!targetArticle) return null;
  return (
    <Wrap>
      <ArticleContainer>
        <CoverAuthorContainer>
          <ArticleCover src={targetArticle.img} />
          <TitleContainer>
            <Title>{targetArticle.title}</Title>
            <ArticleDate>
              {new Date(targetArticle.postTime).getFullYear()}/
              {new Date(targetArticle.postTime).getMonth() + 1}/
              {new Date(targetArticle.postTime).getDate()}
            </ArticleDate>
            <Author to={`/profile/${targetArticle.authorUid}`}>
              作者: {targetArticle.author.name}
            </Author>
          </TitleContainer>
        </CoverAuthorContainer>
        <ArticleContext className="DetailProseMirror">
          {parse(targetArticle.context)}
        </ArticleContext>
        <RecordContainer>
          {targetArticle.likedBy.includes(profile.uid) ? (
            <>
              <RecordImg
                src={alreadyLike}
                onClick={() => {
                  toggleLike();
                }}
              />
              <Record>{targetArticle.likedBy.length}</Record>
            </>
          ) : (
            <>
              <RecordImg
                src={notyetLike}
                onClick={() => {
                  toggleLike();
                }}
              />
              <Record>{targetArticle.likedBy.length}</Record>
            </>
          )}
          <CommentRecordImg src={comment} />
          <Record>{targetArticle.commentCount}</Record>
        </RecordContainer>
        <CommentContainer>
          <AddComment>
            <AddCommentTextArea
              value={newCommentContext}
              placeholder="新增留言 ..."
              onChange={(e) => {
                setNewCommentContext(e.target.value);
              }}
            />
            <AddCommentBtn
              onClick={() => {
                if (!profile.isLogged) {
                  window.alert("留言需先登入，確認後導向登入頁面");
                  navigate("/profile");
                  return;
                }
                addArticleComment();
              }}
            >
              送出
            </AddCommentBtn>
          </AddComment>
          <CommentCount>共 {targetArticle.commentCount} 則留言</CommentCount>
          {articleComments.map((comment, index) => (
            <CommentCard key={index}>
              <CommentUserContainer>
                <CommentUserImg src={comment.user.img} />
                <CommentUserName>{comment.user.name}</CommentUserName>
              </CommentUserContainer>
              <CommentTime>
                {new Date(comment.commentTime).getFullYear()}/
                {new Date(comment.commentTime).getMonth() + 1}/
                {new Date(comment.commentTime).getDate()}{" "}
                {new Date(comment.commentTime).getHours()}:
                {new Date(comment.commentTime).getMinutes()}
              </CommentTime>
              <CommentContext>{comment.context}</CommentContext>
            </CommentCard>
          ))}
        </CommentContainer>
      </ArticleContainer>
    </Wrap>
  );
};

export default ArticleDetail;
