import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Profile, OwnPet } from "../../reducers/profile";
import UserInfos from "./UserInfos";
import { PetDiary } from "./PetDiary";
import { db } from "../../utils/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { setOwnPets } from "../../functions/profileReducerFunction";
import {
  SimpleSinglePetCard,
  EditAddedPetInfo,
  AddPet,
  DetailPetSingleInfo,
} from "./OwnPetInfo";
import { WritePetArticle } from "./WritePetArticle";
import { PopupHint } from "../Dating/Dating";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 144px;
  overflow: hidden;
  padding-bottom: 72px;
  @media (max-width: 1120px) {
    padding-left: 50px;
    padding-right: 50px;
  }
  @media (max-width: 657px) {
    padding-left: 30px;
    padding-right: 30px;
  }
`;

const SideBarWrapper = styled.div`
  width: 100%;
  background-color: #f8f6f6;
  height: 80px;
  position: fixed;
  top: 72px;
  z-index: 100;
  @media (max-width: 1120px) {
    padding-left: 30px;
    padding-right: 30px;
  }
  @media (max-width: 1025px) {
    top: 72px;
  }
  @media (max-width: 953px) {
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    padding-right: 0px;
  }
`;

const SidebarProfileTab = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1120px;
  margin: 0 auto;
  padding-top: 10px;
  @media (max-width: 953px) {
    margin: 0;
    padding-top: 0;
  }
`;

const UserProfileContainer = styled.div`
  display: flex;
  @media (max-width: 953px) {
    display: none;
  }
`;

export const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  object-fit: cover;
`;

const ProfileName = styled.div`
  text-align: center;
  font-size: 22px;
  letter-spacing: 1.5px;
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SettingTabContainer = styled.div`
  display: flex;
  @media (max-width: 953px) {
    flex: 1;
    width: 100vw;
    flex-shrink: 0;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 30px;
  }
  @media (max-width: 540px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const SettingTab = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 22px;
  letter-spacing: 1.5px;
  margin-right: 30px;
  cursor: pointer;
  position: relative;
  &:after {
    content: "";
    /* width: 0%; */
    width: ${(props) => (props.$isActive ? "100%" : "0%")};
    height: 3px;
    background-color: #b7b0a8;
    position: absolute;
    top: 43px;
    left: 0;
    right: 0;
    margin: 0 auto;
    transition: 0.3s;
    @media (max-width: 953px) {
      top: 52px;
    }
  }
  &:hover:after {
    width: 100%;
  }
  &:last-child {
    margin-right: 0;
  }
  @media (max-width: 540px) {
    font-size: 18px;
    letter-spacing: 1px;
    margin-right: 15px;
  }
  @media (max-width: 380px) {
    font-size: 16px;
  }
`;

export const EditContainer = styled.div`
  display: flex;
`;
export const EditInfoLabel = styled.label`
  flex-shrink: 0;
`;
export const EditInfoInput = styled.input``;

const MainInfo = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
`;

type profileSettingType = {
  signOutProfile: () => void;
};

type UploadImgType = { file: File | string; url: string };
const uploadImgInitialState: UploadImgType = {
  file: "",
  url: "",
};

type AddArticleInfo = {
  title: string;
  context: string;
};

const ProfileSetting: React.FC<profileSettingType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [img, setImg] = useState<UploadImgType>(uploadImgInitialState);
  const [newName, setNewName] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("個人資訊");
  const [ownPetDetail, setOwnPetDetail] = useState<boolean>(false);
  const [ownPetEdit, setOwnPetEdit] = useState<boolean>(false);
  const [ownPetIndex, setOwnPetIndex] = useState<number>(-1);
  const [addPet, setAddPet] = useState<boolean>(false);
  const [petImg, setPetImg] = useState<UploadImgType>(uploadImgInitialState);
  const [addPetInfo, setAddPetInfo] = useState<{
    name: string;
    sex: string;
    shelterName: string;
    kind: string;
    birthYear: number;
  }>({ name: "", sex: "", shelterName: "false", kind: "", birthYear: 0 });
  const [petNewImg, setPetNewImg] = useState<UploadImgType>(
    uploadImgInitialState
  );
  const [petNewInfo, setPetNewInfo] = useState<{
    name: string;
    birthYear: number;
  }>({ name: "", birthYear: 0 });
  const [articleCover, setArticleCover] = useState<UploadImgType>(
    uploadImgInitialState
  );
  const [addArticleInfo, setAddArticleInfo] = useState<AddArticleInfo>({
    title: "",
    context: "",
  });
  const tabs = ["個人資訊", "寵物資料", "寵物日記", "寵物文章"];
  const [updateInfo, setUpdateInfo] = useState("");
  const [incompleteInfo, setIncompleteInfo] = useState(false);

  async function getOwnPetList() {
    const allOwnPet: OwnPet[] = [];
    const q = collection(db, "memberProfiles", profile.uid, "ownPets");
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((info) => {
      allOwnPet.push(info.data() as OwnPet);
    });
    dispatch(setOwnPets(allOwnPet));
  }

  async function addDocOwnPets(downloadURL: string) {
    await addDoc(collection(db, `/memberProfiles/${profile.uid}/ownPets`), {
      ...addPetInfo,
      img: downloadURL,
    });
  }

  return (
    <>
      <SideBarWrapper>
        <SidebarProfileTab>
          <UserProfileContainer>
            <ProfileImg src={profile.img as string} alt="" />
            <ProfileName>{profile.name}</ProfileName>
          </UserProfileContainer>
          <SettingTabContainer>
            {tabs.map((tab, index) => (
              <SettingTab
                key={index}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  setSelectedTab(target.innerText);
                  if (index === 1) {
                    getOwnPetList();
                  }
                }}
                $isActive={selectedTab === tabs[index]}
              >
                {tab}
              </SettingTab>
            ))}
          </SettingTabContainer>
        </SidebarProfileTab>
      </SideBarWrapper>
      <Wrapper>
        {updateInfo === "已更新個人資訊" && (
          <PopupHint $Top={70}>{updateInfo}</PopupHint>
        )}
        {updateInfo === "已更新寵物資訊" && (
          <PopupHint $Top={70}>{updateInfo}</PopupHint>
        )}
        {updateInfo === "新增寵物成功！" && (
          <PopupHint $Top={70}>{updateInfo}</PopupHint>
        )}
        {updateInfo === "新增寵物日記成功！" && (
          <PopupHint $Top={70}>{updateInfo}</PopupHint>
        )}
        {updateInfo === "已更新寵物日記" && (
          <PopupHint $Top={70}>{updateInfo}</PopupHint>
        )}
        {updateInfo === "已上傳寵物文章！" && (
          <PopupHint $Top={70}>{updateInfo}</PopupHint>
        )}
        {updateInfo === "已更新寵物文章" && (
          <PopupHint $Top={70}>{updateInfo}</PopupHint>
        )}
        <MainInfo>
          {selectedTab === tabs[0] ? (
            <>
              <UserInfos
                newName={newName}
                setNewName={setNewName}
                setImg={setImg}
                img={img}
                setUpdateInfo={setUpdateInfo}
                setIncompleteInfo={setIncompleteInfo}
                incompleteInfo={incompleteInfo}
              />
            </>
          ) : (
            ""
          )}

          {selectedTab === tabs[1] && addPet ? (
            <AddPet
              setAddPet={setAddPet}
              petNewImg={petNewImg}
              petImg={petImg}
              setPetImg={setPetImg}
              addPetInfo={addPetInfo}
              setAddPetInfo={setAddPetInfo}
              setOwnPetDetail={setOwnPetDetail}
              addDocOwnPets={addDocOwnPets}
              setPetNewImg={setPetNewImg}
              setUpdateInfo={setUpdateInfo}
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          ) : selectedTab === tabs[1] && !ownPetDetail ? (
            <SimpleSinglePetCard
              setOwnPetDetail={setOwnPetDetail}
              setOwnPetIndex={setOwnPetIndex}
              petNewImg={petNewImg}
              setPetNewImg={setPetNewImg}
              setPetNewInfo={setPetNewInfo}
              getOwnPetList={getOwnPetList}
              setAddPet={setAddPet}
            />
          ) : (
            ""
          )}
          {selectedTab === tabs[1] && ownPetDetail && ownPetEdit ? (
            <EditAddedPetInfo
              setOwnPetDetail={setOwnPetDetail}
              petNewImg={petNewImg}
              setPetNewImg={setPetNewImg}
              setPetNewInfo={setPetNewInfo}
              petNewInfo={petNewInfo}
              ownPetIndex={ownPetIndex}
              getOwnPetList={getOwnPetList}
              ownPetEdit={ownPetEdit}
              setOwnPetEdit={setOwnPetEdit}
              setUpdateInfo={setUpdateInfo}
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          ) : selectedTab === tabs[1] && ownPetDetail && !ownPetEdit ? (
            <DetailPetSingleInfo
              petNewImg={petNewImg}
              petNewInfo={petNewInfo}
              ownPetIndex={ownPetIndex}
              ownPetEdit={ownPetEdit}
              setOwnPetEdit={setOwnPetEdit}
              setOwnPetDetail={setOwnPetDetail}
              getOwnPetList={getOwnPetList}
            />
          ) : (
            ""
          )}
          {selectedTab === tabs[2] ? (
            <PetDiary
              setUpdateInfo={setUpdateInfo}
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          ) : (
            ""
          )}
          {selectedTab === tabs[3] ? (
            <WritePetArticle
              addArticleInfo={addArticleInfo}
              setAddArticleInfo={setAddArticleInfo}
              articleCover={articleCover}
              setArticleCover={setArticleCover}
              setUpdateInfo={setUpdateInfo}
              setIncompleteInfo={setIncompleteInfo}
              incompleteInfo={incompleteInfo}
            />
          ) : (
            ""
          )}
        </MainInfo>
      </Wrapper>
    </>
  );
};

export default ProfileSetting;
