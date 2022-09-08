import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import upload from "./plus.png";
import { db, deleteFirebaseData, storage } from "../../utils/firebase";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { EditContainer, EditInfoLabel, EditInfoInput } from "./ProfileSetting";

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
  width: 350px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
const PetDetailSexBtn = styled.div`
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

type SimplePetCardType = {
  setOwnPetDetail: (value: boolean) => void;
  setOwnPetIndex: (value: number) => void;
  setPetNewImg: (value: { file: File | string; url: string }) => void;
  setPetNewInfo: (value: { name: string; birthYear: number }) => void;
  petNewImg: {
    file: File | string;
    url: string;
  };
  getOwnPetList: () => void;
  setAddPet: (value: boolean) => void;
};

export const SimpleSinglePetCard: React.FC<SimplePetCardType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  return (
    <PetInfo>
      {profile.ownPets.map((pet, index) => (
        <PetSimpleCard key={index}>
          <CloseBtn
            onClick={() => {
              props.setOwnPetDetail(true);
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
            編輯
          </CloseBtn>
          <CloseBtn
            style={{ top: "50px" }}
            onClick={async () => {
              deleteFirebaseData(
                `/memberProfiles/${profile.uid}/ownPets`,
                "name",
                profile.ownPets[index].name
              );
              window.alert("刪除完成！");
              props.getOwnPetList();
            }}
          >
            刪除
          </CloseBtn>
          <PetSimpleImage src={pet.img} alt="" />
          <PetSimpleInfos>
            <PetSimpleInfo>
              {pet.name} {pet.sex === "M" ? "♂" : "♀"}
            </PetSimpleInfo>
            <PetSimpleInfo>{`${2022 - pet.birthYear}`}Y</PetSimpleInfo>
          </PetSimpleInfos>
        </PetSimpleCard>
      ))}
      <PetSimpleCard onClick={() => props.setAddPet(true)}>
        <PetSimpleImage src={upload} />
        <PetSimpleInfos>
          <PetSimpleInfo>新增寵物</PetSimpleInfo>
        </PetSimpleInfos>
      </PetSimpleCard>
    </PetInfo>
  );
};

type DetailPetCardType = {
  setOwnPetDetail: (value: boolean) => void;
  ownPetIndex: number;
  setPetNewImg: (value: { file: File | string; url: string }) => void;
  petNewInfo: { name: string; birthYear: number };
  setPetNewInfo: (value: { name: string; birthYear: number }) => void;
  petNewImg: {
    file: File | string;
    url: string;
  };
  getOwnPetList: () => void;
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
    props.getOwnPetList();
  }

  async function updatePetInfoCondition() {
    if (!props.petNewInfo.name && !props.petNewImg.url) {
      window.alert("更新資料不可為空");
      return;
    }
    if (
      props.petNewInfo.name === profile.ownPets[props.ownPetIndex].name &&
      props.petNewInfo.birthYear ===
        profile.ownPets[props.ownPetIndex].birthYear &&
      props.petNewImg.url === profile.ownPets[props.ownPetIndex].img
    ) {
      window.alert("未更新資料");
      return;
    }
    if (props.petNewImg.url !== profile.ownPets[props.ownPetIndex].img) {
      await updateOwnPetInfo();

      window.alert("更新完成！");
      props.setOwnPetDetail(false);
    } else {
      await updatePetInfo("");
      window.alert("更新完成！");
      props.setOwnPetDetail(false);
    }
  }

  function updateInputImage(file: FileList) {
    if (!file) return;
    const newImage = {
      file: file[0],
      url: URL.createObjectURL(file[0]),
    };
    props.setPetNewImg(newImage);
  }

  return (
    <PetDetailCard>
      <CloseBtn onClick={() => props.setOwnPetDetail(false)}>X</CloseBtn>
      {props.petNewImg.url ? (
        <PreviewContainer>
          <PetDetailUploadImg src={props.petNewImg.url} alt="" />
          <PreviewCancelBtn
            onClick={() => {
              props.setPetNewImg({ file: "", url: "" });
            }}
          >
            取消
          </PreviewCancelBtn>
        </PreviewContainer>
      ) : (
        ""
      )}

      <PetDetailImg htmlFor="image"></PetDetailImg>
      <PetDetailInput
        id="image"
        type="file"
        accept="image/*"
        onChange={(e) => {
          updateInputImage(e.target.files as FileList);
        }}
      />
      <EditContainer>
        <EditInfoLabel htmlFor="name">name: </EditInfoLabel>
        <EditInfoInput
          id="kind"
          type="text"
          value={props.petNewInfo.name}
          onChange={(e) => {
            props.setPetNewInfo({ ...props.petNewInfo, name: e.target.value });
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
      <PetDatailInfo>
        種類: {profile.ownPets[props.ownPetIndex].kind}
      </PetDatailInfo>
      <PetDatailInfo>
        性別：{profile.ownPets[props.ownPetIndex].sex === "M" ? "公" : "母"}
      </PetDatailInfo>
      {profile.ownPets[props.ownPetIndex].shelterName === "false" ? (
        ""
      ) : (
        <PetDatailInfo>
          從{profile.ownPets[props.ownPetIndex].shelterName}領養
        </PetDatailInfo>
      )}
      <PetDetailSexBtn
        onClick={async () => {
          updatePetInfoCondition();
        }}
      >
        更新寵物資料
      </PetDetailSexBtn>
    </PetDetailCard>
  );
};

type AddPetType = {
  setAddPet: (value: boolean) => void;
  petImg: {
    file: File | string;
    url: string;
  };
  setPetImg: (value: { file: File | string; url: string }) => void;
  addPetInfo: {
    name: string;
    sex: string;
    shelterName: string;
    kind: string;
    birthYear: number;
  };
  setAddPetInfo: (value: {
    name: string;
    sex: string;
    shelterName: string;
    kind: string;
    birthYear: number;
  }) => void;
  setOwnPetDetail: (value: boolean) => void;
  addPetDataFirebase: () => void;
  petNewImg: { file: File | string; url: string };
  setPetNewImg: (value: { file: File | string; url: string }) => void;
};

export const AddPet: React.FC<AddPetType> = (props) => {
  function updateInputImage(file: FileList) {
    if (!file) return;
    const newImage = {
      file: file[0],
      url: URL.createObjectURL(file[0]),
    };
    props.setPetNewImg(newImage);
  }
  return (
    <PetDetailCard>
      <CloseBtn onClick={() => props.setAddPet(false)}>X</CloseBtn>
      {props.petNewImg.url ? (
        <PreviewContainer>
          <PreviewImg src={props.petNewImg.url} />
          <PreviewCancelBtn
            onClick={() => {
              props.setPetNewImg({ file: "", url: "" });
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
          updateInputImage(e.target.files as FileList);
        }}
      />
      <EditContainer>
        <EditInfoLabel htmlFor="name">name: </EditInfoLabel>
        <EditInfoInput
          id="name"
          type="text"
          onChange={(e) => {
            props.setAddPetInfo({ ...props.addPetInfo, name: e.target.value });
          }}
        />
      </EditContainer>
      <EditContainer>
        <EditInfoLabel htmlFor="kind">kind: </EditInfoLabel>
        <EditInfoInput
          id="kind"
          type="text"
          onChange={(e) => {
            props.setAddPetInfo({ ...props.addPetInfo, kind: e.target.value });
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
        >
          女
        </PetDetailSexBtn>
        <PetDetailSexBtn
          onClick={() => {
            props.setAddPetInfo({ ...props.addPetInfo, sex: "M" });
          }}
        >
          男
        </PetDetailSexBtn>
      </EditContainer>
      <PetDetailSexBtn
        onClick={async () => {
          if (
            Object.values(props.addPetInfo).some((info) => !info) ||
            Object.values(props.petImg).some((info) => !info)
          ) {
            window.alert("請填寫完整寵物資料");
            return;
          }
          props.setOwnPetDetail(false);
          props.addPetDataFirebase();
        }}
      >
        上傳寵物資料
      </PetDetailSexBtn>
    </PetDetailCard>
  );
};
