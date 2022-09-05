import store from "../src/store/configureStore";
import { Provider } from "react-redux";
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
    </Provider>
  );
}

export default App;
