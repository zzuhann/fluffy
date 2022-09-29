import React, { Dispatch, SetStateAction, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  setName,
  setEmail,
  setPassword,
  setImage,
  clearProfileInfo,
  targetRegisterOrLogin,
  afterRegisterSaveName,
  setProfileUid,
  setNotification,
} from "../../functions/profileReducerFunction";
import { useSelector, useDispatch } from "react-redux";
import { Profile } from "../../reducers/profile";
import styled from "styled-components";
import ProfileSetting from "./ProfileSetting";
import defaultProfile from "./img/defaultprofile.png";
import close from "./img/close.png";
import { CatLoading } from "../../utils/loading";

const WarningText = styled.div`
  color: #db5452;
  position: absolute;
  bottom: -20px;
`;

const WarningErrorCode = styled(WarningText)`
  position: relative;
  bottom: 0;
  align-self: center;
`;

const RegisterLoginWrapper = styled.div<{ $Top: number }>`
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 500px;
  margin: 0 auto;
  position: absolute;
  top: ${(props) => (props.$Top ? `${props.$Top + 500}px` : "50%")};
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 36px;
  padding-top: 95px;
  background-color: #f8f6f6;
  border-radius: 5px;
  box-shadow: 5px 5px 2px 1px rgba(255, 255, 255, 0.2),
    0 0 0 10000px rgba(0, 0, 0, 0.5);
`;

const ToggleRegisterLogin = styled.div`
  position: absolute;
  top: 52px;
  right: 36px;
  cursor: pointer;
`;

const RegisterLoginTitle = styled.div`
  font-size: 32px;
  position: absolute;
  top: 36px;
  left: 36px;
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    background-color: #d0470c;
    position: absolute;
    left: -8px;
    top: 1px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  position: relative;
`;

const Label = styled.label`
  font-size: 18px;
`;

const Input = styled.input`
  font-size: 18px;
  border-radius: 5px;
  letter-spacing: 1px;
  margin-top: 8px;
  background-color: #ececec;
  border: none;
  padding: 10px;
  ::placeholder,
  ::-webkit-input-placeholder {
    font-size: 16px;
    letter-spacing: 1px;
  }
  :-ms-input-placeholder {
    font-size: 16px;
    letter-spacing: 1px;
  }
`;

export const RegisterLoginBtn = styled.div`
  width: 100%;
  font-size: 18px;
  letter-spacing: 1.5px;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  background-color: #952f04;
  color: #fff;
  cursor: pointer;
  align-self: center;
  text-align: center;
  transition: 0.3s;
  &:hover {
    background-color: #8a2b02;
  }
`;

const LoginPopupCancel = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
`;

type LoginRegisterType = {
  openLoginBox: boolean;
  setOpenLoginBox: Dispatch<SetStateAction<boolean>>;
  $Top: number;
};

export const LoginRegisterBox: React.FC<LoginRegisterType> = (props) => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const dispatch = useDispatch();
  // let navigate = useNavigate();
  const Emailregex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  const [registerStatus, setRegisterStatus] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorStatus, setErrorStatus] = useState("");
  const [loginStatus, setLoginStatus] = useState({ email: "", password: "" });
  const [isLoading, setLoading] = useState(false);

  function createProfile() {
    if (
      profile.name.length === 0 ||
      profile.email.length === 0 ||
      profile.password.length === 0 ||
      !Emailregex.test(profile.email) ||
      profile.password.length < 6
    ) {
      if (profile.name.length === 0) {
        setRegisterStatus((pre) => {
          return { ...pre, name: "empty" };
        });
      } else {
        setRegisterStatus((pre) => {
          return { ...pre, name: "" };
        });
      }

      if (profile.email.length === 0) {
        setRegisterStatus((pre) => {
          return { ...pre, email: "empty" };
        });
      } else if (!Emailregex.test(profile.email)) {
        setRegisterStatus((pre) => {
          return { ...pre, email: "wrongFormat" };
        });
      } else {
        setRegisterStatus((pre) => {
          return { ...pre, email: "" };
        });
      }

      if (profile.password.length === 0) {
        setRegisterStatus((pre) => {
          return { ...pre, password: "empty" };
        });
      } else if (profile.password.length < 6) {
        setRegisterStatus((pre) => {
          return { ...pre, password: "wrongLength" };
        });
      } else {
        setRegisterStatus((pre) => {
          return { ...pre, password: "" };
        });
      }
      return;
    } else {
      setRegisterStatus({ name: "", email: "", password: "" });
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, profile.email, profile.password)
      .then(async (response) => {
        setErrorStatus("");
        const userUid = response.user.uid;
        await setDoc(doc(db, "memberProfiles", userUid), {
          name: profile.name,
        });
        dispatch(setNotification("註冊成功"));
        setTimeout(() => {
          dispatch(setNotification(""));
        }, 3000);
        dispatch(afterRegisterSaveName());
        props.setOpenLoginBox(false);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorStatus("此信箱已被註冊！");
            break;
          default:
        }
      });
  }

  function logInProfile() {
    if (
      profile.email.length === 0 ||
      profile.password.length === 0 ||
      !Emailregex.test(profile.email) ||
      profile.password.length < 6
    ) {
      if (profile.email.length === 0) {
        setLoginStatus((pre) => {
          return { ...pre, email: "empty" };
        });
      } else if (!Emailregex.test(profile.email)) {
        setLoginStatus((pre) => {
          return { ...pre, email: "wrongFormat" };
        });
      } else {
        setLoginStatus((pre) => {
          return { ...pre, email: "" };
        });
      }

      if (profile.password.length === 0) {
        setLoginStatus((pre) => {
          return { ...pre, password: "empty" };
        });
      } else if (profile.password.length < 6) {
        setLoginStatus((pre) => {
          return { ...pre, password: "wrongLength" };
        });
      } else {
        setLoginStatus((pre) => {
          return { ...pre, password: "" };
        });
      }
      return;
    } else {
      setLoginStatus({ email: "", password: "" });
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, profile.email, profile.password)
      .then(async (userCredential) => {
        setErrorStatus("");
        dispatch(clearProfileInfo());
        const docRef = doc(db, "memberProfiles", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setNotification("登入成功"));
          setTimeout(() => {
            dispatch(setNotification(""));
          }, 3000);
          dispatch(setName(docSnap.data().name));
          dispatch(setProfileUid(userCredential.user.uid));
          props.setOpenLoginBox(false);
          if (docSnap.data().img) {
            dispatch(setImage(docSnap.data().img));
          } else {
            dispatch(setImage(defaultProfile));
          }
        } else {
          console.log("No such document!");
        }
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            setErrorStatus("查無此信箱，請進行註冊或重新輸入");
            break;
          case "auth/wrong-password":
            setErrorStatus("密碼錯誤，請重新輸入！");
            break;
          default:
        }
      });
  }

  return isLoading ? (
    <CatLoading />
  ) : profile.clickLoginOrRegister === "login" ? (
    <RegisterLoginWrapper
      $Top={props.$Top}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          logInProfile();
        }
      }}
    >
      {props.openLoginBox && (
        <LoginPopupCancel
          src={close}
          onClick={() => props.setOpenLoginBox(false)}
        />
      )}

      <RegisterLoginTitle>登入</RegisterLoginTitle>
      <ToggleRegisterLogin
        onClick={() => {
          dispatch(setEmail(""));
          dispatch(setPassword(""));
          dispatch(targetRegisterOrLogin("register"));
          setErrorStatus("");
        }}
      >
        尚未有帳號？進行註冊
      </ToggleRegisterLogin>
      <InputContainer>
        <Label htmlFor="email">Email 帳號</Label>
        <Input
          key="emailLogin"
          type="text"
          placeholder="請輸入 Email"
          id="email"
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setLoginStatus({ ...loginStatus, email: "empty" });
            } else if (!Emailregex.test(e.target.value)) {
              setLoginStatus({ ...loginStatus, email: "wrongFormat" });
            } else {
              setLoginStatus({ ...loginStatus, email: "" });
            }
          }}
        />
        {loginStatus.email === "empty" ? (
          <WarningText>Email 不得為空白</WarningText>
        ) : loginStatus.email === "wrongFormat" ? (
          <WarningText>Email 格式錯誤，請填寫有效 Email</WarningText>
        ) : (
          ""
        )}
      </InputContainer>
      <InputContainer>
        <Label htmlFor="password">密碼</Label>
        <Input
          key="passwordLogin"
          type="password"
          placeholder="請輸入密碼"
          id="password"
          onChange={(e) => {
            dispatch(setPassword(e.target.value));
          }}
          onBlur={(e) => {
            if (e.target.value.length === 0) {
              setLoginStatus({ ...loginStatus, password: "empty" });
            } else if (e.target.value.length < 6) {
              setLoginStatus({ ...loginStatus, password: "wrongLength" });
            } else {
              setLoginStatus({ ...loginStatus, password: "" });
            }
          }}
        />
        {loginStatus.password === "empty" ? (
          <WarningText>密碼不得為空白</WarningText>
        ) : loginStatus.password === "wrongLength" ? (
          <WarningText>密碼不能少於 6 個字元</WarningText>
        ) : (
          ""
        )}
      </InputContainer>
      <Label>測試帳號：fluffy@test.com</Label>
      <Label>測試密碼：Fluffy</Label>
      {errorStatus && <WarningErrorCode>{errorStatus}</WarningErrorCode>}
      <RegisterLoginBtn onClick={() => logInProfile()}>登入</RegisterLoginBtn>
    </RegisterLoginWrapper>
  ) : (
    <RegisterLoginWrapper
      $Top={props.$Top}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          createProfile();
        }
      }}
    >
      {props.openLoginBox && (
        <LoginPopupCancel
          src={close}
          onClick={() => props.setOpenLoginBox(false)}
        />
      )}
      <RegisterLoginTitle>註冊</RegisterLoginTitle>
      <InputContainer>
        <Label htmlFor="name">使用者名稱</Label>
        <Input
          key="nameRegister"
          type="text"
          placeholder="輸入使用者名稱"
          id="name"
          onChange={(e) => {
            dispatch(setName(e.target.value));
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setRegisterStatus({ ...registerStatus, name: "empty" });
            } else {
              setRegisterStatus({ ...registerStatus, name: "" });
            }
          }}
        />
        {registerStatus.name === "empty" ? (
          <WarningText>使用者名稱不得為空白</WarningText>
        ) : (
          ""
        )}
      </InputContainer>
      <InputContainer>
        <Label htmlFor="email">Email 帳號</Label>
        <Input
          key="emailRegister"
          type="text"
          placeholder="請輸入 email"
          id="email"
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setRegisterStatus({ ...registerStatus, email: "empty" });
            } else if (!Emailregex.test(e.target.value)) {
              setRegisterStatus({
                ...registerStatus,
                email: "wrongFormat",
              });
            } else {
              setRegisterStatus({ ...registerStatus, email: "" });
            }
          }}
        />
        {registerStatus.email === "empty" ? (
          <WarningText>Email 不得為空白</WarningText>
        ) : registerStatus.email === "wrongFormat" ? (
          <WarningText>Email 格式錯誤，請填寫有效 Email</WarningText>
        ) : (
          ""
        )}
      </InputContainer>
      <InputContainer>
        <Label htmlFor="password">密碼</Label>
        <Input
          key="passwordRegister"
          type="password"
          placeholder="長度至少六位字元"
          id="password"
          onChange={(e) => {
            dispatch(setPassword(e.target.value));
          }}
          onBlur={(e) => {
            if (e.target.value.length === 0) {
              setRegisterStatus({ ...registerStatus, password: "empty" });
            } else if (e.target.value.length < 6) {
              setRegisterStatus({
                ...registerStatus,
                password: "wrongLength",
              });
            } else {
              setRegisterStatus({ ...registerStatus, password: "" });
            }
          }}
        />
        {registerStatus.password === "empty" ? (
          <WarningText>密碼不得為空白</WarningText>
        ) : registerStatus.password === "wrongLength" ? (
          <WarningText>密碼不能少於 6 個字元</WarningText>
        ) : (
          ""
        )}
      </InputContainer>
      {errorStatus && <WarningErrorCode>{errorStatus}</WarningErrorCode>}
      <RegisterLoginBtn onClick={() => createProfile()}>註冊</RegisterLoginBtn>

      <ToggleRegisterLogin
        onClick={() => {
          dispatch(setName(""));
          dispatch(setEmail(""));
          dispatch(setPassword(""));
          dispatch(targetRegisterOrLogin("login"));
          setErrorStatus("");
        }}
      >
        已經有帳號？進行登入
      </ToggleRegisterLogin>
    </RegisterLoginWrapper>
  );
};

const ProfileLoginRegister = () => {
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;
  const [notthing, setNotThing] = useState(false);

  return (
    <>
      {profile.isLogged ? (
        <ProfileSetting />
      ) : (
        <LoginRegisterBox
          openLoginBox={false}
          setOpenLoginBox={setNotThing}
          $Top={0}
        />
      )}
    </>
  );
};

export default ProfileLoginRegister;
