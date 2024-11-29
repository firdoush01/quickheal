import {
  CiMicrophoneOff,
  CiMicrophoneOn,
  CiVideoOff,
  CiVideoOn,
} from "react-icons/ci";

import { FiVideo, FiVideoOff } from "react-icons/fi";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";

function ActionButtons({
  callStatus,
  localFeedEl,
  remoteFeedEl,
  updateCallStatus,
  localStream,
  peerConnection,
  setCallEnded,
}) {
  function videoHandler() {
    const copyCallStatus = { ...callStatus };
    if (copyCallStatus.videoEnabled) {
      copyCallStatus.videoEnabled = false;
      updateCallStatus(copyCallStatus);
      const tracks = localStream.getVideoTracks();
      tracks.forEach((track) => (track.enabled = false));
    } else if (copyCallStatus.videoEnabled === false) {
      copyCallStatus.videoEnabled = true;
      updateCallStatus(copyCallStatus);
      const tracks = localStream.getVideoTracks();
      tracks.forEach((track) => (track.enabled = true));
    } else if (copyCallStatus.videoEnabled === null) {
      copyCallStatus.videoEnabled = true;
      updateCallStatus(copyCallStatus);
    }
  }

  function audioHandler() {
    const copyCallStatus = { ...callStatus };
    //first, check if the audio is enabled, if so disabled
    if (callStatus.audioEnabled === true) {
      copyCallStatus.audioEnabled = false;
      updateCallStatus(copyCallStatus);

      const tracks = localStream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = false));
    } else if (callStatus.audioEnabled === false) {
      copyCallStatus.audioEnabled = true;
      updateCallStatus(copyCallStatus);
      const tracks = localStream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = true));
    } else {
      localStream.getAudioTracks().forEach((t) => {
        peerConnection.addTrack(t, localStream);
      });
    }
  }

  function callEndHandler() {
    console.log("Ending call");

    if (peerConnection) {
      const copyStatus = { ...callStatus };
      copyStatus.current = "completed";

      peerConnection.onicecandidate = null;
      peerConnection.ontrack = null;
      peerConnection.close();
      peerConnection = null;
      localFeedEl.current.srcObject = null;
      remoteFeedEl.current.srcObject = null;
      localFeedEl = null;
      remoteFeedEl = null;
      setCallEnded(true);
    }
  }

  const Button = ({ handler, className, children }) => {
    return (
      <button
        onClick={handler}
        className={`  text-xl font-bold border-2 rounded-full w-14 h-14 flex items-center justify-center ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex gap-5 mb-10">
      <Button
        handler={audioHandler}
        className={`${
          callStatus.audioEnabled === true
            ? "bg-slate-200 text-black  border-slate-800"
            : "bg-black text-white  border-slate-500"
        }`}
      >
        {callStatus.audioEnabled === true ? (
          <FaMicrophoneAlt />
        ) : (
          <FaMicrophoneAltSlash />
        )}
      </Button>
      <Button
        handler={videoHandler}
        className={`${
          callStatus.videoEnabled === true
            ? "bg-slate-200 text-black  border-slate-800"
            : "bg-black text-white  border-slate-500"
        }`}
      >
        {callStatus.videoEnabled === true ? <FiVideo /> : <FiVideoOff />}
      </Button>

      <Button handler={callEndHandler} className="bg-red-500 text-white">
        <MdCallEnd />
      </Button>
    </div>
  );
}

export default ActionButtons;
