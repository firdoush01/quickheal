import React, { useEffect, useRef, useState } from "react";
import rtcmanager from "../../core/RTCManager";
import { socket } from "../../utils/socket";

const ConnectionType = {
  DOCTOR: "doctor",
  PATIENT: "patient",
};

function DoctorMeet({
  remoteStream,
  localStream,
  peerConnection,
  callStatus,
  updateCallStatus,
  offerData,
}) {
  const [message, setMessage] = useState("");

  const localRef = useRef();
  const remoteRef = useRef();
  const [answerCreated, setAnswerCreated] = useState(false);

  useEffect(() => {
    socket.on("doctor:message", (data) => {
      console.log(data);
      setMessage(data.message);
    });
  }, [socket]);

  useEffect(() => {
    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;
  }, []);

  useEffect(() => {
    if (peerConnection) {
      peerConnection.ontrack = (e) => {
        if (e?.streams?.length) {
          setMessage("");
        } else {
          setMessage("Disconnected...");
        }
      };
    }
  }, [peerConnection]);

  useEffect(() => {
    const addOfferAndCreateAnswer = async () => {
      await rtcmanager.answerOffer(offerData);
      setAnswerCreated(true);
    };

    if (!answerCreated && callStatus.haveMedia) {
      addOfferAndCreateAnswer();
    }
  }, [callStatus.haveMedia, answerCreated]);

  return (
    <div>
      <div id="waiting" class="btn btn-warning">
        {message}
      </div>
      <video ref={localRef} autoplay playsinline controls></video>
      <video ref={remoteRef} autoplay playsinline controls></video>
    </div>
  );
}

export default DoctorMeet;
