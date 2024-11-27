import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

import connectDB from "./utils/connectDB";
import authRouter from "./router/authRouter";

import PatientDB from "./models/Patient";
import DoctorDB from "./models/Doctor";

import PDManager from "./core/PDManager";
import Patient from "./core/Patient";
import Doctor from "./core/Doctor";
import Role from "./types/role";

const app = express();

// const key = fs.readFileSync("cert.key");
// const cert = fs.readFileSync("cert.crt");

// const server = createServer({ key, cert }, app);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const manager = PDManager.getInstance();

const offers: {
  offererId: string;
  offer: any;
  offerIceCandidates: any[];
  answererId: any;
  answer: any;
  answererIceCandidates: any[];
}[] = [
  // offererUserName
  // offer
  // offerIceCandidates
  // answererUserName
  // answer
  // answererIceCandidates
];

// middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.json("hello");
});

// Routers
app.use("/api/v1/auth", authRouter);

// Socket Operations
io.on("connection", (socket) => {
  console.log("Client Connected: ", socket.id);

  socket.emit("pong");

  socket.on("connection-type", async (data) => {
    switch (data.connectionType) {
      case Role.PATIENT: {
        const id = data.id;

        let patient = await PatientDB.findById(id)
          .select("id")
          .select("name")
          .select("email")
          .select("age");

        if (patient) {
          manager.mapIdToSocket(patient.id, socket.id);
          manager.addPatient(
            new Patient(patient.id, patient.name, data.description)
          );
          console.log(manager.getWaitingPatients());

          socket.emit("patient:message", {
            message: "Add to the waiting list",
          });
        }
      }

      case Role.DOCTOR: {
        const id = data.id;

        let doctor = await DoctorDB.findById(id)
          .select("id")
          .select("name")
          .select("email")
          .select("approved")
          .select("specialization");

        if (doctor) {
          console.log("Doctor Connected!");
          manager.mapIdToSocket(doctor.id, socket.id);
          manager.addDoctor(new Doctor(doctor.id, doctor.name));
          socket.emit("doctor:message", {
            message: "Add to the list",
          });
        } else {
          socket.emit("doctor:message", {
            message: "Not approved to work",
          });
        }

        console.log(manager.getDoctors());
      }
    }
  });

  socket.on("doctor:available", (data) => {
    const doctorId = data.id;
    const available: boolean = data.available === "true";

    manager.setDoctorAvailablity(doctorId, available);
    console.log(manager.getAvailableDoctors());
  });

  socket.on("newOffer", (newOffer) => {
    console.log("Offer Received!");
    const match = manager.matchConsultation();
    console.log(match);

    if (match) {
      offers.push({
        offererId: match.patientId,
        offer: newOffer,
        offerIceCandidates: [],
        answererId: match.doctorId,
        answer: null,
        answererIceCandidates: [],
      });

      socket
        .to(match.doctorSocketId)
        .emit("newOfferAwaiting", offers.slice(-1));
    }
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    console.log(offerObj);

    const answererSocketId = manager.getSocketIdFromMap(offerObj.offererId);

    const offerToUpdate = offers.find(
      (o) => o.offererId === offerObj.offererId
    );

    if (!offerToUpdate) {
      console.log("No OfferToUpdate");
      return;
    }

    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;

    socket.to(answererSocketId).emit("answerResponse", offerToUpdate);
  });

  socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj) => {
    const { didIOffer, iceUserId, iceCandidate } = iceCandidateObj;
    // console.log(iceCandidate);
    if (didIOffer) {
      //this ice is coming from the offerer. Send to the answerer
      const offerInOffers = offers.find((o) => o.offererId === iceUserId);
      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        // 1. When the answerer answers, all existing ice candidates are sent
        // 2. Any candidates that come in after the offer has been answered, will be passed through
        if (offerInOffers.answererId) {
          //pass it through to the other socket
          const socketToSendTo = manager.getSocketIdFromMap(
            offerInOffers.answererId
          );
          if (socketToSendTo) {
            socket
              .to(socketToSendTo)
              .emit("receivedIceCandidateFromServer", iceCandidate);
          } else {
            console.log("Ice candidate recieved but could not find answere");
          }
        }
      }
    } else {
      //this ice is coming from the answerer. Send to the offerer
      //pass it through to the other socket
      const offerInOffers = offers.find((o) => o.answererId === iceUserId);

      if (offerInOffers) {
        const socketToSendTo = manager.getSocketIdFromMap(
          offerInOffers.offererId
        );
        if (socketToSendTo) {
          socket
            .to(socketToSendTo)
            .emit("receivedIceCandidateFromServer", iceCandidate);
        } else {
          console.log("Ice candidate recieved but could not find offerer");
        }
      }
    }
    // console.log(offers)
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
