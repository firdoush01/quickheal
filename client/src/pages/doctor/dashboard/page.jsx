import React, { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";
import rtcmanager from "../../../core/RTCManager";

const Options = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
};

// const connection = {
//   connectionType: "patient",
//   token:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRpZW50SWQiOiI2NzQ1ZWJlZDYwYmViZjhlMDA3YjlkYmMiLCJwYXRpZW50TmFtZSI6IlN1aGFpbCIsImNvbm5lY3Rpb25UeXBlIjoicGF0aWVudCIsImlhdCI6MTczMjYzNzU4MywiZXhwIjoxNzMyNjU1NTgzfQ.aG6AHa2XwMLR8dWDsVSZZC4soxqQaJeYWA88J-x_gL4",
// };

function DoctorDashboard() {
  const [available, setAvailable] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [message, setMessage] = useState("");
  const [incomingCall, setIncomingCall] = useState(false);
  const navigate = useNavigate();
  // Socket Calls
  useEffect(() => {
    socket.on("doctor:message", (data) => {
      setMessage(data.message);
    });

    socket.on("newOfferAwaiting", async (offers) => {
      console.log(offers);

      // createOfferEls(offers);
      setIncomingCall(true);
      await rtcmanager.answerOffer(offers[0]);
      navigate("/meet");
    });
  }, [socket]);

  // Initial Request
  useEffect(() => {
    const data = window.localStorage.getItem("data");

    const dataObj = JSON.parse(data);
    setDoctor(dataObj);

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

      {incomingCall && <h1>Incomming Patient</h1>}

      <span>{message}</span>
    </div>
  );
}

export default DoctorDashboard;
