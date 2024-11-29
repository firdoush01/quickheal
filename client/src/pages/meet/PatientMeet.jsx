import React, { useEffect, useRef, useState } from "react";
import rtcmanager from "../../core/RTCManager";
import { socket } from "../../utils/socket";
import ActionButtons from "../components/ActionButtons";
import { Link, useNavigate } from "react-router-dom";

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
  connectionType,
}) {
  const [message, setMessage] = useState("Waiting for connection...");

  const localRef = useRef();
  const remoteRef = useRef();

  const [callEnded, setCallEnded] = useState(false);
  const [returnDashBoard, setReturnDashBoard] = useState(false);

  const navigate = useNavigate();

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

    if (!requestCreated && callStatus.haveMedia) {
      makeRequest();
      setMessage("");
    }
  }, [callStatus.haveMedia, requestCreated]);

  useEffect(() => {
    if (callEnded) {
      setReturnDashBoard(true);
      if (peerConnection) {
        const copyStatus = { ...callStatus };
        copyStatus.current = "completed";

        peerConnection.close();
        peerConnection.onicecandidate = null;
        peerConnection.ontrack = null;
        peerConnection = null;
        updateCallStatus(copyStatus);
        localRef.current.srcObject = null;
        remoteRef.current.srcObject = null;
      }
    }
  }, [callEnded]);

  if (returnDashBoard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-4">
        <a href="/dashboard/patient">
          <span className=" py-2 text-white bg-blue-700 p-5 rounded-lg hover:bg-blue-600 focus:outline-none transition-all duration-300 transform hover:scale-105 cursor-pointer">
            Go to Dashboard
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 px-4">
      <div className="w-full max-w-4xl p-4">
        {/* Waiting message */}
        {message && (
          <div
            id="waiting"
            className="btn btn-warning text-white text-center text-lg font-semibold p-3 mb-4 bg-yellow-500 rounded-lg shadow-md"
          >
            {message}
          </div>
        )}

        {/* Video layout */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="w-full max-w-5xl p-4">
            {/* Video layout */}
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative w-full">
                <video
                  ref={remoteRef}
                  autoPlay
                  playsInline
                  className="w-full h-full rounded-lg border-2 border-gray-600 shadow-lg"
                ></video>
                <div className="absolute bottom-2 left-2 text-white text-xs">
                  Doctor's Stream
                </div>
              </div>

              <div className="relative w-1/4 h-1/4">
                <video
                  ref={localRef}
                  autoPlay
                  playsInline
                  className="w-full h-full rounded-lg border-2 border-gray-600 shadow-lg"
                ></video>
                <div className="absolute bottom-2 left-2 text-white text-xs">
                  You
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default PatientMeet;
