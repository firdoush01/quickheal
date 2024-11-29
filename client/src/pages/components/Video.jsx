import React from "react";

function Video({ ref }) {
  return <video ref={ref} autoPlay playsInline></video>;
}

export default Video;
