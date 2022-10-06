import React, { useState } from "react";
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
import {
  imgInitialState,
  imgType,
} from "../../functions/commonFunctionAndType";
import Topbar from "./TopBar";

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

export const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  object-fit: cover;
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

type AddArticleInfo = {
  title: string;
  context: string;
};

const ProfileSetting = () => {
  const dispatch = useDispatch();
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const tabs = ["個人資訊", "寵物資料", "寵物日記", "寵物文章"];
  const [selectedTab, setSelectedTab] = useState<string>("個人資訊");
  const [newName, setNewName] = useState<string>("");
  const [ownPetDetail, setOwnPetDetail] = useState<boolean>(false);
  const [ownPetEdit, setOwnPetEdit] = useState<boolean>(false);
  const [ownPetIndex, setOwnPetIndex] = useState<number>(-1);
  const [addPet, setAddPet] = useState<boolean>(false);
  const [petImg, setPetImg] = useState<imgType>(imgInitialState);
  const [addPetInfo, setAddPetInfo] = useState<{
    name: string;
    sex: string;
    shelterName: string;
    kind: string;
    birthYear: number;
  }>({ name: "", sex: "", shelterName: "false", kind: "", birthYear: 0 });
  const [petNewImg, setPetNewImg] = useState<imgType>(imgInitialState);
  const [petNewInfo, setPetNewInfo] = useState<{
    name: string;
    birthYear: number;
  }>({ name: "", birthYear: 0 });
  const [articleCover, setArticleCover] = useState<imgType>(imgInitialState);
  const [addArticleInfo, setAddArticleInfo] = useState<AddArticleInfo>({
    title: "",
    context: "",
  });
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
      <Topbar
        tabs={tabs}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
      <Wrapper>
        <MainInfo>
          {selectedTab === tabs[0] && (
            <>
              <UserInfos
                newName={newName}
                setNewName={setNewName}
                setIncompleteInfo={setIncompleteInfo}
                incompleteInfo={incompleteInfo}
              />
            </>
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
