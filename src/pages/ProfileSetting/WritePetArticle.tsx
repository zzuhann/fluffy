import React, { useState, Dispatch, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
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
} from "./UserInfos";
import {
  DeleteCheckBox,
  DeleteCheckText,
  DeleteCheckBoxBtnContainer,
  DeleteCheckBoxBtn,
  WarningDeleteBtn,
  NowNoInfoInHere,
  NowNoInfoImg,
  NowNoInfoText,
} from "./UserOwnPetInfos";
import parse from "html-react-parser";
import noarticle from "./img/shigoto_zaitaku_cat_man.png";
import { imgType } from "../../functions/commonFunctionAndType";
import { useNotifyDispatcher } from "../../component/SidebarNotify";
import { TellUserUploadImg, ToPreviewImg } from "../../component/PreviewImg";

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

const WarningText = styled.div`
  font-size: 22px;
  color: #b54745;
  @media (max-width: 533px) {
    font-size: 18px;
  }
`;

const CoverEditArticleLabel = styled(EditArticleLabel)`
  @media (max-width: 533px) {
    display: none;
  }
`;

const PetDetailInput = styled.input`
  display: none;
`;

const ArticleDeleteBox = styled(DeleteCheckBox)`
  top: 25%;
  z-index: 100;
  @media (max-width: 605px) {
    top: 20%;
  }
`;

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
  padding-bottom: 70px;
  @media (max-width: 960px) {
    padding: 20px;
    padding-bottom: 70px;
  }
  @media (max-width: 403px) {
    padding: 10px;
    padding-bottom: 70px;
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
  min-height: 250px;
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
  line-height: 40px;
  @media (max-width: 740px) {
    font-size: 28px;
  }
  @media (max-width: 416px) {
    font-size: 22px;
  }
`;

const ArticleContext = styled.div`
  margin-top: 25px;
  line-height: 34px;
  font-size: 18px;
`;

const ArticlePostTime = styled.div`
  padding-bottom: 20px;
  border-bottom: 2px solid #d1cfcf;
  color: #d1cfcf;
  font-weight: bold;
  position: relative;
`;

const EditArticleBtn = styled(Btn)`
  padding: 5px 10px;
  right: 170px;
  bottom: 13px;
  @media (max-width: 542px) {
    right: 140px;
    font-size: 16px;
  }
  @media (max-width: 416px) {
    padding: 5px;
    right: 110px;
  }
  @media (max-width: 403px) {
    right: 110px;
  }
`;

const DeteleArticleBtn = styled(Btn)`
  padding: 5px 10px;
  right: 85px;
  bottom: 13px;
  @media (max-width: 542px) {
    font-size: 16px;
    right: 70px;
  }
  @media (max-width: 416px) {
    padding: 5px;
    right: 55px;
  }
  @media (max-width: 403px) {
    right: 55px;
  }
`;

const CancelDetailBtn = styled(Btn)`
  padding: 5px 10px;
  right: 0;
  bottom: 13px;
  @media (max-width: 960px) {
    right: 0;
  }
  @media (max-width: 542px) {
    padding: 5px 10px;
    font-size: 16px;
  }
  @media (max-width: 416px) {
    padding: 5px;
  }
`;

type PetArticleType = {
  addArticleInfo: {
    title: string;
    context: string;
  };
  setAddArticleInfo: Dispatch<
    SetStateAction<{ title: string; context: string }>
  >;
  articleCover: imgType;
  setArticleCover: Dispatch<SetStateAction<imgType>>;
  setIncompleteInfo: Dispatch<SetStateAction<boolean>>;
  incompleteInfo: boolean;
};

type EditArticleType = {
  title: string;
  context: string;
};

export const WritePetArticle: React.FC<PetArticleType> = (props) => {
  const dispatch = useDispatch();
  const notifyDispatcher = useNotifyDispatcher();
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [editArticleContext, setEditArticleContext] = useState<EditArticleType>(
    { title: "", context: "" }
  );
  const [editArticleCover, setEditArticleCover] = useState<imgType>({
    file: "",
    url: "",
  });
  const [ownArticleIndex, setOwnArticleIndex] = useState<number>(-1);
  const [initialDiaryTimeStamp, setInitialDiaryTimeStamp] = useState<number>();
  const [addArticleMode, setAddArticleMode] = useState<boolean>(false);
  const [editArticleMode, setEditArticleMode] = useState<boolean>(false);
  const [detailArticleOpen, setDetailArticleOpen] = useState<boolean>(false);
  const [openDeleteBox, setOpenDeleteBox] = useState(false);

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
    const promises: Promise<void>[] = [];
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
  }

  async function updateArticleInfoCondition() {
    const initialContext = profile.ownArticles[ownArticleIndex].context;
    const initialTitle = profile.ownArticles[ownArticleIndex].title;
    const initialCover = profile.ownArticles[ownArticleIndex].img;
    if (
      !editArticleContext.context ||
      !editArticleContext.title ||
      editArticleContext.context === "<p></p>"
    ) {
      props.setIncompleteInfo(true);
      return;
    }
    if (
      editArticleContext.context === initialContext &&
      editArticleContext.title === initialTitle &&
      editArticleCover.url === initialCover
    ) {
      return;
    }
    props.setIncompleteInfo(false);

    if (editArticleCover.url !== initialCover) {
      const updateOwnPetArticle = profile.ownArticles;
      updateOwnPetArticle[ownArticleIndex] = {
        ...updateOwnPetArticle[ownArticleIndex],
        title: editArticleContext.title,
        context: editArticleContext.context,
        img: editArticleCover.url,
      };
      dispatch(setOwnArticle(updateOwnPetArticle));
      if (editArticleCover.file) {
        await updateNewArticleDataFirebase(
          (editArticleCover.file as File).name,
          editArticleCover.file as File
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
    }
    notifyDispatcher("已更新寵物文章");
    setEditArticleMode(false);
  }

  function addPetArticleUpdateState() {
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
  }

  function clickToAddPetArticle() {
    if (
      !props.addArticleInfo.title ||
      !props.addArticleInfo.context ||
      !props.articleCover.url
    ) {
      props.setIncompleteInfo(true);
      return;
    }
    props.setIncompleteInfo(false);
    if (props.articleCover.file instanceof File) {
      addPetArticleUpdateState();
      notifyDispatcher("已上傳寵物文章！");
      setAddArticleMode(false);
      addDataWithUploadImage(
        `petArticles/${props.articleCover.file.name}`,
        props.articleCover.file,
        addPetArticleDoc
      );
    }
  }

  function renderTellUserUploadPetArticleCover() {
    return (
      <>
        <TellUserUploadImg recOrSqu="rec" />
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
    );
  }

  function renderEditPetArticleToUploadCover() {
    return (
      <>
        <TellUserUploadImg recOrSqu="rec" />
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
    );
  }

  function renderAddPetArticle() {
    return (
      <AddArticleInfoContainer>
        <FinishAddArticleBtn
          onClick={() => {
            clickToAddPetArticle();
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
            props.setIncompleteInfo(false);
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
            <ToPreviewImg
              imgURL={props.articleCover.url}
              emptyImg={props.setArticleCover}
              recOrSquare="rec"
            />
          ) : (
            renderTellUserUploadPetArticleCover()
          )}
        </EditContainer>
        <PetArticle
          setAddArticleInfo={props.setAddArticleInfo}
          addArticleInfo={props.addArticleInfo}
        />
        <ContextDetails addArticleInfo={props.addArticleInfo} />
        {props.incompleteInfo && (
          <WarningText>請填寫完整文章資訊及文章封面</WarningText>
        )}
      </AddArticleInfoContainer>
    );
  }

  function renderEditPetArticle() {
    return (
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
          <CoverEditArticleLabel htmlFor="cover">
            文章封面:{" "}
          </CoverEditArticleLabel>
          {editArticleCover.url ? (
            <ToPreviewImg
              imgURL={editArticleCover.url}
              emptyImg={setEditArticleCover}
              recOrSquare="rec"
            />
          ) : (
            renderEditPetArticleToUploadCover()
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
        <CancelBtn
          onClick={() => {
            setEditArticleMode(false);
            props.setIncompleteInfo(false);
            setEditArticleContext({
              ...editArticleContext,
              title: profile.ownArticles[ownArticleIndex].title,
              context: profile.ownArticles[ownArticleIndex].context,
            });
            setEditArticleCover({
              ...editArticleCover,
              url: profile.ownArticles[ownArticleIndex].img,
            });
          }}
        >
          取消
        </CancelBtn>
        {props.incompleteInfo && <WarningText>更新資料不可為空值</WarningText>}
      </InfoContainer>
    );
  }

  function deletePetArticleUpdateState() {
    const DeleOwnPetArticle = profile.ownArticles;
    DeleOwnPetArticle.splice(ownArticleIndex, 1);
    dispatch(setOwnArticle(DeleOwnPetArticle));
  }

  function renderDeletePetArticleBox() {
    return (
      <ArticleDeleteBox>
        <DeleteCheckText>確定要刪除嗎？</DeleteCheckText>
        <DeleteCheckBoxBtnContainer>
          <WarningDeleteBtn
            onClick={async () => {
              await deleteFirebaseDataMutipleWhere(
                `/petArticles`,
                "postTime",
                profile.ownArticles[ownArticleIndex].postTime,
                "authorUid",
                profile.uid
              );
              setDetailArticleOpen(false);
              setOpenDeleteBox(false);
              deletePetArticleUpdateState();
              notifyDispatcher("已刪除文章");
            }}
          >
            確定
          </WarningDeleteBtn>
          <DeleteCheckBoxBtn onClick={() => setOpenDeleteBox(false)}>
            取消
          </DeleteCheckBoxBtn>
        </DeleteCheckBoxBtnContainer>
      </ArticleDeleteBox>
    );
  }

  function renderDetailPetArticle() {
    const articleCover = profile.ownArticles[ownArticleIndex].img;
    const articleTitle = profile.ownArticles[ownArticleIndex].title;
    const artcilePostTime = `${new Date(
      profile.ownArticles[ownArticleIndex].postTime
    ).getFullYear()}-${
      new Date(profile.ownArticles[ownArticleIndex].postTime).getMonth() + 1 <
      10
        ? `0${
            new Date(profile.ownArticles[ownArticleIndex].postTime).getMonth() +
            1
          }`
        : `${
            new Date(profile.ownArticles[ownArticleIndex].postTime).getMonth() +
            1
          }`
    }-${
      new Date(profile.ownArticles[ownArticleIndex].postTime).getDate() < 10
        ? `0${new Date(
            profile.ownArticles[ownArticleIndex].postTime
          ).getDate()}`
        : `${new Date(profile.ownArticles[ownArticleIndex].postTime).getDate()}`
    }`;

    return (
      <InfoContainer>
        <ArticleCover src={articleCover} alt="article-cover" />
        <ArticleTitle>{articleTitle}</ArticleTitle>
        <ArticlePostTime>
          {artcilePostTime}
          <EditArticleBtn
            onClick={() => {
              setEditArticleMode(true);
            }}
          >
            編輯
          </EditArticleBtn>
          <DeteleArticleBtn
            onClick={() => {
              setOpenDeleteBox(true);
            }}
          >
            刪除
          </DeteleArticleBtn>
          <CancelDetailBtn onClick={() => setDetailArticleOpen(false)}>
            取消
          </CancelDetailBtn>
        </ArticlePostTime>
        <ArticleContext className="DetailProseMirror">
          {parse(profile.ownArticles[ownArticleIndex].context)}
        </ArticleContext>
        {openDeleteBox && renderDeletePetArticleBox()}
      </InfoContainer>
    );
  }

  function renderNowNoPetArticle() {
    return (
      <NowNoInfoInHere>
        <NowNoInfoImg src={noarticle} alt="now-no-article" />
        <NowNoInfoText>\ 目前沒有文章 點擊右上角可以新增 /</NowNoInfoText>
      </NowNoInfoInHere>
    );
  }

  function renderSimpleAllPetArticle() {
    return (
      <InfoContainer>
        <ArticleSectionTitle>寵物文章</ArticleSectionTitle>
        <AddArticleBtn onClick={() => setAddArticleMode(true)}>
          新增文章
        </AddArticleBtn>
        <UserArticleContainer>
          {profile.ownArticles.length === 0
            ? renderNowNoPetArticle()
            : profile.ownArticles.map((article, index) => (
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
                  <UserArticleImg src={article.img} alt="article-cover" />
                  <UserArticleTitle>{article.title}</UserArticleTitle>
                </UserArticle>
              ))}
        </UserArticleContainer>
      </InfoContainer>
    );
  }

  return (
    <>
      {addArticleMode
        ? renderAddPetArticle()
        : editArticleMode
        ? renderEditPetArticle()
        : detailArticleOpen && profile.ownArticles[ownArticleIndex]
        ? renderDetailPetArticle()
        : renderSimpleAllPetArticle()}
    </>
  );
};
