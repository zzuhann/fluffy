export enum ActionType {
  toggleDetailInfo = 'toggleDetailInfo',
  setUserDirection = 'setUserDirection',
  setAllCardInfrontOfUser = 'setAllCardInfrontOfUser',
  setConsiderList = 'setConsiderList',
  setUpcomingDateList = 'setUpcomingDateList',
}

interface toggleDetailInfo {
  type: ActionType.toggleDetailInfo
  payload: { openDetail: boolean }
}

interface setUserDirection {
  type: ActionType.setUserDirection
  payload: { direction: string }
}

interface setAllCardInfrontOfUser {
  type: ActionType.setAllCardInfrontOfUser
  payload: { allCards: Card[] }
}

interface setConsiderList {
  type: ActionType.setConsiderList
  payload: { considerList: Card[] }
}

interface setUpcomingDateList {
  type: ActionType.setUpcomingDateList
  payload: { upcomingDateList: InviteDating[] }
}

export type DatingActions =
  | toggleDetailInfo
  | setUserDirection
  | setAllCardInfrontOfUser
  | setConsiderList
  | setUpcomingDateList

export interface Dating {
  openDetail: boolean
  direction: string
  allCards: Card[]
  considerList: Card[]
  upcomingDateList: InviteDating[]
}

export interface InviteDating {
  id: number
  area: number
  shleterPkid: number
  shelterName: string
  shelterAddress: string
  shelterTel: string
  kind: string
  sex: string
  color: string
  sterilization: string
  image: string
  datingDate: Date | number
  inviter: string
  time: string
  way: string
  doneWithMeeting: boolean
}

export interface Card {
  id: number
  area: number
  shleterPkid: number
  shelterName: string
  shelterAddress: string
  shelterTel: string
  kind: string
  sex: string
  color: string
  sterilization: string
  foundPlace: string
  image: string
}

export interface petCardInfo {
  animal_id: number
  animal_area_pkid: number
  animal_shelter_pkid: number
  animal_place: string
  shelter_address: string
  shelter_tel: string
  animal_kind: string
  animal_sex: string
  animal_colour: string
  animal_sterilization: string
  animal_foundplace: string
  album_file: string
}

const initialState: Dating = {
  openDetail: false,
  direction: '',
  allCards: [],
  considerList: [],
  upcomingDateList: [],
}

function DatingReducer(state: Dating = initialState, action: DatingActions) {
  switch (action.type) {
    case ActionType.toggleDetailInfo: {
      return { ...state, openDetail: action.payload.openDetail }
    }
    case ActionType.setUserDirection: {
      return { ...state, direction: action.payload.direction }
    }
    case ActionType.setAllCardInfrontOfUser: {
      return { ...state, allCards: action.payload.allCards }
    }
    case ActionType.setConsiderList: {
      return { ...state, considerList: action.payload.considerList }
    }
    case ActionType.setUpcomingDateList: {
      return { ...state, upcomingDateList: action.payload.upcomingDateList }
    }
    default:
      return state
  }
}
export type DatingReducerType = typeof DatingReducer

export default DatingReducer
