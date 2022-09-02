export enum ActionType {
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

export type DatingActions =
  | toggleDetailInfo
  | setUserDirection
  | setAllCardInfrontOfUser;

export type Dating = {
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

export type petCardInfo = {
  animal_id: number;
  animal_area_pkid: number;
  animal_place: string;
  shelter_address: string;
  shelter_tel: string;
  animal_kind: string;
  animal_sex: string;
  animal_colour: string;
  animal_sterilization: string;
  animal_foundplace: string;
  album_file: string;
};

const initialState: Dating = {
  openDetail: false,
  direction: "",
  allCards: [],
};

const DatingReducer = (state: Dating = initialState, action: DatingActions) => {
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
export type DatingReducerType = typeof DatingReducer;

export default DatingReducer;
