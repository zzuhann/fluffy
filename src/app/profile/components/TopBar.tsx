import type { Dispatch, SetStateAction } from 'react'
import type { Profile } from '../../reducers/profile'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

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
`

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
`

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 953px) {
    display: none;
  }
`

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  object-fit: cover;
`

const ProfileName = styled.div`
  font-size: 22px;
  letter-spacing: 1.5px;
  margin-left: 15px;
  margin-right: 15px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 32px;
`

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
`

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
    width: ${props => (props.$isActive ? '100%' : '0%')};
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
`

interface TopbarType {
  tabs: string[]
  selectedTab: string
  setSelectedTab: Dispatch<SetStateAction<string>>
}

const Topbar: React.FC<TopbarType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    state => state.profile,
  ) as Profile

  return (
    <SideBarWrapper>
      <SidebarProfileTab>
        <UserProfileContainer>
          <ProfileImg src={profile.img as string} alt="user" />
          <ProfileName>{profile.name}</ProfileName>
        </UserProfileContainer>
        <SettingTabContainer>
          {props.tabs.map((tab, index) => (
            <SettingTab
              key={index}
              onClick={(e) => {
                const target = e.target as HTMLDivElement
                props.setSelectedTab(target.textContent as string)
              }}
              $isActive={props.selectedTab === props.tabs[index]}
            >
              {tab}
            </SettingTab>
          ))}
        </SettingTabContainer>
      </SidebarProfileTab>
    </SideBarWrapper>
  )
}

export default Topbar
