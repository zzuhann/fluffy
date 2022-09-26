import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import catHand from "./cat_hand_mike.png";

const Wrap = styled.div<Position>`
  position: absolute;
  top: ${(props) => props.$Top};
  transform: ${(props) => props.$transform};
  right: ${(props) => props.$Right};
`;

type Position = {
  $Top: string;
  $Bottom: string;
  $Right: string;
  $Left: string;
  $transform: string;
};

export const Loading: React.FC<Position> = (props) => {
  return (
    <Wrap
      $Top={props.$Top}
      $Bottom={props.$Bottom}
      $Right={props.$Right}
      $Left={props.$Left}
      $transform={props.$transform}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        x="0"
        y="0"
        version="1.1"
        viewBox="0 0 40 40"
        xmlSpace="preserve"
      >
        <path
          d="M20.201 5.169c-8.254 0-14.946 6.692-14.946 14.946 0 8.255 6.692 14.946 14.946 14.946s14.946-6.691 14.946-14.946c-.001-8.254-6.692-14.946-14.946-14.946zm0 26.58c-6.425 0-11.634-5.208-11.634-11.634 0-6.425 5.209-11.634 11.634-11.634 6.425 0 11.633 5.209 11.633 11.634 0 6.426-5.208 11.634-11.633 11.634z"
          opacity="0.8"
          style={{ fill: "#FFB9B8" }}
        ></path>
        <path
          d="M26.013 10.047l1.654-2.866a14.855 14.855 0 00-7.466-2.012v3.312c2.119 0 4.1.576 5.812 1.566z"
          style={{ fill: "#EFEFEF" }}
        >
          <animateTransform
            attributeName="transform"
            attributeType="xml"
            dur="0.7s"
            from="0 20 20"
            repeatCount="indefinite"
            to="360 20 20"
            type="rotate"
          ></animateTransform>
        </path>
      </svg>
    </Wrap>
  );
};

const CatAnimation = keyframes`
  0% {bottom: 0}
  50% {bottom: -100px}
  100% {
    bottom: 0px;
  }
`;

const CatFootContainer = styled.div`
  height: 220px;
  /* margin: 0 auto; */
  position: absolute;
  overflow: hidden;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CatFoot = styled.img`
  height: 200px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: ${CatAnimation} 2s ease infinite;
`;

const LoadingText = styled.div`
  font-size: 18px;
  letter-spacing: 2px;
`;

export const CatLoading = () => {
  return (
    <CatFootContainer>
      <LoadingText>Loading ...</LoadingText>
      <CatFoot src={catHand} />
    </CatFootContainer>
  );
};
