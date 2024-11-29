/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import rtcmanager from "../core/RTCManager";
import { socket } from "../utils/socket";

const ConnectionType = {
  DOCTOR: "doctor",
  PATIENT: "patient",
};

function Meet() {
  const [message, setMessage] = useState("");
  const localRef = useRef();
  const remoteRef = useRef();

  useEffect(() => {
    socket.on("patient:message", (data) => {
      console.log(data);
      setMessage(data.message);
    });

    socket.on("doctor:message", (data) => {
      console.log(data);
      setMessage(data.message);
    });

    socket.on("answerResponse", async (offerObj) => {
      console.log(offerObj);
      await rtcmanager.addAnswer(offerObj);
    });

    socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
      rtcmanager.addNewIceCandidate(iceCandidate);
      console.log(iceCandidate);
    });
  }, [socket]);

  useEffect(() => {
    const storedData = window.localStorage.getItem("data");

    if (storedData) {
      const { id, connectionType } = JSON.parse(storedData);

      (async () => {
        if (connectionType === ConnectionType.PATIENT) {
          const dataObj = JSON.parse(storedData);
          const { localStream, remoteStream } = await rtcmanager.call(dataObj);
          localRef.current.srcObject = localStream;
          remoteRef.current.srcObject = remoteStream;
        }
      })();

      localRef.current.srcObject = rtcmanager.getStream().localStream;
      remoteRef.current.srcObject = rtcmanager.getStream().remoteStream;
    } else {
      console.error("No data found in localStorage");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 px-4">
      <div className="w-full max-w-4xl p-4">
        {/* Waiting message */}
        <div
          id="waiting"
          className="btn btn-warning text-white text-center text-lg font-semibold p-3 mb-4 bg-yellow-500 rounded-lg shadow-md"
        >
          {message || "Waiting for connection..."}
        </div>

        {/* Video layout */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <video
              ref={localRef}
              autoPlay
              playsInline
              controls
              className="w-full h-full rounded-lg border-2 border-gray-600 shadow-lg"
            ></video>
            <div className="absolute bottom-2 left-2 text-white text-xs">
              Local Stream
            </div>
          </div>

          <div className="relative w-full md:w-1/2">
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              controls
              className="w-full h-full rounded-lg border-2 border-gray-600 shadow-lg"
            ></video>
            <div className="absolute bottom-2 left-2 text-white text-xs">
              Remote Stream
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {message === "No data found in localStorage" && (
        <div className="text-center text-red-500 font-semibold">
          <p>
            Error: Data not found in localStorage. Please reload and try again.
          </p>
        </div>
      )}
    </div>
  );
}

export default Meet;
