import React, { useEffect, useRef, useState } from "react";
import rtcmanager from "../../core/RTCManager";
import { socket } from "../../utils/socket";

const ConnectionType = {
  DOCTOR: "doctor",
  PATIENT: "patient",
};

function PatientMeet({
  remoteStream,
  localStream,
  peerConnection,
  callStatus,
  updateCallStatus,
}) {
  const [message, setMessage] = useState("");

  const localRef = useRef();
  const remoteRef = useRef();

  const [requestCreated, setRequestCreated] = useState(false);

  useEffect(() => {
    socket.on("patient:message", (data) => {
      console.log(data);

      setMessage(data.message);
    });

    socket.on("answerResponse", async (offerObj) => {
      console.log(offerObj);
      const copyCallStatus = { ...callStatus };
      copyCallStatus.answer = offerObj.answer;
      copyCallStatus.myRole = ConnectionType.PATIENT;
      updateCallStatus(copyCallStatus);
      await rtcmanager.addAnswer(offerObj);
    });

    socket.on("receivedIceCandidateFromServer", async (iceCandidate) => {
      await rtcmanager.addNewIceCandidate(iceCandidate);
      console.log(iceCandidate);
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
    console.log("calling");

    async function makeRequest() {
      await rtcmanager.call();
      setRequestCreated(true);
      setMessage("Waiting for the Doctor...");
    }

    console.log();

    if (!requestCreated && callStatus.haveMedia) {
      makeRequest();
    }
  }, [callStatus.haveMedia, requestCreated]);

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

export default PatientMeet;
