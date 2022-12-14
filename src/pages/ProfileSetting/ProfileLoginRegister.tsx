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
  setShelter,
} from "../../functions/profileReducerFunction";
import { useSelector, useDispatch } from "react-redux";
import { Profile } from "../../reducers/profile";
import styled from "styled-components";
import ProfileSetting from "./ProfileSetting";
import defaultProfile from "./img/defaultprofile.png";
import close from "./img/close.png";
import { Loading } from "../../utils/loading";
import { useNotifyDispatcher } from "../../component/SidebarNotify";
import { BlackMask } from "../../component/Header";

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
  z-index: 2501;
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 500px;
  margin: 0 auto;
  position: fixed;
  top: ${(props) => (props.$Top ? `${props.$Top}vh` : "50%")};
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
  position: relative;
  width: 100%;
  font-size: 18px;
  letter-spacing: 1.5px;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  background-color: #952f04;
  color: #fff;
  min-height: 35px;
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
  const notifyDispatcher = useNotifyDispatcher();
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
        notifyDispatcher("????????????");
        dispatch(afterRegisterSaveName());
        props.setOpenLoginBox(false);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorStatus("????????????????????????");
            setLoading(false);
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
          notifyDispatcher("????????????");
          dispatch(setName(docSnap.data().name));
          if (docSnap.data().shelter === "true") {
            dispatch(setShelter(true));
          }
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
        setLoading(false);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            setLoading(false);
            setErrorStatus("????????????????????????????????????????????????");
            break;
          case "auth/wrong-password":
            setLoading(false);
            setErrorStatus("?????????????????????????????????");
            break;
          default:
        }
      });
  }

  return profile.clickLoginOrRegister === "login" ? (
    <>
      <BlackMask $isActive={props.openLoginBox} />
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
            alt="close"
          />
        )}
        <RegisterLoginTitle>??????</RegisterLoginTitle>
        <ToggleRegisterLogin
          onClick={() => {
            dispatch(setEmail(""));
            dispatch(setPassword(""));
            dispatch(targetRegisterOrLogin("register"));
            setErrorStatus("");
          }}
        >
          ??????????????????????????????
        </ToggleRegisterLogin>
        <InputContainer>
          <Label htmlFor="email">Email ??????</Label>
          <Input
            key="emailLogin"
            type="text"
            placeholder="????????? Email"
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
            <WarningText>Email ???????????????</WarningText>
          ) : loginStatus.email === "wrongFormat" ? (
            <WarningText>Email ?????????????????????????????? Email</WarningText>
          ) : (
            ""
          )}
        </InputContainer>
        <InputContainer>
          <Label htmlFor="password">??????</Label>
          <Input
            key="passwordLogin"
            type="password"
            placeholder="???????????????"
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
            <WarningText>?????????????????????</WarningText>
          ) : loginStatus.password === "wrongLength" ? (
            <WarningText>?????????????????? 6 ?????????</WarningText>
          ) : (
            ""
          )}
        </InputContainer>
        <Label>???????????????fluffy@test.com</Label>
        <Label>???????????????Fluffy</Label>
        {errorStatus && <WarningErrorCode>{errorStatus}</WarningErrorCode>}
        {isLoading ? (
          <RegisterLoginBtn>
            <Loading
              $Top={"50%"}
              $Bottom={"auto"}
              $Right={"auto"}
              $Left={"50%"}
              $transform={"translate(-50%,-50%)"}
            />
          </RegisterLoginBtn>
        ) : (
          <RegisterLoginBtn onClick={() => logInProfile()}>
            ??????
          </RegisterLoginBtn>
        )}
      </RegisterLoginWrapper>
    </>
  ) : (
    <>
      <BlackMask $isActive={props.openLoginBox} />
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
            alt="close"
          />
        )}
        <RegisterLoginTitle>??????</RegisterLoginTitle>
        <InputContainer>
          <Label htmlFor="name">???????????????</Label>
          <Input
            key="nameRegister"
            type="text"
            placeholder="?????????????????????"
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
          {registerStatus.name === "empty" && (
            <WarningText>??????????????????????????????</WarningText>
          )}
        </InputContainer>
        <InputContainer>
          <Label htmlFor="email">Email ??????</Label>
          <Input
            key="emailRegister"
            type="text"
            placeholder="????????? email"
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
            <WarningText>Email ???????????????</WarningText>
          ) : registerStatus.email === "wrongFormat" ? (
            <WarningText>Email ?????????????????????????????? Email</WarningText>
          ) : (
            ""
          )}
        </InputContainer>
        <InputContainer>
          <Label htmlFor="password">??????</Label>
          <Input
            key="passwordRegister"
            type="password"
            placeholder="????????????????????????"
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
            <WarningText>?????????????????????</WarningText>
          ) : registerStatus.password === "wrongLength" ? (
            <WarningText>?????????????????? 6 ?????????</WarningText>
          ) : (
            ""
          )}
        </InputContainer>
        {errorStatus && <WarningErrorCode>{errorStatus}</WarningErrorCode>}
        {isLoading ? (
          <RegisterLoginBtn>
            <Loading
              $Top={"50%"}
              $Bottom={"auto"}
              $Right={"auto"}
              $Left={"50%"}
              $transform={"translate(-50%,-50%)"}
            />
          </RegisterLoginBtn>
        ) : (
          <RegisterLoginBtn onClick={() => createProfile()}>
            ??????
          </RegisterLoginBtn>
        )}
        <ToggleRegisterLogin
          onClick={() => {
            dispatch(setName(""));
            dispatch(setEmail(""));
            dispatch(setPassword(""));
            dispatch(targetRegisterOrLogin("login"));
            setErrorStatus("");
          }}
        >
          ??????????????????????????????
        </ToggleRegisterLogin>
      </RegisterLoginWrapper>
    </>
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
