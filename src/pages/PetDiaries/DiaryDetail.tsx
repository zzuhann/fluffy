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
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { db } from "../../utils/firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import notyetLike from "./heart.png";
import alreadyLike from "./love.png";
import comment from "./chat.png";
import { AllPetDiariesType } from "./AllPetDiraies";
import { CommentType } from "../Articles/ArticleDetail";
import { Btn } from "../ProfileSetting/UserInfos";
import { LoginRegisterBox } from "../ProfileSetting/ProfileLoginRegister";
import { Loading } from "../../utils/loading";

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  position: relative;
  padding-top: 120px;
  padding-bottom: 120px;
  @media (max-width: 1120px) {
    padding-left: 50px;
    padding-right: 50px;
  }
  @media (max-width: 514px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const DiaryContainer = styled.div`
  display: flex;
  max-width: 1120px;
  margin: 0 auto;
  position: relative;
  /* top: 120px; */
  border: solid 1px #dbdbdb;
  border-radius: 10px;
  overflow: hidden;
  font-size: 16px;
  @media (max-width: 889px) {
    flex-direction: column;
  }
`;

const DiaryImage = styled.img`
  width: 500px;
  height: 500px;
  object-fit: cover;
  @media (max-width: 1060px) {
    width: 400px;
  }
  @media (max-width: 889px) {
    width: 100%;
    height: 400px;
  }
  @media (max-width: 558px) {
    height: 300px;
  }
`;

const DiaryTextInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
  @media (max-width: 889px) {
    padding-bottom: 20px;
  }
`;

const DiaryAuthorContainer = styled(Link)`
  display: flex;
  border-bottom: 1px solid #efefef;
  padding: 10px 15px;
  position: relative;
`;

const DiaryAuthorContainerNoBorder = styled(Link)`
  display: flex;
  padding: 10px 15px 0 0;
  position: relative;
`;

const AuthorImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  object-fit: cover;
`;
const AuthorName = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #3c3c3c;
  letter-spacing: 1px;
  line-height: 20px;
`;
const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow-y: scroll;
  padding: 0 15px 0 15px;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:vertical {
    width: 11px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white;
    background-color: #efefef;
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;

const DiaryContext = styled.div`
  font-size: 16px;
  margin-left: 55px;
  margin-bottom: 16px;
  margin-top: 10px;
  white-space: pre-wrap;
`;
const TimeContainer = styled.div`
  display: flex;
  margin-left: 55px;
  font-size: 16px;
  color: #7d7d7d;
`;

const PostTime = styled.div``;
const TakeptTime = styled.div`
  margin-left: 20px;
`;

const CommentTitle = styled.div``;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #efefef;
  word-break: break-all;
`;

const CommentCard = styled.div`
  position: relative;
  margin-top: 25px;
`;
const RecordContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  left: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
`;
const RecordImg = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const CommentRecordImg = styled.img`
  width: 23px;
  height: 23px;
`;
const Record = styled.div`
  margin-right: 15px;
  margin-left: 5px;
  font-size: 16px;
  position: relative;
  bottom: 3px;
`;

const CommentUserContainer = styled.div`
  display: flex;
  align-items: center;
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
  @media (max-width: 889px) {
    top: 13px;
  }
  @media (max-width: 409px) {
    top: auto;
    bottom: -22px;
    color: #7d7d7d;
  }
`;
const CommentContext = styled.div`
  margin-left: 55px;
  padding-right: 10px;
  line-height: 20px;
  white-space: pre-wrap;
  @media (max-width: 478px) {
    margin-left: 0px;
    margin-top: 10px;
  }
`;
const AddComment = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px 0 15px;
  position: relative;
`;
const AddCommentTextArea = styled.textarea`
  resize: vertical;
  min-height: 60px;
  max-height: 80px;
  width: 100%;
  border: 3px solid #efefef;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 18px;
  padding-right: 90px;
`;
const AddCommentBtn = styled(Btn)`
  top: 50%;
  transform: translateY(-50%);
  right: 25px;
  padding: 5px 10px;
`;

const DiaryDetail = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const { id } = useParams();
  const navigate = useNavigate();
  const [targetDiary, setTargetDiary] = useState<AllPetDiariesType>();
  const [diaryComments, setDiaryComments] = useState<CommentType[]>([]);
  const [newCommentContext, setNewCommentContext] = useState<string>();
  const [openLoginBox, setOpenLoginBox] = useState(false);
  const commentSection = useRef<HTMLHeadingElement>(null);
  const [commentScrollHeight, setCommentScrollHeight] = useState<number>(0);
  const [loadingComment, setLoadingComment] = useState(false);

  useEffect(() => {
    if (commentSection.current) {
      commentSection.current.scrollTop = commentScrollHeight;
    }
  }, [commentScrollHeight]);

  async function addDiaryComment() {
    if (!targetDiary) return;
    if (!newCommentContext) {
      return;
    }
    setLoadingComment(true);
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
    getDiaryComments();
    getSpecificDiary();
    if (commentSection.current) {
      setCommentScrollHeight(commentSection.current.scrollHeight + 100);
    }
    setLoadingComment(false);
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
      navigate("/petdiary");
    }
  }

  async function toggleLike() {
    if (!targetDiary) return;
    if (!profile.isLogged) {
      setOpenLoginBox(true);
      return;
    }
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
    <Wrap>
      <DiaryContainer>
        <DiaryImage src={targetDiary.img} />
        <DiaryTextInfo>
          <DiaryAuthorContainer to={`/profile/${targetDiary.authorUid}`}>
            <AuthorImg src={targetDiary.author.img} />
            <AuthorName>
              {targetDiary.author.name}/ {targetDiary.petName}(
              {`${new Date().getFullYear() - targetDiary.birthYear}`}y)
            </AuthorName>
          </DiaryAuthorContainer>
          <MainSection ref={commentSection}>
            <DiaryAuthorContainerNoBorder
              to={`/profile/${targetDiary.authorUid}`}
            >
              <AuthorImg src={targetDiary.author.img} />
              <AuthorName>{targetDiary.author.name}</AuthorName>
            </DiaryAuthorContainerNoBorder>
            <DiaryContext>{targetDiary.context}</DiaryContext>
            <TimeContainer>
              <PostTime>
                發布於 {new Date(targetDiary.postTime).getFullYear()}/
                {new Date(targetDiary.postTime).getMonth() + 1}/
                {new Date(targetDiary.postTime).getDate()}
              </PostTime>
              <TakeptTime>
                拍攝於 {new Date(targetDiary.takePhotoTime).getFullYear()}/
                {new Date(targetDiary.takePhotoTime).getMonth() + 1}/
                {new Date(targetDiary.takePhotoTime).getDate()}
              </TakeptTime>
            </TimeContainer>
            <CommentContainer>
              <CommentTitle>留言區</CommentTitle>
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
                    {new Date(comment.commentTime).getHours() < 10
                      ? `0${new Date(comment.commentTime).getHours()}`
                      : new Date(comment.commentTime).getHours()}
                    :
                    {new Date(comment.commentTime).getMinutes() < 10
                      ? `0${new Date(comment.commentTime).getMinutes()}`
                      : new Date(comment.commentTime).getMinutes()}
                  </CommentTime>
                  <CommentContext>{comment.context}</CommentContext>
                </CommentCard>
              ))}
            </CommentContainer>
          </MainSection>
          <RecordContainer>
            {targetDiary.likedBy.includes(profile.uid) ? (
              <>
                <RecordImg
                  src={alreadyLike}
                  onClick={() => {
                    toggleLike();
                  }}
                />
                <Record>{targetDiary.likedBy.length}</Record>
              </>
            ) : (
              <>
                <RecordImg
                  src={notyetLike}
                  onClick={() => {
                    toggleLike();
                  }}
                />
                <Record>{targetDiary.likedBy.length}</Record>
              </>
            )}
            <CommentRecordImg src={comment} />
            <Record>{targetDiary.commentCount}</Record>
          </RecordContainer>
          <AddComment>
            <AddCommentTextArea
              value={newCommentContext}
              placeholder="新增留言 ..."
              onChange={(e) => {
                setNewCommentContext(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!profile.isLogged) {
                    setOpenLoginBox(true);
                    return;
                  }
                  addDiaryComment();
                }
              }}
            ></AddCommentTextArea>
            {loadingComment ? (
              <Loading
                $Top={"50%"}
                $Bottom={"auto"}
                $Right={"30px"}
                $Left={"auto"}
                $transform={"translateY(-50%)"}
              />
            ) : (
              <AddCommentBtn
                onClick={() => {
                  if (!profile.isLogged) {
                    setOpenLoginBox(true);
                    return;
                  }
                  addDiaryComment();
                }}
              >
                送出
              </AddCommentBtn>
            )}
          </AddComment>
        </DiaryTextInfo>
      </DiaryContainer>
      {openLoginBox && (
        <LoginRegisterBox
          openLoginBox={openLoginBox}
          setOpenLoginBox={setOpenLoginBox}
          $Top={0}
        />
      )}
    </Wrap>
  );
};

export default DiaryDetail;
