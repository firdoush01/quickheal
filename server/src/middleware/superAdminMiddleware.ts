import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const superAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const passcode = req.headers.authorization?.split(" ")[1];

  if (!passcode) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }

  try {
    if (passcode !== process.env.SUPERADMIN_PASSCODE) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token." });
  }
};

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const adminFound = await Admin.findById(decoded.id);
    if (!adminFound) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token." });
  }
};
