"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uid_1 = __importDefault(require("../libs/uid"));
const Session_1 = __importDefault(require("./Session"));
class PDManager {
    constructor() {
        this.unAvailableDoctors = [];
        this.availableDoctors = [];
        this.waitingPatients = [];
        this.session = [];
    }
    static getInstance() {
        if (this.instance === null) {
            this.instance = new PDManager();
        }
        return this.instance;
    }
    addDoctor(doctor) {
        if (doctor.getAvailability())
            this.availableDoctors.push(doctor);
        else
            this.unAvailableDoctors.push(doctor);
        return doctor;
    }
    addPatient(patient) {
        this.waitingPatients.push(patient);
    }
    getAvailableDoctors() {
        return this.availableDoctors.map((a) => a.getName());
    }
    getWaitingPatients() {
        return this.waitingPatients.map((patient) => patient.getName());
    }
    makeDoctorUnavailable(doctor) {
        this.availableDoctors = this.availableDoctors.filter((d) => d.getId() !== doctor.getId());
        this.unAvailableDoctors.push(doctor);
    }
    removeDoctor(id) {
        this.availableDoctors = this.availableDoctors.filter((d) => d.getId() !== id);
        this.unAvailableDoctors = this.unAvailableDoctors.filter((d) => d.getId() !== id);
    }
    assignConsultation() {
        if (this.waitingPatients.length === 0)
            return null;
        let session = null;
        let doctor;
        let newSession;
        if (this.availableDoctors.length > 0) {
            doctor = this.availableDoctors.shift();
            newSession = new Session_1.default(uid_1.default.generate(10), doctor, this.waitingPatients.shift());
            this.session.push(newSession);
            return newSession;
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
