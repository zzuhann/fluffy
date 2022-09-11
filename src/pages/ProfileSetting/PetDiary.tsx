import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Profile, PetDiaryType } from "../../reducers/profile";
import upload from "./plus.png";
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
  doc,
  updateDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { EditContainer, EditInfoLabel, EditInfoInput } from "./ProfileSetting";
import { setOwnPetDiary } from "../../functions/profileReducerFunction";

const PetInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const PetSimpleCard = styled.div`
  flex-basis: 300px;
  position: relative;
`;

const PetSimpleImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
`;
const PetSimpleInfos = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;
const PetSimpleInfo = styled.div`
  font-size: 25px;
  color: #fff;
`;

const PetDetailCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

const PetDetailImg = styled.label`
  width: 350px;
  height: 350px;
  object-fit: cover;
  background-color: transparent;
`;

const PreviewContainer = styled.div`
  position: absolute;
  width: 350px;
  height: 350px;
`;

const PreviewImg = styled.img`
  width: 350px;
  height: 350px;
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

const PetDetailInput = styled.input`
  display: none;
`;
const CheckBtn = styled.div`
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;
const PetDetailUploadImg = styled.img`
  width: 350px;
  height: 350px;
  object-fit: cover;
`;

const PetDatailInfo = styled.div``;

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

const SelectPetName = styled.select``;
const OptionPetName = styled.option``;

const DiaryTextArea = styled.textarea`
  width: 350px;
  resize: vertical;
`;

type UploadImgType = { file: File | null; url: string };
const uploadImgInitialState: UploadImgType = {
  file: null,
  url: "",
};

type UploadDiary = {
  petName: string;
  takePhotoTime: number;
  context: string;
};

export const PetDiary = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [writeDiaryBoxOpen, setWriteDiaryBoxOpen] = useState<boolean>(false);
  const [diaryImg, setDiaryImg] = useState<UploadImgType>(
    uploadImgInitialState
  );
  const [uploadDiaryInfo, setUploadDiaryInfo] = useState<UploadDiary>({
    petName: "",
    takePhotoTime: 0,
    context: "",
  });

  const [initialDiaryTimeStamp, setInitialDiaryTimeStamp] = useState<number>();
  const [editDiaryBoxOpen, setEditDiaryBoxOpen] = useState<boolean>(false);
  const [newDiaryContext, setNewDiaryContext] = useState<UploadDiary>({
    petName: "",
    takePhotoTime: 0,
    context: "",
  });
  const [newDiaryImg, setNewDiaryImg] = useState<UploadImgType>(
    uploadImgInitialState
  );
  const [ownPetDiaryIndex, setOwnPetDiaryIndex] = useState<number>(-1);

  useEffect(() => {
    getAuthorPetDiary(profile.uid);
    setUploadDiaryInfo({
      ...uploadDiaryInfo,
      petName: profile.ownPets[0].name,
    });
  }, []);

  function updateNewPetDiaryDataFirebase(photoName: string, newPetImg: File) {
    const storageRef = ref(storage, `petDiary/${photoName}`);
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
          updatePetDiaryInfo(downloadURL);
        });
      }
    );
  }

  async function addPetDiaryDoc(imgURL: string) {
    await addDoc(collection(db, `/petDiaries`), {
      ...uploadDiaryInfo,
      img: imgURL,
      postTime: Date.now(),
      author: { img: profile.img, name: profile.name },
      commentCount: 0,
      likedBy: [],
      authorUid: profile.uid,
    });
    setUploadDiaryInfo({ petName: "", takePhotoTime: 0, context: "" });
    setDiaryImg({ file: null, url: "" });
    setWriteDiaryBoxOpen(false);
    window.alert("上傳成功！");
    getAuthorPetDiary(profile.uid);
    setEditDiaryBoxOpen(false);
  }

  async function updatePetDiaryInfo(imgURL: string) {
    const q = query(
      collection(db, `/petDiaries`),
      where("postTime", "==", initialDiaryTimeStamp),
      where("authorUid", "==", profile.uid)
    );
    const querySnapshot = await getDocs(q);
    const promises: any[] = [];
    querySnapshot.forEach(async (d) => {
      const petProfileRef = doc(db, `/petDiaries`, d.id);
      if (imgURL) {
        promises.push(
          updateDoc(petProfileRef, {
            takePhotoTime: newDiaryContext.takePhotoTime,
            context: newDiaryContext.context,
            img: imgURL,
          })
        );
      } else {
        promises.push(
          updateDoc(petProfileRef, {
            takePhotoTime: newDiaryContext.takePhotoTime,
            context: newDiaryContext.context,
          })
        );
      }
    });
    await Promise.all(promises);
    getAuthorPetDiary(profile.uid);
  }

  async function updatePetInfoCondition() {
    if (!newDiaryContext.context && !newDiaryContext.takePhotoTime) {
      window.alert("更新資料不可為空");
      return;
    }
    if (
      newDiaryContext.context === profile.petDiary[ownPetDiaryIndex].context &&
      newDiaryContext.takePhotoTime ===
        profile.petDiary[ownPetDiaryIndex].takePhotoTime &&
      newDiaryImg.url === profile.petDiary[ownPetDiaryIndex].img
    ) {
      window.alert("未更新資料");
      return;
    }
    if (newDiaryImg.url !== profile.petDiary[ownPetDiaryIndex].img) {
      if (newDiaryImg.file) {
        await updateNewPetDiaryDataFirebase(
          newDiaryImg.file.name,
          newDiaryImg.file
        );
      }
      window.alert("更新完成！");
      setEditDiaryBoxOpen(false);
    } else {
      await updateFirebaseDataMutipleWhere(
        `/petDiaries`,
        "postTime",
        initialDiaryTimeStamp as number,
        "authorUid",
        profile.uid,
        "",
        {
          takePhotoTime: newDiaryContext.takePhotoTime,
          context: newDiaryContext.context,
        }
      );
      getAuthorPetDiary(profile.uid);
      window.alert("更新完成！");
      setEditDiaryBoxOpen(false);
    }
  }

  async function getAuthorPetDiary(authorUid: string) {
    const authorPetDiary: PetDiaryType[] = [];
    const q = query(
      collection(db, "petDiaries"),
      where("authorUid", "==", authorUid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      authorPetDiary.push(info.data() as PetDiaryType);
    });
    dispatch(setOwnPetDiary(authorPetDiary));
  }

  return (
    <>
      {writeDiaryBoxOpen ? (
        <PetDetailCard>
          <CloseBtn onClick={() => setWriteDiaryBoxOpen(false)}>X</CloseBtn>
          {diaryImg.url ? (
            <PreviewContainer>
              <PreviewImg src={diaryImg.url} />
              <PreviewCancelBtn
                onClick={() => {
                  setDiaryImg({ file: null, url: "" });
                }}
              >
                取消
              </PreviewCancelBtn>
            </PreviewContainer>
          ) : (
            ""
          )}

          <PetDetailImg htmlFor="image">
            <PetDetailUploadImg src={upload} alt="" />
          </PetDetailImg>
          <PetDetailInput
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              updateUseStateInputImage(e.target.files as FileList, setDiaryImg);
            }}
          />

          <EditContainer>
            <EditInfoLabel htmlFor="petName">寵物姓名: </EditInfoLabel>
            <SelectPetName
              id="petName"
              onChange={(e) => {
                setUploadDiaryInfo({
                  ...uploadDiaryInfo,
                  petName: e.target.value,
                });
              }}
            >
              {profile.ownPets.map((pet, index) => (
                <OptionPetName key={index} value={pet.name}>
                  {pet.name}
                </OptionPetName>
              ))}
            </SelectPetName>
          </EditContainer>

          <EditContainer>
            <EditInfoLabel htmlFor="takePhotoTime">
              拍攝此照片時間:{" "}
            </EditInfoLabel>
            <EditInfoInput
              id="takePhotoTime"
              type="datetime-local"
              max={`${new Date().getFullYear()}-${
                new Date().getMonth() + 1 < 10
                  ? `0${new Date().getMonth() + 1}`
                  : `${new Date().getMonth() + 1}`
              }-${
                new Date().getDate() < 10
                  ? `0${new Date().getDate()}`
                  : `${new Date().getDate()}`
              }T${
                new Date().getHours() < 10
                  ? `0${new Date().getHours()}`
                  : `${new Date().getHours()}`
              }:${
                new Date().getMinutes() < 10
                  ? `0${new Date().getMinutes()}`
                  : `${new Date().getMinutes()}`
              }`}
              onChange={(e) => {
                setUploadDiaryInfo({
                  ...uploadDiaryInfo,
                  takePhotoTime: Date.parse(e.target.value),
                });
              }}
            />
          </EditContainer>

          <EditContainer>
            <EditInfoLabel htmlFor="context">description: </EditInfoLabel>
            <DiaryTextArea
              id="context"
              onChange={(e) => {
                setUploadDiaryInfo({
                  ...uploadDiaryInfo,
                  context: e.target.value,
                });
              }}
            ></DiaryTextArea>
          </EditContainer>
          <CheckBtn
            onClick={() => {
              if (diaryImg.file) {
                addDataWithUploadImage(
                  `petDiary/${diaryImg.file.name}`,
                  diaryImg.file as File,
                  addPetDiaryDoc
                );
              }
            }}
          >
            上傳日記
          </CheckBtn>
        </PetDetailCard>
      ) : editDiaryBoxOpen ? (
        <PetDetailCard>
          <CloseBtn onClick={() => setEditDiaryBoxOpen(false)}>X</CloseBtn>
          {newDiaryImg.url ? (
            <PreviewContainer>
              <PreviewImg src={newDiaryImg.url} />
              <PreviewCancelBtn
                onClick={() => {
                  setNewDiaryImg({ file: null, url: "" });
                }}
              >
                取消
              </PreviewCancelBtn>
            </PreviewContainer>
          ) : (
            ""
          )}

          <PetDetailImg htmlFor="image">
            <PetDetailUploadImg src={upload} alt="" />
          </PetDetailImg>
          <PetDetailInput
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              updateUseStateInputImage(
                e.target.files as FileList,
                setNewDiaryImg
              );
            }}
          />

          <EditContainer>
            <EditInfoLabel htmlFor="petName">寵物姓名: </EditInfoLabel>
            <PetDatailInfo>{newDiaryContext.petName}</PetDatailInfo>
          </EditContainer>

          <EditContainer>
            <EditInfoLabel htmlFor="takePhotoTime">
              拍攝此照片時間:{" "}
            </EditInfoLabel>
            <EditInfoInput
              id="takePhotoTime"
              type="datetime-local"
              max={`${new Date().getFullYear()}-${
                new Date().getMonth() + 1 < 10
                  ? `0${new Date().getMonth() + 1}`
                  : `${new Date().getMonth() + 1}`
              }-${
                new Date().getDate() < 10
                  ? `0${new Date().getDate()}`
                  : `${new Date().getDate()}`
              }T${
                new Date().getHours() < 10
                  ? `0${new Date().getHours()}`
                  : `${new Date().getHours()}`
              }:${
                new Date().getMinutes() < 10
                  ? `0${new Date().getMinutes()}`
                  : `${new Date().getMinutes()}`
              }`}
              value={`${new Date(
                newDiaryContext.takePhotoTime
              ).getFullYear()}-${
                new Date(newDiaryContext.takePhotoTime).getMonth() + 1 < 10
                  ? `0${new Date(newDiaryContext.takePhotoTime).getMonth() + 1}`
                  : `${new Date(newDiaryContext.takePhotoTime).getMonth() + 1}`
              }-${
                new Date(newDiaryContext.takePhotoTime).getDate() < 10
                  ? `0${new Date(newDiaryContext.takePhotoTime).getDate()}`
                  : `${new Date(newDiaryContext.takePhotoTime).getDate()}`
              }T${
                new Date(newDiaryContext.takePhotoTime).getHours() < 10
                  ? `0${new Date(newDiaryContext.takePhotoTime).getHours()}`
                  : `${new Date(newDiaryContext.takePhotoTime).getHours()}`
              }:${
                new Date(newDiaryContext.takePhotoTime).getMinutes() < 10
                  ? `0${new Date(newDiaryContext.takePhotoTime).getMinutes()}`
                  : `${new Date(newDiaryContext.takePhotoTime).getMinutes()}`
              }`}
              onChange={(e) => {
                setNewDiaryContext({
                  ...newDiaryContext,
                  takePhotoTime: Date.parse(e.target.value),
                });
              }}
            />
          </EditContainer>

          <EditContainer>
            <EditInfoLabel htmlFor="context">description: </EditInfoLabel>
            <DiaryTextArea
              id="context"
              value={newDiaryContext.context}
              onChange={(e) => {
                setNewDiaryContext({
                  ...newDiaryContext,
                  context: e.target.value,
                });
              }}
            ></DiaryTextArea>
          </EditContainer>
          <CheckBtn
            onClick={() => {
              updatePetInfoCondition();
            }}
          >
            更新日記
          </CheckBtn>
        </PetDetailCard>
      ) : (
        <>
          <PetInfo>
            {profile.petDiary.map((diary, index) => (
              <PetSimpleCard key={index}>
                <CloseBtn
                  onClick={() => {
                    setEditDiaryBoxOpen(true);
                    setInitialDiaryTimeStamp(diary.postTime);
                    setOwnPetDiaryIndex(index);
                    setNewDiaryImg({
                      ...newDiaryImg,
                      url: profile.petDiary[index].img,
                    });
                    setNewDiaryContext({
                      ...newDiaryContext,
                      petName: profile.petDiary[index].petName,
                      context: profile.petDiary[index].context,
                      takePhotoTime: profile.petDiary[index].takePhotoTime,
                    });
                  }}
                >
                  編輯
                </CloseBtn>
                <CloseBtn
                  style={{ top: "50px" }}
                  onClick={async () => {
                    await deleteFirebaseDataMutipleWhere(
                      `/petDiaries`,
                      "postTime",
                      diary.postTime,
                      "authorUid",
                      profile.uid
                    );
                    window.alert("刪除完成！");
                    getAuthorPetDiary(profile.uid);
                  }}
                >
                  刪除
                </CloseBtn>
                <PetSimpleImage src={diary.img} alt="" />
                <PetSimpleInfos>
                  <PetSimpleInfo>{diary.petName}</PetSimpleInfo>
                </PetSimpleInfos>
              </PetSimpleCard>
            ))}
            <PetSimpleCard onClick={() => setWriteDiaryBoxOpen(true)}>
              <PetSimpleImage src={upload} />
              <PetSimpleInfos>
                <PetSimpleInfo>新增日記</PetSimpleInfo>
              </PetSimpleInfos>
            </PetSimpleCard>
          </PetInfo>
        </>
      )}
    </>
  );
};
