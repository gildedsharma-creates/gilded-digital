import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  userId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: "Web Development" | "Mobile Application" | "Digital Marketing";
  projectScope: string;
  appointmentDate: Date;
  timeSlot: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: String, index: true },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ["Web Development", "Mobile Application", "Digital Marketing"],
      required: true,
    },
    projectScope: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);