import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DoctorAuth from "./pages/doctor/auth/page";
import DoctorDashboard from "./pages/doctor/dashboard/page";
import PatientAuth from "./pages/patient/auth/page";
import PatientDashboard from "./pages/patient/dashboard/page";
import Meet from "./pages/Meet";
import AdminPage from "./pages/admin/page";
import AdminAuth from "./pages/admin/auth/page";
import { useState } from "react";
import PatientMeet from "./pages/meet/PatientMeet";
import DoctorMeet from "./pages/meet/DoctorMeet";

function App() {
  const [callStatus, updateCallStatus] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [connectionType, setConnectionType] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/auth" element={<AdminAuth />} />

        <Route path="/auth/doctor" element={<DoctorAuth />} />
        <Route path="/auth/patient" element={<PatientAuth />} />

        <Route
          path="/dashboard/doctor"
          element={
            <DoctorDashboard
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              setPeerConnection={setPeerConnection}
              offerData={offerData}
              setOfferData={setOfferData}
              connectionType={connectionType}
              setConnectionType={setConnectionType}
            />
          }
        />
        <Route
          path="/dashboard/patient"
          element={
            <PatientDashboard
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              setPeerConnection={setPeerConnection}
              offerData={offerData}
              setOfferData={setOfferData}
              connectionType={connectionType}
              setConnectionType={setConnectionType}
            />
          }
        />

        <Route path="/meet" element={<Meet />} />
        <Route
          path="/meet/patient"
          element={
            <PatientMeet
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              setPeerConnection={setPeerConnection}
              connectionType={connectionType}
            />
          }
        />
        <Route
          path="/meet/doctor"
          element={
            <DoctorMeet
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              setPeerConnection={setPeerConnection}
              offerData={offerData}
              connectionType={connectionType}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
