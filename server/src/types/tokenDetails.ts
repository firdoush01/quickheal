import { JwtPayload } from "jsonwebtoken";

interface IDoctorToken {
  doctorId: string;
  doctorName: string;
  doctorApproved: boolean;
  connectionType: string;
  iat: number;
  exp: number;
}

interface IPatientToken {
  patientId: string;
  patientName: string;
  patientAge: string;
  connectionType: string;
  iat: number;
  exp: number;
}

export { IDoctorToken, IPatientToken };
