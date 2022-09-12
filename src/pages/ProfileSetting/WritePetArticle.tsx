import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Profile, OwnArticle } from "../../reducers/profile";
import {
  addDataWithUploadImage,
  db,
  deleteFirebaseDataMutipleWhere,
  storage,
  updateFirebaseDataMutipleWhere,
  updateUseStateInputImage,
} from "../../utils/firebase";
import {
  getDocs,
  collection,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { setOwnArticle } from "../../functions/profileReducerFunction";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  ContextDetails,
  EditContextDetails,
  EditPetArticle,
  PetArticle,
} from "./PetArticle";
import upload from "./plus.png";

export const EditContainer = styled.div`
  display: flex;
`;
export const EditInfoLabel = styled.label`
  flex-shrink: 0;
`;
export const EditInfoInput = styled.input``;
const CloseBtn = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  background-color: #000;
  z-index: 99;
`;

const SaveBtn = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 350px;
  height: 200px;
`;

const PreviewImg = styled.img`
  width: 350px;
  height: 200px;
  object-fit: cover;
  position: relative;
`;

const PreviewCancelBtn = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const PetDetailImg = styled.label`
  width: 350px;
  height: 200px;
  object-fit: cover;
  background-color: transparent;
`;
const PetDetailInput = styled.input`
  display: none;
`;

type PetArticleType = {
  addArticleInfo: {
    title: string;
    context: string;
  };
  setAddArticleInfo: (value: { title: string; context: string }) => void;
  articleCover: { file: File | string; url: string };
  setArticleCover: (value: { file: File | string; url: string }) => void;
};

type EditArticleType = {
  title: string;
  context: string;
};

type EditCover = { file: File | null; url: string };

export const WritePetArticle: React.FC<PetArticleType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [addArticleMode, setAddArticleMode] = useState<boolean>(false);
  const [editArticleMode, setEditArticleMode] = useState<boolean>(false);
  const [editArticleContext, setEditArticleContext] = useState<EditArticleType>(
    { title: "", context: "" }
  );
  const [editArticleCover, setEditArticleCover] = useState<EditCover>({
    file: null,
    url: "",
  });
  const [ownArticleIndex, setOwnArticleIndex] = useState<number>(-1);
  const [initialDiaryTimeStamp, setInitialDiaryTimeStamp] = useState<number>();

  async function addPetArticleDoc(imgURL: string) {
    await addDoc(collection(db, `/petArticles`), {
      ...props.addArticleInfo,
      img: imgURL,
      postTime: Date.now(),
      author: { img: profile.img, name: profile.name },
      commentCount: 0,
      likedBy: [],
      authorUid: profile.uid,
    });
    props.setAddArticleInfo({
      title: "",
      context: "",
    });
    props.setArticleCover({ file: "", url: "" });
    window.alert("成功上傳！");
  }

  function updateNewArticleDataFirebase(photoName: string, newPetImg: File) {
    const storageRef = ref(storage, `petArticles/${photoName}`);
    const uploadTask = uploadBytesResumable(storageRef, newPetImg);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("upload");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          updateArticleInfo(downloadURL);
        });
      }
    );
  }

  async function updateArticleInfo(imgURL: string) {
    const q = query(
      collection(db, `/petArticles`),
      where("postTime", "==", initialDiaryTimeStamp),
      where("authorUid", "==", profile.uid)
    );
    const querySnapshot = await getDocs(q);
    const promises: any[] = [];
    querySnapshot.forEach(async (d) => {
      const ownArticleRef = doc(db, `/petArticles`, d.id);
      if (imgURL) {
        promises.push(
          updateDoc(ownArticleRef, {
            title: editArticleContext.title,
            context: editArticleContext.context,
            img: imgURL,
          })
        );
      } else {
        promises.push(
          updateDoc(ownArticleRef, {
            title: editArticleContext.title,
            context: editArticleContext.context,
          })
        );
      }
    });
    await Promise.all(promises);
    getAuthorArticles(profile.uid);
  }

  async function updateArticleInfoCondition() {
    if (!editArticleContext.context && !editArticleContext.title) {
      window.alert("更新資料不可為空");
      return;
    }
    if (
      editArticleContext.context ===
        profile.ownArticles[ownArticleIndex].context &&
      editArticleContext.title === profile.ownArticles[ownArticleIndex].title &&
      editArticleCover.url === profile.ownArticles[ownArticleIndex].img
    ) {
      window.alert("未更新資料");
      return;
    }
    if (editArticleCover.url !== profile.ownArticles[ownArticleIndex].img) {
      if (editArticleCover.file) {
        await updateNewArticleDataFirebase(
          editArticleCover.file.name,
          editArticleCover.file
        );
      }
      window.alert("更新完成！");
      setEditArticleMode(false);
    } else {
      await updateFirebaseDataMutipleWhere(
        `/petArticles`,
        "postTime",
        initialDiaryTimeStamp as number,
        "authorUid",
        profile.uid,
        "",
        {
          title: editArticleContext.title,
          context: editArticleContext.context,
        }
      );
      getAuthorArticles(profile.uid);
      window.alert("更新完成！");
      setEditArticleMode(false);
    }
  }

  async function getAuthorArticles(authorUid: string) {
    const authorPetDiary: OwnArticle[] = [];
    const q = query(
      collection(db, "petArticles"),
      where("authorUid", "==", authorUid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetDiary.push(info.data() as OwnArticle);
    });
    dispatch(setOwnArticle(authorPetDiary));
  }

  useEffect(() => {
    getAuthorArticles(profile.uid);
  }, []);

  return (
    <>
      {addArticleMode ? (
        <div className="editContainer">
          <CloseBtn onClick={() => setAddArticleMode(false)}>X</CloseBtn>
          <EditContainer>
            <EditInfoLabel htmlFor="title">Title: </EditInfoLabel>
            <EditInfoInput
              id="title"
              value={props.addArticleInfo.title}
              onChange={(e) => {
                props.setAddArticleInfo({
                  ...props.addArticleInfo,
                  title: e.target.value,
                });
              }}
            />
          </EditContainer>
          <EditContainer>
            <EditInfoLabel htmlFor="cover">文章封面: </EditInfoLabel>
            {props.articleCover.url ? (
              <PreviewContainer>
                <PreviewImg src={props.articleCover.url} alt="" />
                <PreviewCancelBtn
                  onClick={() => {
                    props.setArticleCover({ file: "", url: "" });
                  }}
                >
                  取消
                </PreviewCancelBtn>
              </PreviewContainer>
            ) : (
              ""
            )}
            <PetDetailImg htmlFor="cover"></PetDetailImg>
            <PetDetailInput
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => {
                updateUseStateInputImage(
                  e.target.files as FileList,
                  props.setArticleCover
                );
              }}
            />
          </EditContainer>

          <PetArticle
            setAddArticleInfo={props.setAddArticleInfo}
            addArticleInfo={props.addArticleInfo}
          />
          <ContextDetails addArticleInfo={props.addArticleInfo} />
          <SaveBtn
            onClick={() => {
              if (
                !props.addArticleInfo.title ||
                !props.addArticleInfo.context
              ) {
                window.alert("請填寫完整文章資訊");
                return;
              }
              if (!props.articleCover.url) {
                window.alert("請上傳文章封面");
                return;
              }
              if (props.articleCover.file instanceof File) {
                addDataWithUploadImage(
                  `petArticles/${props.articleCover.file.name}`,
                  props.articleCover.file,
                  addPetArticleDoc
                );
              }
            }}
          >
            上傳文章
          </SaveBtn>
        </div>
      ) : editArticleMode ? (
        <div className="editContainer">
          <EditContainer>
            <EditInfoLabel htmlFor="title">Title: </EditInfoLabel>
            <EditInfoInput
              id="title"
              value={editArticleContext.title}
              onChange={(e) => {
                setEditArticleContext({
                  ...editArticleContext,
                  title: e.target.value,
                });
              }}
            />
          </EditContainer>
          <EditContainer>
            <EditInfoLabel htmlFor="cover">文章封面: </EditInfoLabel>
            {editArticleCover.url ? (
              <PreviewContainer>
                <PreviewImg src={editArticleCover.url} alt="" />
                <PreviewCancelBtn
                  onClick={() => {
                    setEditArticleCover({ file: null, url: "" });
                  }}
                >
                  取消
                </PreviewCancelBtn>
              </PreviewContainer>
            ) : (
              ""
            )}
            <PetDetailImg htmlFor="cover"></PetDetailImg>
            <PetDetailInput
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => {
                updateUseStateInputImage(
                  e.target.files as FileList,
                  setEditArticleCover
                );
              }}
            />
          </EditContainer>

          <EditPetArticle
            editArticleContext={editArticleContext}
            setEditArticleContext={setEditArticleContext}
          />
          <EditContextDetails editArticleContext={editArticleContext} />
          <SaveBtn
            onClick={() => {
              updateArticleInfoCondition();
            }}
          >
            更新文章
          </SaveBtn>
        </div>
      ) : (
        <UserArticleContainer>
          {profile.ownArticles.map((article, index) => (
            <UserArticle key={index}>
              <UserArticleImg src={article.img} />
              <UserArticleTitle>{article.title}</UserArticleTitle>
              <ArticleEditBtnContainer>
                <ArticleBtnEditandDel
                  onClick={() => {
                    setEditArticleMode(true);
                    setInitialDiaryTimeStamp(article.postTime);
                    setOwnArticleIndex(index);
                    setEditArticleCover({
                      ...editArticleCover,
                      url: profile.ownArticles[index].img,
                    });
                    setEditArticleContext({
                      ...editArticleContext,
                      title: profile.ownArticles[index].title,
                      context: profile.ownArticles[index].context,
                    });
                  }}
                >
                  編輯
                </ArticleBtnEditandDel>
                <ArticleBtnEditandDel
                  onClick={async () => {
                    await deleteFirebaseDataMutipleWhere(
                      `/petArticles`,
                      "postTime",
                      article.postTime,
                      "authorUid",
                      profile.uid
                    );
                    window.alert("刪除完成！");
                    getAuthorArticles(profile.uid);
                  }}
                >
                  刪除
                </ArticleBtnEditandDel>
              </ArticleEditBtnContainer>
            </UserArticle>
          ))}
          <UserArticle onClick={() => setAddArticleMode(true)}>
            <UserArticleImg src={upload} />
            <UserArticleTitle>新增日記</UserArticleTitle>
          </UserArticle>
        </UserArticleContainer>
      )}
    </>
  );
};

const UserArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserArticle = styled.div`
  width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserArticleImg = styled.img`
  width: 350px;
  height: 200px;
`;

const UserArticleTitle = styled.div`
  width: 300px;
  text-align: center;
`;

const ArticleEditBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const ArticleBtnEditandDel = styled.div`
  width: 150px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;
