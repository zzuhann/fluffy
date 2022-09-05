export enum ActionType {
  setProfileName,
  setProfileEmail,
  setProfilePassword,
  setProfileImage,
  clearProfileInfo,
  checkIfLogged,
  setProfileUid,
  clickLoginOrRegister,
  afterRegisterSaveName,
}

interface setProfileName {
  type: ActionType.setProfileName;
  payload: { name: string };
}

interface setProfileEmail {
  type: ActionType.setProfileEmail;
  payload: { email: string };
}

interface setProfilePassword {
  type: ActionType.setProfilePassword;
  payload: { password: string };
}

interface setProfileImage {
  type: ActionType.setProfileImage;
  payload: { img: File | string };
}

interface clearProfileInfo {
  type: ActionType.clearProfileInfo;
}

interface checkIsLogged {
  type: ActionType.checkIfLogged;
  payload: { isLogged: boolean };
}

interface setProfileUid {
  type: ActionType.setProfileUid;
  payload: { uid: string };
}

interface clickLoginOrRegister {
  type: ActionType.clickLoginOrRegister;
  payload: { target: string };
}

interface afterRegisterSaveName {
  type: ActionType.afterRegisterSaveName;
}

export type ProfileActions =
  | setProfileName
  | setProfileEmail
  | setProfilePassword
  | setProfileImage
  | clearProfileInfo
  | checkIsLogged
  | setProfileUid
  | clickLoginOrRegister
  | afterRegisterSaveName;

export type Profile = {
  name: string;
  password: string;
  email: string;
  img: string | File;
  isLogged: boolean;
  clickLoginOrRegister: string;
  uid: string;
};

const initialState: Profile = {
  name: "",
  password: "",
  email: "",
  img: "",
  isLogged: false,
  clickLoginOrRegister: "",
  uid: "",
};

const ProfileReducer = (
  state: Profile = initialState,
  action: ProfileActions
) => {
  switch (action.type) {
    case ActionType.setProfileName: {
      return { ...state, name: action.payload.name };
    }
    case ActionType.setProfileEmail: {
      return { ...state, email: action.payload.email };
    }
    case ActionType.setProfilePassword: {
      return { ...state, password: action.payload.password };
    }
    case ActionType.setProfileImage: {
      return { ...state, img: action.payload.img };
    }
    case ActionType.checkIfLogged: {
      return { ...state, isLogged: action.payload.isLogged };
    }
    case ActionType.clearProfileInfo: {
      return { ...state, name: "", password: "", email: "", img: "" };
    }
    case ActionType.afterRegisterSaveName: {
      return {
        ...state,
        password: "",
        email: "",
        img: "",
      };
    }
    case ActionType.setProfileUid: {
      return { ...state, uid: action.payload.uid };
    }
    case ActionType.clickLoginOrRegister: {
      return { ...state, clickLoginOrRegister: action.payload.target };
    }
    default:
      return state;
  }
};

export default ProfileReducer;