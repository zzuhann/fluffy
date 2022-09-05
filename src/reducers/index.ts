import { combineReducers } from "redux";
import ProfileReducer from "./profile";
import DatingReducer from "./dating";

export default combineReducers({
  profile: ProfileReducer,
  dating: DatingReducer,
});
