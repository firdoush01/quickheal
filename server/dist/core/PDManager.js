"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uid_1 = __importDefault(require("../libs/uid"));
const Session_1 = __importDefault(require("./Session"));
class PDManager {
    constructor() {
        this.doctors = [];
        this.availableDoctors = [];
        this.waitingPatients = [];
        this.session = [];
        this.idSocketMap = {};
    }
    static getInstance() {
        if (this.instance === null) {
            this.instance = new PDManager();
        }
        return this.instance;
    }
    addDoctor(doctor) {
        const foundDoctor = this.doctors.find((d) => d.getId() === doctor.getId());
        if (!foundDoctor) {
            this.doctors.push(doctor);
        }
    }
    addPatient(patient) {
        const foundPatient = this.waitingPatients.find((p) => p.getId() === patient.getId());
        if (!foundPatient) {
            this.waitingPatients.push(patient);
        }
    }
    getAvailableDoctors() {
        return this.availableDoctors;
    }
    getDoctors() {
        return this.doctors;
    }
    getUnAvailableDoctors() {
        return this.doctors.filter((d) => d.getAvailability() === false);
    }
    getWaitingPatients() {
        return this.waitingPatients.map((patient) => patient.getName());
    }
    addToAvailableDoctor(doctor) {
        if (!this.availableDoctors.includes(doctor)) {
            this.availableDoctors.push(doctor);
        }
    }
    removeFromAvailableDoctor(doctor) {
        this.availableDoctors = this.availableDoctors.filter((d) => d.getId() !== doctor.getId());
    }
    setDoctorAvailablity(doctorId, available) {
        const doctor = this.doctors.find((d) => d.getId() === doctorId);
        if (doctor === undefined) {
            console.log("Doctor not in the list.");
            return;
        }
        if (available) {
            doctor.setAvailable(true);
            this.addToAvailableDoctor(doctor);
        }
        else {
            doctor.setAvailable(false);
            this.removeFromAvailableDoctor(doctor);
        }
    }
    removeDoctor(id) {
        this.doctors = this.doctors.filter((d) => d.getId() !== id);
    }
    emptyDoctors() {
        this.doctors = [];
    }
    emptyPatient() {
        this.waitingPatients = [];
    }
    mapIdToSocket(doctorId, socketId) {
        this.idSocketMap[doctorId] = socketId;
    }
    getSocketIdFromMap(id) {
        return this.idSocketMap[id];
    }
    matchConsultation() {
        if (this.waitingPatients.length === 0)
            return null;
        let doctor;
        let patient;
        if (this.availableDoctors.length > 0) {
            doctor = this.availableDoctors[0];
            this.availableDoctors = this.availableDoctors.slice(1);
            patient = this.waitingPatients[0];
            this.waitingPatients = this.waitingPatients.slice(1);
            const doctorId = doctor.getId();
            const patientId = patient.getId();
            const dockerSocketId = this.idSocketMap[doctorId];
            const patientSocketId = this.idSocketMap[patientId];
            const newSession = new Session_1.default(uid_1.default.generate(10), doctor, patient);
            this.session.push(newSession);
            return {
                doctorId: doctorId,
                patientId: patientId,
                doctorSocketId: dockerSocketId,
                patientSocketId: patientSocketId,
            };
        }
        return null;
    }
    endSession(session) {
        let doctor = session.getDoctor();
        let sessionId = session.getSessionId();
        this.session = this.session.filter((s) => s.getSessionId() != sessionId);
        this.availableDoctors.push(doctor);
    }
}
PDManager.instance = null;
exports.default = PDManager;
