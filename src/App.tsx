import store from "../src/store/configureStore";
import { Provider, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import Header from "./component/Header";

const GlobalStyle = createGlobalStyle`
  * {
    outline: solid 1px black;
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <Provider store={store}>
      <Reset />
      <GlobalStyle />
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </Provider>
  );
}

export default App;
