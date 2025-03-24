import type {
  OwnArticle,
  OwnPet,
  PetDiaryType,
} from '../reducers/profile'
import {
  ActionType,
} from '../reducers/profile'

export function setName(name: string) {
  return {
    type: ActionType.setProfileName,
    payload: { name },
  }
}

export function setEmail(email: string) {
  return {
    type: ActionType.setProfileEmail,
    payload: { email },
  }
}

export function setPassword(password: string) {
  return {
    type: ActionType.setProfilePassword,
    payload: { password },
  }
}

export function setImage(img: File | string) {
  return {
    type: ActionType.setProfileImage,
    payload: { img },
  }
}

export function clearProfileInfo() {
  return {
    type: ActionType.clearProfileInfo,
  }
}

export function checkIfLogged(isLogged: boolean) {
  return {
    type: ActionType.checkIfLogged,
    payload: { isLogged },
  }
}

export function setProfileUid(uid: string) {
  return {
    type: ActionType.setProfileUid,
    payload: { uid },
  }
}

export function targetRegisterOrLogin(target: string) {
  return {
    type: ActionType.clickLoginOrRegister,
    payload: { target },
  }
}

export function afterRegisterSaveName() {
  return {
    type: ActionType.afterRegisterSaveName,
  }
}

export function setOwnPets(ownPets: OwnPet[]) {
  return {
    type: ActionType.setOwnPets,
    payload: { ownPets },
  }
}

export function setOwnPetDiary(petDiary: PetDiaryType[]) {
  return {
    type: ActionType.setOwnPetDiary,
    payload: { petDiary },
  }
}

export function setOwnArticle(ownArticles: OwnArticle[]) {
  return {
    type: ActionType.setOwnArticle,
    payload: { ownArticles },
  }
}

export function setNotification(notification: string) {
  return {
    type: ActionType.setNotification,
    payload: { notification },
  }
}

export function setShelter(isShelter: boolean) {
  return {
    type: ActionType.setShelter,
    payload: { isShelter },
  }
}
