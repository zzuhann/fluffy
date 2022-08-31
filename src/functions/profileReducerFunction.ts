import { ActionType } from "../reducers/profile";

export function setName(name: string) {
  return {
    type: ActionType.setProfileName,
    payload: { name },
  };
}

export function setEmail(email: string) {
  return {
    type: ActionType.setProfileEmail,
    payload: { email },
  };
}

export function setPassword(password: string) {
  return {
    type: ActionType.setProfilePassword,
    payload: { password },
  };
}

export function clearProfileInfo() {
  return {
    type: ActionType.clearProfileInfo,
  };
}
