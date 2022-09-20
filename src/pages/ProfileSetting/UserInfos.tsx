import React, { useEffect, useState } from "react";
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

const EditUserInfoContainer = styled(UserInfo)`
  padding-bottom: 80px;
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
  @media (max-width: 403px) {
    font-size: 24px;
    padding-left: 10px;
    left: 15px;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 617px) {
    flex-direction: column;
  }
`;

const UserName = styled.div`
  font-size: 25px;
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

const PreviewContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 40px;
  position: relative;
  @media (max-width: 614px) {
    margin-bottom: 30px;
  }
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

export const CancelIcon = styled.img`
  position: relative;
  width: 35px;
  height: 35px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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

export const ImageUploadLabel = styled.label`
  width: 200px;
  height: 200px;
  border-radius: 40px;
  position: relative;
`;

export const ProfileImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 40px;
  position: relative;
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
  const [defaultUrl, setDefaultUrl] = useState<string>("");
  useEffect(() => {
    setDefaultUrl(profile.img as string);
  }, []);

  useEffect(() => {
    props.setNewName(profile.name);
    setNewImg({ ...newImg, url: profile.img as string });
  }, []);

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
            const userProfileRef = doc(db, "memberProfiles", profile.uid);
            await updateDoc(userProfileRef, {
              name: props.newName,
              img: downloadURL,
            });
            await updateFirebaseDataWhere(
              `/petDiaries`,
              "authorUid",
              profile.uid,
              "",
              {
                author: {
                  name: props.newName,
                  img: profile.img,
                },
              }
            );
            await updateFirebaseDataWhere(
              `/petArticles`,
              "authorUid",
              profile.uid,
              "",
              {
                author: {
                  name: props.newName,
                  img: profile.img,
                },
              }
            );
            await updateFirebaseDataWhere(
              `/petDiaries`,
              "authorUid",
              profile.uid,
              "",
              {
                author: {
                  name: props.newName,
                  img: profile.img,
                },
              }
            );
            updateAllCommentsUserData();
            window.alert("更新成功！");
          });
        }
      );
    } else {
      dispatch(setName(props.newName));
      const userProfileRef = doc(db, "memberProfiles", profile.uid);
      await updateDoc(userProfileRef, {
        name: props.newName,
        img: profile.img,
      });
      await updateFirebaseDataWhere(
        `/petDiaries`,
        "authorUid",
        profile.uid,
        "",
        {
          author: {
            name: props.newName,
            img: profile.img,
          },
        }
      );
      await updateFirebaseDataWhere(
        `/petArticles`,
        "authorUid",
        profile.uid,
        "",
        {
          author: {
            name: props.newName,
            img: profile.img,
          },
        }
      );
      await updateFirebaseDataWhere(
        `/petDiaries`,
        "authorUid",
        profile.uid,
        "",
        {
          author: {
            name: props.newName,
            img: profile.img,
          },
        }
      );
      updateAllCommentsUserData();
      window.alert("更新成功！");
    }
  }

  async function updateAllCommentsUserData() {
    const comments = query(
      collectionGroup(db, "comments"),
      where("useruid", "==", profile.uid)
    );
    const querySnapshot = await getDocs(comments);
    const promises: any[] = [];
    querySnapshot.forEach((d) => {
      const targetRef = doc(db, d.ref.path);
      promises.push(
        updateDoc(targetRef, {
          user: { name: props.newName, img: profile.img },
        })
      );
    });
    await Promise.all(promises);
  }

  return (
    <>
      {editProfileMode ? (
        <EditUserInfoContainer>
          <Title>編輯個人資訊</Title>
          <EditModeContainer>
            {defaultUrl !== defaultProfile && (newImg.url || props.img.url) ? (
              <PreviewContainer>
                <PreviewImg src={newImg.url} />
                <PreviewCancelBtn
                  onClick={() => {
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
                    setDefaultUrl("");
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
            <CancelUpdateBtn
              onClick={() => {
                setEditProfileMode(false);
                props.setNewName(profile.name);
                setNewImg({ ...newImg, url: profile.img as string });
              }}
            >
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
        </EditUserInfoContainer>
      ) : (
        <UserInfo>
          <Title>個人資訊</Title>
          <UserContainer>
            <UserImage src={profile.img as string} />
            <UserName>姓名: {profile.name}</UserName>
          </UserContainer>
          <EditBtn onClick={() => setEditProfileMode(true)}>編輯</EditBtn>
        </UserInfo>
      )}
    </>
  );
};

export default UserInfos;
