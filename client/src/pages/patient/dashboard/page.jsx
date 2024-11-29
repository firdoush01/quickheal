import React, { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";
import rtcmanager from "../../../core/RTCManager";

import patientImage from "../../../assets/patient dash.png";

import { motion } from "framer-motion";
import { VideoCameraIcon } from "@heroicons/react/solid"; // Importing Heroicons for the video call icon

function PatientDashboard({
  callStatus,
  updateCallStatus,
  setLocalStream,
  setRemoteStream,
  remoteStream,
  peerConnection,
  setPeerConnection,
  connectionType,
  setConnectionType,
}) {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [patient, setPatient] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const data = window.localStorage.getItem("data");

    const dataObj = JSON.parse(data);
    setPatient(dataObj);
    setConnectionType(dataObj.connectionType);

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
    copyCallStatus.videoEnabled = true;
    copyCallStatus.audioEnabled = true;
    updateCallStatus(copyCallStatus);
    setLocalStream(localStream);
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
    <motion.div
      className="min-h-screen bg-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }} // Faster fade-in
    >
      <motion.div
        className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 relative"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }} // Faster slide-in
      >
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-green-600">
            Patient Dashboard
          </h1>
        </header>

        {/* Image Section */}
        <motion.div
          className="w-full mb-6 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }} // Faster fade-in for image
        >
          <motion.img
            src={patientImage}
            alt="Patient Dashboard Illustration"
            className="w-full max-w-lg rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }} // Hover effect to scale the image
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>

        {/* Main Content */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient's Concerns Input */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }} // Faster slide-in from left
          >
            {/* <h2 className="text-xl font-semibold text-green-700">
              Describe your concerns
            </h2>
            <textarea
              cols="30"
              rows="10"
              placeholder="Enter your concerns"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 mt-2 border rounded-lg"
            ></textarea> */}
          </motion.div>

          {/* Request a Call Card */}
          <motion.div
            className="bg-green-100 p-6 rounded-lg shadow-md"
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }} // Faster slide-in from right
          >
            <h2 className="text-xl font-semibold text-green-700">
              Request a Call
            </h2>
            <motion.button
              onClick={call}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }} // Hover effect to scale button
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Video Call Icon */}
              <VideoCameraIcon className="h-5 w-5 text-white" />
              Request a Video Call
            </motion.button>
          </motion.div>
        </section>

        {/* Message Display */}
        <motion.section
          className="mt-6 bg-yellow-100 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }} // Faster fade-in for messages
        >
          <h2 className="text-xl font-semibold text-yellow-700">Messages</h2>
          <p className="mt-2 text-gray-600">{message || "No new messages"}</p>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }} // Faster fade-in for footer
        >
          <p className="text-gray-500 text-sm">
            Logged in as{" "}
            <span className="font-medium">{patient?.name || "Patient"}</span>
          </p>
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}

export default PatientDashboard;
