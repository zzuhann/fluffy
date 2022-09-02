import { ActionType, Card } from "../reducers/dating";

export function toggleDetailInfo(openDetail: boolean) {
  return {
    type: ActionType.toggleDetailInfo,
    payload: { openDetail },
  };
}

export function setUserDirection(direction: string) {
  return {
    type: ActionType.setUserDirection,
    payload: { direction },
  };
}

export function setAllCardInfrontOfUser(allCards: Card[]) {
  return {
    type: ActionType.setAllCardInfrontOfUser,
    payload: { allCards },
  };
}

export function setUserKindPreference(kind: string) {
  return {
    type: ActionType.setUserKindPreference,
    payload: { kind },
  };
}

export function setUserLocationPreference(location: string) {
  return {
    type: ActionType.setUserLocationPreference,
    payload: { location },
  };
}
