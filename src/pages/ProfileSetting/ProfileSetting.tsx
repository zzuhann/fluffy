import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Profile, OwnPet } from "../../reducers/profile";
import { RegisterLoginBtn } from "./ProfileLoginRegister";
import UserInfos from "./UserInfos";
import { PetDiary } from "./PetDiary";
import { db, storage } from "../../utils/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { setOwnPets } from "../../functions/profileReducerFunction";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { SimpleSinglePetCard, EditAddedPetInfo, AddPet } from "./OwnPetInfo";
import { WritePetArticle } from "./WritePetArticle";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  position: relative;
`;

const SidebarProfileTab = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProfileImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileName = styled.div`
  text-align: center;
`;

const SettingTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const SettingTab = styled.div`
  text-align: center;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
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
  const [selectedTab, setSelectedTab] = useState<string>("info");
  const [ownPetDetail, setOwnPetDetail] = useState<boolean>(false);
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
  const tabs = ["info", "ownpet", "diary", "articles", "lostpet"];

  useEffect(() => {
    if (profile.img) {
      setImg({ ...img, url: profile.img as string });
      setNewName(profile.name);
    }
  }, [profile]);

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
    window.alert("上傳成功！");
    getOwnPetList();
  }

  return (
    <Wrapper>
      <SidebarProfileTab>
        <UserProfileContainer>
          <ProfileImg src={profile.img as string} alt="" />
          <ProfileName>{profile.name}</ProfileName>
          <RegisterLoginBtn onClick={() => props.signOutProfile()}>
            登出
          </RegisterLoginBtn>
        </UserProfileContainer>
        <SettingTabContainer>
          {tabs.map((tab, index) => (
            <SettingTab
              key={index}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                setSelectedTab(target.innerText);
                if (index === 1) {
                  onclick = () => getOwnPetList();
                }
              }}
            >
              {tab}
            </SettingTab>
          ))}
        </SettingTabContainer>
      </SidebarProfileTab>
      <MainInfo>
        {selectedTab === tabs[0] ? (
          <UserInfos
            newName={newName}
            setNewName={setNewName}
            setImg={setImg}
            img={img}
          />
        ) : (
          ""
        )}
        {selectedTab === tabs[1] && !ownPetDetail ? (
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
        {selectedTab === tabs[1] && ownPetDetail ? (
          <EditAddedPetInfo
            setOwnPetDetail={setOwnPetDetail}
            petNewImg={petNewImg}
            setPetNewImg={setPetNewImg}
            setPetNewInfo={setPetNewInfo}
            petNewInfo={petNewInfo}
            ownPetIndex={ownPetIndex}
            getOwnPetList={getOwnPetList}
          />
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
          />
        ) : (
          ""
        )}
        {selectedTab === tabs[2] ? <PetDiary /> : ""}
        {selectedTab === tabs[3] ? (
          <WritePetArticle
            addArticleInfo={addArticleInfo}
            setAddArticleInfo={setAddArticleInfo}
            articleCover={articleCover}
            setArticleCover={setArticleCover}
          />
        ) : (
          ""
        )}
      </MainInfo>
    </Wrapper>
  );
};

export default ProfileSetting;
