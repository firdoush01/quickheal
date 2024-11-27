"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const connectDB_1 = __importDefault(require("./utils/connectDB"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const Patient_1 = __importDefault(require("./models/Patient"));
const Doctor_1 = __importDefault(require("./models/Doctor"));
const PDManager_1 = __importDefault(require("./core/PDManager"));
const Patient_2 = __importDefault(require("./core/Patient"));
const Doctor_2 = __importDefault(require("./core/Doctor"));
const role_1 = __importDefault(require("./types/role"));
const app = (0, express_1.default)();
// const key = fs.readFileSync("cert.key");
// const cert = fs.readFileSync("cert.crt");
// const server = createServer({ key, cert }, app);
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const manager = PDManager_1.default.getInstance();
const offers = [
// offererUserName
// offer
// offerIceCandidates
// answererUserName
// answer
// answererIceCandidates
];
// middlewares
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
}));
app.get("/", (req, res) => {
    res.json("hello");
});
// Routers
app.use("/api/v1/auth", authRouter_1.default);
// Socket Operations
io.on("connection", (socket) => {
    console.log("Client Connected: ", socket.id);
    socket.emit("pong");
    socket.on("connection-type", (data) => __awaiter(void 0, void 0, void 0, function* () {
        switch (data.connectionType) {
            case role_1.default.PATIENT: {
                const id = data.id;
                let patient = yield Patient_1.default.findById(id)
                    .select("id")
                    .select("name")
                    .select("email")
                    .select("age");
                if (patient) {
                    manager.mapIdToSocket(patient.id, socket.id);
                    manager.addPatient(new Patient_2.default(patient.id, patient.name, data.description));
                    console.log(manager.getWaitingPatients());
                    socket.emit("patient:message", {
                        message: "Add to the waiting list",
                    });
                }
            }
            case role_1.default.DOCTOR: {
                const id = data.id;
                let doctor = yield Doctor_1.default.findById(id)
                    .select("id")
                    .select("name")
                    .select("email")
                    .select("approved")
                    .select("specialization");
                if (doctor) {
                    console.log("Doctor Connected!");
                    manager.mapIdToSocket(doctor.id, socket.id);
                    manager.addDoctor(new Doctor_2.default(doctor.id, doctor.name));
                    socket.emit("doctor:message", {
                        message: "Add to the list",
                    });
                }
                else {
                    socket.emit("doctor:message", {
                        message: "Not approved to work",
                    });
                }
                console.log(manager.getDoctors());
            }
        }
    }));
    socket.on("doctor:available", (data) => {
        const doctorId = data.id;
        const available = data.available === "true";
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
        const offerToUpdate = offers.find((o) => o.offererId === offerObj.offererId);
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
                    const socketToSendTo = manager.getSocketIdFromMap(offerInOffers.answererId);
                    if (socketToSendTo) {
                        socket
                            .to(socketToSendTo)
                            .emit("receivedIceCandidateFromServer", iceCandidate);
                    }
                    else {
                        console.log("Ice candidate recieved but could not find answere");
                    }
                }
            }
        }
        else {
            //this ice is coming from the answerer. Send to the offerer
            //pass it through to the other socket
            const offerInOffers = offers.find((o) => o.answererId === iceUserId);
            if (offerInOffers) {
                const socketToSendTo = manager.getSocketIdFromMap(offerInOffers.offererId);
                if (socketToSendTo) {
                    socket
                        .to(socketToSendTo)
                        .emit("receivedIceCandidateFromServer", iceCandidate);
                }
                else {
                    console.log("Ice candidate recieved but could not find offerer");
                }
            }
        }
        // console.log(offers)
    });
});
function startServer() {
    // MongoConnection
    (0, connectDB_1.default)();
    // Server
    server.listen(process.env.PORT || 5000, () => {
        console.log("Server Connected!");
    });
}
startServer();
