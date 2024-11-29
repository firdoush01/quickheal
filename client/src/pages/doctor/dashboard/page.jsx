import React, { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";
import rtcmanager from "../../../core/RTCManager";
import doctorImage from "../../../assets/doctor dash.png";
import { motion } from "framer-motion";

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
      console.log(data);

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
        {/* Image Section without Hover Effect */}
        <motion.div
          className="w-full mb-6 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }} // Faster fade-in for image
        >
          <motion.img
            src={doctorImage}
            alt="Doctor Dashboard Illustration"
            className="mx-auto w-1/2 md:w-1/3 lg:w-1/4 h-auto rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }} // Apply hover effect directly to the image
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>

        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Doctor Dashboard</h1>
          <select
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-gray-50"
          >
            <option value="true" key={Options.AVAILABLE}>
              {Options.AVAILABLE}
            </option>
            <option value="false" key={Options.UNAVAILABLE}>
              {Options.UNAVAILABLE}
            </option>
          </select>
        </header>

        {/* Main Content */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-green-100 p-6 rounded-lg shadow-md"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }} // Faster slide-in
          >
            {incomingCall ? (
              incomingCall.map((callData, i) => (
                <div key={i}>
                  <h2 className="text-xl font-semibold text-green-700">
                    Incoming Patient Call!
                  </h2>
                  <button
                    onClick={() => {
                      answer(callData);
                    }}
                  >
                    Answer
                  </button>
                </div>
              ))
            ) : (
              <h2 className="text-xl font-semibold text-gray-600">
                No Incoming Calls
              </h2>
            )}
          </motion.div>

          <motion.div
            className="bg-yellow-100 p-6 rounded-lg shadow-md"
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }} // Faster slide-in
          >
            <h2 className="text-xl font-semibold text-yellow-700">Messages</h2>
            <p className="mt-2 text-gray-600">{message || "No new messages"}</p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }} // Faster fade-in for footer
          >
            Logged in as{" "}
            <span className="font-medium">{doctor?.name || "Doctor"}</span>
          </motion.p>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export default DoctorDashboard;
