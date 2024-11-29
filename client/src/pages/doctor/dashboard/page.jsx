import React, { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";
import rtcmanager from "../../../core/RTCManager";

const Options = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
};

function DoctorDashboard({
  callStatus,
  updateCallStatus,
  setLocalStream,
  setRemoteStream,
  remoteStream,
  peerConnection,
  setPeerConnection,
  offerData,
  setOfferData,
  connectionType,
  setConnectionType,
}) {
  const [available, setAvailable] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [message, setMessage] = useState("");
  const [incomingCall, setIncomingCall] = useState([]);
  const navigate = useNavigate();

  // Socket Calls
  useEffect(() => {
    socket.on("doctor:message", (data) => {
      setMessage(data.message);
    });

    socket.on("newOfferAwaiting", async (offers) => {
      console.log(offers);
      setIncomingCall(offers);
    });
  }, [socket]);

  // Initial Request
  useEffect(() => {
    const data = window.localStorage.getItem("data");

    const dataObj = JSON.parse(data);
    setDoctor(dataObj);
    setConnectionType(dataObj.connectionType);

    socket.emit("connection-type", {
      id: dataObj.id,
      connectionType: dataObj.connectionType,
    });
  }, []);

  // Sending Availability
  useEffect(() => {
    socket.emit("doctor:available", {
      id: doctor.id,
      available,
    });
    console.log(available);
  }, [available]);

  async function answer(callData) {
    setOfferData(callData);
    const localStream = await rtcmanager.fetchMedia();
    const copyCallStatus = { ...callStatus };
    copyCallStatus.haveMedia = true;
    copyCallStatus.videoEnabled = true;
    copyCallStatus.audioEnabled = true;
    updateCallStatus(copyCallStatus);
    setLocalStream(localStream);

    if (callStatus.haveMedia && !peerConnection) {
      const { peerConnection, remoteStream } = rtcmanager.createPeerConnection(
        doctor.id,
        false,
        offerData
      );

      setPeerConnection(peerConnection);
      setRemoteStream(remoteStream);
    }
  }

  useEffect(() => {
    if (remoteStream && peerConnection) {
      navigate("/meet/doctor");
    }
  }, [remoteStream, peerConnection]);

  return (
    <div>
      <select
        defaultValue={false}
        onChange={(e) => setAvailable(e.target.value)}
      >
        <option value={true} key={Options.AVAILABLE}>
          {Options.AVAILABLE}
        </option>
        <option value={false} key={Options.UNAVAILABLE}>
          {Options.UNAVAILABLE}
        </option>
      </select>

      {incomingCall.map((callData, i) => (
        <div key={i}>
          <h1>Incomming Patient</h1>
          <button
            onClick={() => {
              answer(callData);
            }}
          >
            Answer
          </button>
        </div>
      ))}

      <span>{message}</span>
    </div>
  );
}

export default DoctorDashboard;
