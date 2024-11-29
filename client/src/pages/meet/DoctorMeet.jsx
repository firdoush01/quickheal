import React, { useEffect, useRef, useState } from "react";
import rtcmanager from "../../core/RTCManager";
import { socket } from "../../utils/socket";
import ActionButtons from "../components/ActionButtons";
import { Link, useNavigate } from "react-router-dom";

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
  connectionType,
}) {
  const [message, setMessage] = useState("");

  const localRef = useRef();
  const remoteRef = useRef();
  const [answerCreated, setAnswerCreated] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (callEnded) {
      console.log("inside the if");
      navigate("/dashboard/doctor");
    }
  }, [callEnded]);

  console.log(callEnded);

  return (
    <div>
      <div id="waiting" class="btn btn-warning">
        {message}
      </div>
      <video ref={localRef} autoPlay playsInline></video>
      <video ref={remoteRef} autoPlay playsInline></video>
      <ActionButtons
        localFeedEl={localRef}
        remoteFeedEl={remoteRef}
        callStatus={callStatus}
        localStream={localStream}
        updateCallStatus={updateCallStatus}
        peerConnection={peerConnection}
        connectionType={connectionType}
        setCallEnded={setCallEnded}
      />
      {callEnded && (
        <div>
          <span>
            <Link to="/dashboard/doctor">Return to Dashboard</Link>
          </span>
        </div>
      )}
    </div>
  );
}

export default DoctorMeet;
