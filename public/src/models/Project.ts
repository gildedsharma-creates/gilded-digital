import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnail: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  techStack: string[];
  isFeatured: boolean;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String },
    techStack: [{ type: String, required: true }],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);