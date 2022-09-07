import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Profile } from "../../reducers/profile";
import { RegisterLoginBtn } from "./ProfileLoginRegister";

import UserInfos from "./UserInfos";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
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
  const tabs = ["info", "ownpet", "diary", "articles", "lostpet"];

  useEffect(() => {
    if (profile.img) {
      setImg({ ...img, url: profile.img as string });
      setNewName(profile.name);
    }
  }, [profile]);

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
      </MainInfo>
    </Wrapper>
  );
};

export default ProfileSetting;
