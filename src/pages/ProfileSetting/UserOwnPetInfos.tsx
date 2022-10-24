import React, { Dispatch, SetStateAction, useState } from "react";
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
  addDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Title } from "./UserInfos";
import {
  Btn,
  EditModeContainer,
  ImageUploadInput,
  EditModeUserInfoContainer,
  CancelUpdateBtn,
  UpdateBtn,
  EditContainer,
  EditInfoLabel,
  EditInfoInput,
} from "./UserInfos";
import { setOwnPets } from "../../functions/profileReducerFunction";
import noPetNow from "./img/cat_fish_run.png";
import {
  imgInitialState,
  imgType,
} from "../../functions/commonFunctionAndType";
import { useNotifyDispatcher } from "../../component/SidebarNotify";
import { TellUserUploadImg, ToPreviewImg } from "../../component/PreviewImg";

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

const EditModePetInfoContainer = styled(EditModeUserInfoContainer)`
  margin-left: 15px;
  @media (max-width: 614px) {
    margin-top: 30px;
    margin-left: 0px;
  }
`;

type UserOwnPetInfosType = {
  setIncompleteInfo: Dispatch<SetStateAction<boolean>>;
  incompleteInfo: boolean;
  getOwnPetList: () => void;
};

const UserOwnPetInfos: React.FC<UserOwnPetInfosType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const notifyDispatcher = useNotifyDispatcher();
  const [invalidBirthYear, setInvalidBirthYear] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [addPet, setAddPet] = useState<boolean>(false);
  const [petImg, setPetImg] = useState<imgType>(imgInitialState);
  const [petNewImg, setPetNewImg] = useState<imgType>(imgInitialState);
  const [ownPetDetail, setOwnPetDetail] = useState<boolean>(false);
  const [addPetInfo, setAddPetInfo] = useState<{
    name: string;
    sex: string;
    shelterName: string;
    kind: string;
    birthYear: number;
  }>({ name: "", sex: "", shelterName: "false", kind: "", birthYear: 0 });
  const [petNewInfo, setPetNewInfo] = useState<{
    name: string;
    birthYear: number;
  }>({ name: "", birthYear: 0 });
  const [ownPetEdit, setOwnPetEdit] = useState<boolean>(false);
  const [ownPetIndex, setOwnPetIndex] = useState<number>(-1);
  const [openDeleteBox, setOpenDeleteBox] = useState(false);

  async function addDocOwnPets(downloadURL: string) {
    await addDoc(collection(db, `/memberProfiles/${profile.uid}/ownPets`), {
      ...addPetInfo,
      img: downloadURL,
    });
  }

  function renderAddUserOwnPetInfo() {
    return (
      <PetDetailCard>
        <Title>新增寵物</Title>
        <EditModeContainer>
          {petImg.url ? (
            <ToPreviewImg
              imgURL={petImg.url}
              emptyImg={setPetImg}
              recOrSquare="square"
            />
          ) : (
            <>
              <TellUserUploadImg recOrSqu="squ" />
              <ImageUploadInput
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  updateUseStateInputImage(
                    e.target.files as FileList,
                    setPetImg
                  );
                }}
              />
            </>
          )}
          <EditModePetInfoContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="name">名字: </EditInfoLabel>
              <EditInfoInput
                id="name"
                type="text"
                onChange={(e) => {
                  setAddPetInfo({
                    ...addPetInfo,
                    name: e.target.value,
                  });
                  if (
                    profile.ownPets.some((pet) => pet.name === e.target.value)
                  ) {
                    setInvalidName(true);
                  } else {
                    setInvalidName(false);
                  }
                }}
              />
              {invalidName && <WarningText>已存在相同名字的寵物</WarningText>}
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="kind">種類: </EditInfoLabel>
              <EditInfoInput
                id="kind"
                type="text"
                onChange={(e) => {
                  setAddPetInfo({
                    ...addPetInfo,
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
                  if (
                    e.key === "." ||
                    e.key === "e" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setAddPetInfo({
                    ...addPetInfo,
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
                  setAddPetInfo({ ...addPetInfo, sex: "F" });
                }}
                $isActive={addPetInfo.sex === "F"}
              >
                女
              </PetDetailSexBtn>
              <PetDetailSexBtn
                onClick={() => {
                  setAddPetInfo({ ...addPetInfo, sex: "M" });
                }}
                $isActive={addPetInfo.sex === "M"}
              >
                男
              </PetDetailSexBtn>
            </EditContainer>
            {props.incompleteInfo && (
              <WarningText>請填寫完整寵物資料</WarningText>
            )}
          </EditModePetInfoContainer>
          <AddPetBtn
            onClick={async () => {
              if (
                Object.values(addPetInfo).some((info) => !info) ||
                Object.values(petImg).some((info) => !info)
              ) {
                props.setIncompleteInfo(true);
                return;
              }
              if (invalidBirthYear || invalidName) {
                props.setIncompleteInfo(false);
                return;
              }
              props.setIncompleteInfo(false);
              setAddPet(false);
              addDataWithUploadImage(
                `pets/${profile.uid}-${addPetInfo.name}`,
                petImg.file as File,
                addDocOwnPets
              );
              const addNewPet = profile.ownPets;
              addNewPet.push({ ...addPetInfo, img: petImg.url });
              dispatch(setOwnPets(addNewPet));
              notifyDispatcher("新增寵物成功！");
              setPetImg({ file: "", url: "" });
            }}
          >
            上傳寵物資料
          </AddPetBtn>
          <AddPetCancelBtn
            onClick={() => {
              props.setIncompleteInfo(false);
              setAddPet(false);
            }}
          >
            取消
          </AddPetCancelBtn>
        </EditModeContainer>
      </PetDetailCard>
    );
  }

  async function updateOwnPetInfo() {
    const storageRef = ref(storage, `pets/${profile.uid}-${petNewInfo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, petNewImg.file as File);
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
          await updatePetInfo(downloadURL);
        });
      }
    );
  }

  async function updatePetInfo(imgURL: string) {
    const q = query(
      collection(db, `/memberProfiles/${profile.uid}/ownPets`),
      where("name", "==", profile.ownPets[ownPetIndex].name)
    );
    const querySnapshot = await getDocs(q);
    const promises: Promise<void>[] = [];
    querySnapshot.forEach(async (d) => {
      const petProfileRef = doc(
        db,
        `/memberProfiles/${profile.uid}/ownPets`,
        d.id
      );
      if (imgURL) {
        promises.push(
          updateDoc(petProfileRef, {
            name: petNewInfo.name,
            birthYear: petNewInfo.birthYear,
            img: imgURL,
          })
        );
      } else {
        promises.push(
          updateDoc(petProfileRef, {
            name: petNewInfo.name,
            birthYear: petNewInfo.birthYear,
          })
        );
      }
    });
    await Promise.all(promises);
  }

  async function updatePetInfoCondition() {
    if (!petNewInfo.name || !petNewImg.url) {
      props.setIncompleteInfo(true);
      return;
    }
    if (
      petNewInfo.name === profile.ownPets[ownPetIndex].name &&
      petNewInfo.birthYear === profile.ownPets[ownPetIndex].birthYear &&
      petNewImg.url === profile.ownPets[ownPetIndex].img
    ) {
      return;
    }
    props.setIncompleteInfo(false);
    if (petNewImg.url !== profile.ownPets[ownPetIndex].img) {
      await updateOwnPetInfo();
      await updateFirebaseDataMutipleWhere(
        `/petDiaries`,
        "authorUid",
        profile.uid,
        "petName",
        profile.ownPets[ownPetIndex].name,
        "",
        { petName: petNewInfo.name }
      );
      setOwnPetEdit(false);
      const updateOwnPet = profile.ownPets;
      updateOwnPet[ownPetIndex] = {
        ...updateOwnPet[ownPetIndex],
        name: petNewInfo.name,
        birthYear: petNewInfo.birthYear,
        img: petNewImg.url,
      };
      notifyDispatcher("已更新寵物資訊");
    } else {
      await updatePetInfo("");
      await updateFirebaseDataMutipleWhere(
        `/petDiaries`,
        "authorUid",
        profile.uid,
        "petName",
        profile.ownPets[ownPetIndex].name,
        "",
        { petName: petNewInfo.name }
      );
      setOwnPetEdit(false);
      const updateOwnPet = profile.ownPets;
      updateOwnPet[ownPetIndex] = {
        ...updateOwnPet[ownPetIndex],
        name: petNewInfo.name,
        birthYear: petNewInfo.birthYear,
      };
      notifyDispatcher("已更新寵物資訊");
    }
  }

  function renderEditUserOwnPetInfo() {
    return (
      <PetDetailCard>
        <Title>編輯寵物資訊</Title>
        <EditModeContainer>
          {petNewImg.url ? (
            <ToPreviewImg
              imgURL={petNewImg.url}
              emptyImg={setPetNewImg}
              recOrSquare="square"
            />
          ) : (
            <>
              <TellUserUploadImg recOrSqu="squ" />
              <ImageUploadInput
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  updateUseStateInputImage(
                    e.target.files as FileList,
                    setPetNewImg
                  );
                }}
              />
            </>
          )}
          <EditModeUserInfoContainer>
            <EditContainer>
              <EditInfoLabel>名字: </EditInfoLabel>
              <EditInfoInput
                defaultValue={petNewInfo.name}
                onChange={(e) => {
                  setPetNewInfo({
                    ...petNewInfo,
                    name: e.target.value,
                  });
                  if (
                    profile.ownPets.some((pet) => pet.name === e.target.value)
                  ) {
                    setInvalidName(true);
                  } else {
                    setInvalidName(false);
                  }
                }}
              />
              {invalidName && <WarningText>已存在相同名字的寵物</WarningText>}
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="birthYear">出生年: </EditInfoLabel>
              <EditInfoInput
                id="birthYear"
                type="number"
                min="1911"
                max={new Date().getFullYear()}
                value={petNewInfo.birthYear}
                onKeyDown={(e) => {
                  if (
                    e.key === "." ||
                    e.key === "e" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setPetNewInfo({
                    ...petNewInfo,
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
              種類: {profile.ownPets[ownPetIndex].kind}
            </PetSingleName>
            <PetSingleName>
              性別: {profile.ownPets[ownPetIndex].sex === "M" ? "公" : "母"}
            </PetSingleName>

            {props.incompleteInfo && (
              <WarningText>更新資料不可為空值</WarningText>
            )}
          </EditModeUserInfoContainer>
          <CancelUpdateBtn
            onClick={() => {
              setOwnPetEdit(false);
              setPetNewImg({
                ...petNewImg,
                url: profile.ownPets[ownPetIndex].img,
              });
              setPetNewInfo({
                name: profile.ownPets[ownPetIndex].name,
                birthYear: profile.ownPets[ownPetIndex].birthYear,
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

  function renderDetailPetSingleInfo() {
    return (
      <>
        {profile.ownPets[ownPetIndex] && (
          <PetDeatilContainer>
            <PetTitle>寵物資訊</PetTitle>
            <PetSingleContainer>
              <PetSingleImage src={petNewImg.url} alt="pet" />
              <PetSingleDetailTextContainer>
                <PetSingleName>
                  姓名: {petNewInfo.name} (
                  {profile.ownPets[ownPetIndex].sex === "F" ? "♀" : "♂"})
                </PetSingleName>
                <PetSingleName>
                  出生年: {petNewInfo.birthYear} 年 (
                  {new Date().getFullYear() - petNewInfo.birthYear}y)
                </PetSingleName>
                <PetSingleName>
                  種類: {profile.ownPets[ownPetIndex].kind}
                </PetSingleName>
                {profile.ownPets[ownPetIndex].shelterName === "false" ? (
                  ""
                ) : (
                  <PetSingleName>
                    從{profile.ownPets[ownPetIndex].shelterName}領養
                  </PetSingleName>
                )}
              </PetSingleDetailTextContainer>
            </PetSingleContainer>

            <CloseDetailBtn
              onClick={() => {
                setOwnPetDetail(false);
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
                setOwnPetEdit(true);
              }}
            >
              編輯
            </EditBtn>
            {openDeleteBox && (
              <DeleteCheckBox>
                <DeleteCheckText>確定要刪除嗎？</DeleteCheckText>
                <DeleteCheckText>
                  將會連同 {profile.ownPets[ownPetIndex].name} 的日記一起刪除
                </DeleteCheckText>
                <DeleteCheckBoxBtnContainer>
                  <WarningDeleteBtn
                    onClick={async () => {
                      await deleteFirebaseDataMutipleWhere(
                        `/petDiaries`,
                        "petName",
                        profile.ownPets[ownPetIndex].name,
                        "authorUid",
                        profile.uid
                      );
                      await deleteFirebaseData(
                        `/memberProfiles/${profile.uid}/ownPets`,
                        "name",
                        profile.ownPets[ownPetIndex].name
                      );
                      const newOwnPets = profile.ownPets;
                      newOwnPets.splice(ownPetIndex, 1);
                      dispatch(setOwnPets(newOwnPets));
                      setOpenDeleteBox(false);
                      setOwnPetDetail(false);
                      notifyDispatcher("已刪除寵物資訊");
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

  function renderSimpleSinglePetCard() {
    return (
      <InfoContainer>
        <PetTitle>寵物資料</PetTitle>
        <PetInfo>
          {profile.ownPets.length !== 0 ? (
            profile.ownPets.map((pet, index) => (
              <PetSimpleCard
                key={index}
                onClick={() => {
                  setOwnPetDetail(true);
                  setAddPet(false);
                  setOwnPetIndex(index);
                  setPetNewImg({
                    ...petNewImg,
                    url: profile.ownPets[index].img,
                  });
                  setPetNewInfo({
                    name: profile.ownPets[index].name,
                    birthYear: profile.ownPets[index].birthYear,
                  });
                }}
              >
                <PetSimpleImage src={pet.img} alt="pet" />
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
              <NowNoInfoImg src={noPetNow} alt="now-no-pet" />
              <NowNoInfoText>\ 目前沒有寵物 點擊右上角可以新增 /</NowNoInfoText>
            </NowNoInfoInHere>
          )}
        </PetInfo>
        <AddBtnSimple onClick={() => setAddPet(true)}>新增寵物 +</AddBtnSimple>
      </InfoContainer>
    );
  }

  return (
    <>
      {addPet
        ? renderAddUserOwnPetInfo()
        : ownPetDetail && ownPetEdit
        ? renderEditUserOwnPetInfo()
        : ownPetDetail && !ownPetEdit
        ? renderDetailPetSingleInfo()
        : renderSimpleSinglePetCard()}
    </>
  );
};

export default UserOwnPetInfos;
