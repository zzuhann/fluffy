import React, { useState, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
  doc,
  updateDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { setOwnPetDiary } from "../../functions/profileReducerFunction";
import {
  EditModeContainer,
  EditModeUserInfoContainer,
  ImageUploadInput,
  Title,
  EditContainer,
  EditInfoLabel,
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
  AddBtnSimple,
  InfoContainer,
  PetTitle,
} from "./UserOwnPetInfos";
import { Btn } from "./UserInfos";
import noPetDiary from "./img/pet_dog_woman.png";
import { useNotifyDispatcher } from "../../functions/SidebarNotify";
import { TellUserUploadImg, ToPreviewImg } from "../../component/PreviewImg";
import { imgType } from "../../functions/commonFunctionAndType";

const DiaryLabel = styled(EditInfoLabel)`
  width: 180px;
`;

const AddDiaryLabel = styled(DiaryLabel)`
  @media (max-width: 653px) {
    font-size: 18px;
    width: 140px;
  }
`;

const EditDiaryContainer = styled(EditModeContainer)`
  @media (max-width: 958px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 495px) {
    padding-bottom: 50px;
  }
`;

const EditModeDiaryContainer = styled(EditModeUserInfoContainer)`
  @media (max-width: 958px) {
    margin-top: 30px;
  }
`;
const EditModePetDiaryContainer = styled(EditModeDiaryContainer)`
  @media (max-width: 905px) {
    margin-top: 30px;
  }
  @media (max-width: 688px) {
    padding-bottom: 50px;
  }
`;
const EditPetDiaryModeContainer = styled(EditModeDiaryContainer)`
  flex-direction: row;
  @media (max-width: 905px) {
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }
`;

const PetInfo = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  justify-content: space-between;
  gap: 20px;
  grid-template-rows: 250px;
  @media (max-width: 725px) {
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 300px);
  }
  @media (max-width: 432px) {
    grid-template-columns: repeat(auto-fill, 250px);
  }
`;

const PetSimpleCard = styled.div`
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
  width: 250px;
  height: 250px;
  object-fit: cover;
  @media (max-width: 725px) {
    width: 300px;
  }
  @media (max-width: 432px) {
    width: 250px;
  }
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
  font-size: 22px;
  color: #fff;
  letter-spacing: 1.5px;
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 30px;
  white-space: nowrap;
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

const PetDetailInput = styled.input`
  display: none;
`;

const SelectGroup = styled.div`
  position: relative;
  border: solid 1px black;
  font-size: 22px;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 10px;
  padding: 10px 15px;
  padding-right: 40px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  width: 200px;
  @media (max-width: 653px) {
    font-size: 18px;
    width: 150px;
  }
  @media (max-width: 495px) {
    margin-left: 0;
    margin-top: 10px;
  }
`;
const NowChooseOption = styled.div`
  overflow: hidden;
  line-height: 30px;
  &:after {
    content: "ˇ";
    position: absolute;
    right: 10px;
    top: 15px;
  }
`;
const OptionGroup = styled.ul<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  height: ${(props) => (props.$isActive ? "auto" : "0px")};
  position: absolute;
  background-color: #fff;
  width: 200px;
  top: 50px;
  left: 0;
  @media (max-width: 653px) {
    width: 150px;
  }
`;
const OptionName = styled.li`
  display: flex;
  padding: 8px 10px;
  transition: 0.2s;
  &:hover {
    background-color: #d1cfcf;
    color: #3c3c3c;
  }
`;

const AddDiaryInputContainer = styled(EditContainer)`
  @media (max-width: 495px) {
    flex-direction: column;
  }
`;

const DiaryTextArea = styled.textarea`
  width: 350px;
  min-height: 100px;
  max-height: 300px;
  resize: vertical;
  font-size: 22px;
  margin-left: 10px;
  padding: 5px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  @media (max-width: 653px) {
    width: 250px;
  }
  @media (max-width: 495px) {
    width: 250px;
    margin-left: 0;
    margin-top: 10px;
  }
`;

const PetDeatilContainer = styled.div`
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  margin-top: 30px;
  padding: 15px;
  position: relative;
  @media (max-width: 466px) {
    padding-bottom: 55px;
  }
`;

const PetSingleContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 842px) {
    flex-direction: column;
    margin-top: 40px;
  }
  @media (max-width: 401px) {
    margin-top: 20px;
  }
`;

const PetSingleDetailTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 842px) {
    margin-top: 30px;
  }
  @media (max-width: 401px) {
    margin-top: 10px;
  }
`;

const PetSingleName = styled.div`
  font-size: 22px;
  letter-spacing: 1px;
  line-height: 28px;
  margin-left: 20px;
  margin-bottom: 15px;
  word-break: break-all;
  @media (max-width: 842px) {
    margin-left: 0;
  }
  @media (max-width: 401px) {
    font-size: 18px;
    margin-bottom: 5px;
  }
`;

const PetSingleImage = styled.img`
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 40px;
  @media (max-width: 513px) {
    width: 100%;
    aspect-ratio: 1;
  }
`;

const EditBtn = styled(Btn)`
  top: 10px;
  right: 185px;
  @media (max-width: 513px) {
    padding: 5px 10px;
    top: 13px;
    right: 165px;
  }
  @media (max-width: 466px) {
    bottom: 13px;
    top: auto;
    left: 15px;
    right: auto;
  }
`;

const CloseDetailBtn = styled(Btn)`
  top: 10px;
  right: 15px;
  @media (max-width: 513px) {
    padding: 5px 10px;
    top: 13px;
  }
  @media (max-width: 466px) {
    bottom: 13px;
    top: auto;
    right: 15px;
  }
`;

const AddCloseDetailBtn = styled(CloseDetailBtn)`
  top: 10px;
  right: 15px;
  @media (max-width: 513px) {
    padding: 5px 10px;
    top: 13px;
  }
  @media (max-width: 495px) {
    bottom: 13px;
    top: auto;
    right: 15px;
  }
`;

const DeleteBtn = styled(Btn)`
  top: 10px;
  right: 100px;
  @media (max-width: 513px) {
    padding: 5px 10px;
    top: 13px;
    right: 90px;
  }
  @media (max-width: 466px) {
    bottom: 13px;
    top: auto;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const UploadAddDiaryBtn = styled(Btn)`
  top: 10px;
  right: 100px;
  @media (max-width: 513px) {
    padding: 5px 10px;
    top: 13px;
    right: 90px;
  }
  @media (max-width: 495px) {
    bottom: 13px;
    top: auto;
    left: 15px;
    right: auto;
  }
`;

const EditPetDiaryUpdateBtn = styled(Btn)`
  top: 15px;
  right: 100px;
  @media (max-width: 688px) {
    top: auto;
    bottom: 15px;
    left: 15px;
    right: auto;
  }
`;

const EditPetDiaryCancelUpdateBtn = styled(Btn)`
  top: 15px;
  right: 15px;
  @media (max-width: 688px) {
    top: auto;
    bottom: 15px;
  }
`;

const EditPetDiaryLabel = styled(EditInfoLabel)`
  width: 180px;
  flex-shrink: 0;
  @media (max-width: 495px) {
    width: auto;
  }
`;

const WarningText = styled.div`
  margin-left: 20px;
  font-size: 22px;
  color: #b54745;
  @media (max-width: 614px) {
    margin-left: 0;
  }
`;

const PetDiaryName = styled.div`
  font-size: 22px;
  margin-left: 15px;
  word-break: break-all;
`;

export const CalendarContainer = styled.div`
  max-width: 300px;
  border: solid 3px #d1cfcf;
  border-radius: 8px;
  color: #3c3c3c;
  margin-left: 10px;

  .react-calendar {
    border: none;
    border-radius: 8px;
    font-family: NotoSansTC;
  }
  .react-calendar__navigation {
    height: auto;
    padding: 10px;
    letter-spacing: 1.5px;
    margin-bottom: 0;
    font-size: 16px;
    button {
      min-width: 30px;
    }
  }
  .react-calendar__viewContainer {
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px;
  }
  .react-calendar__month-view__days__day {
    color: #3c3c3c;
    font-weight: bold;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #d0470c;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #d1cfcf;
  }
  .react-calendar__tile--now,
  .react-calendar__tile--active:enabled:hover {
    background-color: #fff;
    &:hover {
      background-color: #efefef;
    }
  }
  .react-calendar__tile--active,
  .react-calendar__tile--active:enabled:focus {
    background-color: #efefef;
  }
  .react-calendar__tile:disabled,
  .react-calendar__navigation button:disabled {
    background-color: #fff;
    color: #ececec;
  }
  .react-calendar__tile {
    padding: 6px;
  }
  @media (max-width: 653px) {
    width: 250px;
  }
  @media (max-width: 495px) {
    margin-left: 0;
    margin-top: 10px;
  }
`;

const uploadImgInitialState: imgType = {
  file: "",
  url: "",
};

type UploadDiary = {
  petName: string;
  takePhotoTime: number;
  context: string;
  birthYear: number;
};

export const PetDiary: React.FC<{
  setIncompleteInfo: Dispatch<SetStateAction<boolean>>;
  incompleteInfo: boolean;
}> = (props) => {
  const dispatch = useDispatch();
  const notifyDispatcher = useNotifyDispatcher();
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [writeDiaryBoxOpen, setWriteDiaryBoxOpen] = useState<boolean>(false);
  const [diaryImg, setDiaryImg] = useState<imgType>(uploadImgInitialState);
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
  const [newDiaryImg, setNewDiaryImg] = useState<imgType>(
    uploadImgInitialState
  );
  const [ownPetDiaryIndex, setOwnPetDiaryIndex] = useState<number>(-1);
  const [optionBoxOpen, setOptionBoxOpen] = useState<boolean>(false);
  const [nowChoosePetName, setNowChoosePetName] = useState<string>("");
  const [openDeleteBox, setOpenDeleteBox] = useState<boolean>(false);

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
    setEditDiaryBoxOpen(false);
  }

  async function updatePetDiaryInfo(imgURL: string) {
    const q = query(
      collection(db, `/petDiaries`),
      where("postTime", "==", initialDiaryTimeStamp),
      where("authorUid", "==", profile.uid)
    );
    const querySnapshot = await getDocs(q);
    const promises: Promise<void>[] = [];
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
  }

  async function updatePetInfoCondition() {
    if (!newDiaryContext.context || !newDiaryContext.takePhotoTime) {
      props.setIncompleteInfo(true);
      return;
    }
    if (
      newDiaryContext.context === profile.petDiary[ownPetDiaryIndex].context &&
      newDiaryContext.takePhotoTime ===
        profile.petDiary[ownPetDiaryIndex].takePhotoTime &&
      newDiaryImg.url === profile.petDiary[ownPetDiaryIndex].img
    ) {
      return;
    }
    if (newDiaryImg.url !== profile.petDiary[ownPetDiaryIndex].img) {
      const updateOwnPetDiary = profile.petDiary;
      updateOwnPetDiary[ownPetDiaryIndex] = {
        ...updateOwnPetDiary[ownPetDiaryIndex],
        takePhotoTime: newDiaryContext.takePhotoTime,
        context: newDiaryContext.context,
        img: newDiaryImg.url,
      };
      if (newDiaryImg.file) {
        await updateNewPetDiaryDataFirebase(
          (newDiaryImg.file as File).name,
          newDiaryImg.file as File
        );
      }
    } else {
      const updateOwnPetDiary = profile.petDiary;
      updateOwnPetDiary[ownPetDiaryIndex] = {
        ...updateOwnPetDiary[ownPetDiaryIndex],
        takePhotoTime: newDiaryContext.takePhotoTime,
        context: newDiaryContext.context,
      };
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
    }
    notifyDispatcher("已更新寵物日記");
    props.setIncompleteInfo(false);
    setDetailDiaryBoxOpen(true);
  }

  function renderPetDiaryUploadImg() {
    return (
      <>
        <TellUserUploadImg recOrSqu="squ" />
        <PetDetailInput
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            updateUseStateInputImage(e.target.files as FileList, setDiaryImg);
          }}
        />
      </>
    );
  }

  function renderSelectPetGroup() {
    return (
      <SelectGroup>
        {nowChoosePetName ? (
          <NowChooseOption
            onMouseEnter={() => {
              setOptionBoxOpen(true);
            }}
            onClick={() => {
              optionBoxOpen ? setOptionBoxOpen(false) : setOptionBoxOpen(true);
            }}
          >
            {nowChoosePetName}
          </NowChooseOption>
        ) : (
          <NowChooseOption
            onMouseEnter={() => {
              setOptionBoxOpen(true);
            }}
            onClick={() => {
              optionBoxOpen ? setOptionBoxOpen(false) : setOptionBoxOpen(true);
            }}
          >
            選擇寵物
          </NowChooseOption>
        )}
        <OptionGroup
          $isActive={optionBoxOpen === true}
          onMouseLeave={() => {
            setOptionBoxOpen(false);
          }}
        >
          {profile.ownPets.map((pet, index) => (
            <OptionName
              key={index}
              value={pet.name}
              onClick={(e) => {
                const index = profile.ownPets.findIndex(
                  (pet) => pet.name === (e.target as HTMLInputElement).innerText
                );
                setUploadDiaryInfo({
                  ...uploadDiaryInfo,
                  petName: (e.target as HTMLInputElement).innerText,
                  birthYear: profile.ownPets[index].birthYear,
                });
                setNowChoosePetName((e.target as HTMLInputElement).innerText);
              }}
            >
              {pet.name}
            </OptionName>
          ))}
        </OptionGroup>
      </SelectGroup>
    );
  }

  function addPetDiaryUpdateState() {
    const addNewPet = profile.petDiary;
    addNewPet.push({
      ...uploadDiaryInfo,
      img: diaryImg.url,
      postTime: Date.now(),
      author: { img: profile.img as string, name: profile.name },
      commentCount: 0,
      likedBy: [],
      authorUid: profile.uid,
      id: "",
    });
    dispatch(setOwnPetDiary(addNewPet));
  }

  function clickToUploadPetDiary() {
    if (
      !uploadDiaryInfo.petName ||
      !uploadDiaryInfo.context ||
      !uploadDiaryInfo.takePhotoTime ||
      Object.values(diaryImg).some((info) => !info)
    ) {
      props.setIncompleteInfo(true);
      return;
    }
    props.setIncompleteInfo(false);
    addPetDiaryUpdateState();
    notifyDispatcher("新增寵物日記成功！");
    setNowChoosePetName("");
    setWriteDiaryBoxOpen(false);
    setDiaryImg({ file: null, url: "" });
    if (diaryImg.file) {
      addDataWithUploadImage(
        `petDiary/${(diaryImg.file as File).name}`,
        diaryImg.file as File,
        addPetDiaryDoc
      );
    }
  }

  function renderaddPetDiary() {
    return (
      <PetDetailCard>
        <Title>新增寵物日記</Title>
        <EditDiaryContainer>
          <AddCloseDetailBtn
            onClick={() => {
              setWriteDiaryBoxOpen(false);
              setUploadDiaryInfo({
                ...uploadDiaryInfo,
                petName: "",
                birthYear: 0,
              });
              setNowChoosePetName("");
              props.setIncompleteInfo(false);
            }}
          >
            取消
          </AddCloseDetailBtn>
          {diaryImg.url ? (
            <ToPreviewImg
              imgURL={diaryImg.url}
              emptyImg={setDiaryImg}
              recOrSquare="square"
            />
          ) : (
            renderPetDiaryUploadImg()
          )}
          <EditModeDiaryContainer>
            <AddDiaryInputContainer>
              <AddDiaryLabel htmlFor="petName">寵物姓名: </AddDiaryLabel>
              {renderSelectPetGroup()}
            </AddDiaryInputContainer>

            <AddDiaryInputContainer>
              <AddDiaryLabel htmlFor="takePhotoTime">
                拍攝照片日期:{" "}
              </AddDiaryLabel>
              <CalendarContainer>
                <Calendar
                  defaultValue={new Date()}
                  maxDate={new Date()}
                  onClickDay={(value) => {
                    setUploadDiaryInfo({
                      ...uploadDiaryInfo,
                      takePhotoTime: Date.parse(`${value}`),
                    });
                  }}
                />
              </CalendarContainer>
            </AddDiaryInputContainer>

            <AddDiaryInputContainer>
              <AddDiaryLabel htmlFor="context">日記內文: </AddDiaryLabel>
              <DiaryTextArea
                id="context"
                onChange={(e) => {
                  setUploadDiaryInfo({
                    ...uploadDiaryInfo,
                    context: e.target.value,
                  });
                }}
              ></DiaryTextArea>
            </AddDiaryInputContainer>
            {props.incompleteInfo && (
              <WarningText>請填寫完整寵物日記資訊</WarningText>
            )}
          </EditModeDiaryContainer>
          <UploadAddDiaryBtn
            onClick={() => {
              clickToUploadPetDiary();
            }}
          >
            上傳日記
          </UploadAddDiaryBtn>
        </EditDiaryContainer>
      </PetDetailCard>
    );
  }

  function deletePetDiaryUpdateState() {
    const newDiary = profile.petDiary;
    newDiary.splice(ownPetDiaryIndex, 1);
    dispatch(setOwnPetDiary(newDiary));
  }

  async function deletePetDiary() {
    await deleteFirebaseDataMutipleWhere(
      `/petDiaries`,
      "postTime",
      profile.petDiary[ownPetDiaryIndex].postTime,
      "authorUid",
      profile.uid
    );
    deletePetDiaryUpdateState();
    setEditDiaryBoxOpen(false);
    setDetailDiaryBoxOpen(false);
    setOpenDeleteBox(false);
    notifyDispatcher("已刪除寵物日記");
  }

  function renderWarningDeletePetDiaryBox() {
    return (
      <DeleteCheckBox>
        <DeleteCheckText>確定要刪除嗎？</DeleteCheckText>
        <DeleteCheckBoxBtnContainer>
          <WarningDeleteBtn
            onClick={async () => {
              deletePetDiary();
            }}
          >
            確定
          </WarningDeleteBtn>
          <DeleteCheckBoxBtn onClick={() => setOpenDeleteBox(false)}>
            取消
          </DeleteCheckBoxBtn>
        </DeleteCheckBoxBtnContainer>
      </DeleteCheckBox>
    );
  }

  function renderDetailPetDiary() {
    const petAge =
      new Date().getFullYear() - profile.petDiary[ownPetDiaryIndex].birthYear;
    const petSex =
      profile.petDiary[ownPetDiaryIndex].hasOwnProperty("sex") &&
      profile.ownPets[ownPetDiaryIndex].sex === "F"
        ? "♀"
        : "♂";
    const petDiaryTakePhotoDate = `${new Date(
      newDiaryContext.takePhotoTime
    ).getFullYear()}/${
      new Date(newDiaryContext.takePhotoTime).getMonth() + 1 < 10
        ? `0${new Date(newDiaryContext.takePhotoTime).getMonth() + 1}`
        : `${new Date(newDiaryContext.takePhotoTime).getMonth() + 1}`
    }/${
      new Date(newDiaryContext.takePhotoTime).getDate() < 10
        ? `0${new Date(newDiaryContext.takePhotoTime).getDate()}`
        : `${new Date(newDiaryContext.takePhotoTime).getDate()}`
    } `;
    return (
      <PetDeatilContainer>
        <Title>日記資訊</Title>
        <PetSingleContainer>
          <PetSingleImage
            src={profile.petDiary[ownPetDiaryIndex].img}
            alt="diary"
          />
          <PetSingleDetailTextContainer>
            <PetSingleName>
              {petAge}
              歲時的{profile.petDiary[ownPetDiaryIndex].petName} ({petSex})
            </PetSingleName>
            <PetSingleName>
              內容: {profile.petDiary[ownPetDiaryIndex].context}
            </PetSingleName>
            <PetSingleName>拍攝日期: {petDiaryTakePhotoDate}</PetSingleName>
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
        <DeleteBtn onClick={() => setOpenDeleteBox(true)}>刪除</DeleteBtn>
        <EditBtn
          onClick={() => {
            setEditDiaryBoxOpen(true);
            setDetailDiaryBoxOpen(false);
          }}
        >
          編輯
        </EditBtn>
        {openDeleteBox && renderWarningDeletePetDiaryBox()}
      </PetDeatilContainer>
    );
  }

  function renderEditPetDiaryImageUpload() {
    return (
      <>
        <TellUserUploadImg recOrSqu="squ" />
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
    );
  }

  function renderEditPetDiary() {
    return (
      <PetDetailCard>
        <Title>編輯寵物日記</Title>
        <EditPetDiaryModeContainer>
          {newDiaryImg.url ? (
            <ToPreviewImg
              imgURL={newDiaryImg.url}
              emptyImg={setNewDiaryImg}
              recOrSquare="square"
            />
          ) : (
            renderEditPetDiaryImageUpload()
          )}
          <EditModePetDiaryContainer>
            <EditContainer>
              <EditPetDiaryLabel htmlFor="petName">
                寵物主角:{" "}
              </EditPetDiaryLabel>
              <PetDiaryName>{newDiaryContext.petName}</PetDiaryName>
            </EditContainer>
            <AddDiaryInputContainer>
              <EditPetDiaryLabel htmlFor="takePhotoTime">
                拍攝照片日期:{" "}
              </EditPetDiaryLabel>
              <CalendarContainer>
                <Calendar
                  defaultValue={new Date(newDiaryContext.takePhotoTime)}
                  maxDate={new Date()}
                  onClickDay={(value) => {
                    setNewDiaryContext({
                      ...newDiaryContext,
                      takePhotoTime: Date.parse(`${value}`),
                    });
                  }}
                />
              </CalendarContainer>
            </AddDiaryInputContainer>
            <AddDiaryInputContainer>
              <EditPetDiaryLabel htmlFor="context">
                日記內文:{" "}
              </EditPetDiaryLabel>
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
            </AddDiaryInputContainer>
            {props.incompleteInfo && (
              <WarningText>更新資料不可為空值</WarningText>
            )}
          </EditModePetDiaryContainer>
          <EditPetDiaryCancelUpdateBtn
            onClick={() => {
              setEditDiaryBoxOpen(true);
              setDetailDiaryBoxOpen(true);
              props.setIncompleteInfo(false);
            }}
          >
            取消
          </EditPetDiaryCancelUpdateBtn>
          <EditPetDiaryUpdateBtn
            onClick={() => {
              updatePetInfoCondition();
            }}
          >
            更新寵物日記
          </EditPetDiaryUpdateBtn>
        </EditPetDiaryModeContainer>
      </PetDetailCard>
    );
  }

  function setDisplayClickPetDiaryInfo(index: number, time: number) {
    setDetailDiaryBoxOpen(true);
    setEditDiaryBoxOpen(true);
    setInitialDiaryTimeStamp(time);
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
  }

  function renderNoPetDiaryNow() {
    return (
      <NowNoInfoInHere>
        <NowNoInfoImg src={noPetDiary} alt="now-no-diary" />
        {profile.ownPets.length === 0 ? (
          <NowNoInfoText>\ 新增日記前須先新增寵物資料 /</NowNoInfoText>
        ) : (
          <NowNoInfoText>\ 目前沒有日記 點擊右上角可以新增 /</NowNoInfoText>
        )}
      </NowNoInfoInHere>
    );
  }

  function renderDisplayPetDiaries() {
    return (
      <InfoContainer>
        <PetTitle>寵物日記</PetTitle>
        <PetInfo>
          {profile.petDiary.length !== 0
            ? profile.petDiary.map((diary, index) => (
                <PetSimpleCard
                  key={index}
                  onClick={() => {
                    setDisplayClickPetDiaryInfo(index, diary.postTime);
                  }}
                >
                  <PetSimpleImage src={diary.img} alt="diary" />
                  <PetSimpleInfos>
                    <PetSimpleInfo>{diary.petName}</PetSimpleInfo>
                  </PetSimpleInfos>
                </PetSimpleCard>
              ))
            : renderNoPetDiaryNow()}
        </PetInfo>

        {profile.ownPets.length !== 0 && (
          <AddBtnSimple onClick={() => setWriteDiaryBoxOpen(true)}>
            新增日記 +
          </AddBtnSimple>
        )}
      </InfoContainer>
    );
  }

  return (
    <>
      {writeDiaryBoxOpen
        ? renderaddPetDiary()
        : editDiaryBoxOpen && detailDiaryBoxOpen
        ? renderDetailPetDiary()
        : editDiaryBoxOpen && !detailDiaryBoxOpen
        ? renderEditPetDiary()
        : renderDisplayPetDiaries()}
    </>
  );
};
