import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";

import connectDB from "./utils/connectDB";
import authRouter from "./router/authRouter";

import PatientDB from "./models/Patient";
import DoctorDB from "./models/Doctor";

import PDManager from "./core/PDManager";
import Patient from "./core/Patient";
import Doctor from "./core/Doctor";
import { IDoctorToken, IPatientToken } from "./types/tokenDetails";
import Role from "./types/role";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const manager = PDManager.getInstance();

const offers = [
  // offererUserName
  // offer
  // offerIceCandidates
  // answererUserName
  // answer
  // answererIceCandidates
];

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

// Routers
app.use("/api/v1/auth", authRouter);

// Socket Operations
io.on("connection", (socket) => {
  console.log("Client Connected: ", socket.id);

  socket.emit("pong");

  socket.on("connection-type", async (data) => {
    switch (data.connectionType) {
      case Role.PATIENT: {
        const tokenDecoded = jwt.decode(data.token) as IPatientToken;
        console.log(tokenDecoded);

        let patient = await PatientDB.findById(tokenDecoded.patientId);

        if (patient) {
          manager.mapIdToSocket(patient.id, socket.id);
          manager.addPatient(new Patient(patient?.name, data.description));
          console.log(manager.getWaitingPatients());
        }
      }

      case Role.DOCTOR: {
        const tokenDecoded = jwt.decode(data.token) as IDoctorToken;

        let doctor = await DoctorDB.findById(tokenDecoded.doctorId);

        if (doctor) {
          manager.mapIdToSocket(doctor.id, socket.id);
          manager.addDoctor(new Doctor(doctor.id, doctor.name));
          console.log(manager.getIdSocketMap());
        }
      }
    }
  });

  socket.on("doctor:available", (data) => {
    const doctorId = data.doctorId;
    const available = data.available;

    manager.setDoctorAvailablity(doctorId, available);
  });

  socket.on("newOffer", (newOffer) => {
    const match = manager.matchConsultation();
    if (match) {
      offers.push({
        offererId: match?.patientSocketId,
        offer: newOffer,
        offerIceCandidates: [],
        answererUserName: null,
        answer: null,
        answererIceCandidates: [],
      });
      socket.to(match.doctorSocketId).emit("newOfferAwaiting", newOffer);
    }
  });
});

function startServer() {
  // MongoConnection
  connectDB();

  // Server
  server.listen(process.env.PORT || 5000, () => {
    console.log("Server Connected!");
  });
}

startServer();
