import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Profile, PetDiaryType } from "../../reducers/profile";
import {
  addDataWithUploadImage,
  db,
  deleteFirebaseData,
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
import { setOwnPetDiary } from "../../functions/profileReducerFunction";
import {
  CancelIcon,
  EditModeContainer,
  EditModeUserInfoContainer,
  ImageUploadInput,
  ImageUploadLabel,
  ProfileImg,
  Title,
  EditContainer,
  EditInfoLabel,
  EditInfoInput,
  UpdateBtn,
  CancelUpdateBtn,
} from "./UserInfos";
import { InfoContainer } from "./OwnPetInfo";
import { Btn } from "./UserInfos";
import pet from "./pet.png";
import trash from "./bin.png";
import upload from "./upload.png";
import defaultProfile from "./defaultprofile.png";

const PetInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
  position: relative;
  justify-content: space-between;
  margin-top: 30px;
`;

const PetSimpleCard = styled.div`
  flex-basis: 300px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 30px;
  transition: 0.3s;
  bottom: 0;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
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
  bottom: 1px;
  left: 0;
  width: 100%;
  padding: 10px 15px;
`;
const PetSimpleInfo = styled.div`
  font-size: 25px;
  color: #fff;
  letter-spacing: 1.5px;
`;

const PetDetailCard = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  margin-top: 30px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  padding: 15px;
  position: relative;
`;

const PetDetailImg = styled.label`
  width: 350px;
  height: 350px;
  object-fit: cover;
  background-color: transparent;
`;

const PreviewContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 40px;
  position: relative;
`;

const PreviewImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 40px;
  object-fit: cover;
  position: relative;
`;

const PreviewCancelBtn = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
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
  font-size: 22px;
  margin-left: 10px;
  padding: 5px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
`;

const PetDeatilContainer = styled.div`
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  margin-top: 30px;
  padding: 15px;
  position: relative;
`;

const PetSingleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PetSingleDetailTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PetSingleName = styled.div`
  font-size: 22px;
  margin-left: 20px;
  margin-bottom: 15px;
`;

const PetSingleImage = styled.img`
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 40px;
`;

const EditBtn = styled(Btn)`
  top: 15px;
  right: 185px;
`;

const CloseDetailBtn = styled(Btn)`
  top: 15px;
  right: 15px;
`;

const DeleteBtn = styled(Btn)`
  top: 15px;
  right: 100px;
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
  birthYear: number;
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
    birthYear: 0,
  });

  const [initialDiaryTimeStamp, setInitialDiaryTimeStamp] = useState<number>();
  const [editDiaryBoxOpen, setEditDiaryBoxOpen] = useState<boolean>(false);
  const [detailDiaryBoxOpen, setDetailDiaryBoxOpen] = useState<boolean>(false);
  const [newDiaryContext, setNewDiaryContext] = useState<UploadDiary>({
    petName: "",
    takePhotoTime: 0,
    context: "",
    birthYear: 0,
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
      birthYear: profile.ownPets[0].birthYear,
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
    setUploadDiaryInfo({
      petName: "",
      takePhotoTime: 0,
      context: "",
      birthYear: 0,
    });
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
                const index = profile.ownPets.findIndex(
                  (pet) => pet.name === e.target.value
                );
                setUploadDiaryInfo({
                  ...uploadDiaryInfo,
                  petName: e.target.value,
                  birthYear: profile.ownPets[index].birthYear,
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
      ) : editDiaryBoxOpen && detailDiaryBoxOpen ? (
        <PetDeatilContainer>
          <Title>日記資訊</Title>
          <PetSingleContainer>
            <PetSingleImage src={profile.petDiary[ownPetDiaryIndex].img} />
            <PetSingleDetailTextContainer>
              <PetSingleName>
                {new Date().getFullYear() -
                  profile.petDiary[ownPetDiaryIndex].birthYear}
                歲時的{profile.petDiary[ownPetDiaryIndex].petName} (
                {profile.ownPets[ownPetDiaryIndex].sex === "F" ? "♀" : "♂"})
              </PetSingleName>
              <PetSingleName>
                內容: {profile.petDiary[ownPetDiaryIndex].context}
              </PetSingleName>
              <PetSingleName>
                拍攝時間:{" "}
                {`${new Date(newDiaryContext.takePhotoTime).getFullYear()}/${
                  new Date(newDiaryContext.takePhotoTime).getMonth() + 1 < 10
                    ? `0${
                        new Date(newDiaryContext.takePhotoTime).getMonth() + 1
                      }`
                    : `${
                        new Date(newDiaryContext.takePhotoTime).getMonth() + 1
                      }`
                }/${
                  new Date(newDiaryContext.takePhotoTime).getDate() < 10
                    ? `0${new Date(newDiaryContext.takePhotoTime).getDate()}`
                    : `${new Date(newDiaryContext.takePhotoTime).getDate()}`
                } ${
                  new Date(newDiaryContext.takePhotoTime).getHours() < 10
                    ? `0${new Date(newDiaryContext.takePhotoTime).getHours()}`
                    : `${new Date(newDiaryContext.takePhotoTime).getHours()}`
                }:${
                  new Date(newDiaryContext.takePhotoTime).getMinutes() < 10
                    ? `0${new Date(newDiaryContext.takePhotoTime).getMinutes()}`
                    : `${new Date(newDiaryContext.takePhotoTime).getMinutes()}`
                }`}
              </PetSingleName>
            </PetSingleDetailTextContainer>
          </PetSingleContainer>

          <CloseDetailBtn
            onClick={() => {
              setEditDiaryBoxOpen(false);
              setDetailDiaryBoxOpen(false);
            }}
          >
            關閉
          </CloseDetailBtn>
          <DeleteBtn
            onClick={async () => {
              await deleteFirebaseDataMutipleWhere(
                `/petDiaries`,
                "postTime",
                profile.petDiary[ownPetDiaryIndex].postTime,
                "authorUid",
                profile.uid
              );
              window.alert("刪除完成！");
              getAuthorPetDiary(profile.uid);
            }}
          >
            刪除
          </DeleteBtn>
          <EditBtn
            onClick={() => {
              setEditDiaryBoxOpen(true);
              setDetailDiaryBoxOpen(false);
            }}
          >
            編輯
          </EditBtn>
        </PetDeatilContainer>
      ) : editDiaryBoxOpen && !detailDiaryBoxOpen ? (
        <PetDetailCard>
          <Title>編輯寵物日記</Title>
          <CloseBtn onClick={() => setEditDiaryBoxOpen(false)}>X</CloseBtn>
          <EditModeContainer>
            {newDiaryImg.url ? (
              <PreviewContainer>
                <PreviewImg src={newDiaryImg.url} />
                <PreviewCancelBtn
                  onClick={() => {
                    setNewDiaryImg({ file: null, url: "" });
                  }}
                >
                  <CancelIcon src={trash} />
                </PreviewCancelBtn>
              </PreviewContainer>
            ) : (
              <>
                <ImageUploadLabel htmlFor="image">
                  <ProfileImg src={defaultProfile} alt="上傳" />
                  <PreviewCancelBtn>
                    <CancelIcon src={upload} />
                  </PreviewCancelBtn>
                </ImageUploadLabel>
                <ImageUploadInput
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
              </>
            )}
            <EditModeUserInfoContainer>
              <EditContainer>
                <EditInfoLabel htmlFor="petName">
                  寵物主角: {newDiaryContext.petName}
                </EditInfoLabel>
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
                      ? `0${
                          new Date(newDiaryContext.takePhotoTime).getMonth() + 1
                        }`
                      : `${
                          new Date(newDiaryContext.takePhotoTime).getMonth() + 1
                        }`
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
                      ? `0${new Date(
                          newDiaryContext.takePhotoTime
                        ).getMinutes()}`
                      : `${new Date(
                          newDiaryContext.takePhotoTime
                        ).getMinutes()}`
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
                <EditInfoLabel htmlFor="context">日記內文: </EditInfoLabel>
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
            </EditModeUserInfoContainer>
            <CancelUpdateBtn
              onClick={() => {
                setEditDiaryBoxOpen(true);
                setDetailDiaryBoxOpen(true);
              }}
            >
              取消
            </CancelUpdateBtn>
            <UpdateBtn
              onClick={() => {
                updatePetInfoCondition();
              }}
            >
              更新寵物日記
            </UpdateBtn>
          </EditModeContainer>
        </PetDetailCard>
      ) : (
        <InfoContainer>
          <Title>寵物日記</Title>
          <PetInfo>
            {profile.petDiary.map((diary, index) => (
              <PetSimpleCard
                key={index}
                onClick={() => {
                  setDetailDiaryBoxOpen(true);
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
                <PetSimpleImage src={diary.img} alt="" />
                <PetSimpleInfos>
                  <PetSimpleInfo>{diary.petName}</PetSimpleInfo>
                </PetSimpleInfos>
              </PetSimpleCard>
            ))}
            <PetSimpleCard onClick={() => setWriteDiaryBoxOpen(true)}>
              <PetSimpleImage src={pet} />
              <PetSimpleInfos>
                <PetSimpleInfo>新增日記</PetSimpleInfo>
              </PetSimpleInfos>
            </PetSimpleCard>
          </PetInfo>
        </InfoContainer>
      )}
    </>
  );
};
