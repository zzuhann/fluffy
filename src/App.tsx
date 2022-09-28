import store from "../src/store/configureStore";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import Header from "./component/Header";
import NotoSansTCRegular from "./fonts/NotoSansTC-Regular.otf";
import NotoSansTMedium from "./fonts/NotoSansTC-Medium.otf";
import NotoSansTCBold from "./fonts/NotoSansTC-Bold.otf";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: NotoSansTC;
    src: url(${NotoSansTCRegular}) format('opentype');
    font-weight: normal;
  }
  @font-face {
    font-family: NotoSansTC;
    src: url(${NotoSansTMedium}) format('opentype');
    font-weight: 500;
  }

  @font-face {
    font-family: NotoSansTC;
    src: url(${NotoSansTCBold}) format('opentype');
    font-weight: bold;
  }
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
      border: 2px solid white; /* should match background, can't be transparent */
      background-color: #efefef;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
      border-radius: 8px;
    }
  }
  a {
    text-decoration:none;
  }
  input {
    font-size:16px;
    letter-spacing:1px;
  }
  input::placeholder {
    font-family: NotoSansTC;
    src: url(${NotoSansTCBold}) format('opentype');
  }
  input::-webkit-input-placeholder {
    font-family: NotoSansTC;
    src: url(${NotoSansTCBold}) format('opentype');
  }
  input:-moz-placeholder {
    font-family: NotoSansTC;
    src: url(${NotoSansTCBold}) format('opentype');
  }
  input::-moz-placeholder {
    font-family: NotoSansTC;
    src: url(${NotoSansTCBold}) format('opentype');
  }
  body {
    font-family: NotoSansTC;
    font-weight:400;
    color:#3C3C3C;
  }
`;

function App() {
  return (
    <Provider store={store}>
      <Reset />
      <GlobalStyle />
      <Header />
      <Outlet />
    </Provider>
  );
}

export default App;
