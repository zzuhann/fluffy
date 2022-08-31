export enum ActionType {
  setProfileName,
  setProfileEmail,
  setProfilePassword,
  setProfileImage,
  clearProfileInfo,
  checkIfLogged,
  setProfileUid,
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
  payload: { img: object };
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

export type ProfileActions =
  | setProfileName
  | setProfileEmail
  | setProfilePassword
  | setProfileImage
  | clearProfileInfo
  | checkIsLogged
  | setProfileUid;

export type Profile = {
  name: string;
  password: string;
  email: string;
  img: object;
  isLogged: boolean;
  clickLoginOrRegister: string;
  uid: string;
};

const initialState: Profile = {
  name: "",
  password: "",
  email: "",
  img: {},
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
      return { ...state, name: "", password: "", email: "", img: {} };
    }
    case ActionType.setProfileUid: {
      return { ...state, uid: action.payload.uid };
    }
    default:
      return state;
  }
};

export default ProfileReducer;
