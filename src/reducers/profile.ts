export enum ActionType {
  setProfileName,
  setProfileEmail,
  setProfilePassword,
  clearProfileInfo,
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

interface clearProfileInfo {
  type: ActionType.clearProfileInfo;
}

export type ProfileActions =
  | setProfileName
  | setProfileEmail
  | setProfilePassword
  | clearProfileInfo;

export type Profile = {
  name: string;
  password: string;
  email: string;
};

const initialState: Profile = { name: "", password: "", email: "" };

const ProfileReducer = (state = initialState, action: ProfileActions) => {
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
    case ActionType.clearProfileInfo: {
      return { name: "", password: "", email: "" };
    }
    default:
      return state;
  }
};

export default ProfileReducer;
