import { useEffect, useRef } from "react";
import "./App.css";
import { socket } from "./utils/socket";
import RTCManager from "./core/RTCManager";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/doctor/Home";
import DoctorAuth from "./pages/doctor/auth/page";
import DoctorDashboard from "./pages/doctor/dashboard/page";

const connection = {
  connectionType: "patient",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRpZW50SWQiOiI2NzQ1ZWJlZDYwYmViZjhlMDA3YjlkYmMiLCJwYXRpZW50TmFtZSI6IlN1aGFpbCIsImNvbm5lY3Rpb25UeXBlIjoicGF0aWVudCIsImlhdCI6MTczMjYzNzU4MywiZXhwIjoxNzMyNjU1NTgzfQ.aG6AHa2XwMLR8dWDsVSZZC4soxqQaJeYWA88J-x_gL4",
};

const rtcmanager = new RTCManager();

function App() {
  const videoRef = useRef();
  useEffect(() => {
    // socket.on("pong", () => {
    //   socket.emit("connection-type", connection);
    // });
    // (async () => {
    //   const stream = await rtcmanager.fetchMedia();
    //   videoRef.current.srcObject = stream;
    // })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/doctor" element={<DoctorAuth />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
