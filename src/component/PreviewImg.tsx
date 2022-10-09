import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { imgType, UploadImgType } from "../functions/commonFunctionAndType";
import { CancelIcon } from "../pages/ProfileSetting/UserInfos";
import trash from "./img/bin.png";

const PreviewContainer = styled.div`
  position: relative;
  width: 350px;
  height: 200px;
  padding-left: 15px;
  @media (max-width: 533px) {
    padding-left: 0px;
    width: 100%;
  }
`;

const PreviewImg = styled.img`
  width: 350px;
  height: 200px;
  object-fit: cover;
  position: relative;
  @media (max-width: 533px) {
    width: 100%;
  }
`;

const PreviewCancelBtn = styled.div`
  position: absolute;
  bottom: -10px;
  right: -25px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #db5452;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #b54745;
    color: #fff;
  }
  @media (max-width: 533px) {
    bottom: -5px;
    right: -15px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
  }
  @media (max-width: 465px) {
    bottom: -8px;
    right: -5px;
  }
`;

export const ToPreviewImgEmptyImgToString: React.FC<{
  imgURL: string;
  emptyImg: Dispatch<SetStateAction<imgType>>;
}> = ({ imgURL, emptyImg }) => {
  return (
    <PreviewContainer>
      <PreviewImg src={imgURL} alt="" />
      <PreviewCancelBtn
        onClick={() => {
          emptyImg({ file: "", url: "" });
        }}
      >
        <CancelIcon src={trash} />
      </PreviewCancelBtn>
    </PreviewContainer>
  );
};

export const ToPreviewImgEmptyImgToNull: React.FC<{
  imgURL: string;
  emptyImg: Dispatch<SetStateAction<UploadImgType>>;
}> = ({ imgURL, emptyImg }) => {
  return (
    <PreviewContainer>
      <PreviewImg src={imgURL} />
      <PreviewCancelBtn
        onClick={() => {
          emptyImg({ file: null, url: "" });
        }}
      >
        <CancelIcon src={trash} />
      </PreviewCancelBtn>
    </PreviewContainer>
  );
};
