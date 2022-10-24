import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  db,
  storage,
  updateFirebaseDataWhere,
  updateUseStateInputImage,
} from "../../utils/firebase";
import {
  collectionGroup,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { setImage, setName } from "../../functions/profileReducerFunction";
import { Profile } from "../../reducers/profile";
import defaultProfile from "./img/defaultprofile.png";
import { useNotifyDispatcher } from "../../component/SidebarNotify";
import { imgType } from "../../functions/commonFunctionAndType";
import { TellUserUploadImg, ToPreviewImg } from "../../component/PreviewImg";

export const Btn = styled.div`
  position: absolute;
  font-size: 18px;
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

const EditUserInfoContainer = styled(UserInfo)`
  padding-bottom: 80px;
`;
export const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  position: relative;
  padding-left: 15px;
  margin-bottom: 20px;
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    background-color: #db5452;
    position: absolute;
    left: 0;
  }
  @media (max-width: 403px) {
    font-size: 22px;
    padding-left: 10px;
    left: 15px;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 617px) {
    flex-direction: column;
    margin-top: 15px;
  }
`;

const UserName = styled.div`
  font-size: 22px;
  margin-left: 20px;
  @media (max-width: 617px) {
    margin-left: 0;
    margin-top: 30px;
  }
`;

const UserImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 40px;
`;
export const UpdateBtn = styled(Btn)`
  bottom: 15px;
  right: 15px;
  @media (max-width: 614px) {
    right: 50px;
  }
  @media (max-width: 435px) {
    right: 20px;
  }
  @media (max-width: 383px) {
    padding: 5px 10px;
    right: 10px;
  }
`;

const EditBtn = styled(Btn)`
  top: 10px;
  right: 15px;
  @media (max-width: 403px) {
    padding: 5px 10px;
  }
`;

export const EditContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

export const EditInfoLabel = styled.label`
  font-size: 22px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  width: 80px;
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
export const EditInfoInput = styled.input`
  font-size: 22px;
  margin-left: 10px;
  padding: 5px;
  width: 200px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  @media (max-width: 614px) {
    width: 150px;
  }
`;

export const EditModeContainer = styled.div`
  display: flex;
  @media (max-width: 614px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const EditModeUserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 614px) {
    margin-top: 30px;
  }
`;

export const ImageUploadInput = styled.input`
  display: none;
`;

export const CancelUpdateBtn = styled(Btn)`
  bottom: 15px;
  right: 200px;
  @media (max-width: 614px) {
    right: auto;
    left: 50px;
  }
  @media (max-width: 435px) {
    left: 20px;
  }
  @media (max-width: 383px) {
    padding: 5px 10px;
    left: 10px;
  }
`;

type userInfoType = {
  newName: string;
  setNewName: Dispatch<SetStateAction<string>>;
  setIncompleteInfo: Dispatch<SetStateAction<boolean>>;
  incompleteInfo: boolean;
};

const UserInfos: React.FC<userInfoType> = (props) => {
  const dispatch = useDispatch();
  const notifyDispatcher = useNotifyDispatcher();
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [editProfileMode, setEditProfileMode] = useState<boolean>(false);
  const [defaultUrl, setDefaultUrl] = useState<string>("");
  const [newImg, setNewImg] = useState<imgType>({
    file: "",
    url: "",
  });

  useEffect(() => {
    if (profile.name && props.newName === "") {
      props.setNewName(profile.name);
      setDefaultUrl(profile.img as string);
      setNewImg({ ...newImg, url: profile.img as string });
    }
  }, [profile.name]);

  async function updateAllInfoAboutUser(imgURL: string) {
    const userProfileRef = doc(db, "memberProfiles", profile.uid);
    await updateDoc(userProfileRef, {
      name: props.newName,
      img: imgURL,
    });
    await updateFirebaseDataWhere(`/petDiaries`, "authorUid", profile.uid, "", {
      author: {
        name: props.newName,
        img: imgURL,
      },
    });
    await updateFirebaseDataWhere(
      `/petArticles`,
      "authorUid",
      profile.uid,
      "",
      {
        author: {
          name: props.newName,
          img: imgURL,
        },
      }
    );
    await updateFirebaseDataWhere(`/petDiaries`, "authorUid", profile.uid, "", {
      author: {
        name: props.newName,
        img: imgURL,
      },
    });
    updateAllCommentsUserData(imgURL);
  }

  function updateUserProfile() {
    if (newImg.url === profile.img && props.newName === profile.name) {
      return;
    }
    if (props.newName === "" || newImg.url === "") {
      props.setIncompleteInfo(true);
      return;
    }
    props.setIncompleteInfo(false);
    uploadProfileData();
  }

  async function uploadProfileData() {
    if (newImg.file) {
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
            updateAllInfoAboutUser(downloadURL);
            notifyDispatcher("已更新個人資訊");
            setEditProfileMode(false);
          });
        }
      );
    } else {
      dispatch(setName(props.newName));
      updateAllInfoAboutUser(profile.img as string);
      notifyDispatcher("已更新個人資訊");
      setEditProfileMode(false);
    }
  }

  async function updateAllCommentsUserData(newImg: string) {
    const comments = query(
      collectionGroup(db, "comments"),
      where("useruid", "==", profile.uid)
    );
    const querySnapshot = await getDocs(comments);
    querySnapshot.forEach((d) => {
      const targetRef = doc(db, d.ref.path);
      updateDoc(targetRef, {
        user: { name: props.newName, img: newImg },
      });
    });
  }

  function renderTellUserUploadImg() {
    return (
      <>
        <TellUserUploadImg recOrSqu="squ" />
        <ImageUploadInput
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            updateUseStateInputImage(e.target.files as FileList, setNewImg);
            setDefaultUrl("");
          }}
        />
      </>
    );
  }

  function renderEditUserInfo() {
    return (
      <EditUserInfoContainer>
        <Title>編輯個人資訊</Title>
        <EditModeContainer>
          {defaultUrl !== defaultProfile && newImg.url ? (
            <ToPreviewImg
              imgURL={newImg.url}
              emptyImg={setNewImg}
              recOrSquare="square"
            />
          ) : (
            renderTellUserUploadImg()
          )}
          <UserContainer>
            <EditContainer>
              <EditInfoLabel>姓名: </EditInfoLabel>
              <EditInfoInput
                defaultValue={props.newName}
                onChange={(e) => {
                  props.setNewName(e.target.value);
                }}
              />
            </EditContainer>
            {props.incompleteInfo && (
              <WarningText>更新資料不可為空值</WarningText>
            )}
          </UserContainer>
          <CancelUpdateBtn
            onClick={() => {
              setEditProfileMode(false);
              props.setNewName(profile.name);
              setNewImg({ ...newImg, url: profile.img as string });
              props.setIncompleteInfo(false);
            }}
          >
            取消
          </CancelUpdateBtn>
          <UpdateBtn
            onClick={() => {
              updateUserProfile();
            }}
          >
            更新個人資料
          </UpdateBtn>
        </EditModeContainer>
      </EditUserInfoContainer>
    );
  }

  function renderDetailInfo() {
    return (
      <UserInfo>
        <Title>個人資訊</Title>
        <UserContainer>
          <UserImage src={profile.img as string} alt="user" />
          <UserName>姓名: {profile.name}</UserName>
        </UserContainer>
        <EditBtn onClick={() => setEditProfileMode(true)}>編輯</EditBtn>
      </UserInfo>
    );
  }

  return <>{editProfileMode ? renderEditUserInfo() : renderDetailInfo()}</>;
};

export default UserInfos;
