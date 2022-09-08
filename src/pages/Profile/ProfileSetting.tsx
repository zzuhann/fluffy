import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Profile, OwnPet } from "../../reducers/profile";
import { RegisterLoginBtn } from "./ProfileLoginRegister";
import UserInfos from "./UserInfos";
import kaka from "./DSCN5350.JPG";
import upload from "./plus.png";
import { db, storage } from "../../utils/firebase";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { setOwnPets } from "../../functions/profileReducerFunction";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
          <PetInfo>
            {profile.ownPets.map((pet, index) => (
              <PetSimpleCard key={index}>
                <CloseBtn
                  onClick={() => {
                    setOwnPetDetail(true);
                    setOwnPetIndex(index);
                    setPetNewImg({
                      ...petNewImg,
                      url: profile.ownPets[index].img,
                    });
                    setPetNewInfo({
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
                    const q = query(
                      collection(db, `/memberProfiles/${profile.uid}/ownPets`),
                      where("name", "==", profile.ownPets[index].name)
                    );
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (d) => {
                      await deleteDoc(
                        doc(db, `/memberProfiles/${profile.uid}/ownPets`, d.id)
                      );
                    });
                    window.alert("刪除完成！");
                    getOwnPetList();
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
            <PetSimpleCard onClick={() => setAddPet(true)}>
              <PetSimpleImage src={upload} />
              <PetSimpleInfos>
                <PetSimpleInfo>新增寵物</PetSimpleInfo>
              </PetSimpleInfos>
            </PetSimpleCard>
          </PetInfo>
        ) : (
          ""
        )}
        {selectedTab === tabs[1] && ownPetDetail ? (
          <PetDetailCard>
            <CloseBtn onClick={() => setOwnPetDetail(false)}>X</CloseBtn>
            {petNewImg.url ? (
              <PreviewContainer>
                <PetDetailUploadImg src={petNewImg.url} alt="" />
                <PreviewCancelBtn
                  onClick={() => {
                    setPetNewImg({ file: "", url: "" });
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
                if (!e.target.files) return;
                const newImage = {
                  file: e.target.files[0],
                  url: URL.createObjectURL(e.target.files[0]),
                };
                setPetNewImg(newImage);
              }}
            />
            <EditContainer>
              <EditInfoLabel htmlFor="name">name: </EditInfoLabel>
              <EditInfoInput
                id="kind"
                type="text"
                value={petNewInfo.name}
                onChange={(e) => {
                  setPetNewInfo({ ...petNewInfo, name: e.target.value });
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
                value={petNewInfo.birthYear}
                onChange={(e) => {
                  setPetNewInfo({
                    ...petNewInfo,
                    birthYear: Number(e.target.value),
                  });
                }}
              />
            </EditContainer>
            <PetDatailInfo>
              種類: {profile.ownPets[ownPetIndex].kind}
            </PetDatailInfo>
            <PetDatailInfo>
              性別：{profile.ownPets[ownPetIndex].sex === "M" ? "公" : "母"}
            </PetDatailInfo>
            {profile.ownPets[ownPetIndex].shelterName === "false" ? (
              ""
            ) : (
              <PetDatailInfo>
                從{profile.ownPets[ownPetIndex].shelterName}領養
              </PetDatailInfo>
            )}
            <PetDetailSexBtn
              onClick={async () => {
                if (!petNewInfo.name && !petNewImg.url) {
                  window.alert("更新資料不可為空");
                  return;
                }
                if (
                  petNewInfo.name === profile.ownPets[ownPetIndex].name &&
                  petNewInfo.birthYear ===
                    profile.ownPets[ownPetIndex].birthYear &&
                  petNewImg.url === profile.ownPets[ownPetIndex].img
                ) {
                  window.alert("未更新資料");
                  return;
                }
                if (petNewImg.url !== profile.ownPets[ownPetIndex].img) {
                  const storageRef = ref(
                    storage,
                    `pets/${profile.uid}-${petNewInfo.name}`
                  );
                  const uploadTask = uploadBytesResumable(
                    storageRef,
                    petNewImg.file as File
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
                      getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                          const q = query(
                            collection(
                              db,
                              `/memberProfiles/${profile.uid}/ownPets`
                            ),
                            where(
                              "name",
                              "==",
                              profile.ownPets[ownPetIndex].name
                            )
                          );
                          const querySnapshot = await getDocs(q);
                          querySnapshot.forEach(async (d) => {
                            const petProfileRef = doc(
                              db,
                              `/memberProfiles/${profile.uid}/ownPets`,
                              d.id
                            );
                            await updateDoc(petProfileRef, {
                              name: petNewInfo.name,
                              birthYear: petNewInfo.birthYear,
                              img: downloadURL,
                            });
                          });
                          window.alert("更新完成！");
                          getOwnPetList();
                        }
                      );
                    }
                  );
                } else {
                  const q = query(
                    collection(db, `/memberProfiles/${profile.uid}/ownPets`),
                    where("name", "==", profile.ownPets[ownPetIndex].name)
                  );
                  const querySnapshot = await getDocs(q);
                  querySnapshot.forEach(async (d) => {
                    const petProfileRef = doc(
                      db,
                      `/memberProfiles/${profile.uid}/ownPets`,
                      d.id
                    );
                    await updateDoc(petProfileRef, {
                      name: petNewInfo.name,
                      birthYear: petNewInfo.birthYear,
                    });
                    console.log(`/memberProfiles/${profile.uid}/ownPets`);
                    console.log(d.id);
                  });

                  window.alert("更新完成！");
                  getOwnPetList();
                }
              }}
            >
              更新寵物資料
            </PetDetailSexBtn>
          </PetDetailCard>
        ) : (
          ""
        )}
        {selectedTab === tabs[1] && addPet ? (
          <PetDetailCard>
            <CloseBtn onClick={() => setAddPet(false)}>X</CloseBtn>
            {petImg.url ? (
              <PreviewContainer>
                <PreviewImg src={petImg.url} />
                <PreviewCancelBtn
                  onClick={() => {
                    setPetImg({ file: "", url: "" });
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
                if (!e.target.files) return;
                const newImage = {
                  file: e.target.files[0],
                  url: URL.createObjectURL(e.target.files[0]),
                };
                setPetImg(newImage);
              }}
            />
            <EditContainer>
              <EditInfoLabel htmlFor="name">name: </EditInfoLabel>
              <EditInfoInput
                id="name"
                type="text"
                onChange={(e) => {
                  setAddPetInfo({ ...addPetInfo, name: e.target.value });
                }}
              />
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="kind">kind: </EditInfoLabel>
              <EditInfoInput
                id="kind"
                type="text"
                onChange={(e) => {
                  setAddPetInfo({ ...addPetInfo, kind: e.target.value });
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
                  setAddPetInfo({
                    ...addPetInfo,
                    birthYear: Number(e.target.value),
                  });
                }}
              />
            </EditContainer>
            <EditContainer>
              <EditInfoLabel htmlFor="sex">性別: </EditInfoLabel>
              <PetDetailSexBtn
                onClick={() => {
                  setAddPetInfo({ ...addPetInfo, sex: "F" });
                }}
              >
                女
              </PetDetailSexBtn>
              <PetDetailSexBtn
                onClick={() => {
                  setAddPetInfo({ ...addPetInfo, sex: "M" });
                }}
              >
                男
              </PetDetailSexBtn>
            </EditContainer>
            <PetDetailSexBtn
              onClick={async () => {
                if (
                  Object.values(addPetInfo).some((info) => !info) ||
                  Object.values(petImg).some((info) => !info)
                ) {
                  window.alert("請填寫完整寵物資料");
                  return;
                }
                setOwnPetDetail(false);
                addPetDataFirebase();
              }}
            >
              上傳寵物資料
            </PetDetailSexBtn>
          </PetDetailCard>
        ) : (
          ""
        )}
      </MainInfo>
    </Wrapper>
  );
};

export default ProfileSetting;
