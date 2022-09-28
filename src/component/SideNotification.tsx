import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { Profile } from "../reducers/profile";

const PopupAnimation = keyframes`
  0% {right: -300px}
  70% {right:0}
  100% {right: -300px}
`;

export const PopupHint = styled.div`
  background-color: #b54745;
  color: #fff;
  position: absolute;
  right: -200px;
  right: 0;
  position: fixed;
  top: 100px;
  padding: 20px 25px;
  letter-spacing: 1.5px;
  z-index: 100;
  font-size: 18px;
  animation: ${PopupAnimation} 3s ease infinite;
`;

const SideNotification = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  return (
    <>{profile.notification && <PopupHint>{profile.notification}</PopupHint>}</>
  );
};

export default SideNotification;
