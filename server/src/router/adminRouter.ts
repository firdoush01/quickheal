import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin";
import Doctor from "../models/Doctor";
import {
  superAdminMiddleware,
  verifyAdmin,
} from "../middleware/superAdminMiddleware";
import PDManager from "../core/PDManager";

const router = express.Router();
const manager = PDManager.getInstance();

// Admin Registration Route
router.post(
  "/register",
  superAdminMiddleware,
  async (
    req: Request<
      {},
      {},
      {
        name: string;
        email: string;
        password: string;
      },
      {}
    >,
    res: Response
  ) => {
    const { name, email, password } = req.body;

    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        res.status(400).json({ message: "Admin already exists." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
      });

      await newAdmin.save();
      res.status(201).json({ message: "Admin registered successfully." });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
      return;
    }
  }
);

// Admin Login Route
router.post(
  "/login",
  async (
    req: Request<
      {},
      {},
      {
        email: string;
        password: string;
      },
      {}
    >,
    res: Response
  ) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
      const admin = await Admin.findOne({ email }).select("+password");
      if (!admin) {
        res.status(404).json({ message: "Admin not found." });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials." });
        return;
      }

      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ token, message: "Login successful." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Approve Doctor Route
router.post(
  "/approve/doctor/:doctorId",
  verifyAdmin,
  async (req: Request<{ doctorId: string }, {}, {}, {}>, res: Response) => {
    const { doctorId } = req.params;

    try {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        res.status(404).json({ message: "Doctor not found." });
        return;
      }

      doctor.approved = true;
      await doctor.save();

      res.status(200).json({ message: "Doctor approved successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.post(
  "/empty/doctors",
  verifyAdmin,
  async (req: Request, res: Response) => {
    try {
      manager.emptyDoctors();
      res.status(200).json({ message: "Doctor's queue is Emptied!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);
router.post(
  "/empty/patients",
  verifyAdmin,
  async (req: Request, res: Response) => {
    try {
      manager.emptyPatient();
      res.status(200).json({ message: "Waiting Patient's queue is Emptied!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
