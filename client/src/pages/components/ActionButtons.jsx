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

  return (
    <div>
      <button onClick={videoHandler}>Video</button>

      <button onClick={audioHandler}>Audio</button>
      <button onClick={callEndHandler}>End</button>
    </div>
  );
}

export default ActionButtons;
