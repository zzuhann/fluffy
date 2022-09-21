import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
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
import {
  Btn,
  Title,
  EditContainer,
  EditInfoLabel,
  EditInfoInput,
  CancelIcon,
} from "./UserInfos";
import parse from "html-react-parser";
import trash from "./bin.png";
import upload from "./upload.png";

const FinishAddArticleBtn = styled(Btn)`
  bottom: 15px;
  right: 100px;
`;

const CancelBtn = styled(Btn)`
  bottom: 15px;
  right: 15px;
`;

const EditTitleInput = styled(EditInfoInput)`
  width: 300px;
  @media (max-width: 533px) {
    margin-left: 15px;
    width: 200px;
  }
  @media (max-width: 465px) {
    margin-left: 5px;
    width: 100%;
  }
`;

const EditArticleLabel = styled(EditInfoLabel)`
  width: 100px;
  margin-left: 0;
  @media (max-width: 533px) {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

const CoverEditArticleLabel = styled(EditArticleLabel)`
  @media (max-width: 533px) {
    display: none;
  }
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

const HintUploadImg = styled.div`
  font-size: 18px;
  color: #3c3c3c;
  font-weight: bold;
  position: absolute;
  border: 2px solid #d1cfcf;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 350px;
  height: 200px;
  padding-left: 15px;
  @media (max-width: 533px) {
    padding-left: 0px;
  }
`;

const PreviewImg = styled.img`
  width: 350px;
  height: 200px;
  object-fit: cover;
  position: relative;
`;

const PreviewCancelBtn = styled.div`
  position: absolute;
  bottom: -10px;
  right: -25px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #d0470c;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #952f04;
    color: #fff;
  }
  @media (max-width: 533px) {
    bottom: -5px;
    right: -20px;
  }
  @media (max-width: 465px) {
    bottom: -5px;
    right: -10px;
  }
`;

const PetDetailImg = styled.label`
  width: 350px;
  height: 200px;
  object-fit: cover;
  position: relative;
  padding-left: 15px;
  @media (max-width: 533px) {
    padding-left: 0px;
  }
`;
const PetDetailInput = styled.input`
  display: none;
`;

type PetArticleType = {
  addArticleInfo: {
    title: string;
    context: string;
  };
  // setAddArticleInfo: (value: { title: string; context: string }) => void;
  setAddArticleInfo: Dispatch<
    SetStateAction<{ title: string; context: string }>
  >;
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
  const [detailArticleOpen, setDetailArticleOpen] = useState<boolean>(false);

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
    // getAuthorArticles(profile.uid);
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
      const updateOwnPetArticle = profile.ownArticles;
      updateOwnPetArticle[ownArticleIndex] = {
        ...updateOwnPetArticle[ownArticleIndex],
        title: editArticleContext.title,
        context: editArticleContext.context,
        img: editArticleCover.url,
      };
      dispatch(setOwnArticle(updateOwnPetArticle));
      window.alert("更新完成！");
      setEditArticleMode(false);
      if (editArticleCover.file) {
        await updateNewArticleDataFirebase(
          editArticleCover.file.name,
          editArticleCover.file
        );
      }
    } else {
      const updateOwnPetArticle = profile.ownArticles;
      updateOwnPetArticle[ownArticleIndex] = {
        ...updateOwnPetArticle[ownArticleIndex],
        title: editArticleContext.title,
        context: editArticleContext.context,
      };
      dispatch(setOwnArticle(updateOwnPetArticle));
      window.alert("更新完成！");
      setEditArticleMode(false);
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
      // getAuthorArticles(profile.uid);
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
        <AddArticleInfoContainer>
          <FinishAddArticleBtn
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
                const newArticleArr = profile.ownArticles;
                newArticleArr.push({
                  ...props.addArticleInfo,
                  img: props.articleCover.url,
                  postTime: Date.now(),
                  author: { img: profile.img as string, name: profile.name },
                  commentCount: 0,
                  likedBy: [],
                  authorUid: profile.uid,
                  id: "",
                });
                dispatch(setOwnArticle(newArticleArr));
                window.alert("成功上傳！");
                setAddArticleMode(false);
                addDataWithUploadImage(
                  `petArticles/${props.articleCover.file.name}`,
                  props.articleCover.file,
                  addPetArticleDoc
                );
              }
            }}
          >
            上傳文章
          </FinishAddArticleBtn>
          <CancelBtn
            onClick={() => {
              setAddArticleMode(false);
              props.setAddArticleInfo({
                title: "",
                context: "",
              });
              props.setArticleCover({ file: "", url: "" });
            }}
          >
            取消
          </CancelBtn>
          <EditContainer>
            <EditArticleLabel htmlFor="title">文章標題: </EditArticleLabel>
            <EditTitleInput
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
            <CoverEditArticleLabel htmlFor="cover">
              文章封面:{" "}
            </CoverEditArticleLabel>
            {props.articleCover.url ? (
              <PreviewContainer>
                <PreviewImg src={props.articleCover.url} alt="" />
                <PreviewCancelBtn
                  onClick={() => {
                    props.setArticleCover({ file: "", url: "" });
                  }}
                >
                  <CancelIcon src={trash} />
                </PreviewCancelBtn>
              </PreviewContainer>
            ) : (
              <>
                <PetDetailImg htmlFor="cover">
                  <HintUploadImg>請在此上傳封面</HintUploadImg>
                  <PreviewCancelBtn>
                    <CancelIcon src={upload} />
                  </PreviewCancelBtn>
                </PetDetailImg>

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
              </>
            )}
          </EditContainer>
          <PetArticle
            setAddArticleInfo={props.setAddArticleInfo}
            addArticleInfo={props.addArticleInfo}
          />
          <ContextDetails addArticleInfo={props.addArticleInfo} />
        </AddArticleInfoContainer>
      ) : editArticleMode ? (
        <InfoContainer>
          <EditContainer>
            <EditArticleLabel htmlFor="title">文章標題: </EditArticleLabel>
            <EditTitleInput
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
                  <CancelIcon src={trash} />
                </PreviewCancelBtn>
              </PreviewContainer>
            ) : (
              <>
                <PetDetailImg htmlFor="cover">
                  <HintUploadImg>請在此上傳封面</HintUploadImg>
                  <PreviewCancelBtn>
                    <CancelIcon src={upload} />
                  </PreviewCancelBtn>
                </PetDetailImg>
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
              </>
            )}
          </EditContainer>

          <EditPetArticle
            editArticleContext={editArticleContext}
            setEditArticleContext={setEditArticleContext}
          />
          <EditContextDetails editArticleContext={editArticleContext} />
          <FinishAddArticleBtn
            onClick={() => {
              updateArticleInfoCondition();
            }}
          >
            更新文章
          </FinishAddArticleBtn>
          <CancelBtn onClick={() => setEditArticleMode(false)}>取消</CancelBtn>
        </InfoContainer>
      ) : detailArticleOpen && profile.ownArticles[ownArticleIndex] ? (
        <InfoContainer>
          <ArticleCover src={profile.ownArticles[ownArticleIndex].img} />
          <ArticleTitle>
            {profile.ownArticles[ownArticleIndex].title}
          </ArticleTitle>
          <ArticlePostTime>{`${new Date(
            profile.ownArticles[ownArticleIndex].postTime
          ).getFullYear()}-${
            new Date(profile.ownArticles[ownArticleIndex].postTime).getMonth() +
              1 <
            10
              ? `0${
                  new Date(
                    profile.ownArticles[ownArticleIndex].postTime
                  ).getMonth() + 1
                }`
              : `${
                  new Date(
                    profile.ownArticles[ownArticleIndex].postTime
                  ).getMonth() + 1
                }`
          }-${
            new Date(profile.ownArticles[ownArticleIndex].postTime).getDate() <
            10
              ? `0${new Date(
                  profile.ownArticles[ownArticleIndex].postTime
                ).getDate()}`
              : `${new Date(
                  profile.ownArticles[ownArticleIndex].postTime
                ).getDate()}`
          }`}</ArticlePostTime>
          <ArticleContext className="DetailProseMirror">
            {parse(profile.ownArticles[ownArticleIndex].context)}
          </ArticleContext>
          <EditArticleBtn
            onClick={() => {
              setEditArticleMode(true);
            }}
          >
            編輯
          </EditArticleBtn>
          <DeteleArticleBtn
            onClick={async () => {
              await deleteFirebaseDataMutipleWhere(
                `/petArticles`,
                "postTime",
                profile.ownArticles[ownArticleIndex].postTime,
                "authorUid",
                profile.uid
              );
              setDetailArticleOpen(false);
              const DeleOwnPetArticle = profile.ownArticles;
              DeleOwnPetArticle.splice(ownArticleIndex, 1);
              dispatch(setOwnArticle(DeleOwnPetArticle));
              window.alert("刪除完成！");
            }}
          >
            刪除
          </DeteleArticleBtn>
          <CancelDetailBtn onClick={() => setDetailArticleOpen(false)}>
            取消
          </CancelDetailBtn>
        </InfoContainer>
      ) : (
        <InfoContainer>
          <ArticleSectionTitle>寵物文章</ArticleSectionTitle>
          <AddArticleBtn onClick={() => setAddArticleMode(true)}>
            新增文章
          </AddArticleBtn>
          <UserArticleContainer>
            {profile.ownArticles.map((article, index) => (
              <UserArticle
                key={index}
                onClick={() => {
                  setDetailArticleOpen(true);
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
                <UserArticleImg src={article.img} />
                <UserArticleTitle>{article.title}</UserArticleTitle>
              </UserArticle>
            ))}
          </UserArticleContainer>
        </InfoContainer>
      )}
    </>
  );
};

const ArticleSectionTitle = styled(Title)`
  @media (max-width: 470px) {
    font-size: 22px;
  }
  @media (max-width: 403px) {
    left: 0;
    top: 10px;
  }
`;

const AddArticleBtn = styled(Btn)`
  top: 20px;
  right: 40px;
  @media (max-width: 960px) {
    right: 20px;
  }
  @media (max-width: 470px) {
    padding: 5px;
    top: 15px;
  }
  @media (max-width: 403px) {
    right: 10px;
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  margin-top: 30px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  padding: 20px 40px;
  position: relative;
  margin-bottom: 50px;

  @media (max-width: 960px) {
    padding: 20px;
  }
  @media (max-width: 403px) {
    padding: 10px;
  }
`;

const AddArticleInfoContainer = styled(InfoContainer)`
  padding-bottom: 70px;
`;

const UserArticleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
  position: relative;
  justify-content: space-between;
  margin-top: 30px;
  @media (max-width: 742px) {
    flex-direction: column;
  }
`;

const UserArticle = styled.div`
  display: flex;
  width: calc((100% - 100px) / 2);
  align-items: center;
  flex-direction: column;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  padding: 15px;
  position: relative;
  margin-bottom: 30px;
  transition: 0.3s;
  bottom: 0;
  cursor: pointer;
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
  @media (max-width: 1170px) {
    width: calc((100% - 30px) / 2);
  }
  @media (max-width: 960px) {
    padding: 10px;
  }
  @media (max-width: 742px) {
    width: 100%;
  }
  @media (max-width: 742px) {
    padding: 15px;
  }
  @media (max-width: 470px) {
    padding: 10px;
  }
`;

const UserArticleImg = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  @media (max-width: 1170px) {
    width: 90%;
    height: 200px;
  }
  @media (max-width: 960px) {
    width: 100%;
    height: 150px;
  }
  @media (max-width: 742px) {
    height: 250px;
  }
  @media (max-width: 558px) {
    height: 200px;
  }
  @media (max-width: 470px) {
    height: 150px;
  }
`;

const UserArticleTitle = styled.div`
  font-size: 22px;
  letter-spacing: 1.5px;
  line-height: 30px;
  margin-top: 10px;
  font-weight: bold;
  align-self: flex-start;
  @media (max-width: 1170px) {
    width: 90%;
    align-self: center;
  }
  @media (max-width: 960px) {
    width: 100%;
  }
  @media (max-width: 742px) {
    font-size: 28px;
  }
  @media (max-width: 558px) {
    font-size: 22px;
  }
`;

const ArticleCover = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  @media (max-width: 853px) {
    height: 350px;
  }
  @media (max-width: 740px) {
    height: 300px;
  }
  @media (max-width: 542px) {
    height: 250px;
  }
`;

const ArticleTitle = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 15px;
  @media (max-width: 542px) {
    font-size: 28px;
  }
  @media (max-width: 416px) {
    font-size: 22px;
  }
`;

const ArticleContext = styled.div`
  margin-top: 25px;
`;

const ArticlePostTime = styled.div`
  padding-bottom: 20px;
  border-bottom: 2px solid #d1cfcf;
  color: #d1cfcf;
  font-weight: bold;
`;

const EditArticleBtn = styled(Btn)`
  right: 205px;
  top: 435px;
  @media (max-width: 960px) {
    right: 185px;
  }
  @media (max-width: 853px) {
    top: 385px;
  }
  @media (max-width: 740px) {
    top: 335px;
  }
  @media (max-width: 542px) {
    padding: 5px 10px;
    top: 290px;
    right: 150px;
    font-size: 16px;
  }
  @media (max-width: 416px) {
    padding: 5px;
    top: 285px;
  }
  @media (max-width: 403px) {
    right: 120px;
    top: 275px;
  }
`;

const DeteleArticleBtn = styled(Btn)`
  right: 125px;
  top: 435px;
  @media (max-width: 960px) {
    right: 105px;
  }
  @media (max-width: 853px) {
    top: 385px;
  }
  @media (max-width: 740px) {
    top: 335px;
  }
  @media (max-width: 542px) {
    padding: 5px 10px;
    top: 290px;
    right: 85px;
    font-size: 16px;
  }
  @media (max-width: 416px) {
    padding: 5px;
    top: 285px;
  }
  @media (max-width: 403px) {
    right: 65px;
    top: 275px;
  }
`;

const CancelDetailBtn = styled(Btn)`
  right: 40px;
  top: 435px;
  @media (max-width: 960px) {
    right: 20px;
  }
  @media (max-width: 853px) {
    top: 385px;
  }
  @media (max-width: 740px) {
    top: 335px;
  }
  @media (max-width: 542px) {
    padding: 5px 10px;
    top: 290px;
    font-size: 16px;
  }
  @media (max-width: 416px) {
    padding: 5px;
    top: 285px;
  }
  @media (max-width: 403px) {
    right: 10px;
    top: 275px;
  }
`;
