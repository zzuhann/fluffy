export enum ActionType {
  setUserKindPreference,
  setUserLocationPreference,
  toggleDetailInfo,
  setUserDirection,
  setAllCardInfrontOfUser,
}

interface toggleDetailInfo {
  type: ActionType.toggleDetailInfo;
  payload: { openDetail: boolean };
}

interface setUserDirection {
  type: ActionType.setUserDirection;
  payload: { direction: string };
}

interface setAllCardInfrontOfUser {
  type: ActionType.setAllCardInfrontOfUser;
  payload: { allCards: Card[] };
}

interface setUserKindPreference {
  type: ActionType.setUserKindPreference;
  payload: { kind: string };
}

interface setUserLocationPreference {
  type: ActionType.setUserLocationPreference;
  payload: { location: string };
}

export type DatingActions =
  | toggleDetailInfo
  | setUserDirection
  | setAllCardInfrontOfUser
  | setUserKindPreference
  | setUserLocationPreference;

export type Dating = {
  kind: string;
  location: string;
  openDetail: boolean;
  direction: string;
  allCards: Card[];
};

export type Card = {
  id: number;
  area: number;
  shelterName: string;
  shelterAddress: string;
  shelterTel: string;
  kind: string;
  sex: string;
  color: string;
  sterilization: string;
  foundPlace: string;
  image: string;
};

const initialState: Dating = {
  kind: "",
  location: "",
  openDetail: false,
  direction: "",
  allCards: [],
};

const DatingReducer = (state: Dating = initialState, action: DatingActions) => {
  switch (action.type) {
    case ActionType.setUserKindPreference: {
      return { ...state, kind: action.payload.kind };
    }
    case ActionType.setUserLocationPreference: {
      return { ...state, location: action.payload.location };
    }
    case ActionType.toggleDetailInfo: {
      return { ...state, openDetail: action.payload.openDetail };
    }
    case ActionType.setUserDirection: {
      return { ...state, direction: action.payload.direction };
    }
    case ActionType.setAllCardInfrontOfUser: {
      return { ...state, allCards: action.payload.allCards };
    }
    default:
      return state;
  }
};
export type DatingReducerType = typeof DatingReducer;

export default DatingReducer;
