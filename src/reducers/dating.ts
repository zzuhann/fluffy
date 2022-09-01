export enum ActionType {
  setUserPreference,
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

export type ProfileActions =
  | toggleDetailInfo
  | setUserDirection
  | setAllCardInfrontOfUser;

export type Dating = {
  preference: string;
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
  preference: "",
  openDetail: false,
  direction: "",
  allCards: [],
};

const DatingReducer = (
  state: Dating = initialState,
  action: ProfileActions
) => {
  switch (action.type) {
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

export default DatingReducer;
