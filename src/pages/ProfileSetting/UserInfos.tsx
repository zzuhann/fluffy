import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, updateUseStateInputImage } from "../../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { setImage, setName } from "../../functions/profileReducerFunction";
import { Profile } from "../../reducers/profile";
import trash from "./bin.png";
import defaultProfile from "./defaultprofile.png";
import upload from "./upload.png";

export const Btn = styled.div`
  position: absolute;
  font-size: 20px;
  color: #737373;
  letter-spacing: 1.5px;
  text-align: center;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  padding: 10px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #d1cfcf;
    color: #3c3c3c;
  }
`;

const UserInfo = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 30px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  padding: 15px;
  position: relative;
`;
export const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  position: relative;
  padding-left: 15px;
  margin-bottom: 20px;
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    background-color: #d0470c;
    position: absolute;
    left: 0;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  font-size: 25px;
  margin-left: 20px;
`;

const UserImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 40px;
`;
const UpdateBtn = styled(Btn)`
  bottom: 15px;
  right: 15px;
`;

const EditBtn = styled(Btn)`
  top: 15px;
  right: 15px;
`;

const EditContainer = styled.div`
  display: flex;
`;

const EditInfoLabel = styled.label`
  font-size: 25px;
  margin-left: 20px;
  display: flex;
  align-items: center;
`;
const EditInfoInput = styled.input`
  font-size: 25px;
  margin-left: 10px;
  padding: 5px;
  width: 150px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
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

const CancelIcon = styled.img`
  position: relative;
  width: 35px;
  height: 35px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const EditModeContainer = styled.div`
  display: flex;
`;

const EditModeUserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageUploadLabel = styled.label`
  width: 200px;
  height: 200px;
  border-radius: 40px;
  position: relative;
`;

const ProfileImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 40px;
  object-fit: cover;
  position: relative;
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const CancelUpdateBtn = styled(Btn)`
  bottom: 15px;
  right: 200px;
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
  const [editProfileMode, setEditProfileMode] = useState<boolean>(false);
  const [newImg, setNewImg] = useState<{ file: File | string; url: string }>({
    file: "",
    url: "",
  });

  useEffect(() => {
    props.setNewName(profile.name);
    setNewImg({ ...newImg, url: profile.img as string });
  }, []);

  function uploadProfileData() {
    const storageRef = ref(storage, `images/${profile.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, newImg.file as File);
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
      {editProfileMode ? (
        <>
          <Title>編輯個人資訊</Title>
          <EditModeContainer>
            {newImg.url || props.img.url ? (
              <PreviewContainer>
                <PreviewImg src={newImg.url} />
                <PreviewCancelBtn
                  onClick={() => {
                    // props.setImg({ file: "", url: "" });
                    setNewImg({ file: "", url: "" });
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
                      setNewImg
                    );
                  }}
                />
              </>
            )}
            <EditModeUserInfoContainer>
              <EditContainer>
                <EditInfoLabel>姓名: </EditInfoLabel>
                <EditInfoInput
                  defaultValue={props.newName}
                  onChange={(e) => {
                    props.setNewName(e.target.value);
                  }}
                />
              </EditContainer>
            </EditModeUserInfoContainer>
            <CancelUpdateBtn onClick={() => setEditProfileMode(false)}>
              取消
            </CancelUpdateBtn>
            <UpdateBtn
              onClick={async () => {
                if (
                  props.newName === "" ||
                  newImg.url === "" ||
                  (newImg.url === profile.img && props.newName === profile.name)
                ) {
                  window.alert("未更新資料或更新資料不可為空值");
                  return;
                }
                uploadProfileData();
              }}
            >
              更新個人資料
            </UpdateBtn>
          </EditModeContainer>
        </>
      ) : (
        <>
          <Title>個人資訊</Title>
          <UserContainer>
            <UserImage src={profile.img as string} />
            <UserName>姓名: {profile.name}</UserName>
          </UserContainer>
          <EditBtn onClick={() => setEditProfileMode(true)}>編輯</EditBtn>
        </>
      )}
    </UserInfo>
  );
};

export default UserInfos;
