import React, { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
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

  function call() {
    socket.emit("patient:request", {
      patient: patient,
      description: description,
    });
    navigate("/meet");
  }

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
