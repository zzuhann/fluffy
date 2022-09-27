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
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Title } from "./UserInfos";
import trash from "./bin.png";
import upload from "./upload.png";
import defaultProfile from "./defaultprofile.png";
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
import { setOwnPets } from "../../functions/profileReducerFunction";

export const InfoContainer = styled.div`
  /* width: 100%; */
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
  /* display: flex;
  flex-wrap: wrap; */
  width: 100%;
  margin: 0 auto;
  position: relative;
  /* justify-content: space-between; */
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
  /* flex-basis: 250px; */
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  /* margin-bottom: 30px; */
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
const PetSimpleInfo = styled.div`
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

const DeleteCheckBox = styled.div`
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
`;

const DeleteCheckText = styled.div`
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 1px;
`;

const DeleteCheckBoxBtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const DeleteCheckBoxBtn = styled(Btn)`
  font-size: 18px;
  position: relative;
`;

const WarningDeleteBtn = styled(DeleteCheckBoxBtn)`
  border-color: #db5452;
  color: #db5452;
  &:hover {
    background-color: #db5452;
    color: #fff;
  }
`;

type SimplePetCardType = {
  setOwnPetDetail: Dispatch<SetStateAction<boolean>>;
  setOwnPetIndex: Dispatch<SetStateAction<number>>;
  setPetNewImg: Dispatch<SetStateAction<{ file: File | string; url: string }>>;
  setPetNewInfo: Dispatch<SetStateAction<{ name: string; birthYear: number }>>;
  setAddPet: Dispatch<SetStateAction<boolean>>;
  petNewImg: {
    file: File | string;
    url: string;
  };
  getOwnPetList: () => void;
};

export const SimpleSinglePetCard: React.FC<SimplePetCardType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  return (
    <InfoContainer>
      <PetTitle>寵物資料</PetTitle>
      <PetInfo>
        {profile.ownPets.map((pet, index) => (
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
              <PetSimpleInfo>
                {pet.name} {pet.sex === "M" ? "♂" : "♀"}
              </PetSimpleInfo>
              <PetSimpleInfo>{`${2022 - pet.birthYear}`}Y</PetSimpleInfo>
            </PetSimpleInfos>
          </PetSimpleCard>
        ))}
      </PetInfo>
      <AddBtnSimple onClick={() => props.setAddPet(true)}>
        新增寵物 +
      </AddBtnSimple>
    </InfoContainer>
  );
};

type DetailPetCardType = {
  setOwnPetDetail: Dispatch<SetStateAction<boolean>>;
  ownPetIndex: number;
  setPetNewImg: Dispatch<SetStateAction<{ file: File | string; url: string }>>;
  petNewInfo: { name: string; birthYear: number };
  setPetNewInfo: Dispatch<SetStateAction<{ name: string; birthYear: number }>>;
  petNewImg: {
    file: File | string;
    url: string;
  };
  getOwnPetList: () => void;
  ownPetEdit: boolean;
  setOwnPetEdit: Dispatch<SetStateAction<boolean>>;
  setIncompleteInfo: Dispatch<SetStateAction<boolean>>;
  setUpdateInfo: Dispatch<SetStateAction<string>>;
  incompleteInfo: boolean;
};

type DetailPetSingleInfoType = {
  ownPetIndex: number;
  petNewInfo: { name: string; birthYear: number };
  petNewImg: {
    file: File | string;
    url: string;
  };
  ownPetEdit: boolean;
  setOwnPetEdit: Dispatch<SetStateAction<boolean>>;
  setOwnPetDetail: Dispatch<SetStateAction<boolean>>;
  getOwnPetList: () => void;
  setUpdateInfo: Dispatch<SetStateAction<string>>;
};

export const DetailPetSingleInfo: React.FC<DetailPetSingleInfoType> = (
  props
) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [openDeleteBox, setOpenDeleteBox] = useState(false);
  const dispatch = useDispatch();

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
                    props.setUpdateInfo("已更新寵物資訊");
                    setTimeout(() => {
                      props.setUpdateInfo("");
                    }, 3000);
                  }}
                >
                  確定
                </WarningDeleteBtn>
                <DeleteCheckBoxBtn>取消</DeleteCheckBoxBtn>
              </DeleteCheckBoxBtnContainer>
            </DeleteCheckBox>
          )}
        </PetDeatilContainer>
      )}
    </>
  );
};

export const EditAddedPetInfo: React.FC<DetailPetCardType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;

  async function updateOwnPetInfo() {
    const storageRef = ref(
      storage,
      `pets/${profile.uid}-${props.petNewInfo.name}`
    );
    const uploadTask = uploadBytesResumable(
      storageRef,
      props.petNewImg.file as File
    );
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
            name: props.petNewInfo.name,
            birthYear: props.petNewInfo.birthYear,
            img: imgURL,
          })
        );
      } else {
        promises.push(
          updateDoc(petProfileRef, {
            name: props.petNewInfo.name,
            birthYear: props.petNewInfo.birthYear,
          })
        );
      }
    });
    await Promise.all(promises);
    // props.getOwnPetList();
  }

  async function updatePetInfoCondition() {
    if (!props.petNewInfo.name || !props.petNewImg.url) {
      props.setIncompleteInfo(true);
      return;
    }
    if (
      props.petNewInfo.name === profile.ownPets[props.ownPetIndex].name &&
      props.petNewInfo.birthYear ===
        profile.ownPets[props.ownPetIndex].birthYear &&
      props.petNewImg.url === profile.ownPets[props.ownPetIndex].img
    ) {
      return;
    }
    props.setIncompleteInfo(false);
    if (props.petNewImg.url !== profile.ownPets[props.ownPetIndex].img) {
      await updateOwnPetInfo();
      await updateFirebaseDataMutipleWhere(
        `/petDiaries`,
        "authorUid",
        profile.uid,
        "petName",
        profile.ownPets[props.ownPetIndex].name,
        "",
        { petName: props.petNewInfo.name }
      );
      props.setOwnPetEdit(false);
      const updateOwnPet = profile.ownPets;
      updateOwnPet[props.ownPetIndex] = {
        ...updateOwnPet[props.ownPetIndex],
        name: props.petNewInfo.name,
        birthYear: props.petNewInfo.birthYear,
        img: props.petNewImg.url,
      };
      props.setUpdateInfo("已更新寵物資訊");
      setTimeout(() => {
        props.setUpdateInfo("");
      }, 3000);
    } else {
      await updatePetInfo("");
      await updateFirebaseDataMutipleWhere(
        `/petDiaries`,
        "authorUid",
        profile.uid,
        "petName",
        profile.ownPets[props.ownPetIndex].name,
        "",
        { petName: props.petNewInfo.name }
      );
      props.setOwnPetEdit(false);
      const updateOwnPet = profile.ownPets;
      updateOwnPet[props.ownPetIndex] = {
        ...updateOwnPet[props.ownPetIndex],
        name: props.petNewInfo.name,
        birthYear: props.petNewInfo.birthYear,
      };
      props.setUpdateInfo("已更新寵物資訊");
      setTimeout(() => {
        props.setUpdateInfo("");
      }, 3000);
    }
  }

  return (
    <PetDetailCard>
      <Title>編輯寵物資訊</Title>
      <EditModeContainer>
        {props.petNewImg.url ? (
          <PreviewContainer>
            <PreviewImg src={props.petNewImg.url} />
            <PreviewCancelBtn
              onClick={() => {
                props.setPetNewImg({ file: "", url: "" });
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
                  props.setPetNewImg
                );
              }}
            />
          </>
        )}
        <EditModeUserInfoContainer>
          <EditContainer>
            <EditInfoLabel>名字: </EditInfoLabel>
            <EditInfoInput
              defaultValue={props.petNewInfo.name}
              onChange={(e) => {
                props.setPetNewInfo({
                  ...props.petNewInfo,
                  name: e.target.value,
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
              max="2022"
              value={props.petNewInfo.birthYear}
              onChange={(e) => {
                props.setPetNewInfo({
                  ...props.petNewInfo,
                  birthYear: Number(e.target.value),
                });
              }}
            />
          </EditContainer>
          <PetSingleName>
            種類: {profile.ownPets[props.ownPetIndex].kind}
          </PetSingleName>
          <PetSingleName>
            性別: {profile.ownPets[props.ownPetIndex].sex === "M" ? "公" : "母"}
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
            updatePetInfoCondition();
          }}
        >
          更新寵物資料
        </UpdateBtn>
      </EditModeContainer>
    </PetDetailCard>
  );
};

type AddPetType = {
  setAddPet: Dispatch<SetStateAction<boolean>>;
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
  setPetNewImg: Dispatch<SetStateAction<{ file: File | string; url: string }>>;
  setIncompleteInfo: Dispatch<SetStateAction<boolean>>;
  setUpdateInfo: Dispatch<SetStateAction<string>>;
  incompleteInfo: boolean;
};

export const AddPet: React.FC<AddPetType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();

  return (
    <PetDetailCard>
      <Title>新增寵物</Title>
      <EditModeContainer>
        {props.petImg.url ? (
          <PreviewContainer>
            <PreviewImg src={props.petImg.url} />
            <PreviewCancelBtn
              onClick={() => {
                props.setPetImg({ file: "", url: "" });
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
                  props.setPetImg
                );
              }}
            />
          </>
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
              }}
            />
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
              max="2022"
              onChange={(e) => {
                props.setAddPetInfo({
                  ...props.addPetInfo,
                  birthYear: Number(e.target.value),
                });
              }}
            />
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
          onClick={async () => {
            if (
              Object.values(props.addPetInfo).some((info) => !info) ||
              Object.values(props.petImg).some((info) => !info)
            ) {
              props.setIncompleteInfo(true);
              return;
            }
            props.setIncompleteInfo(false);
            props.setAddPet(false);
            addDataWithUploadImage(
              `pets/${profile.uid}-${props.addPetInfo.name}`,
              props.petImg.file as File,
              props.addDocOwnPets
            );
            const addNewPet = profile.ownPets;
            addNewPet.push({ ...props.addPetInfo, img: props.petImg.url });
            dispatch(setOwnPets(addNewPet));
            props.setUpdateInfo("新增寵物成功！");
            setTimeout(() => {
              props.setUpdateInfo("");
            }, 3000);
            props.setPetImg({ file: "", url: "" });
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
};
