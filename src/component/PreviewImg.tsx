import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { imgType } from "../functions/commonFunctionAndType";
import { CancelIcon } from "../pages/ProfileSetting/UserInfos";
import trash from "./img/bin.png";

const PreviewContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  @media (max-width: 533px) {
    padding-left: 0px;
    width: 100%;
  }
`;

const PreviewArticleContainer = styled(PreviewContainer)`
  width: 350px;
  height: 200px;
  padding-left: 15px;
`;

const PreviewImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  position: relative;
  border-radius: 40px;
  @media (max-width: 533px) {
    width: 100%;
  }
`;

const PreviewArticleImg = styled(PreviewImg)`
  width: 350px;
  height: 200px;
  border-radius: 10px;
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

const SquarePreviewCancelBtn = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
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
`;

export const ToPreviewImg: React.FC<{
  imgURL: string;
  emptyImg: Dispatch<SetStateAction<imgType>>;
  recOrSquare: string;
}> = ({ imgURL, emptyImg, recOrSquare }) => {
  return (
    <>
      {recOrSquare === "rec" ? (
        <PreviewArticleContainer>
          <PreviewArticleImg src={imgURL} />
          <PreviewCancelBtn
            onClick={() => {
              emptyImg({ file: "", url: "" });
            }}
          >
            <CancelIcon src={trash} alt="delete" />
          </PreviewCancelBtn>
        </PreviewArticleContainer>
      ) : (
        <PreviewContainer>
          <PreviewImg src={imgURL} alt="preview" />
          <SquarePreviewCancelBtn
            onClick={() => {
              emptyImg({ file: "", url: "" });
            }}
          >
            <CancelIcon src={trash} alt="delete" />
          </SquarePreviewCancelBtn>
        </PreviewContainer>
      )}
    </>
  );
};
