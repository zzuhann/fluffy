import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

const LoginRegisterBtn = styled.div`
  cursor: pointer;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const Header = () => {
  return (
    <Wrapper>
      <LoginRegisterBtn>註冊</LoginRegisterBtn>
      <LoginRegisterBtn>登入</LoginRegisterBtn>
    </Wrapper>
  );
};

export default Header;
