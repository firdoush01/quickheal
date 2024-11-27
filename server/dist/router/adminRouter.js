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
const Admin_1 = __importDefault(require("../models/Admin"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const superAdminMiddleware_1 = require("../middleware/superAdminMiddleware");
const PDManager_1 = __importDefault(require("../core/PDManager"));
const router = express_1.default.Router();
const manager = PDManager_1.default.getInstance();
// Admin Registration Route
router.post("/register", superAdminMiddleware_1.superAdminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingAdmin = yield Admin_1.default.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ message: "Admin already exists." });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newAdmin = new Admin_1.default({
            name,
            email,
            password: hashedPassword,
        });
        yield newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully." });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}));
// Admin Login Route
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const admin = yield Admin_1.default.findOne({ email }).select("+password");
        if (!admin) {
            res.status(404).json({ message: "Admin not found." });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token, message: "Login successful." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
// Approve Doctor Route
router.post("/approve/doctor/:doctorId", superAdminMiddleware_1.verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.params;
    try {
        const doctor = yield Doctor_1.default.findById(doctorId);
        if (!doctor) {
            res.status(404).json({ message: "Doctor not found." });
            return;
        }
        doctor.approved = true;
        yield doctor.save();
        res.status(200).json({ message: "Doctor approved successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
router.post("/empty/doctors", superAdminMiddleware_1.verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        manager.emptyDoctors();
        res.status(200).json({ message: "Doctor's queue is Emptied!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
router.post("/empty/patients", superAdminMiddleware_1.verifyAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        manager.emptyPatient();
        res.status(200).json({ message: "Waiting Patient's queue is Emptied!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}));
exports.default = router;
