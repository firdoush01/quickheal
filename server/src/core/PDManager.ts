import UID from "../libs/uid";
import Doctor from "./Doctor";
import Patient from "./Patient";
import Session from "./Session";

interface IMatch {
  doctorSocketId: string;
  patientSocketId: string;
}

class PDManager {
  private static instance: PDManager | null = null;
  private unAvailableDoctors: Doctor[] = [];
  private availableDoctors: Doctor[] = [];
  private waitingPatients: Patient[] = [];
  private session: Session[] = [];
  private idSocketMap: Record<string, string> = {};

  private constructor() {}

  public static getInstance(): PDManager {
    if (this.instance === null) {
      this.instance = new PDManager();
    }

    return this.instance;
  }

  addDoctor(doctor: Doctor): Doctor {
    if (doctor.getAvailability()) this.availableDoctors.push(doctor);
    else this.unAvailableDoctors.push(doctor);
    return doctor;
  }

  addPatient(patient: Patient): void {
    this.waitingPatients.push(patient);
  }

  getAvailableDoctors(): String[] {
    return this.availableDoctors.map((a) => a.getName());
  }
  getUnAvailableDoctors(): String[] {
    return this.unAvailableDoctors.map((a) => a.getName());
  }

  getWaitingPatients(): string[] {
    return this.waitingPatients.map((patient) => patient.getName());
  }

  setDoctorAvailablity(doctorId: string, available: boolean) {
    const doctor = this.unAvailableDoctors.find((d) => d.getId() === doctorId);

    if (doctor === undefined) return;

    if (available) {
      if (doctor) {
        doctor.setAvailable(true);
        this.addDoctor(doctor);
      }
    } else {
      this.availableDoctors = this.availableDoctors.filter(
        (d) => d.getId() !== doctor.getId()
      );

      this.unAvailableDoctors.push(doctor);
    }
  }

  removeDoctor(id: String) {
    this.availableDoctors = this.availableDoctors.filter(
      (d) => d.getId() !== id
    );
    this.unAvailableDoctors = this.unAvailableDoctors.filter(
      (d) => d.getId() !== id
    );
  }

  mapIdToSocket(doctorId: string, socketId: string) {
    this.idSocketMap[doctorId] = socketId;
  }

  getIdSocketMap(): Record<string, string> {
    return this.idSocketMap;
  }

  matchConsultation(): IMatch | null {
    if (this.waitingPatients.length === 0) return null;

    let doctor: Doctor | undefined;
    let patient: Patient | undefined;
    let newSession: Session | null;

    if (this.availableDoctors.length > 0) {
      doctor = this.availableDoctors.shift()!;
      patient = this.waitingPatients.shift()!;
      const dockerSocketId = this.idSocketMap[doctor.getId()];
      const patientSocketId = this.idSocketMap[patient.getId()];

      // newSession = new Session(
      //   UID.generate(10),
      //   doctor,
      //
      // );
      // this.session.push(newSession);
      // return newSession;

      return {
        doctorSocketId: dockerSocketId,
        patientSocketId: patientSocketId,
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
