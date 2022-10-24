import store from "../src/store/configureStore";
import { Provider } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import Header from "./component/Header";

import SideNotification from "./component/SideNotification";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
    }
    &::-webkit-scrollbar:vertical {
      width: 11px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      border: 2px solid white;
      background-color: #efefef;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
      border-radius: 8px;
    }
    scrollbar-color: #efefef;
    scrollbar-width: thin !important;
  }
  a {
    text-decoration:none;
  }
  input {
    font-size:16px;
    letter-spacing:1px;
  }
  input::placeholder {
    font-family: 'Noto Sans TC', sans-serif;
  }
  input::-webkit-input-placeholder {
    font-family: 'Noto Sans TC', sans-serif;
  }
  input:-moz-placeholder {
    font-family: 'Noto Sans TC', sans-serif;
  }
  input::-moz-placeholder {
    font-family: 'Noto Sans TC', sans-serif;
  }
  body {
    font-family: 'Noto Sans TC', sans-serif;
    font-weight:400;
    color:#3C3C3C;
    overflow-x:hidden;
  }
`;

function App() {
  return (
    <Provider store={store}>
      <Reset />
      <GlobalStyle />
      <Header />
      <Outlet />
      <SideNotification />
    </Provider>
  );
}

export default App;
