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

export function setImage(img: File | string) {
  return {
    type: ActionType.setProfileImage,
    payload: { img },
  };
}

export function clearProfileInfo() {
  return {
    type: ActionType.clearProfileInfo,
  };
}

export function checkIfLogged(isLogged: boolean) {
  return {
    type: ActionType.checkIfLogged,
    payload: { isLogged },
  };
}

export function setProfileUid(uid: string) {
  return {
    type: ActionType.setProfileUid,
    payload: { uid },
  };
}

export function targetRegisterOrLogin(target: string) {
  return {
    type: ActionType.clickLoginOrRegister,
    payload: { target },
  };
}

export function afterRegisterSaveName() {
  return {
    type: ActionType.afterRegisterSaveName,
  };
}
