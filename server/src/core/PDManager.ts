import UID from "../libs/uid";
import Doctor from "./Doctor";
import Patient from "./Patient";
import Session from "./Session";

interface IMatch {
  doctorId: string;
  patientId: string;
  doctorSocketId: string;
  patientSocketId: string;
  description: string;
}

interface IWaitingPatient {
  patient: Patient;
  description: string;
}

class PDManager {
  private static instance: PDManager | null = null;
  private doctors: Doctor[] = [];
  private patients: Patient[] = [];
  private availableDoctors: Doctor[] = [];
  private waitingPatients: IWaitingPatient[] = [];
  private session: Session[] = [];
  private idSocketMap: Record<string, string> = {};

  private constructor() {}

  public static getInstance(): PDManager {
    if (this.instance === null) {
      this.instance = new PDManager();
    }

    return this.instance;
  }

  addDoctor(doctor: Doctor): void {
    const foundDoctor = this.doctors.find((d) => d.getId() === doctor.getId());
    if (!foundDoctor) {
      this.doctors.push(doctor);
    }
  }

  addPatient(patient: Patient): void {
    const foundPatient = this.patients.find(
      (p) => p.getId() === patient.getId()
    );
    if (!foundPatient) {
      this.patients.push(patient);
    }
  }

  getPatientById(id: string): Patient | null {
    const patient = this.patients.find((p) => p.getId() === id);
    if (!patient) return null;
    return patient;
  }

  getAvailableDoctors(): string[] {
    return this.availableDoctors.map((d) => d.getName());
  }

  getDoctors(): Doctor[] {
    return this.doctors;
  }

  getUnAvailableDoctors(): Doctor[] {
    return this.doctors.filter((d) => d.getAvailability() === false);
  }

  getWaitingPatients(): string[] {
    return this.waitingPatients.map((w) => w.patient.getName());
  }

  addToWaitingList(patient: Patient, description: string) {
    if (this.waitingPatients.find((w) => w.patient.getId() === patient.getId()))
      return;

    this.waitingPatients.push({
      patient,
      description,
    });
  }

  firstWaitingPatient() {
    if (this.waitingPatients.length === 0) return;

    const patient = this.waitingPatients.shift()!;
    return patient;
  }

  addToAvailableDoctor(doctor: Doctor): void {
    if (!this.availableDoctors.includes(doctor)) {
      this.availableDoctors.push(doctor);
    }
  }

  firstDoctorInList() {
    if (this.availableDoctors.length === 0) return;

    const doctor = this.availableDoctors.shift()!;
    return doctor;
  }

  removeFromAvailableDoctor(doctor: Doctor): void {
    this.availableDoctors = this.availableDoctors.filter(
      (d) => d.getId() !== doctor.getId()
    );
  }

  setDoctorAvailablity(doctorId: string, available: boolean): void {
    const doctor = this.doctors.find((d) => d.getId() === doctorId);

    if (doctor === undefined) {
      console.log("Doctor not in the list.");

      return;
    }

    if (available) {
      doctor.setAvailable(true);
      this.addToAvailableDoctor(doctor);
    } else {
      doctor.setAvailable(false);
      this.removeFromAvailableDoctor(doctor);
    }
  }

  removeDoctor(id: String) {
    this.doctors = this.doctors.filter((d) => d.getId() !== id);
  }

  emptyDoctors() {
    this.doctors = [];
  }
  emptyPatient() {
    this.waitingPatients = [];
  }

  mapIdToSocket(doctorId: string, socketId: string) {
    this.idSocketMap[doctorId] = socketId;
  }

  getSocketIdFromMap(id: string) {
    return this.idSocketMap[id];
  }

  matchConsultation(): IMatch | null {
    let doctor = this.firstDoctorInList();
    let waitingPatient = this.firstWaitingPatient();

    if (waitingPatient && doctor) {
      const doctorId = doctor.getId();
      const patientId = waitingPatient.patient.getId();

      const dockerSocketId = this.idSocketMap[doctorId];
      const patientSocketId = this.idSocketMap[patientId];

      const newSession = new Session(
        UID.generate(10),
        doctor,
        waitingPatient.patient
      );
      this.session.push(newSession);

      return {
        doctorId: doctorId,
        patientId: patientId,
        doctorSocketId: dockerSocketId,
        patientSocketId: patientSocketId,
        description: waitingPatient.description,
      };
    }

    return null;
  }

  endSession(session: Session) {
    let doctor = session.getDoctor();
    let sessionId = session.getSessionId();

    this.session = this.session.filter((s) => s.getSessionId() != sessionId);

    this.availableDoctors.push(doctor);
  }
}

export default PDManager;
