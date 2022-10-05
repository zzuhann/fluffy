import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
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
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Title } from "./UserInfos";
import trash from "./img/bin.png";
import upload from "./img/upload.png";
import defaultProfile from "./img/defaultprofile.png";
import {
  Btn,
  EditModeContainer,
  CancelIcon,
  ImageUploadLabel,
  ProfileImg,
  ImageUploadInput,
  EditModeUserInfoContainer,
  CancelUpdateBtn,
  UpdateBtn,
  EditContainer,
  EditInfoLabel,
  EditInfoInput,
} from "./UserInfos";
import {
  setNotification,
  setOwnPets,
} from "../../functions/profileReducerFunction";
import noPetNow from "./img/cat_fish_run.png";
import {
  imgType,
  numberInputPreventSymbol,
} from "../../functions/commonFunctionAndType";
import { useNotifyDispatcher } from "../../functions/SidebarNotify";

export const InfoContainer = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  margin-top: 30px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  padding: 15px;
  position: relative;
  @media (max-width: 925px) {
    padding: 50px;
  }
  @media (max-width: 725px) {
    padding: 50px 25px;
  }
  @media (max-width: 432px) {
    padding: 50px 15px;
  }
`;

export const PetTitle = styled(Title)`
  @media (max-width: 725px) {
    position: absolute;
    top: 25px;
    left: 25px;
  }
  @media (max-width: 403px) {
    font-size: 22px;
    top: 28px;
    padding-left: 10px;
    left: 15px;
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
  transition: 0.3s;
  bottom: 0;
  cursor: pointer;
  &:hover {
    box-shadow: 5px 5px 4px 3px rgba(0, 0, 0, 0.2);
    bottom: 5px;
  }
`;

export const AddBtnSimple = styled(Btn)`
  top: 15px;
  right: 15px;
  @media (max-width: 432px) {
    padding: 5px 10px;
    font-size: 16px;
    top: 25px;
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

const PetSimpleNameSex = styled.div`
  display: flex;
  align-items: center;
`;
const PetSimpleInfo = styled.div`
  font-size: 22px;
  color: #fff;
  letter-spacing: 1.5px;
`;

const PetSimpleName = styled(PetSimpleInfo)`
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 30px;
  white-space: nowrap;
`;

const PetName = styled.div`
  word-break: break-all;
  font-size: 22px;
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
  @media (max-width: 882px) {
    padding-bottom: 70px;
  }
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
  position: relative;
`;

const PreviewCancelBtn = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #db5452;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #b54745;
    color: #fff;
  }
`;
const PetDetailSexBtn = styled(Btn)<{ $isActive: boolean }>`
  position: relative;
  margin-left: 10px;
  background-color: ${(props) => (props.$isActive ? "#d1cfcf" : "#fff")};
`;

const AddPetBtn = styled(Btn)`
  bottom: 15px;
  right: 15px;
  @media (max-width: 614px) {
    right: 30px;
  }
  @media (max-width: 401px) {
    right: 10px;
  }
`;

const AddPetCancelBtn = styled(Btn)`
  bottom: 15px;
  right: 180px;
  @media (max-width: 614px) {
    right: auto;
    left: 30px;
  }
  @media (max-width: 401px) {
    left: 10px;
  }
`;

const PetDeatilContainer = styled.div`
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  margin-top: 30px;
  padding: 15px;
  position: relative;
  @media (max-width: 725px) {
    padding-bottom: 80px;
  }
`;

const PetSingleContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 725px) {
    flex-direction: column;
    margin-top: 80px;
  }
`;
const PetSingleDetailTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 725px) {
    margin-top: 20px;
  }
`;

const PetSingleName = styled.div`
  font-size: 22px;
  margin-left: 20px;
  margin-bottom: 15px;
  word-break: break-all;
  @media (max-width: 614px) {
    margin-left: 0;
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

const PetSingleImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 40px;
`;

const EditBtn = styled(Btn)`
  top: 15px;
  right: 185px;
  @media (max-width: 605px) {
    bottom: 15px;
    top: auto;
    left: 20px;
    width: 69px;
  }
`;

const CloseDetailBtn = styled(Btn)`
  top: 15px;
  right: 15px;
  @media (max-width: 605px) {
    bottom: 15px;
    top: auto;
    width: 69px;
    right: 20px;
  }
`;

const DeleteBtn = styled(Btn)`
  top: 15px;
  right: 100px;
  @media (max-width: 605px) {
    bottom: 15px;
    top: auto;
    left: 50%;
    transform: translateX(-50%);
    width: 69px;
  }
`;

export const DeleteCheckBox = styled.div`
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: solid 3px #d1cfcf;
  padding: 20px 25px;
  font-size: 22px;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  @media (max-width: 605px) {
    font-size: 18px;
    width: 350px;
  }
`;

export const DeleteCheckText = styled.div`
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 1px;
  line-height: 24px;
`;

export const DeleteCheckBoxBtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const DeleteCheckBoxBtn = styled(Btn)`
  font-size: 18px;
  position: relative;
`;

export const WarningDeleteBtn = styled(DeleteCheckBoxBtn)`
  border-color: #db5452;
  color: #db5452;
  &:hover {
    background-color: #db5452;
    color: #fff;
  }
`;

export const NowNoInfoInHere = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 913px) {
    flex-direction: column;
  }
`;
export const NowNoInfoImg = styled.img`
  height: 100%;
  @media (max-width: 913px) {
    height: 70%;
  }
`;

export const NowNoInfoText = styled.div`
  font-size: 22px;
  letter-spacing: 1.5px;
  font-weight: bold;
  margin-left: 30px;
  @media (max-width: 913px) {
    margin-left: 0px;
    font-size: 18px;
    letter-spacing: 1px;
  }
  @media (max-width: 465px) {
    font-size: 16px;
  }
  @media (max-width: 387px) {
    font-size: 14px;
  }
`;
type UserPetInfoType = {
  addPet: boolean;
  setAddPet: Dispatch<SetStateAction<boolean>>;
  setOwnPetIndex: Dispatch<SetStateAction<number>>;
  setPetNewInfo: Dispatch<SetStateAction<{ name: string; birthYear: number }>>;
  petNewInfo: { name: string; birthYear: number };
  ownPetDetail: boolean;
  petImg: {
    file: File | string;
    url: string;
  };
  setPetImg: Dispatch<SetStateAction<{ file: File | string; url: string }>>;
  addPetInfo: {
    name: string;
    sex: string;
    shelterName: string;
    kind: string;
    birthYear: number;
  };
  setAddPetInfo: Dispatch<
    SetStateAction<{
      name: string;
      sex: string;
      shelterName: string;
      kind: string;
      birthYear: number;
    }>
  >;
  setOwnPetDetail: Dispatch<SetStateAction<boolean>>;
  addDocOwnPets: (value: string) => void;
  petNewImg: { file: File | string; url: string };
  setPetNewImg: Dispatch<SetStateAction<imgType>>;
  setIncompleteInfo: Dispatch<SetStateAction<boolean>>;
  setOwnPetEdit: Dispatch<SetStateAction<boolean>>;
  incompleteInfo: boolean;
  getOwnPetList: () => void;
  ownPetEdit: boolean;
  ownPetIndex: number;
};

const UserPetInfo: React.FC<UserPetInfoType> = (props) => {
  const notifyDispatcher = useNotifyDispatcher();
  const dispatch = useDispatch();
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const editNameInputRef = useRef<HTMLInputElement>(null);
  const [invalidBirthYear, setInvalidBirthYear] = useState(false);
  const [invalidAddName, setInvalidAddName] = useState(false);
  const [invalidEditName, setInvalidEditName] = useState(false);
  const [openDeleteBox, setOpenDeleteBox] = useState(false);

  const clickAddPetInfo = () => {
    if (
      Object.values(props.addPetInfo).some((info) => !info) ||
      Object.values(props.petImg).some((info) => !info)
    ) {
      props.setIncompleteInfo(true);
      return;
    }
    if (invalidBirthYear || invalidAddName) {
      props.setIncompleteInfo(false);
      return;
    }
    props.setIncompleteInfo(false);
    props.setAddPet(false);
    addDataWithUploadImage(
      `pets/${profile.uid}-${props.addPetInfo.name}`,
      props.petImg.file as File,
      props.addDocOwnPets
    );
    addPetState();
    notifyDispatcher("新增寵物成功！");
    props.setPetImg({ file: "", url: "" });
  };

  const addPetState = () => {
    const addNewPet = profile.ownPets;
    addNewPet.push({ ...props.addPetInfo, img: props.petImg.url });
    dispatch(setOwnPets(addNewPet));
  };

  interface PetPreviewImgType {
    previewImgURL: string;
    emptyImg: Dispatch<SetStateAction<imgType>>;
  }

  function PetPreviewImg({ previewImgURL, emptyImg }: PetPreviewImgType) {
    return (
      <PreviewContainer>
        <PreviewImg src={previewImgURL} />
        <PreviewCancelBtn
          onClick={() => {
            emptyImg({ file: "", url: "" });
          }}
        >
          <CancelIcon src={trash} />
        </PreviewCancelBtn>
      </PreviewContainer>
    );
  }

  interface PetUploadImgType {
    uploadImg: Dispatch<SetStateAction<imgType>>;
  }

  function PetUploadImg({ uploadImg }: PetUploadImgType) {
    return (
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
            updateUseStateInputImage(e.target.files as FileList, uploadImg);
          }}
        />
      </>
    );
  }

  function AddPet() {
    return (
      <PetDetailCard>
        <Title>新增寵物</Title>
        <EditModeContainer>
          {props.petImg.url ? (
            <PetPreviewImg
              previewImgURL={props.petImg.url}
              emptyImg={props.setPetImg}
            />
          ) : (
            <PetUploadImg uploadImg={props.setPetImg} />
          )}

          <EditModeUserInfoContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="name">名字: </EditInfoLabel>
              <EditInfoInput
                id="name"
                type="text"
                onChange={(e) => {
                  props.setAddPetInfo({
                    ...props.addPetInfo,
                    name: e.target.value,
                  });
                  if (
                    profile.ownPets.some((pet) => pet.name === e.target.value)
                  ) {
                    setInvalidAddName(true);
                  } else {
                    setInvalidAddName(false);
                  }
                }}
              />
              {invalidAddName && (
                <WarningText>已存在相同名字的寵物</WarningText>
              )}
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="kind">種類: </EditInfoLabel>
              <EditInfoInput
                id="kind"
                type="text"
                onChange={(e) => {
                  props.setAddPetInfo({
                    ...props.addPetInfo,
                    kind: e.target.value,
                  });
                }}
              />
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="birthYear">出生年: </EditInfoLabel>
              <EditInfoInput
                id="birthYear"
                type="number"
                min="1911"
                max={new Date().getFullYear()}
                onKeyDown={(e) => {
                  numberInputPreventSymbol(e);
                }}
                onChange={(e) => {
                  props.setAddPetInfo({
                    ...props.addPetInfo,
                    birthYear: Number(e.target.value),
                  });
                  if (
                    Number(e.target.value) > new Date().getFullYear() ||
                    Number(e.target.value) < 1911
                  ) {
                    setInvalidBirthYear(true);
                  } else {
                    setInvalidBirthYear(false);
                  }
                }}
              />
              {invalidBirthYear && (
                <WarningText>
                  請輸入1911~{new Date().getFullYear()}的數字
                </WarningText>
              )}
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="sex">性別: </EditInfoLabel>
              <PetDetailSexBtn
                onClick={() => {
                  props.setAddPetInfo({ ...props.addPetInfo, sex: "F" });
                }}
                $isActive={props.addPetInfo.sex === "F"}
              >
                女
              </PetDetailSexBtn>
              <PetDetailSexBtn
                onClick={() => {
                  props.setAddPetInfo({ ...props.addPetInfo, sex: "M" });
                }}
                $isActive={props.addPetInfo.sex === "M"}
              >
                男
              </PetDetailSexBtn>
            </EditContainer>
            {props.incompleteInfo && (
              <WarningText>請填寫完整寵物資料</WarningText>
            )}
          </EditModeUserInfoContainer>
          <AddPetBtn
            onClick={() => {
              clickAddPetInfo();
            }}
          >
            上傳寵物資料
          </AddPetBtn>
          <AddPetCancelBtn
            onClick={() => {
              props.setIncompleteInfo(false);
              props.setAddPet(false);
            }}
          >
            取消
          </AddPetCancelBtn>
        </EditModeContainer>
      </PetDetailCard>
    );
  }

  function SimpleSinglePetCard() {
    return (
      <InfoContainer>
        <PetTitle>寵物資料</PetTitle>
        <PetInfo>
          {profile.ownPets.length !== 0 ? (
            profile.ownPets.map((pet, index) => (
              <PetSimpleCard
                key={index}
                onClick={() => {
                  props.setOwnPetDetail(true);
                  props.setAddPet(false);
                  props.setOwnPetIndex(index);
                  props.setPetNewImg({
                    ...props.petNewImg,
                    url: profile.ownPets[index].img,
                  });
                  props.setPetNewInfo({
                    name: profile.ownPets[index].name,
                    birthYear: profile.ownPets[index].birthYear,
                  });
                }}
              >
                <PetSimpleImage src={pet.img} alt="" />
                <PetSimpleInfos>
                  <PetSimpleNameSex>
                    <PetSimpleName>{pet.name}</PetSimpleName>
                    <PetSimpleInfo>{pet.sex === "M" ? "♂" : "♀"}</PetSimpleInfo>
                  </PetSimpleNameSex>
                  <PetSimpleInfo>{`${2022 - pet.birthYear}`}Y</PetSimpleInfo>
                </PetSimpleInfos>
              </PetSimpleCard>
            ))
          ) : (
            <NowNoInfoInHere>
              <NowNoInfoImg src={noPetNow} />
              <NowNoInfoText>\ 目前沒有寵物 點擊右上角可以新增 /</NowNoInfoText>
            </NowNoInfoInHere>
          )}
        </PetInfo>
        <AddBtnSimple onClick={() => props.setAddPet(true)}>
          新增寵物 +
        </AddBtnSimple>
      </InfoContainer>
    );
  }

  function editPetInfoState(newImg: string) {
    if (newImg) {
      const updateOwnPet = profile.ownPets;
      updateOwnPet[props.ownPetIndex] = {
        ...updateOwnPet[props.ownPetIndex],
        name: (editNameInputRef.current as HTMLInputElement).value,
        birthYear: props.petNewInfo.birthYear,
        img: newImg,
      };
      dispatch(setOwnPets(updateOwnPet));
    } else {
      const updateOwnPet = profile.ownPets;
      updateOwnPet[props.ownPetIndex] = {
        ...updateOwnPet[props.ownPetIndex],
        name: (editNameInputRef.current as HTMLInputElement).value,
        birthYear: props.petNewInfo.birthYear,
      };
      dispatch(setOwnPets(updateOwnPet));
    }
  }

  async function updateOwnPetInfo() {
    const storageRef = ref(
      storage,
      `pets/${profile.uid}-${props.petNewInfo.name}`
    );
    const uploadTask = uploadBytesResumable(
      storageRef,
      props.petNewImg.file as File
    );
    uploadTask.on("state_changed", () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        await updatePetInfo(downloadURL);
      });
    });
  }

  async function updatePetInfo(imgURL: string) {
    const q = query(
      collection(db, `/memberProfiles/${profile.uid}/ownPets`),
      where("name", "==", profile.ownPets[props.ownPetIndex].name)
    );
    const querySnapshot = await getDocs(q);
    const promises: any[] = [];
    querySnapshot.forEach(async (d) => {
      const petProfileRef = doc(
        db,
        `/memberProfiles/${profile.uid}/ownPets`,
        d.id
      );
      if (imgURL) {
        promises.push(
          updateDoc(petProfileRef, {
            name: (editNameInputRef.current as HTMLInputElement).value,
            birthYear: props.petNewInfo.birthYear,
            img: imgURL,
          })
        );
      } else {
        promises.push(
          updateDoc(petProfileRef, {
            name: (editNameInputRef.current as HTMLInputElement).value,
            birthYear: props.petNewInfo.birthYear,
          })
        );
      }
    });
    await Promise.all(promises);
  }

  async function updatePetInfoCondition() {
    if (
      (editNameInputRef.current && !editNameInputRef.current.value) ||
      !props.petNewImg.url
    ) {
      props.setIncompleteInfo(true);
      return;
    }
    if (
      editNameInputRef.current &&
      editNameInputRef.current.value ===
        profile.ownPets[props.ownPetIndex].name &&
      props.petNewInfo.birthYear ===
        profile.ownPets[props.ownPetIndex].birthYear &&
      props.petNewImg.url === profile.ownPets[props.ownPetIndex].img
    ) {
      return;
    }
    await updateFirebaseDataMutipleWhere(
      `/petDiaries`,
      "authorUid",
      profile.uid,
      "petName",
      profile.ownPets[props.ownPetIndex].name,
      "",
      { petName: (editNameInputRef.current as HTMLInputElement).value }
    );
    props.setIncompleteInfo(false);
    props.setPetNewInfo({
      ...props.petNewInfo,
      name: (editNameInputRef.current as HTMLInputElement).value,
    });
    if (props.petNewImg.url !== profile.ownPets[props.ownPetIndex].img) {
      await updateOwnPetInfo();
      editPetInfoState(props.petNewImg.url);
    } else {
      await updatePetInfo("");
      editPetInfoState("");
    }
    props.setOwnPetEdit(false);
    notifyDispatcher("已更新寵物資訊");
  }

  function EditAddedPetInfo() {
    return (
      <PetDetailCard>
        <Title>編輯寵物資訊</Title>
        <EditModeContainer>
          {props.petNewImg.url ? (
            <PetPreviewImg
              previewImgURL={props.petNewImg.url}
              emptyImg={props.setPetNewImg}
            />
          ) : (
            <PetUploadImg uploadImg={props.setPetNewImg} />
          )}
          <EditModeUserInfoContainer>
            <EditContainer>
              <EditInfoLabel>名字: </EditInfoLabel>
              <EditInfoInput
                ref={editNameInputRef}
                defaultValue={props.petNewInfo.name}
                // onChange={(e) => {
                //   props.setPetNewInfo({
                //     ...props.petNewInfo,
                //     name: e.target.value,
                //   });
                //   if (
                //     profile.ownPets.some((pet) => pet.name === e.target.value)
                //   ) {
                //     setInvalidEditName(true);
                //   } else {
                //     setInvalidEditName(false);
                //   }
                // }}
              />
              {invalidEditName && (
                <WarningText>已存在相同名字的寵物</WarningText>
              )}
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="birthYear">出生年: </EditInfoLabel>
              <EditInfoInput
                id="birthYear"
                type="number"
                min="1911"
                max={new Date().getFullYear()}
                value={props.petNewInfo.birthYear}
                onKeyDown={(e) => {
                  numberInputPreventSymbol(e);
                }}
                onChange={(e) => {
                  props.setPetNewInfo({
                    ...props.petNewInfo,
                    birthYear: Number(e.target.value),
                  });
                  if (
                    Number(e.target.value) > new Date().getFullYear() ||
                    Number(e.target.value) < 1911
                  ) {
                    setInvalidBirthYear(true);
                  } else {
                    setInvalidBirthYear(false);
                  }
                }}
              />
              {invalidBirthYear && (
                <WarningText>
                  請輸入1911~{new Date().getFullYear()}的數字
                </WarningText>
              )}
            </EditContainer>
            <PetSingleName>
              種類: {profile.ownPets[props.ownPetIndex].kind}
            </PetSingleName>

            {props.incompleteInfo && (
              <WarningText>更新資料不可為空值</WarningText>
            )}
          </EditModeUserInfoContainer>
          <CancelUpdateBtn
            onClick={() => {
              props.setOwnPetEdit(false);
              props.setPetNewImg({
                ...props.petNewImg,
                url: profile.ownPets[props.ownPetIndex].img,
              });
              props.setPetNewInfo({
                name: profile.ownPets[props.ownPetIndex].name,
                birthYear: profile.ownPets[props.ownPetIndex].birthYear,
              });
              props.setIncompleteInfo(false);
            }}
          >
            取消
          </CancelUpdateBtn>
          <UpdateBtn
            onClick={async () => {
              if (invalidBirthYear) {
                props.setIncompleteInfo(false);
                return;
              }
              updatePetInfoCondition();
            }}
          >
            更新寵物資料
          </UpdateBtn>
        </EditModeContainer>
      </PetDetailCard>
    );
  }

  function DetailPetSingleInfo() {
    return (
      <>
        {profile.ownPets[props.ownPetIndex] && (
          <PetDeatilContainer>
            <PetTitle>寵物資訊</PetTitle>
            <PetSingleContainer>
              <PetSingleImage src={props.petNewImg.url} />
              <PetSingleDetailTextContainer>
                <PetSingleName>
                  姓名: {props.petNewInfo.name} (
                  {profile.ownPets[props.ownPetIndex].sex === "F" ? "♀" : "♂"})
                </PetSingleName>
                <PetSingleName>
                  出生年: {props.petNewInfo.birthYear} 年 (
                  {new Date().getFullYear() - props.petNewInfo.birthYear}y)
                </PetSingleName>
                <PetSingleName>
                  種類: {profile.ownPets[props.ownPetIndex].kind}
                </PetSingleName>
                {profile.ownPets[props.ownPetIndex].shelterName === "false" ? (
                  ""
                ) : (
                  <PetSingleName>
                    從{profile.ownPets[props.ownPetIndex].shelterName}領養
                  </PetSingleName>
                )}
              </PetSingleDetailTextContainer>
            </PetSingleContainer>

            <CloseDetailBtn
              onClick={() => {
                props.setOwnPetDetail(false);
              }}
            >
              關閉
            </CloseDetailBtn>
            <DeleteBtn
              onClick={async () => {
                setOpenDeleteBox(true);
              }}
            >
              刪除
            </DeleteBtn>
            <EditBtn
              onClick={() => {
                props.setOwnPetEdit(true);
              }}
            >
              編輯
            </EditBtn>
            {openDeleteBox && (
              <DeleteCheckBox>
                <DeleteCheckText>確定要刪除嗎？</DeleteCheckText>
                <DeleteCheckText>
                  將會連同 {profile.ownPets[props.ownPetIndex].name}{" "}
                  的日記一起刪除
                </DeleteCheckText>
                <DeleteCheckBoxBtnContainer>
                  <WarningDeleteBtn
                    onClick={async () => {
                      await deleteFirebaseDataMutipleWhere(
                        `/petDiaries`,
                        "petName",
                        profile.ownPets[props.ownPetIndex].name,
                        "authorUid",
                        profile.uid
                      );
                      await deleteFirebaseData(
                        `/memberProfiles/${profile.uid}/ownPets`,
                        "name",
                        profile.ownPets[props.ownPetIndex].name
                      );
                      const newOwnPets = profile.ownPets;
                      newOwnPets.splice(props.ownPetIndex, 1);
                      dispatch(setOwnPets(newOwnPets));
                      setOpenDeleteBox(false);
                      props.setOwnPetDetail(false);
                      dispatch(setNotification("已刪除寵物資訊"));
                      setTimeout(() => {
                        dispatch(setNotification(""));
                      }, 3000);
                    }}
                  >
                    確定
                  </WarningDeleteBtn>
                  <DeleteCheckBoxBtn
                    onClick={() => {
                      setOpenDeleteBox(false);
                    }}
                  >
                    取消
                  </DeleteCheckBoxBtn>
                </DeleteCheckBoxBtnContainer>
              </DeleteCheckBox>
            )}
          </PetDeatilContainer>
        )}
      </>
    );
  }

  return (
    <>
      {props.addPet ? (
        <AddPet />
      ) : !props.ownPetDetail && !props.addPet ? (
        <SimpleSinglePetCard />
      ) : props.ownPetDetail && props.ownPetEdit ? (
        <EditAddedPetInfo />
      ) : (
        <DetailPetSingleInfo />
      )}
    </>
  );
};

export default UserPetInfo;
