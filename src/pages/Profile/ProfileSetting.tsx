import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Profile, OwnPet } from "../../reducers/profile";
import { RegisterLoginBtn } from "./ProfileLoginRegister";
import UserInfos from "./UserInfos";
import { db, storage } from "../../utils/firebase";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { setOwnPets } from "../../functions/profileReducerFunction";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { SimpleSinglePetCard, EditAddedPetInfo, AddPet } from "./OwnPetInfo";

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
export const EditInfoLabel = styled.label``;
export const EditInfoInput = styled.input``;

const MainInfo = styled.div`
  position: relative;
  min-height: 100vh;
`;

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

type profileSettingType = {
  signOutProfile: () => void;
};

const ProfileSetting: React.FC<profileSettingType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  const [img, setImg] = useState<{ file: File | string; url: string }>({
    file: "",
    url: "",
  });
  const [newName, setNewName] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("info");
  const [ownPetDetail, setOwnPetDetail] = useState<boolean>(false);
  const [ownPetIndex, setOwnPetIndex] = useState<number>(-1);
  const [addPet, setAddPet] = useState<boolean>(false);
  const [petImg, setPetImg] = useState<{ file: File | string; url: string }>({
    file: "",
    url: "",
  });
  const [addPetInfo, setAddPetInfo] = useState<{
    name: string;
    sex: string;
    shelterName: string;
    kind: string;
    birthYear: number;
  }>({ name: "", sex: "", shelterName: "false", kind: "", birthYear: 0 });
  const [petNewImg, setPetNewImg] = useState<{
    file: File | string;
    url: string;
  }>({
    file: "",
    url: "",
  });
  const [petNewInfo, setPetNewInfo] = useState<{
    name: string;
    birthYear: number;
  }>({ name: "", birthYear: 0 });
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

  function addPetDataFirebase() {
    const storageRef = ref(storage, `pets/${profile.uid}-${addPetInfo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, petImg.file as File);
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
          await addDoc(
            collection(db, `/memberProfiles/${profile.uid}/ownPets`),
            { ...addPetInfo, img: downloadURL }
          );
          window.alert("上傳成功！");
          getOwnPetList();
        });
      }
    );
  }

  async function deleteOwnPet(name: string) {
    const q = query(
      collection(db, `/memberProfiles/${profile.uid}/ownPets`),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    const promises: any[] = [];
    querySnapshot.forEach(async (d) => {
      promises.push(
        deleteDoc(doc(db, `/memberProfiles/${profile.uid}/ownPets`, d.id))
      );
    });
    await Promise.all(promises);
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
            deleteOwnPet={deleteOwnPet}
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
            addPetDataFirebase={addPetDataFirebase}
            setPetNewImg={setPetNewImg}
          />
        ) : (
          ""
        )}
      </MainInfo>
    </Wrapper>
  );
};

export default ProfileSetting;
