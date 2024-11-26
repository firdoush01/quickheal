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
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connectDB_1 = __importDefault(require("./utils/connectDB"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const PDManager_1 = __importDefault(require("./core/PDManager"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const manager = PDManager_1.default.getInstance();
(0, connectDB_1.default)();
// Routers
app.use("/api/v1/auth", authRouter_1.default);
// Socket Operations
io.on("connection", (socket) => {
    console.log("Client Connected: ", socket.id);
    socket.emit("pong");
    socket.on("connection-type", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const tokenDecoded = jsonwebtoken_1.default.decode(data.token);
        console.log(tokenDecoded);
        const tokenDetails = JSON.parse(tokenDecoded);
        console.log(tokenDetails);
        // if (tokenDetails) {
        //   if (tokenDetails.connectionType === "patient")
        //   const id = data.token;
        //   const patient = await PatientDB.findById(id);
        //   if (patient)
        //     manager.addPatient(new Patient(patient?.name, data.description));
        // }
    }));
});
server.listen(5000, () => {
    console.log("Server Connected!");
});
