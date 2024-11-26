import mongoose, { Schema, Document, Model } from "mongoose";

interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  specialization: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema<IDoctor> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 8 },
    specialization: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Doctor: Model<IDoctor> = mongoose.model<IDoctor>("Doctor", DoctorSchema);
export default Doctor;
