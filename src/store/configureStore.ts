import { createStore } from "redux";
import ProfileReducer from "../reducers/profile";

const store = createStore(ProfileReducer);
export default store;
