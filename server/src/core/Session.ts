import Doctor from "./Doctor";
import Patient from "./Patient";

class Session {
  private sessionId: String;
  private doctor: Doctor;
  private patient: Patient;
  private finished: boolean;

  constructor(sessionId: String, doctor: Doctor, patient: Patient) {
    this.sessionId = sessionId;
    this.doctor = doctor;
    this.patient = patient;
    this.finished = false;
  }

  public getSessionId(): String {
    return this.sessionId;
  }

  public getDoctor(): Doctor {
    return this.doctor;
  }
  public getPatient(): Patient {
    return this.patient;
  }

  public finish() {
    this.finished = true;
  }

  public isFinished(): boolean {
    return this.finished;
  }
}

export default Session;
