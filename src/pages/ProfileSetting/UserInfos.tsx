import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  EditContainer,
  EditInfoLabel,
  EditInfoInput,
  ProfileImg,
} from "./ProfileSetting";
import styled from "styled-components";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, updateUseStateInputImage } from "../../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { setImage, setName } from "../../functions/profileReducerFunction";
import { Profile } from "../../reducers/profile";

const UserInfo = styled.div``;
const UpdateBtn = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

type userInfoType = {
  newName: string;
  setNewName: (value: string) => void;
  setImg: (value: { file: File | string; url: string }) => void;
  img: { file: File | string; url: string };
};

const UserInfos: React.FC<userInfoType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();

  function uploadProfileData() {
    const storageRef = ref(storage, `images/${profile.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, props.img.file as File);
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
          dispatch(setName(props.newName));
          dispatch(setImage(downloadURL));
          const userProfileRef = doc(db, "memberProfiles", profile.uid);
          await updateDoc(userProfileRef, {
            name: props.newName,
            img: downloadURL,
          });
        });
      }
    );
  }

  return (
    <UserInfo>
      <EditContainer>
        <EditInfoLabel>name: </EditInfoLabel>
        <EditInfoInput
          value={props.newName}
          onChange={(e) => {
            props.setNewName(e.target.value);
          }}
        />
      </EditContainer>
      <EditContainer>
        <EditInfoLabel htmlFor="image">image: </EditInfoLabel>
        <EditInfoInput
          type="file"
          accept="image/*"
          id="image"
          onChange={(e) => {
            updateUseStateInputImage(e.target.files as FileList, props.setImg);
          }}
        />
        <ProfileImg src={props.img.url as string} alt="" />
      </EditContainer>
      <UpdateBtn
        onClick={async () => {
          if (
            props.newName === "" ||
            props.img.url === "" ||
            (props.img.url === profile.img && props.newName === profile.name)
          ) {
            window.alert("未更新資料或更新資料不可為空值");
            return;
          }
          uploadProfileData();
        }}
      >
        更新個人資料
      </UpdateBtn>
    </UserInfo>
  );
};

export default UserInfos;
