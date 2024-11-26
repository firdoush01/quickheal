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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const Patient_1 = __importDefault(require("../models/Patient"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
// Doctor Registration
router.post("/doctor/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, specialization } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const doctor = new Doctor_1.default({
            name,
            email,
            password: hashedPassword,
            specialization,
        });
        const savedDoctor = yield doctor.save();
        res.status(201).json({
            message: "Doctor registered successfully",
            doctor: savedDoctor,
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: "Error registering doctor", details: err.message });
    }
}));
// Patient Registration
router.post("/patient/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, age } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const patient = new Patient_1.default({
            name,
            email,
            password: hashedPassword,
            age,
        });
        const savedPatient = yield patient.save();
        res.status(201).json({
            message: "Patient registered successfully",
            patient: savedPatient,
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: "Error registering patient", details: err.message });
    }
}));
// Doctor Login
router.post("/doctor/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const doctor = yield Doctor_1.default.findOne({ email });
        if (!doctor) {
            res.status(404).json({ error: "Doctor not found" });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, doctor.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }
        console.log(JWT_SECRET);
        const token = jsonwebtoken_1.default.sign({
            doctorId: doctor._id,
            doctorName: doctor.name,
            doctorApproved: doctor.approved,
            connectionType: "doctor",
        }, JWT_SECRET, { expiresIn: "3h" });
        res.json({ message: "Login successful", token });
        return;
    }
    catch (err) {
        res.status(500).json({ error: "Error logging in", details: err.message });
    }
}));
// Patient Login
router.post("/patient/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const patient = yield Patient_1.default.findOne({ email });
        if (!patient) {
            res.status(404).json({ error: "Patient not found" });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, patient.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            patientId: patient._id,
            patientName: patient.name,
            connectionType: "patient",
        }, JWT_SECRET, {
            expiresIn: "5h",
        });
        res.json({ message: "Login successful", token });
    }
    catch (err) {
        res.status(500).json({ error: "Error logging in", details: err.message });
    }
}));
exports.default = router;
