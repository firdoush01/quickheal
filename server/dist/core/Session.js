"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Session {
    constructor(sessionId, doctor, patient) {
        this.sessionId = sessionId;
        this.doctor = doctor;
        this.patient = patient;
        this.finished = false;
    }
    getSessionId() {
        return this.sessionId;
    }
    getDoctor() {
        return this.doctor;
    }
    getPatient() {
        return this.patient;
    }
    finish() {
        this.finished = true;
    }
    isFinished() {
        return this.finished;
    }
}
exports.default = Session;
