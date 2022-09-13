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
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { db } from "../../utils/firebase";
import { Link, useParams } from "react-router-dom";
import notyetLike from "./like.png";
import alreadyLike from "./like (1).png";
import { AllPetDiariesType } from "./AllPetDiraies";
import { CommentType } from "../Articles/ArticleDetail";

const DiaryContainer = styled.div`
  display: flex;
  max-width: 1120px;
  margin: 30px auto;
`;
const DiaryImage = styled.img`
  width: 500px;
  height: 500px;
  object-fit: cover;
  margin-right: 20px;
`;
const DiaryTextInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const DiaryAuthorContainer = styled(Link)`
  display: flex;
`;
const AuthorImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  object-fit: cover;
`;
const AuthorName = styled.div``;
const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow-y: scroll;
`;
const PetInfo = styled.div``;
const DiaryContext = styled.div`
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
`;
const PostTime = styled.div``;
const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;
const CommentCard = styled.div`
  position: relative;
`;
const RecordContainer = styled.div`
  display: flex;
`;
const RecordImg = styled.img`
  width: 30px;
  height: 30px;
`;
const Record = styled.div`
  margin-right: 15px;
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
const CommentUserName = styled.div``;
const CommentTime = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
`;
const CommentContext = styled.div``;
const AddComment = styled.div`
  display: flex;
  flex-direction: column;
`;
const AddCommentTextArea = styled.textarea`
  resize: vertical;
  width: 100%;
`;
const AddCommentBtn = styled.div`
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const DiaryDetail = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const { id } = useParams();
  const [targetDiary, setTargetDiary] = useState<AllPetDiariesType>();
  const [diaryComments, setDiaryComments] = useState<CommentType[]>([]);
  const [newCommentContext, setNewCommentContext] = useState<string>();

  async function addDiaryComment() {
    if (!targetDiary) return;
    if (!newCommentContext) {
      window.alert("留言內容不能為空白！");
      return;
    }
    await addDoc(collection(db, `petDiaries/${targetDiary.id}/comments`), {
      user: {
        name: profile.name,
        img: profile.img,
      },
      useruid: profile.uid,
      context: newCommentContext,
      commentTime: Date.now(),
    });
    const articlesRef = doc(db, "petDiaries", targetDiary.id);
    await updateDoc(articlesRef, {
      commentCount: targetDiary.commentCount + 1,
    });
    setNewCommentContext("");
    window.alert("留言成功");
    getDiaryComments();
    getSpecificDiary();
  }

  async function getDiaryComments() {
    if (!targetDiary) return;
    const diaryComments: CommentType[] = [];
    const diariesRef = collection(db, `petDiaries/${targetDiary.id}/comments`);
    let diariesSnapshot = await getDocs(
      query(diariesRef, orderBy("commentTime"))
    );
    diariesSnapshot.forEach((info) => {
      diaryComments.push(info.data() as CommentType);
    });

    setDiaryComments(diaryComments);
  }

  async function getSpecificDiary() {
    const docRef = doc(db, "petDiaries", id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTargetDiary({
        id: docSnap.id,
        ...docSnap.data(),
      } as AllPetDiariesType);
    } else {
      console.log("No such document!");
    }
  }

  async function toggleLike() {
    if (!targetDiary) return;
    const articleDetailRef = doc(db, "petDiaries", id as string);
    if (targetDiary.likedBy.includes(profile.uid)) {
      await updateDoc(articleDetailRef, {
        likedBy: arrayRemove(profile.uid),
      });
      const index = targetDiary.likedBy.indexOf(profile.uid);
      if (index > -1) {
        targetDiary.likedBy.splice(index, 1);
        setTargetDiary({
          ...targetDiary,
          likedBy: targetDiary.likedBy,
        });
      }
    } else {
      await updateDoc(articleDetailRef, {
        likedBy: arrayUnion(profile.uid),
      });
      targetDiary.likedBy.push(profile.uid);
      setTargetDiary({
        ...targetDiary,
        likedBy: targetDiary.likedBy,
      });
    }
  }

  useEffect(() => {
    getSpecificDiary();
  }, []);

  useEffect(() => {
    getDiaryComments();
  }, [targetDiary]);

  if (!targetDiary) return null;
  return (
    <DiaryContainer>
      <DiaryImage src={targetDiary.img} />
      <DiaryTextInfo>
        <DiaryAuthorContainer to={`/profile/${targetDiary.authorUid}`}>
          <AuthorImg src={targetDiary.author.img} />
          <AuthorName>Author: {targetDiary.author.name}</AuthorName>
        </DiaryAuthorContainer>
        <MainSection>
          <PetInfo>
            主角: {targetDiary.petName}(
            {`${new Date().getFullYear() - targetDiary.birthYear}`}Y)
          </PetInfo>
          <DiaryContext>{targetDiary.context}</DiaryContext>
          <PostTime>
            發布於 {new Date(targetDiary.postTime).getFullYear()}/
            {new Date(targetDiary.postTime).getMonth() + 1}/
            {new Date(targetDiary.postTime).getDate()}
          </PostTime>
          <PostTime>
            拍攝於 {new Date(targetDiary.takePhotoTime).getFullYear()}/
            {new Date(targetDiary.takePhotoTime).getMonth() + 1}/
            {new Date(targetDiary.takePhotoTime).getDate()}
          </PostTime>
          <CommentContainer>
            留言區
            {diaryComments.map((comment, index) => (
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
        </MainSection>
        <RecordContainer>
          <Record>喜歡 {targetDiary.likedBy.length}</Record>
          <Record>留言 {targetDiary.commentCount}</Record>
          {targetDiary.likedBy.includes(profile.uid) ? (
            <RecordImg
              src={alreadyLike}
              onClick={() => {
                toggleLike();
              }}
            />
          ) : (
            <RecordImg
              src={notyetLike}
              onClick={() => {
                toggleLike();
              }}
            />
          )}
        </RecordContainer>
        <AddComment>
          <AddCommentTextArea
            value={newCommentContext}
            onChange={(e) => {
              setNewCommentContext(e.target.value);
            }}
          ></AddCommentTextArea>
          <AddCommentBtn
            onClick={() => {
              addDiaryComment();
            }}
          >
            新增留言
          </AddCommentBtn>
        </AddComment>
      </DiaryTextInfo>
    </DiaryContainer>
  );
};

export default DiaryDetail;
