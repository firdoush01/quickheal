import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor";
import Patient from "../models/Patient";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

interface IDoctorRegister {
  name: string;
  email: string;
  password: string;
  specialization: string;
}
interface IPatientRegister {
  name: string;
  email: string;
  password: string;
  age: string;
}
interface ILogin {
  email: string;
  password: string;
}

// Doctor Registration
router.post(
  "/doctor/register",
  async (req: Request<{}, {}, IDoctorRegister, null>, res: Response) => {
    const { name, email, password, specialization } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const doctor = new Doctor({
        name,
        email,
        password: hashedPassword,
        specialization,
      });

      const savedDoctor = await doctor.save();
      res.status(201).json({
        message: "Doctor registered successfully",
        doctor: savedDoctor,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: "Error registering doctor", details: err.message });
    }
  }
);

// Patient Registration
router.post(
  "/patient/register",
  async (req: Request<{}, {}, IPatientRegister, null>, res: Response) => {
    const { name, email, password, age } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const patient = new Patient({
        name,
        email,
        password: hashedPassword,
        age,
      });

      const savedPatient = await patient.save();
      res.status(201).json({
        message: "Patient registered successfully",
        patient: savedPatient,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: "Error registering patient", details: err.message });
    }
  }
);

// Doctor Login
router.post(
  "/doctor/login",
  async (req: Request<{}, {}, ILogin, null>, res: Response) => {
    const { email, password } = req.body;
    try {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }

      const token = jwt.sign(
        {
          doctorId: doctor._id,
          doctorName: doctor.name,
          doctorApproved: doctor.approved,
          connectionType: "doctor",
        },
        JWT_SECRET,
        { expiresIn: "3h" }
      );
      res.json({ message: "Login successful", token });
      return;
    } catch (err: any) {
      res.status(500).json({ error: "Error logging in", details: err.message });
    }
  }
);

// Patient Login
router.post(
  "/patient/login",
  async (req: Request<{}, {}, ILogin, null>, res: Response) => {
    const { email, password } = req.body;
    try {
      const patient = await Patient.findOne({ email });
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, patient.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }
      const token = jwt.sign(
        {
          patientId: patient._id,
          patientName: patient.name,
          connectionType: "patient",
        },
        JWT_SECRET,
        {
          expiresIn: "5h",
        }
      );
      res.json({ message: "Login successful", token });
    } catch (err: any) {
      res.status(500).json({ error: "Error logging in", details: err.message });
    }
  }
);

export default router;
