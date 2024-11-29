import React, { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";
import rtcmanager from "../../../core/RTCManager";

function PatientDashboard({
  callStatus,
  updateCallStatus,
  setLocalStream,
  setRemoteStream,
  remoteStream,
  peerConnection,
  setPeerConnection,
  localStream,
  userName,
  setUserName,
  offerData,
  setOfferData,
}) {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [patient, setPatient] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const data = window.localStorage.getItem("data");

    const dataObj = JSON.parse(data);
    setPatient(dataObj);

    socket.emit("connection-type", {
      id: dataObj.id,
      connectionType: dataObj.connectionType,
    });
  }, []);

  useEffect(() => {
    socket.on("patient:message", (data) => {
      setMessage(data.message);
    });
  }, [socket]);

  async function call() {
    socket.emit("patient:request", {
      patient: patient,
      description: description,
    });

    const localStream = await rtcmanager.fetchMedia();
    const copyCallStatus = { ...callStatus };
    copyCallStatus.haveMedia = true;
    copyCallStatus.videoEnabled = null;
    copyCallStatus.audioEnabled = false;
    updateCallStatus(copyCallStatus);
    setLocalStream(localStream);

    // navigate("/meet");
  }

  useEffect(() => {
    if (callStatus.haveMedia && !peerConnection) {
      const { peerConnection, remoteStream } = rtcmanager.createPeerConnection(
        patient.id,
        true
      );

      setPeerConnection(peerConnection);
      setRemoteStream(remoteStream);
    }
  }, [callStatus.haveMedia]);

  useEffect(() => {
    if (remoteStream && peerConnection) {
      navigate("/meet/patient");
    }
  }, [remoteStream, peerConnection]);

  return (
    <div>
      <textarea
        cols="30"
        rows="10"
        placeholder="Enter your concerns"
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <br />
      <button onClick={call}>Request a call</button>
    </div>
  );
}

export default PatientDashboard;
