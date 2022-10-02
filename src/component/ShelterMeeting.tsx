import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Btn } from "../pages/ProfileSetting/UserInfos";
import { Profile } from "../reducers/profile";
import meetingBanner from "./img/meetingBanner.png";
import phoneCall from "./img/phone-call.png";

const MeetingContainer = styled.div`
  width: 70vw;
  height: 80vh;
  border: solid 1px #fff;
  position: absolute;
  z-index: 2501;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding: 50px;
  background-color: #efefef;
  overflow-x: hidden;
`;

const MeetingPerson = styled.video`
  height: 75%;
  width: 80%;
  /* border: solid 1px black; */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
`;

const MeetingMe = styled.video`
  height: 20vh;
  position: absolute;
  bottom: 70px;
  right: 30px;
  /* border: solid 1px black; */
  border-radius: 5px;
`;

const PhoneBtn = styled(Btn)`
  left: 50%;
  bottom: 15px;
  transform: translateX(-50%);
`;

const ImgBtn = styled.img`
  width: 15px;
  height: 15px;
`;

const TextInfoBtn = styled.div`
  position: absolute;
  font-size: 18px;
  color: #737373;
  letter-spacing: 1.5px;
  text-align: center;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  padding: 10px;
  transition: 0.3s;
  left: 50%;
  bottom: 15px;
  transform: translateX(-50%);
`;

const BlackMask = styled.div`
  opacity: 0.5;
  overflow-y: hidden;
  transition: 0.3s;
  position: fixed;
  background-color: black;
  width: 100vw;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1;
`;

const NowStatus = styled.div`
  position: absolute;
  left: -3px;
  top: 30px;
  padding: 10px 15px;
  font-size: 18px;
  background-color: #d8b2ad;
  border-radius: 3px;
`;

const ShelterMeeting = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>();
  const wsRef = useRef(new WebSocket("wss://fluffyserver.herokuapp.com"));
  const [status, setStatus] = useState("開始通話");
  const profile = useSelector<{ profile: Profile }>(
    (state) => state.profile
  ) as Profile;

  const initWs = () => {
    wsRef.current.onopen = () => console.log("ws 已經打開");
    wsRef.current.onmessage = wsOnMessage;
  };

  const wsOnMessage = (e: MessageEvent) => {
    const wsData = JSON.parse(e.data);
    console.log("wsData", wsData);

    const wsType = wsData["type"];
    console.log(wsType);

    if (wsType === "leave") {
      if (pc.current) {
        pc.current.close();
        pc.current = undefined;
        remoteVideoRef.current!.srcObject = null;
      }
    }

    const wsUsername = wsData["username"];
    console.log("username", profile.uid);
    if (profile.uid === wsUsername) {
      console.log("跳過處理本條訊息");
      return;
    }

    if (wsType === "offer") {
      console.log("進offer");
      const wsOffer = wsData["data"];
      pc.current?.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(wsOffer))
      );
      setStatus("電話響起");
    }
    if (wsType === "answer") {
      const wsAnswer = wsData["data"];
      pc.current?.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(wsAnswer))
      );
      setStatus("通話中");
    }
    if (wsType === "candidate") {
      const wsCandidate = JSON.parse(wsData["data"]);
      pc.current?.addIceCandidate(new RTCIceCandidate(wsCandidate));
      console.log("添加候選成功", wsCandidate);
    }
  };

  const wsSend = (type: string, data: any) => {
    wsRef.current.send(
      JSON.stringify({
        username: profile.uid,
        type,
        data,
      })
    );
  };

  // 詢問攝影機與音訊權限
  const getMediaDevices = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    console.log("stream", stream);
    localVideoRef.current!.srcObject = stream;
    localStreamRef.current = stream;
  };

  // 交換 sdp
  // 設置為當前連接的本地描述
  const createOffer = () => {
    pc.current
      ?.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true, // 接收視頻接收音頻
      })
      .then((sdp) => {
        console.log("offer", JSON.stringify(sdp));
        pc.current?.setLocalDescription(sdp);
        wsSend("offer", JSON.stringify(sdp));
        setStatus("等待對方接聽");
      });
  };

  const createAnswer = () => {
    pc.current
      ?.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true, // 接收視頻接收音頻
      })
      .then((sdp) => {
        console.log("answer", JSON.stringify(sdp));
        pc.current?.setLocalDescription(sdp);
        wsSend("answer", JSON.stringify(sdp));
        setStatus("通話中");
      });
  };

  const createRtcConnection = () => {
    const _pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.stunprotocol.org:3478"],
        },
      ],
    });
    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("candidate", JSON.stringify(e.candidate));
        wsSend("candidate", JSON.stringify(e.candidate));
      }
    };
    _pc.ontrack = (e) => {
      remoteVideoRef.current!.srcObject = e.streams[0];
    };
    pc.current = _pc;
    console.log("rtc連接創建成功", _pc);
  };

  const addLocalStreamToRtcConnection = () => {
    const localStream = localStreamRef.current!;
    localStream.getTracks().forEach((track) => {
      pc.current!.addTrack(track, localStream);
    });
    console.log("將本地視頻流添加到 RTC 連接成功");
  };

  const hangup = () => {
    if (pc.current) {
      wsSend("leave", "離線");
    }
  };

  useEffect(() => {
    initWs();
    getMediaDevices().then(() => {
      createRtcConnection();
      addLocalStreamToRtcConnection();
    });
  }, []);

  return (
    <>
      <BlackMask />
      <MeetingContainer>
        <MeetingPerson
          ref={remoteVideoRef}
          autoPlay
          poster={meetingBanner}
        ></MeetingPerson>
        <MeetingMe ref={localVideoRef} autoPlay></MeetingMe>
        {status === "開始通話" && (
          <PhoneBtn onClick={() => createOffer()}>
            <ImgBtn src={phoneCall} />
            {"  "}撥打電話給收容所
          </PhoneBtn>
        )}
        {status === "等待對方接聽" && (
          <TextInfoBtn>等待對方接聽 ...</TextInfoBtn>
        )}
        {status === "電話響起" && (
          <PhoneBtn onClick={createAnswer}>接聽電話</PhoneBtn>
        )}
        {status === "通話中" && <PhoneBtn onClick={hangup}>結束視訊</PhoneBtn>}
      </MeetingContainer>
    </>
  );
};

export default ShelterMeeting;
